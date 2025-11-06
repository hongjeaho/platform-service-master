package com.platform.datasource.base.dto.receipt;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "ReceiptResult", description = "사건 접수 정보")
public class ReceiptResult {

  @Schema(name = "judgSeq", description = "재결일련번호")
  private final long judgSeq;
  @Schema(name = "recepDt", description = "접수일")
  private LocalDate recepDt;
  @Schema(name = "chargeNm", description = "담당자")
  private String chargeNm;
  @Schema(name = "caseNo", description = "사건번호")
  private final String caseNo;
  @Schema(name = "caseTitle", description = "사건명")
  private final String caseTitle;
  @Schema(name = "implementerNm", description = "시행사명")
  private final String implementerNm;
  @Schema(name = "address", description = "소재지")
  private final String address;
  @Schema(name = "statusCode", description = "진행상태 코드")
  private final String statusCode;
  @Schema(name = "statusName", description = "진행상태 한글명")
  private final String statusName;
  @Schema(name = "ltisStateCode", description = "LTIS 진행상태 코드")
  private final String ltisStateCode;
  @Schema(name = "ltisStateName", description = "LTIS 진행상태 한글명")
  private final String ltisStateName;
}
