package com.platform.api.platform.admin.districtCharge.controller;

import com.platform.api.platform.admin.districtCharge.service.AdminDistrictChargeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "District Charge API", description = "재결관 담당구역 관리를 위한 API")
@RestController
@RequestMapping("/api/admin/districtCharge")
@RequiredArgsConstructor
public class AdminDistrictChargeController {

  private final AdminDistrictChargeService adminDistrictChargeService;

  @Operation(summary = "구별 담당자 등록", description = "구별 담당자 정보를 등록한다.")
  @PostMapping
  ResponseEntity<Boolean> insertAdminDistrictCharge(@RequestBody AdminDistrictManagerEntity entity) {
    adminDistrictChargeService.create(entity);
    return ResponseEntity.ok(true);
  }

  @Operation(summary = "구별 담당자 수정", description = "구별 담당자 정보를 수정한다.")
  @PutMapping("/{seq}")
  ResponseEntity<Boolean> updateAdminDistrictCharge(@PathVariable long seq, @RequestBody AdminDistrictManagerEntity entity) {
    adminDistrictChargeService.update(seq, entity);
    return ResponseEntity.ok(true);
  }

  @Operation(summary = "구별 담당자 삭제", description = "구별 담당자 정보를 삭제한다.")
  @DeleteMapping("/{seq}")
  ResponseEntity<Boolean> deleteAdminDistrictCharge(@PathVariable long seq) {
    adminDistrictChargeService.delete(seq);
    return ResponseEntity.ok(true);
  }
}
