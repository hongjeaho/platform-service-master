package com.platform.api.platform.references.precedent.controller;


import com.platform.api.platform.references.precedent.dto.PrecedentInfoSearchResponse;
import com.platform.api.platform.references.precedent.service.ReferencesPrecedentReadService;
import com.platform.datasource.base.dto.reference.PrecedentDetailInfo;
import com.platform.datasource.base.dto.reference.PrecedentSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "References Precedent API", description = "공통 판례 조회 API")
@RestController
@RequestMapping("/api/references/precedent")
@RequiredArgsConstructor
public class ReferencesPrecedentReadController {

  private final ReferencesPrecedentReadService referencesPrecedentReadService;

  @Operation(summary = "관련 판례 리스트", description = "관련 판례 목록을 조회한다.")
  @GetMapping
  ResponseEntity<PrecedentInfoSearchResponse> getPrecedentList(
      @ParameterObject PrecedentSearch precedentSearch) {
    return ResponseEntity.ok()
        .body(referencesPrecedentReadService.getPrecedentList(precedentSearch));
  }

  @Operation(summary = "판례 상세 조회", description = "판례를 참조한 사건을 상세 조회한다.")
  @GetMapping("/{precedentSeq}")
  ResponseEntity<PrecedentDetailInfo> getPrecedentDetail(@PathVariable Long precedentSeq) {
    return ResponseEntity.ok()
        .body(referencesPrecedentReadService.getPrecedentResultDetail(precedentSeq));
  }
}
