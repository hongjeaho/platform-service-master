package com.platform.api.platform.admin.userManagement.controller;

import com.platform.api.platform.admin.userManagement.dto.AdminUserManagementSearchResponse;
import com.platform.api.platform.admin.userManagement.service.AdminUserManagementReadService;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementResult;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin User Management API", description = "사용자 관리를 위한 API")
@RestController
@RequestMapping("/api/admin/userManagement")
@RequiredArgsConstructor
class AdminUserManagementReadController {

  private final AdminUserManagementReadService adminUserManagementReadService;

  @Operation(summary = "사용자 조회", description = "사용자 목록을 조회한다.")
  @GetMapping
  ResponseEntity<AdminUserManagementSearchResponse> getAdminUserManagementList(@ParameterObject AdminUserManagementSearch search) {
    return ResponseEntity.ok(adminUserManagementReadService.getAdminUserManagementList(search));
  }

  @Operation(summary = "사용자 상세 조회", description = "사용자 상세 정보를 조회한다.")
  @GetMapping("/{seq}")
  ResponseEntity<AdminUserManagementResult> getAdminUserManagement(@PathVariable Long seq) {
    return ResponseEntity.ok(adminUserManagementReadService.getAdminUserManagement(seq));
  }

  @Operation(summary = "사용자 아이디 확인", description = "사용중인 아이디인지 확인 한다.")
  @GetMapping("/userid/check")
  ResponseEntity<Boolean> hasAdminUserManagementUserIdCheck(String userId) {
    return ResponseEntity.ok(adminUserManagementReadService.hasAdminUserManagementUserIdCheck(userId));
  }

}
