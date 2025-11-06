package com.platform.api.platform.references.map.controller;

import com.platform.api.platform.references.map.dto.ReferencesMapResponse;
import com.platform.api.platform.references.map.service.ReferencesMapReadService;
import com.platform.datasource.base.dto.reference.map.ReferencesMapSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "References Map API", description = "지도 정보 조회 API")
@RestController
@RequestMapping("/api/references/map")
@RequiredArgsConstructor
public class ReferencesMapReadController {

  private final ReferencesMapReadService referencesMapReadService;

  @Operation(summary = "재결관 의견 리스트", description = "재결관 의견 목록을 조회한다.")
  @GetMapping
  ResponseEntity<ReferencesMapResponse> getReferencesMapList(
      @ParameterObject ReferencesMapSearch referencesMapSearch
  ) {
    return ResponseEntity.ok()
        .body(referencesMapReadService.getReferencesMapList(referencesMapSearch));
  }
}
