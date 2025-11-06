package com.platform.api.platform.ltis.info.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.ltis.AppraisalInfo;
import com.platform.datasource.base.dto.ltis.BusinessSummary;
import com.platform.datasource.base.dto.ltis.LTISImplementerInfo;
import com.platform.datasource.base.repository.ltis.LTISInfoReadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class LTISInfoReadService {

  private final LTISInfoReadRepository ltisInfoReadRepository;

  /**
   * 조서 사업 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서 사업정보
   */
  public BusinessSummary getLTISBusinessSummary(long judgSeq) {
    return ltisInfoReadRepository.findBusinessSummaryByJudgSeq(judgSeq);
  }


  /**
   * 감정평가 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 감정평가정보
   */
  public AppraisalInfo getLTISAppraisalInfo(long judgSeq) {
    return ltisInfoReadRepository.findAppraisalInfo(judgSeq);
  }

  /**
   * 조서 사업시행자 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서 비고(사업시행자) 정보
   */
  public LTISImplementerInfo getLTISImplementerInfo(long judgSeq) {
    return ltisInfoReadRepository.findImplementerInfo(judgSeq);
  }

}
