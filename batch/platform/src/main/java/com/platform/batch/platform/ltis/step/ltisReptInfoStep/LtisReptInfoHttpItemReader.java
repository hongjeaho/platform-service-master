package com.platform.batch.platform.ltis.step.ltisReptInfoStep;

import static com.platform.batch.platform.common.config.WebClientConfig.LTIS_WEB_CLIENT;

import com.platform.batch.platform.ltis.dto.LtisReptInfoDto;
import com.platform.batch.platform.ltis.dto.LtisReptInfoResponse;
import com.platform.batch.platform.ltis.path.LtisApiPath;
import com.platform.datasource.base.mapper.batch.ltisApi.LtisDataMapper;
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

@Slf4j
@Component
@StepScope
public class LtisReptInfoHttpItemReader implements ItemStreamReader<List<LtisReptInfoDto>> {

  private final WebClient ltisWebClient;
  private final LtisDataMapper ltisDataMapper;

  private Iterator<Long> iterator = Collections.emptyIterator();
  private int currentIndex = 0;

  public static final String CURRENT_INDEX = "ltis.reptInfo.currentIndex";


  public LtisReptInfoHttpItemReader(
      @Qualifier(LTIS_WEB_CLIENT) WebClient ltisWebClient,
      LtisDataMapper ltisDataMapper
  ) {
    this.ltisWebClient = ltisWebClient;
    this.ltisDataMapper = ltisDataMapper;
  }


  @Override
  public void open(@NonNull ExecutionContext executionContext) throws ItemStreamException {
    try {

      List<Long> judgSeqList = ltisDataMapper.getReptJudgSeq();

      if (judgSeqList == null) {
        judgSeqList = Collections.emptyList();
      }

      this.currentIndex = executionContext.containsKey(CURRENT_INDEX)
          ? executionContext.getInt(CURRENT_INDEX) : 0;
      if (currentIndex < 0 || currentIndex > judgSeqList.size()) {
        currentIndex = 0; // 방어적 세팅
      }

      // 처음 시작시 등록된  정보 삭제 처리
      if (currentIndex == 0 && !judgSeqList.isEmpty()) {
        ltisDataMapper.deleteReptInfo(judgSeqList);
      }

      this.iterator = judgSeqList.listIterator(currentIndex);
      log.info("[LTIS-REPT_INFO-READER] open: totalTargets={}, checkpointIndex={}", judgSeqList.size(), currentIndex);
    } catch (Exception e) {
      throw new ItemStreamException("Failed to open LtisReptInfoHttpItemReader", e);
    }
  }

  @Override
  public List<LtisReptInfoDto> read() {
    while (true) {
      if (!iterator.hasNext()) {
        return null; // 끝
      }
      Long judgSeq = iterator.next();
      currentIndex++;
      String body = ltisWebClient.get()
          .uri(b -> b.path(LtisApiPath.REPT_INFO.getPath())
              .queryParam("judgSeq", judgSeq)
              .build())
          .retrieve()
          .bodyToMono(String.class)
          .block();

      var resp = LtisReptInfoResponse.ofResponse(body);
      if (!"200".equals(resp.getCode())) {
        // 정책상 4xx/5xx 중 실패 처리 (스킵)
        log.error("LTIS Rept Info HTTP error, code={}, judgSeq={}", resp.getCode(), judgSeq);
        continue;
      }
      var dto = resp.getReptInfoList();
      if (dto == null) {
        // 데이터 없음: 다음 아이템으로 진행 (스킵)
        log.warn("[LTIS-REPT_INFO-READER] empty detail for judgSeq={} -> skip", judgSeq);
        continue;
      }
      return dto;
    }
  }

  @Override
  public void update(ExecutionContext executionContext) throws ItemStreamException {
    executionContext.putInt(CURRENT_INDEX, currentIndex);
  }

  @Override
  public void close() throws ItemStreamException {
    // no-op
  }
}
