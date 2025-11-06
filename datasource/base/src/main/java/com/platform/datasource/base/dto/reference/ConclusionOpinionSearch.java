package com.platform.datasource.base.dto.reference;

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
@Schema(name = "ConclusionOpinionSearch", description = "재결관 의견 전체 내용 검색 조건")
public class ConclusionOpinionSearch extends AbstractPagingDTO {

  @Schema(name = "opinionTemplateSeq", description = "쟁점의견탬플릿번호")
  private Long opinionTemplateSeq;
  @Schema(name = "keyword", description = "검색어")
  private String keyword;
}
