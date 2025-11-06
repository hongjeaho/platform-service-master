package com.platform.api.platform.references.conclusionOpinion.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.reference.ConclusionOpinionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class ReferencesConclusionOpinionService {

  private final ConclusionOpinionRepository conclusionOpinionRepository;


  /**
   * 재결관 의견 정보 조회수를 업데이트한다.
   *
   * @param conclusionOpinionSeq 재결관 의견 상세 정보 일련번호
   */
  public void updateConclusionOpinionViewCount(long conclusionOpinionSeq) {
    conclusionOpinionRepository.updateViewCount(conclusionOpinionSeq);
  }

  /**
   * 재결관 의견 참조수를 업데이트한다.
   *
   * @param conclusionOpinionSeq 재결관 의견 상세 정보 일련번호
   */
  public void updateConclusionOpinionRefCount(long conclusionOpinionSeq) {
    conclusionOpinionRepository.updateRefCont(conclusionOpinionSeq);
  }

}
