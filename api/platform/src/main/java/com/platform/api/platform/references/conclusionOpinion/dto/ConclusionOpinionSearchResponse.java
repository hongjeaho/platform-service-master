package com.platform.api.platform.references.conclusionOpinion.dto;

import com.platform.datasource.base.dto.reference.ConclusionOpinionResult;
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
@Schema(name = "ConclusionOpinionSearchResponse", description = "재결관 의견 조회 결과")
public class ConclusionOpinionSearchResponse {

  @Schema(name = "total", description = "전체 count")
  private int total;

  @Schema(name = "resultList", description = "조회 결과")
  private List<ConclusionOpinionResult> resultList;
}
