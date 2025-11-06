package com.platform.api.platform.notice.result.controller;

import com.platform.api.platform.notice.result.service.NoticeResultService;
import com.platform.datasource.base.dto.notice.NoticeAttachmentFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.NoticeInfoEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "notice result API", description = "열람공고 결과등록 API")
@RestController
@RequestMapping("/api/notice/result")
@RequiredArgsConstructor
public class NoticeResultController {

  private final NoticeResultService noticeResultService;

  @Operation(summary = "열람공고 결과등록", description = "열람공고 결과등록")
  @PostMapping(value = "/{judgSeq}",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  ResponseEntity<Boolean> insertOrUpdateNoticeResult(
      @PathVariable long judgSeq,
      @Parameter(
          description = "의뢰 공고 결과 등록 사항을 받습니다.",
          content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
      )
      @RequestPart NoticeInfoEntity noticeInfo,
      @Parameter(
          description = "첨부파일 정보 리스트를 받습니다.",
          content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
      )
      @RequestPart List<NoticeAttachmentFile> noticeAttachmentFileList,

      @Parameter(
          description = "첨부 파일 리스트를 받습니다.",
          content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
      )
      @RequestPart(required = false) List<MultipartFile> files
  ) {

    for (int idx = 0; idx < noticeAttachmentFileList.size(); idx++) {
      NoticeAttachmentFile noticeAttachmentFile = noticeAttachmentFileList.get(idx);
      noticeAttachmentFile.attachFile(files.get(idx));
    }

    noticeResultService.insertOrUpdateNoticeResult(judgSeq, noticeInfo, noticeAttachmentFileList);
    return ResponseEntity.ok().body(true);
  }
}
