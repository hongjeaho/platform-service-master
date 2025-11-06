package com.platform.api.platform.references.map.dto;

import com.platform.datasource.base.dto.reference.map.ReferencesMapSearchCase;
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
@Schema(name = "ReferencesMapResponse", description = "지도 검색 응답")
public class ReferencesMapResponse {

  @Schema(name = "list", description = "검색된 사건 목록")
  private List<ReferencesMapSearchCase> list;

  @Schema(name = "totalCount", description = "전체 사건 수", example = "150")
  private Integer totalCount;
}
