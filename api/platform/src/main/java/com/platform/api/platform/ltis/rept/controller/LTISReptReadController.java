package com.platform.api.platform.ltis.rept.controller;

import com.platform.api.platform.ltis.info.dto.LTISCompensationAmountByOwnerInfoResponse;
import com.platform.api.platform.ltis.rept.service.LTISReptReadService;
import com.platform.common.base.dto.AbstractPagingDTO;
import com.platform.datasource.base.dto.ltis.LTISInfo;
import com.platform.datasource.base.dto.ltis.LTISReptInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "LTIS Rept API", description = "LTIS 조서 정보 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ltis/rept")
public class LTISReptReadController {

  private final LTISReptReadService ltisReptReadService;

  @Operation(summary = "조서 정보를 조회한다.", description = "조서 정보를 조회한다.")
  @GetMapping("/{judgSeq}")
  ResponseEntity<LTISInfo> getLtisReptInfo(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisReptReadService.getReptReportInfo(judgSeq));
  }

  @Operation(summary = "조서 필지 정보를 조회한다.", description = "조서 필지 정보를 조회한다.")
  @GetMapping("/{judgSeq}/land")
  ResponseEntity<List<LTISReptInfo>> getLtisReptLand(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisReptReadService.getLtisReptLand(judgSeq));
  }

  @Operation(summary = "조서 필지 소유자 정보를 조회한다.", description = "조서 필지 소유자 정보를 조회한다.")
  @GetMapping("/{judgSeq}/landOwner")
  ResponseEntity<List<LTISReptInfo>> getLtisReptLandOwner(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisReptReadService.getLtisReptLandOwner(judgSeq));
  }

  @Operation(summary = "조서 지장물 정보를 조회한다.", description = "조서 지장물 정보를 조회한다.")
  @GetMapping("/{judgSeq}/object")
  ResponseEntity<List<LTISReptInfo>> getLtisReptObject(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisReptReadService.getLtisReptObject(judgSeq));
  }

  @Operation(summary = "조서 지장물 소유자 정보를 조회한다.", description = "조서 지장물 소유자 정보를 조회한다.")
  @GetMapping("/{judgSeq}/objectOwner")
  ResponseEntity<List<LTISReptInfo>> getLtisReptObjectOwner(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(ltisReptReadService.getLtisReptObjectOwner(judgSeq));
  }

  @Operation(summary = "소유자별 보상액 정보를 조회한다.", description = "소유자별 보상액 정보를 조회한다.")
  @GetMapping("/compensationAmountByOwnerInfo/{judgSeq}")
  ResponseEntity<LTISCompensationAmountByOwnerInfoResponse> getLTISCompensationAmountByOwnerInfo(@PathVariable long judgSeq, @ParameterObject AbstractPagingDTO paging) {
    return ResponseEntity.ok().body(ltisReptReadService.getLTISCompensationAmountByOwnerInfo(judgSeq, paging));
  }
}
