package com.platform.api.platform.board.application.controller;

import com.platform.api.platform.board.application.service.BoardService;
import com.platform.datasource.base.dto.board.base.DetailForUploadBoardAttachment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.BoardContentEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Board API", description = "게시글 작성, 수정, 삭제 API")
@RestController
@RequestMapping("/api/board/base")
@RequiredArgsConstructor
public class BoardController {

  private final BoardService boardService;

  @Operation(summary = "게시글", description = "게시글 작성 및 수정")
  @PostMapping(value = "/InsertOrUpdateBoardContent", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Long> InsertOrUpdateBoardContent(
      @Parameter(description = "게시글 작성 혹은 수정 정보를 받습니다.")
      @RequestBody BoardContentEntity boardContentEntity
  ) {
    Long result = boardService.insertOrUpdateBoardContent(boardContentEntity);

    return ResponseEntity.ok().body(result);
  }

  @Operation(summary = "게시글", description = "게시글 및 첨부파일 작성 혹은 수정")
  @PostMapping(value = "/InsertOrUpdateBoardContentAndFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Boolean> InsertOrUpdateBoardContentAndFile(
      @Parameter(description = "게시글 작성 혹은 수정 정보를 받습니다.", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
      @RequestPart BoardContentEntity boardContentEntity,
      @Parameter(
          description = "게시판의 첨부파일 정보를 받습니다.",
          content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
      )
      @RequestPart
      DetailForUploadBoardAttachment detailForUploadBoardAttachment,
      @Parameter(
          description = "첨부 파일을 받습니다.",
          content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
      )
      @RequestPart(required = false) MultipartFile multipartFile
  ) {

    detailForUploadBoardAttachment.attachFile(multipartFile);
    boardService.insertOrUpdateBoardContentAndFile(boardContentEntity,
        detailForUploadBoardAttachment);

    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "게시글 조회 카운트", description = "게시글 조회수를 업데이트한다.")
  @PostMapping("{boardSeq}/updateBoardViewCount")
  ResponseEntity<Boolean> updateBoardViewCount(
      @PathVariable long boardSeq) {
    boardService.updateBoardViewCount(boardSeq);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "게시글 삭제", description = "게시글 글을 삭제처리한다.")
  @PostMapping("{boardSeq}/removeBoardContent")
  ResponseEntity<Boolean> removeBoardContent(
      @PathVariable long boardSeq) {
    boardService.removeBoardContent(boardSeq);
    return ResponseEntity.ok().body(true);
  }
//
//  @Operation(summary = "게시글 첨부파일 업로드", description = "게시글에 첨부파일을 업로드한다.")
//  @PostMapping(value = "{boardSeq}/uploadBoardAttachment",
//      consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//  ResponseEntity<Boolean> uploadBoardAttachment(
//      @PathVariable Long boardSeq,
//      @Parameter(
//          description = "게시판의 첨부파일 정보 리스트를 받습니다.",
//          content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
//      )
//      @RequestPart
//      DetailForUploadBoardAttachment detailForUploadBoardAttachment,
//      @Parameter(
//          description = "첨부 파일 리스트를 받습니다.",
//          content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
//      )
//      @RequestPart(required = false) MultipartFile multipartFile
//  ) {
//
//    detailForUploadBoardAttachment.attachFile(multipartFile);
//    detailForUploadBoardAttachment.setBoardSeq(boardSeq);
//
//    boardService.insertOrUpdateBoardAttachment(detailForUploadBoardAttachment);
//    return ResponseEntity.ok().body(true);
//  }

}
