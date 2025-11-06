package com.platform.api.platform.references.decree.controller;


import com.platform.api.platform.references.decree.dto.DecreeInfoSearchResponse;
import com.platform.api.platform.references.decree.service.ReferencesDecreeReadService;
import com.platform.datasource.base.dto.decree.DecreeDetailInfo;
import com.platform.datasource.base.dto.decree.DecreeSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "References Decree API", description = "공통 법령 조회 API")
@RestController
@RequestMapping("/api/references/decree")
@RequiredArgsConstructor
public class ReferencesDecreeReadController {

  private final ReferencesDecreeReadService referencesDecreeReadService;

  @Operation(summary = "관련 법령 리스트", description = "관련 법령 목록을 조회한다.")
  @GetMapping
  ResponseEntity<DecreeInfoSearchResponse> getDecreeList(
      @ParameterObject DecreeSearch decreeSearch) {
    return ResponseEntity.ok()
        .body(referencesDecreeReadService.getDecreeResultList(decreeSearch));
  }

  @Operation(summary = "법령 및 시행규칙 상세조회", description = "사용자가 선택한 법령 및 시행규칙 상세 정보를 조회한다.")
  @GetMapping("/{decreeDetailSeq}")
  ResponseEntity<DecreeDetailInfo> getDecreeDetail(@PathVariable Long decreeDetailSeq) {
    return ResponseEntity.ok()
        .body(referencesDecreeReadService.getDecreeResultDetail(decreeDetailSeq));
  }

}
