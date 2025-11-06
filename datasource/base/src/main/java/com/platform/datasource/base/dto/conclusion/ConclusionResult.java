package com.platform.datasource.base.dto.conclusion;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "ConclusionResult", description = "접수 검토 목록")
public class ConclusionResult {

  @Schema(name = "judgSeq", description = "재결일련번호")
  private final long judgSeq;
  @Schema(name = "caseNo", description = "사건번호")
  private final String caseNo;
  @Schema(name = "caseTitle", description = "사건명")
  private final String caseTitle;
  @Schema(name = "chargeNm", description = "담당자명")
  private final String chargeNm;
  @Schema(name = "statusCode", description = "검토 진행상태 코드")
  private final String statusCode;
  @Schema(name = "statusName", description = "검토 진행상태 한글명")
  private final String statusName;
  @Schema(name = "ltisStateCodes", description = "LTIS 진행상태 코드")
  private final String ltisStateCode;
  @Schema(name = "ltisStateName", description = "LTIS 진행상태 한글명")
  private final String ltisStateName;
}
