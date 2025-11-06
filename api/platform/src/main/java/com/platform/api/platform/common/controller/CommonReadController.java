package com.platform.api.platform.common.controller;


import com.platform.api.platform.common.service.CommonOpinionTemplateReadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.OpinionTemplateEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Common Application API", description = "공통 코드 조회 API")
@RestController
@RequestMapping("/api/common")
@RequiredArgsConstructor
public class CommonReadController {

  private final CommonOpinionTemplateReadService commonOpinionTemplateReadService;

  @Operation(summary = "의견작성 템플릿 리스트", description = "의견작성의 쟁점의견 목록을 조회한다")
  @GetMapping("/templateList")
  ResponseEntity<List<OpinionTemplateEntity>> getOpinionTemplateList() {
    return ResponseEntity.ok().body(commonOpinionTemplateReadService.getOpinionTemplateEntityList());
  }

}
