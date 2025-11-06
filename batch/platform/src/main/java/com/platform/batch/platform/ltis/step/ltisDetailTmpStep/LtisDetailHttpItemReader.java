package com.platform.batch.platform.ltis.step.ltisDetailTmpStep;

import static com.platform.batch.platform.common.config.WebClientConfig.LTIS_WEB_CLIENT;

import com.platform.batch.platform.ltis.dto.LtisApiDto;
import com.platform.batch.platform.ltis.dto.LtisDetailResponse;
import com.platform.batch.platform.ltis.path.LtisApiPath;
import com.platform.datasource.base.mapper.batch.ltisApi.LtisTmpMapper;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.batch.item.ItemStreamReader;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * HTTP 기반 LTIS 상세 Reader - DB에서 처리 대상 judgSeq 목록을 조회하고, 각 judgSeq에 대해 상세 API를 호출하여 LtisTotalInfoDto를 반환 - ExecutionContext에 현재 인덱스를 저장하여 재시작 가능
 */
@Slf4j
@Component
@StepScope
public class LtisDetailHttpItemReader implements ItemStreamReader<LtisApiDto> {

  private final WebClient ltisWebClient;
  private final LtisTmpMapper ltisTmpMapper;

  private Iterator<Long> iterator = Collections.emptyIterator();
  private int currentIndex = 0;

  public LtisDetailHttpItemReader(
      @Qualifier(LTIS_WEB_CLIENT) WebClient ltisWebClient,
      LtisTmpMapper ltisTmpMapper
  ) {
    this.ltisWebClient = ltisWebClient;
    this.ltisTmpMapper = ltisTmpMapper;
  }

  @Override
  public void open(@NonNull ExecutionContext executionContext) throws ItemStreamException {
    try {
      List<Long> judgSeqList = ltisTmpMapper.getLtisListTmpJudgSeq();
      if (judgSeqList == null) {
        judgSeqList = Collections.emptyList();
      }
      this.currentIndex = executionContext.containsKey("ltis.detail.currentIndex")
          ? executionContext.getInt("ltis.detail.currentIndex") : 0;
      if (currentIndex < 0 || currentIndex > judgSeqList.size()) {
        currentIndex = 0; // 방어적 세팅
      }
      this.iterator = judgSeqList.listIterator(currentIndex);
      log.info("[LTIS-DETAIL-READER] open: totalTargets={}, checkpointIndex={}", judgSeqList.size(), currentIndex);
    } catch (Exception e) {
      throw new ItemStreamException("Failed to open LtisDetailHttpItemReader", e);
    }
  }

  @Override
  public LtisApiDto read() {
    while (true) {
      if (!iterator.hasNext()) {
        return null; // 끝
      }
      Long judgSeq = iterator.next();
      currentIndex++;
      String body = ltisWebClient.get()
          .uri(b -> b.path(LtisApiPath.DETAIL.getPath())
              .queryParam("judgSeq", judgSeq)
              .build())
          .retrieve()
          .bodyToMono(String.class)
          .block();
      LtisDetailResponse resp = LtisDetailResponse.ofResponse(body);
      if (!"200".equals(resp.getCode())) {
        // 정책상 4xx/5xx 중 실패 처리: 여기서는 예외로 리트라이 대상화
        throw new ItemStreamException("LTIS DETAIL HTTP error, code=" + resp.getCode() + ", judgSeq=" + judgSeq);
      }
      LtisApiDto dto = resp.getLtisTotalInfoDto();
      if (dto == null) {
        // 데이터 없음: 다음 아이템으로 진행 (스킵)
        log.warn("[LTIS-DETAIL-READER] empty detail for judgSeq={} -> skip", judgSeq);
        continue;
      }
      return dto;
    }
  }

  @Override
  public void update(ExecutionContext executionContext) throws ItemStreamException {
    executionContext.putInt("ltis.detail.currentIndex", currentIndex);
  }

  @Override
  public void close() throws ItemStreamException {
    // no-op
  }
}
