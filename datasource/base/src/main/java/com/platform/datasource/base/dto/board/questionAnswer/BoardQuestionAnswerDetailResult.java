package com.platform.datasource.base.dto.board.questionAnswer;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.BoardQuestionAnswerReplyEntity;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Schema(name = "BoardQuestionAnswerDetailResponse", description = "묻고 답하기 상세정보")
@EqualsAndHashCode(callSuper = false)
public class BoardQuestionAnswerDetailResult extends BoardQuestionAnswerReplyEntity {

  @Schema(name = "title", description = "제목")
  private String title;

  @Schema(name = "content", description = "내용")
  private String content;
}
