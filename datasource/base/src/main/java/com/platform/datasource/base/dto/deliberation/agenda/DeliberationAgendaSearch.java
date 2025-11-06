package com.platform.datasource.base.dto.deliberation.agenda;

import com.platform.common.base.dto.AbstractPagingDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeliberationAgendaSearch extends AbstractPagingDTO {
  @Schema(description = "심의 시작 일자")
  private LocalDate scheduleStartDt;
  @Schema(description = "심의 마지막 일자")
  private LocalDate scheduleEndDt;
}
