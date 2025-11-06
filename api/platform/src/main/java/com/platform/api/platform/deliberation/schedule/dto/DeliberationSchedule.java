package com.platform.api.platform.deliberation.schedule.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "DeliberationSchedule", description = "안건 등록 정보")
public class DeliberationSchedule {
  private Long deliberationDateSeq;
  private Long deliberationGroupSeq;
  private List<Long> judgSeqList;
}
