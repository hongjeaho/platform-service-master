package com.platform.datasource.base.dto.admin.district;

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
@Builder
@Schema(name = "DistrictChargeSearch", description = "구별 담당자 검색 조건")
public class AdminDistrictChargeSearch extends AbstractPagingDTO {

  @Schema(description = "담당자 이름")
  private String managerName;

  @Schema(description = "담당구")
  private String district;

  @Schema(description = "전화번호")
  private String phoneNumber;
}
