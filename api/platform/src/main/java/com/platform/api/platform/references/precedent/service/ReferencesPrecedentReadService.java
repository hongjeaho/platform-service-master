package com.platform.api.platform.references.precedent.service;

import com.platform.api.platform.references.precedent.dto.PrecedentInfoSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.reference.PrecedentDetailInfo;
import com.platform.datasource.base.dto.reference.PrecedentSearch;
import com.platform.datasource.base.repository.reference.PrecedentSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
@Slf4j
public class ReferencesPrecedentReadService {

  private final PrecedentSearchRepository precedentSearchRepository;


  /**
   * 판례 정보 목록을 조회한다.
   *
   * @param precedentSearch 검색조건
   * @return 판례정보 목록 조회
   */
  public PrecedentInfoSearchResponse getPrecedentList(PrecedentSearch precedentSearch) {
    return PrecedentInfoSearchResponse.builder()
        .total(precedentSearchRepository.findTotalSize(precedentSearch))
        .resultList(precedentSearchRepository.findPage(precedentSearch))
        .build();
  }

  /**
   * 판례 상세정보를 조회한다.
   *
   * @param precedentSeq 판례 참고 사건의 일련번호
   * @return 판례정보 상세
   */
  public PrecedentDetailInfo getPrecedentResultDetail(long precedentSeq) {
    return precedentSearchRepository.findLawPrecedentInfo(precedentSeq);
  }

}
