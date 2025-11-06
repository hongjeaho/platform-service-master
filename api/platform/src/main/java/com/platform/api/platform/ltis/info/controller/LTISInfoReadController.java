package com.platform.api.platform.ltis.info.controller;

import com.platform.api.platform.ltis.info.service.LTISInfoReadService;
import com.platform.datasource.base.dto.ltis.AppraisalInfo;
import com.platform.datasource.base.dto.ltis.BusinessSummary;
import com.platform.datasource.base.dto.ltis.LTISImplementerInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "LTIS API", description = "LTIS 정보 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ltis")
public class LTISInfoReadController {

  private final LTISInfoReadService ltisInfoReadService;

  @Operation(summary = "사업 정보를 조회한다.", description = "사업 정보를 조회한다.")
  @GetMapping("/businessSummary/{judgSeq}")
  ResponseEntity<BusinessSummary> getLTISBusinessSummary(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisInfoReadService.getLTISBusinessSummary(judgSeq));
  }

  @Operation(summary = "감정평가 정보를 조회한다.", description = "감정평가 정보를 조회한다.")
  @GetMapping("/appraisalInfo/{judgSeq}")
  ResponseEntity<AppraisalInfo> getLTISAppraisalInfo(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisInfoReadService.getLTISAppraisalInfo(judgSeq));
  }

  @Operation(summary = "조서 비고 정보를 조회한다.", description = "조서 비고 정보를 조회한다.")
  @GetMapping("/implementerInfo/{judgSeq}")
  ResponseEntity<LTISImplementerInfo> getLTISImplementerInfo(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisInfoReadService.getLTISImplementerInfo(judgSeq));
  }
}
