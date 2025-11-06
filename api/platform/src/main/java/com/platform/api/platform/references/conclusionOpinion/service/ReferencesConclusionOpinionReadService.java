package com.platform.api.platform.references.conclusionOpinion.service;

import com.platform.api.platform.references.conclusionOpinion.dto.ConclusionOpinionSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.reference.ConclusionOpinionDetailInfo;
import com.platform.datasource.base.dto.reference.ConclusionOpinionSearch;
import com.platform.datasource.base.repository.reference.ConclusionOpinionSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
@Slf4j
public class ReferencesConclusionOpinionReadService {

  private final ConclusionOpinionSearchRepository conclusionOpinionSearchRepository;


  /**
   * 재결관 의견 목록을 조회한다.
   *
   * @param conclusionOpinionSearch 검색조건
   * @return 재결관 의견 정보 리스트
   */
  public ConclusionOpinionSearchResponse getConclusionOpinionResultList(
      ConclusionOpinionSearch conclusionOpinionSearch) {
    return ConclusionOpinionSearchResponse.builder()
        .total(conclusionOpinionSearchRepository.findTotalSize(
            conclusionOpinionSearch))
        .resultList(
            conclusionOpinionSearchRepository.findPage(conclusionOpinionSearch))
        .build();
  }

  public ConclusionOpinionDetailInfo getConclusionOpinionResultDetail(
      long conclusionOpinionSeq) {
    return conclusionOpinionSearchRepository.findConclusionOpinionInfo(conclusionOpinionSeq);
  }

}
