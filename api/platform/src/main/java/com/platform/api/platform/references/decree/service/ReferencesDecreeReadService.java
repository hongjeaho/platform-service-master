package com.platform.api.platform.references.decree.service;

import com.platform.api.platform.references.decree.dto.DecreeInfoSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.decree.DecreeDetailInfo;
import com.platform.datasource.base.dto.decree.DecreeSearch;
import com.platform.datasource.base.repository.reference.DecreeSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
@Slf4j
public class ReferencesDecreeReadService {

  private final DecreeSearchRepository decreeSearchRepository;


  /**
   * 법령 정보 목록을 조회한다.
   *
   * @param decreeSearch 검색조건
   * @return 법령 정보 리스트
   */
  public DecreeInfoSearchResponse getDecreeResultList(DecreeSearch decreeSearch) {
    return DecreeInfoSearchResponse.builder()
        .total(decreeSearchRepository.findTotalSize(decreeSearch))
        .resultList(decreeSearchRepository.findPage(decreeSearch))
        .build();
  }

  public DecreeDetailInfo getDecreeResultDetail(long decreeDetailSeq) {
    return decreeSearchRepository.findDecreeDetailInfo(decreeDetailSeq);
  }

}
