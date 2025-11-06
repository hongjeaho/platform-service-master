package com.platform.api.platform.board.questionAnswer.controller;

import com.platform.api.platform.board.questionAnswer.dto.BoardQuestionAnswerSearchResponse;
import com.platform.api.platform.board.questionAnswer.service.BoardQuestionAnswerReadService;
import com.platform.datasource.base.dto.board.base.BoardInfoSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.BoardQuestionAnswerReplyEntity;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Board Question And Answer API", description = "묻고 답하기 조회 API")
@RestController
@RequestMapping("/api/public/board")
@RequiredArgsConstructor
public class BoardQuestionAnswerReadController {

  private final BoardQuestionAnswerReadService boardQuestionAnswerReadService;

  @Operation(summary = "묻고 답하기 리스트", description = "묻고 답하기 목록을 조회한다.")
  @GetMapping("/getBoardQuestionAnswerResultList")
  ResponseEntity<BoardQuestionAnswerSearchResponse> getBoardQuestionAnswerResultList(
      @ParameterObject BoardInfoSearch boardInfoSearch) {
    return ResponseEntity.ok()
        .body(boardQuestionAnswerReadService.getBoardQuestionAnswerInfoList(boardInfoSearch));
  }

  @Operation(summary = "묻고 답하기 중 답글 조회", description = "사용자가 묻고 답하기 글에 대한 답글을 조회한다.")
  @GetMapping("/getBoardReplyFromQuestionAnswer/{boardSeq}")
  ResponseEntity<BoardQuestionAnswerReplyEntity> getBoardReplyFromQuestionAnswer(
      @PathVariable Long boardSeq) {
    return ResponseEntity.ok()
        .body(boardQuestionAnswerReadService.getBoardReplyFromQuestionAnswer(boardSeq));
  }
}
