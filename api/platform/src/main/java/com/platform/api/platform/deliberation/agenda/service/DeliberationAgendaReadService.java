package com.platform.api.platform.deliberation.agenda.service;

import com.platform.api.platform.deliberation.agenda.dto.DeliberationAgendaSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaSearch;
import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaSubResult;
import com.platform.datasource.base.repository.deliberation.agenda.DeliberationAgendaSearchReadRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class DeliberationAgendaReadService {

  private final DeliberationAgendaSearchReadRepository deliberationAgendaSearchReadRepository;

  /**
   * 심의 안건 목록을 조회합니다.
   *
   * @param deliberationAgendaSearch 심의 안건 조회 요청 정보를 포함하는 객체
   *                                 - 사건 번호 또는 사업명(keyword)
   *                                 - 담당자(chargeNm)
   *                                 - 현재 페이지(page)
   *                                 - 노출 페이지(pageSize)
   * @return 심의 안건 조회 결과를 포함하는 {@link DeliberationAgendaSearchResponse} 객체
   *         - 전체 count(total)
   *         - 조회 결과 리스트(resultList)
   */
  public DeliberationAgendaSearchResponse getDeliberationAgendaList(DeliberationAgendaSearch deliberationAgendaSearch) {
    return DeliberationAgendaSearchResponse.builder()
        .total(deliberationAgendaSearchReadRepository.findTotalSize(deliberationAgendaSearch))
        .resultList(deliberationAgendaSearchReadRepository.findPage(deliberationAgendaSearch))
        .build();
  }


  /**
   * 심의 안건 세부 목록을 조회합니다.
   *
   * @param deliberationStatusSeq 검토 상태 일련번호
   * @return 심의 안건 세부 결과 목록
   */
  public List<DeliberationAgendaSubResult> getDeliberationAgendaSubList(long deliberationStatusSeq) {
    return deliberationAgendaSearchReadRepository.getDeliberationAgendaSubList(deliberationStatusSeq);
  }

}
