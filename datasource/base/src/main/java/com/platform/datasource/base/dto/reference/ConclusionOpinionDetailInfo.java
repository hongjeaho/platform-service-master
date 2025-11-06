package com.platform.datasource.base.dto.reference;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "ConclusionOpinionDetailInfo", description = "재결관 의견 조회 상세 결과")
public class ConclusionOpinionDetailInfo {

  @Schema(name = "templateName", description = "쟁점의견")
  private String templateName;

  @Schema(name = "caseTitle", description = "사업명")
  private String caseTitle;

  @Schema(name = "deliberationDate", description = "심의일자")
  private String deliberationDate;

  @Schema(name = "chargeNm", description = "담당자")
  private String chargeNm;

  @Schema(name = "conclusionOpinionContent", description = "재결관 의견 내용")
  private String conclusionOpinionContent;

  @Schema(name = "refCount", description = "참조 횟수")
  private String refCount;

}
