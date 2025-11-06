package com.platform.datasource.base.dto.decree;

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
@Schema(name = "DecreeResult", description = "법령 전체 내용 검색 조건")
public class DecreeSearch extends AbstractPagingDTO {

  @Schema(name = "decreeCategoryCode", description = "법령 분류 코드")
  private String decreeCategoryCode;
  @Schema(name = "keyword", description = "검색어")
  private String keyword;
  @Schema(name = "previewLength", description = "리스트 조회용 본문 조회 문자 수")
  private int previewLength;

}
