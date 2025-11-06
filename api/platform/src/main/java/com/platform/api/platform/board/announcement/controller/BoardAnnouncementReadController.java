package com.platform.api.platform.board.announcement.controller;

import com.platform.api.platform.board.announcement.dto.BoardAnnouncementSearchResponse;
import com.platform.api.platform.board.announcement.service.BoardAnnouncementReadService;
import com.platform.datasource.base.dto.board.base.BoardInfoSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Board Announcement API", description = "공지사항 조회 API")
@RestController
@RequestMapping("/api/public/board")
@RequiredArgsConstructor
public class BoardAnnouncementReadController {

  private final BoardAnnouncementReadService boardAnnouncementReadService;

  @Operation(summary = "공지사항 리스트", description = "공지사항 목록을 조회한다.")
  @GetMapping("/getBoardAnnouncementList")
  ResponseEntity<BoardAnnouncementSearchResponse> getBoardAnnouncementList(
      @ParameterObject BoardInfoSearch boardInfoSearch) {
    return ResponseEntity.ok()
        .body(boardAnnouncementReadService.getBoardQuestionAnswerResultList(boardInfoSearch));
  }


}
