package com.platform.datasource.base.dto.board.base;

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
@Schema(name = "BoardInfoSearch", description = "게시글 제목 및 내용 검색 조건")
public class BoardInfoSearch extends AbstractPagingDTO {

  @Schema(name = "boardCategoryCode", description = "게시글 분류 코드")
  private String boardCategoryCode;

  @Schema(name = "searchConditionType", description = "검색 조건")
  private int searchConditionType;

  @Schema(name = "keyword", description = "검색어")
  private String keyword;

}
