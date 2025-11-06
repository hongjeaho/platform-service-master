package com.platform.datasource.base.dto.deliberation.schedule;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "DeliberationScheduleResult", description = "안건 등록 목록")
public class DeliberationScheduleResult {
  @Schema(name = "judgSeq", description = "재결일련번호")
  private final long judgSeq;
  @Schema(name = "caseNo", description = "사건번호")
  private final String caseNo;
  @Schema(name = "caseTitle", description = "사건명")
  private final String caseTitle;
  @Schema(name = "chargeNm", description = "담당자명")
  private final String chargeNm;
  @Schema(name = "scheduleDate", description = "심의 일자")
  private final LocalDate scheduleDate;
  @Schema(name = "scheduleGroup", description = "심의 그룹")
  private final String scheduleGroup;
}