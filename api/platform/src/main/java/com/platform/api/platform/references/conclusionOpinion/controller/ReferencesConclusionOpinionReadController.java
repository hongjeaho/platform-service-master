package com.platform.api.platform.references.conclusionOpinion.controller;


import com.platform.api.platform.references.conclusionOpinion.dto.ConclusionOpinionSearchResponse;
import com.platform.api.platform.references.conclusionOpinion.service.ReferencesConclusionOpinionReadService;
import com.platform.datasource.base.dto.reference.ConclusionOpinionDetailInfo;
import com.platform.datasource.base.dto.reference.ConclusionOpinionSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "References Conclusion Opinion Precedent API", description = "공통 재결관 의견 조회 API")
@RestController
@RequestMapping("/api/references/conclusionOpinionPrecedent")
@RequiredArgsConstructor
public class ReferencesConclusionOpinionReadController {

  private final ReferencesConclusionOpinionReadService referencesConclusionOpinionReadService;

  @Operation(summary = "재결관 의견 리스트", description = "재결관 의견 목록을 조회한다.")
  @GetMapping
  ResponseEntity<ConclusionOpinionSearchResponse> getConclusionOpinionList(
      @ParameterObject ConclusionOpinionSearch conclusionOpinionSearch
  ) {
    return ResponseEntity.ok()
        .body(referencesConclusionOpinionReadService.getConclusionOpinionResultList(
            conclusionOpinionSearch));
  }

  @Operation(summary = "재결관 의견 상세 조회", description = "재결관 의견 상세 정보를 조회한다.")
  @GetMapping("/{conclusionOpinionSeq}")
  ResponseEntity<ConclusionOpinionDetailInfo> getConclusionOpinionDetail(
      @PathVariable Long conclusionOpinionSeq) {
    return ResponseEntity.ok()
        .body(referencesConclusionOpinionReadService.getConclusionOpinionResultDetail(
            conclusionOpinionSeq));
  }
}
