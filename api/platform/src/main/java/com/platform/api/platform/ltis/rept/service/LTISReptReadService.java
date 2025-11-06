package com.platform.api.platform.ltis.rept.service;

import com.platform.api.platform.ltis.info.dto.LTISCompensationAmountByOwnerInfoResponse;
import com.platform.common.base.dto.AbstractPagingDTO;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.ltis.LTISInfo;
import com.platform.datasource.base.dto.ltis.LTISReptInfo;
import com.platform.datasource.base.repository.ltis.LTISReptInfoReadRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class LTISReptReadService {

  private final LTISReptInfoReadRepository ltisReptInfoReadRepository;


  /**
   * 조서 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서정보
   */
  public LTISInfo getReptReportInfo(long judgSeq) {
    return ltisReptInfoReadRepository.findReptReportInfoByJudgSeq(judgSeq);
  }

  /**
   * 재결일련번호에 대한 조서 필지 정보를 조회합니다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서 필지 정보
   */
  public List<LTISReptInfo> getLtisReptLand(long judgSeq) {
    return ltisReptInfoReadRepository.getLtisReptLand(judgSeq);
  }

  /**
   * 재결일련번호에 대한 조서 소유자 정보를 조회합니다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서 소유자 정보
   */
  public List<LTISReptInfo> getLtisReptLandOwner(long judgSeq) {
    return ltisReptInfoReadRepository.getLtisReptLandOwner(judgSeq);
  }

  /**
   * 재결일련번호를 기반으로 조서 지장물 정보를 조회합니다.
   *
   * @param judgSeq 재결일련번호
   * @return 조회된 조서 지장물 정보
   */
  public List<LTISReptInfo> getLtisReptObject(long judgSeq) {
    return ltisReptInfoReadRepository.getLtisReptObject(judgSeq);
  }

  /**
   * 재결일련번호에 대한 조서 지장물 소유자 정보를 조회합니다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서 지장물 소유자 정보
   */
  public List<LTISReptInfo> getLtisReptObjectOwner(long judgSeq) {
    return ltisReptInfoReadRepository.getLtisReptObjectOwner(judgSeq);
  }


  /**
   * 소유자별 보상액을 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서 비고(사업시행자) 정보
   */
  public LTISCompensationAmountByOwnerInfoResponse getLTISCompensationAmountByOwnerInfo(long judgSeq, AbstractPagingDTO paging) {
    return LTISCompensationAmountByOwnerInfoResponse.builder()
        .total(ltisReptInfoReadRepository.findCompensationAmountByOwnerInfoTotalCount(judgSeq))
        .resultList(ltisReptInfoReadRepository.findCompensationAmountByOwnerInfo(judgSeq, paging))
        .build();
  }
}
