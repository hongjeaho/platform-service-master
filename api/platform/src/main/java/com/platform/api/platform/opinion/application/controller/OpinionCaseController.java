package com.platform.api.platform.opinion.application.controller;

import com.platform.api.platform.opinion.application.service.OpinionCaseTemplateService;
import com.platform.datasource.base.dto.opinioin.OpinionCaseTemplate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.OpinionCaseCommentEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "opinion base API", description = "의견등록  API")
@RestController
@RequestMapping("/api/opinion/base")
@RequiredArgsConstructor
public class OpinionCaseController {

  private final OpinionCaseTemplateService opinionCaseTemplateService;

  @Operation(summary = "의견등록", description = "접수된 사건에 의견등록을 한다.")
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Boolean> insertOpinionCaseTemplate(
      @Parameter(
          description = "의견 템플릿 정보",
          content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
      )
      @RequestPart OpinionCaseTemplate opinionCaseTemplate,
      @Parameter(
          description = "의견 내용",
          content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
      )
      @RequestPart List<OpinionCaseCommentEntity> opinionCaseCommentList,
      @Parameter(
          description = "의견 첨부 파일",
          content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
      )
      @RequestPart(required = false) MultipartFile file
  ) throws IOException {
    opinionCaseTemplate.attachFile(file);
    opinionCaseTemplateService.insertOpinionCaseTemplate(file, opinionCaseTemplate, opinionCaseCommentList);
    return ResponseEntity.ok(true);
  }

  @Operation(summary = "의견 삭제", description = "등록된  의견을 삭제 한다.")
  @DeleteMapping("{judgSeq}/{opinionCaseTemplateSeq}")
  public ResponseEntity<Boolean> deleteOpinionCaseTemplate(@PathVariable long judgSeq, @PathVariable long opinionCaseTemplateSeq) {
    opinionCaseTemplateService.deleteOpinionCaseTemplate(judgSeq, opinionCaseTemplateSeq);
    return ResponseEntity.ok(true);
  }
}
