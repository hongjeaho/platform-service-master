package com.platform.datasource.base.dto.reference;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "ConclusionOpinionPrecedentResult", description = "재결관 의견 전체 내용 검색 결과")
public class ConclusionOpinionResult {

  @Schema(name = "seq", description = "재결관 의견 일련번호")
  private final long seq;

  @Schema(name = "caseTitle", description = "심의차수")
  private String deliberationPeriod;

  @Schema(name = "viewCount", description = "조회수")
  private Long viewCount;

  @Schema(name = "deliberationDate", description = "심의일자")
  private String deliberationDate;

  @Schema(name = "templateName", description = "쟁점의견")
  private String templateName;

  @Schema(name = "caseNo", description = "사건번호")
  private String caseNo;

  @Schema(name = "caseTitle", description = "사업명")
  private String caseTitle;

  @Schema(name = "chargeNm", description = "담당자")
  private String chargeNm;
}
