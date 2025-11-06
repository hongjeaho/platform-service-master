package com.platform.api.platform.board.questionAnswer.controller;

import com.platform.api.platform.board.questionAnswer.service.BoardQuestionAnswerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.BoardQuestionAnswerReplyEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Board Question Answer API", description = "묻고 답하기 게시글의 작성, 수정, 삭제 API")
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardQuestionAnswerController {

  private final BoardQuestionAnswerService boardQuestionAnswerService;

  @Operation(summary = "묻고 답하기 게시글의 답변 작성", description = "묻고 답하기 게시글에 답변을 작성한다.")
  @PostMapping("/insertOrUpdateBoardQuestionAnswerReply")
  ResponseEntity<Boolean> insertOrUpdateBoardQuestionAnswerReply(
      @Parameter(description = "묻고 답하기 답변의 작성 혹은 수정 정보를 받습니다.")
      @RequestBody BoardQuestionAnswerReplyEntity boardQuestionAnswerReplyEntity) {
    boardQuestionAnswerService.insertOrUpdateQuestionAnswerReply(boardQuestionAnswerReplyEntity);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "묻고 답하기 게시글의 답변 삭제", description = "묻고 답하기 게시글에 답변을 삭제한다")
  @PostMapping("{boardSeq}/removeBoardQuestionAnswerReply")
  ResponseEntity<Boolean> removeBoardQuestionAnswerReply(
      @PathVariable long boardSeq) {
    boardQuestionAnswerService.removeBoardQuestionAnswerReply(boardSeq);
    return ResponseEntity.ok().body(true);
  }

}
