package com.platform.api.platform.opinion.application.controller;

import com.platform.api.platform.opinion.application.service.OpinionCaseTemplateReadService;
import com.platform.datasource.base.dto.opinioin.OpinionCaseTemplateCommit;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.OpinionTemplateEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "opinion base API", description = "의견등록  API")
@RestController
@RequestMapping("/api/opinion/base")
@RequiredArgsConstructor
public class OpinionCaseReadController {

  private final OpinionCaseTemplateReadService implementerOpinionReadService;

  @Operation(summary = "의견 조회", description = "등록된 의견을 조회 한다.")
  @GetMapping("/{judgSeq}")
  public ResponseEntity<List<OpinionCaseTemplateCommit>> getOpinionCaseTemplateCommitList(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(
        implementerOpinionReadService.getOpinionCaseTemplateCommitList(judgSeq)
    );
  }

  @Operation(summary = "등록 가능한 템플릿 리스트를 조회한다.", description = "등록 가능한 템플릿 리스트를 조회한다.")
  @GetMapping("/template/{judgSeq}")
  public ResponseEntity<List<OpinionTemplateEntity>> getSelectOpinionTemplateList(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(
        implementerOpinionReadService.getOpinionTemplateList(judgSeq)
    );
  }
}
