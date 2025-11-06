package com.platform.datasource.base.dto.deliberation.schedule;

import com.platform.common.base.dto.AbstractPagingDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Schema(name = "DeliberationScheduleSearch", description = "안건 등록 가능한 목록 검색 조건")
@Builder
public class DeliberationScheduleSearch extends AbstractPagingDTO {
  @Schema(description = "사건 번호 또는 사업명")
  private String keyword;
  @Schema(description = "담당자")
  private String chargeNm;
}
