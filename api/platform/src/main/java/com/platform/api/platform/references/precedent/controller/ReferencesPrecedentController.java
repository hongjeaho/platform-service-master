package com.platform.api.platform.references.precedent.controller;


import com.platform.api.platform.references.precedent.service.ReferencesPrecedentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "References Precedent API", description = "공통 판례 조회수 수정 API")
@RestController
@RequestMapping("/api/references/precedent")
@RequiredArgsConstructor
public class ReferencesPrecedentController {

  private final ReferencesPrecedentService referencesPrecedentService;

  @Operation(summary = "판례 조회 카운트", description = "판례 조회수를 업데이트한다.")
  @PutMapping("{precedentSeq}/viewCount")
  ResponseEntity<Boolean> updatePrecedentViewCount(
      @PathVariable long precedentSeq) {
    referencesPrecedentService.updatePrecedentViewCount(precedentSeq);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "판례 참조 카운트", description = "판례 참조수를 업데이트한다.")
  @PutMapping("{precedentSeq}/refCount")
  ResponseEntity<Boolean> updatePrecedentRefCount(
      @PathVariable long precedentSeq) {
    referencesPrecedentService.updatePrecedentRefCount(precedentSeq);
    return ResponseEntity.ok().body(true);
  }

}
