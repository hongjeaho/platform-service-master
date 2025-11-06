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
@Schema(name = "ReferencesMapCoordinates", description = "좌표 정보")
public class ReferencesMapCoordinates {

  @Schema(name = "lat", description = "위도", example = "37.5665")
  private Double lat;

  @Schema(name = "lng", description = "경도", example = "126.9780")
  private Double lng;
}
