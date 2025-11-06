package com.platform.api.platform.references.decree.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.reference.DecreeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class ReferencesDecreeService {

  private final DecreeRepository decreeRepository;


  /**
   * 법령 정보 조회수를 업데이트한다.
   *
   * @param decreeDetailSeq 법령 상세 정보 일련번호
   */
  public void updateDecreeViewCnt(long decreeDetailSeq) {
    decreeRepository.updateDecreeViewCnt(decreeDetailSeq);
  }

  /**
   * 법령 상세 정보에 대한 참조 수를 1 증가시킨다.
   *
   * @param decreeDetailSeq 법령 상세 정보 일련번호
   */
  public void updateDecreeRefCnt(long decreeDetailSeq) {
    decreeRepository.updateDecreeRefCnt(decreeDetailSeq);
  }
}
