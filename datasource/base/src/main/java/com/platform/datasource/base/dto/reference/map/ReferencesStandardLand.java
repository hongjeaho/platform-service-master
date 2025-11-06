package com.platform.datasource.base.dto.reference.map;

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
@Schema(name = "ReferencesStandardLand", description = "표준지 정보")
public class ReferencesStandardLand {

  @Schema(name = "coordinates", description = "표준지 좌표")
  private ReferencesMapCoordinates coordinates;

  @Schema(name = "address", description = "표준지 주소", example = "서울시 강남구 표준지")
  private String address;

  @Schema(name = "price", description = "표준지 공시지가 (원/㎡)", example = "500000")
  private Long price;

  @Schema(name = "area", description = "표준지 면적 (㎡)", example = "100.0")
  private Double area;
}
