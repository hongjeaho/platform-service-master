package com.platform.api.platform.references.decree.controller;


import com.platform.api.platform.references.decree.service.ReferencesDecreeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "References Decree API", description = "공통 법령 조회 API")
@RestController
@RequestMapping("/api/references/decree")
@RequiredArgsConstructor
public class ReferencesDecreeController {

  private final ReferencesDecreeService referencesDecreeService;

  @Operation(summary = "법령 조회 카운트", description = "관련 법령 조회수를 업데이트한다.")
  @PutMapping("{decreeDetailSeq}/viewCnt")
  ResponseEntity<Boolean> updateDecreeViewCnt(
      @PathVariable long decreeDetailSeq) {
    referencesDecreeService.updateDecreeViewCnt(decreeDetailSeq);
    return ResponseEntity.ok().body(true);
  }


  @Operation(summary = "법령 참조 카운트", description = "관련 법령 참조수를 업데이트한다.")
  @PutMapping("{decreeDetailSeq}/refCnt")
  ResponseEntity<Boolean> updateDecreeRefCnt(
      @PathVariable long decreeDetailSeq) {
    referencesDecreeService.updateDecreeRefCnt(decreeDetailSeq);
    return ResponseEntity.ok().body(true);
  }
}
