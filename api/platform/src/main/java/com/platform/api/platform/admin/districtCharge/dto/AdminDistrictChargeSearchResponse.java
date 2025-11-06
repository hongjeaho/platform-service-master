package com.platform.api.platform.admin.districtCharge.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "AdminDistrictChargeSearchResponse", description = "구별 담당자 조회 결과")
public class AdminDistrictChargeSearchResponse {

  @Schema(name = "total", description = "전체 count")
  private int total;
  @Schema(name = "resultList", description = "조회 결과")
  private List<AdminDistrictManagerEntity> resultList;
}
