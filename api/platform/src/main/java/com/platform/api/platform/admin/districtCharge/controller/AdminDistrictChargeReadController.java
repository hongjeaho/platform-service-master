package com.platform.api.platform.admin.districtCharge.controller;

import com.platform.api.platform.admin.districtCharge.dto.AdminDistrictChargeSearchResponse;
import com.platform.api.platform.admin.districtCharge.service.AdminDistrictChargeReadService;
import com.platform.datasource.base.dto.admin.district.AdminDistrictChargeSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "District Charge API", description = "재결관 담당구역 관리를 위한 API")
@RestController
@RequestMapping("/api/admin/districtCharge")
@RequiredArgsConstructor
public class AdminDistrictChargeReadController {

  private final AdminDistrictChargeReadService adminDistrictChargeReadService;

  @Operation(summary = "구별 담당자 리스트 조회", description = "구별 담당자 정보를 조회 한다..")
  @GetMapping
  ResponseEntity<AdminDistrictChargeSearchResponse> getAdminDistrictChargeList(
      @ParameterObject AdminDistrictChargeSearch search
  ) {
    return ResponseEntity.ok(adminDistrictChargeReadService.getDistrictChargeList(search));
  }

  @Operation(summary = "구별 담당자 상세 조회", description = "구별 담당자 상세 정보를 조회 한다..")
  @GetMapping("/{seq}")
  ResponseEntity<AdminDistrictManagerEntity> getAdminDistrictCharge(@PathVariable Long seq) {
    return ResponseEntity.ok(adminDistrictChargeReadService.getDistrictCharge(seq));
  }
}
