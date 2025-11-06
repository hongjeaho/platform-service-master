package com.platform.api.platform.references.precedent.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.reference.PrecedentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class ReferencesPrecedentService {

  private final PrecedentRepository precedentRepository;


  /**
   * 판례 정보 조회수를 업데이트한다.
   *
   * @param precedentSeq 판례 상세 정보 일련번호
   */
  public void updatePrecedentViewCount(long precedentSeq) {
    precedentRepository.updatePrecedentViewCount(precedentSeq);
  }

  /**
   * 판례 참조 카운트를 업데이트한다.
   *
   * @param precedentSeq 판례 상세 정보 일련번호
   */
  public void updatePrecedentRefCount(long precedentSeq) {
    precedentRepository.updatePrecedentRefCount(precedentSeq);
  }
}
