package com.platform.datasource.base.dto.deliberation.agenda;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "DeliberationAgendaSubResult", description = "심의 안건  목록")
public class DeliberationAgendaSubResult {
  
  @Schema(name = "caseNo", description = "사건 번호")
  private final String caseNo;
  @Schema(name = "caseTitle", description = "사건명")
  private final String caseTitle;
  @Schema(name = "chargeNm", description = "담당자명")
  private final String chargeNm;
  @Schema(name = "opinionCount", description = "쟁점의견")
  private final Integer opinionCount;
}
