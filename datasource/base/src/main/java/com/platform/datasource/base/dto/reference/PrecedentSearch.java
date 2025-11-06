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
@Schema(name = "PrecedentSearch", description = "판례 전체 내용 검색 조건")
public class PrecedentSearch extends AbstractPagingDTO {

  @Schema(name = "templateNameSeq", description = "검색조건")
  private long templateNameSeq;
  @Schema(name = "keyword", description = "검색어")
  private String keyword;

}
