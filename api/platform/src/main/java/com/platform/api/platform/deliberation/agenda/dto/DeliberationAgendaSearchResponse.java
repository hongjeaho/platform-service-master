package com.platform.api.platform.deliberation.agenda.dto;

import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaResult;
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
@Schema(name = "DeliberationAgendaSearchResponse", description = "안건 목록  조회")
public class DeliberationAgendaSearchResponse {

  @Schema(name = "total", description = "전체 count")
  private int total;
  @Schema(name = "resultList", description = "조회 결과")
  private List<DeliberationAgendaResult> resultList;
}
