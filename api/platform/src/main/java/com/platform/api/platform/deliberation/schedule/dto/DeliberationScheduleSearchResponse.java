package com.platform.api.platform.deliberation.schedule.dto;

import com.platform.datasource.base.dto.deliberation.schedule.DeliberationScheduleResult;
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
@Schema(name = "DeliberationScheduleSearchResponse", description = "안건 등록 목록 결과 조회")
public class DeliberationScheduleSearchResponse {
  @Schema(name = "total", description = "전체 count")
  private int total;
  @Schema(name = "resultList", description = "조회 결과")
  private List<DeliberationScheduleResult> resultList;
}
