package com.platform.api.platform.references.conclusionOpinion.controller;


import com.platform.api.platform.references.conclusionOpinion.service.ReferencesConclusionOpinionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "References Conclusion Opinion API", description = "공통 재결관 의견 조회 API")
@RestController
@RequestMapping("/api/references/conclusionOpinion")
@RequiredArgsConstructor
public class ReferencesConclusionOpinionController {

  private final ReferencesConclusionOpinionService referencesConclusionOpinionService;

  @Operation(summary = "재결관 의견 카운트", description = "재결관 의견 조회수를 업데이트한다.")
  @PutMapping("{conclusionOpinionSeq}/viewCount")
  ResponseEntity<Boolean> updateConclusionOpinionViewCount(
      @PathVariable long conclusionOpinionSeq) {
    referencesConclusionOpinionService.updateConclusionOpinionViewCount(conclusionOpinionSeq);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "재결관 참조 카운트", description = "재결관 의견 참조수를 업데이트한다.")
  @PutMapping("{conclusionOpinionSeq}/refCount")
  ResponseEntity<Boolean> updateConclusionOpinionRefCount(
      @PathVariable long conclusionOpinionSeq) {
    referencesConclusionOpinionService.updateConclusionOpinionRefCount(conclusionOpinionSeq);
    return ResponseEntity.ok().body(true);
  }
}
