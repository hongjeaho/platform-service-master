package com.platform.datasource.base.dto.deliberation.agenda;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "DeliberationAgendaResult", description = "심의 차수  목록")
public class DeliberationAgendaResult {

  @Schema(name = "deliberationStatusSeq", description = "심의 차수 일련번호")
  private final long deliberationStatusSeq;
  @Schema(name = "scheduleDate", description = "심의 일자")
  private final LocalDate scheduleDate;
  @Schema(name = "scheduleGroup", description = "심의 그룹")
  private final String scheduleGroup;
  @Schema(name = "caseTitle", description = "사건명")
  private final String caseTitle;
}
