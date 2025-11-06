package com.platform.batch.platform.ltis.step.ltisListTmpStep;

import static com.platform.batch.platform.common.config.WebClientConfig.LTIS_WEB_CLIENT;

import com.platform.batch.platform.ltis.dto.LtisApiDto;
import com.platform.batch.platform.ltis.dto.LtisListResponse;
import com.platform.batch.platform.ltis.path.LtisApiPath;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.batch.item.ItemStreamReader;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * HTTP 페이지 기반 LTIS 목록 Reader - pageNum/listCount/startDt/endDt로 LTIS 목록 API를 호출 - ExecutionContext에 현재 페이지/전체 페이지를 저장하여 재시작 가능
 */
@Slf4j
@Component
@StepScope
public class LtisListHttpItemReader implements ItemStreamReader<LtisApiDto> {

  private final WebClient ltisWebClient;
  private final int pageSize;
  private final String jobParamStartDt; // yyyyMMdd
  private final String jobParamEndDt;   // yyyyMMdd

  private int currentPage = 0; // 이미 읽은 페이지 번호
  private int totalPages = -1; // 총 페이지 수
  private Iterator<LtisApiDto> currentIterator = Collections.emptyIterator();
  @Value("${ltis.startDt:NONE}")
  private String startDt; // 실제 사용 시작일
  @Value("${ltis.endDt:NONE}")
  private String endDt;   // 실제 사용 종료일

  public LtisListHttpItemReader(
      @Qualifier(LTIS_WEB_CLIENT) WebClient ltisWebClient,
      @Value("${ltis.listCount:50}") int pageSize,
      @Value("${ltis.startDt:NONE}") String jobParamStartDt,
      @Value("${ltis.endDt:NONE}") String jobParamEndDt
  ) {
    this.ltisWebClient = ltisWebClient;
    this.pageSize = pageSize;
    this.jobParamStartDt = jobParamStartDt;
    this.jobParamEndDt = jobParamEndDt;
  }

  @Override
  public void open(@NonNull ExecutionContext executionContext) throws ItemStreamException {
    // 날짜 파라미터 기본값 설정(없으면 최근 1주)
    if ("NONE".equals(jobParamStartDt) || "NONE".equals(jobParamEndDt)) {
      LocalDate now = LocalDate.now();
      this.startDt = now.minusWeeks(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
      this.endDt = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    } else {
      this.startDt = jobParamStartDt;
      this.endDt = jobParamEndDt;
    }

    this.currentPage = executionContext.containsKey("ltis.currentPage")
        ? executionContext.getInt("ltis.currentPage") : 0;
    this.totalPages = executionContext.containsKey("ltis.totalPages")
        ? executionContext.getInt("ltis.totalPages") : -1;

    log.info("[LTIS-READER] open startDt={}, endDt={}, pageSize={}, checkpoint=currentPage:{}, totalPages:{}",
        startDt, endDt, pageSize, currentPage, totalPages);
  }

  @Override
  public LtisApiDto read() {
    while (true) {
      if (currentIterator.hasNext()) {
        return currentIterator.next();
      }
      if (totalPages != -1 && currentPage >= totalPages) {
        // 더 이상 읽을 데이터 없음
        return null;
      }
      // 다음 페이지 로드
      int nextPage = currentPage + 1;
      String body = ltisWebClient.get()
          .uri(b -> b.path(LtisApiPath.LIST.getPath())
              .queryParam("pageNum", nextPage)
              .queryParam("listCount", pageSize)
              .queryParam("startDt", startDt)
              .queryParam("endDt", endDt)
              .build())
          .retrieve()
          .bodyToMono(String.class)
          .block();

      LtisListResponse resp = LtisListResponse.ofResponse(body);
      if (!"200".equals(resp.getCode())) {
        throw new ItemStreamException("LTIS LIST HTTP error, code=" + resp.getCode());
      }
      if (totalPages == -1) {
        int totalCount = resp.getTotalCount();
        totalPages = (totalCount + (pageSize - 1)) / pageSize;
        log.info("[LTIS-READER] totalCount={}, calculated totalPages={}", totalCount, totalPages);
      }
      List<LtisApiDto> items = resp.getList();
      this.currentIterator = items == null ? Collections.emptyIterator() : items.iterator();
      this.currentPage = nextPage;
    }
  }

  @Override
  public void update(ExecutionContext executionContext) throws ItemStreamException {
    executionContext.putInt("ltis.currentPage", currentPage);
    executionContext.putInt("ltis.totalPages", totalPages);
  }

  @Override
  public void close() throws ItemStreamException {
    // no-op
  }
}
