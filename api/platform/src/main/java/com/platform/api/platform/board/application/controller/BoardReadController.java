package com.platform.api.platform.board.application.controller;

import com.platform.api.platform.board.application.service.BoardReadService;
import com.platform.datasource.base.dto.board.base.DetailForUploadBoardAttachment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.BoardContentEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Board API", description = "게시글 작성, 수정, 삭제 API")
@RestController
@RequestMapping("/api/board/base")
@RequiredArgsConstructor
public class BoardReadController {

  private final BoardReadService boardReadService;

  @Operation(summary = "게시글 상세조회", description = "사용자가 게시글의 상세 정보를 조회한다.")
  @GetMapping("/getBoardDetail/{boardSeq}/{boardCategoryCode}")
  ResponseEntity<BoardContentEntity> getBoardContentDetail(
      @PathVariable Long boardSeq, @PathVariable String boardCategoryCode) {
    return ResponseEntity.ok()
        .body(boardReadService.getBoardCommonContentDetail(boardSeq, boardCategoryCode));
  }

  @Operation(summary = "게시글 파일 조회", description = "게시글에 첨부된 파일을 조회한다.")
  @GetMapping("/getBoardAttachment/{boardSeq}")
  ResponseEntity<DetailForUploadBoardAttachment> getBoardAttachmentByBoardSeq(
      @PathVariable Long boardSeq) {
    return ResponseEntity.ok().body(boardReadService.getBoardAttachmentByBoardSeq(boardSeq));
  }
}
