package com.platform.datasource.base.dto.reference.map;

import com.platform.common.base.dto.AbstractPagingDTO;
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
@Schema(name = "ReferencesMapSearch", description = "지도 검색 조건")
public class ReferencesMapSearch extends AbstractPagingDTO {

  @Schema(name = "keyword", description = "검색 키워드", example = "서울시 강남구")
  private String keyword;

  @Schema(name = "landCategory", description = "지목 목록", example = "[\"전\", \"답\", \"과수원\"]")
  private List<String> landCategory;

  @Schema(name = "usageStatus", description = "이용상황 목록", example = "[\"주거용\", \"상업용\"]")
  private List<String> usageStatus;

  @Schema(name = "zoneType", description = "용도지역 목록", example = "[\"제1종일반주거지역\", \"상업지역\"]")
  private List<String> zoneType;
}
