package com.platform.api.platform.admin.userManagement.controller;

import com.platform.api.platform.admin.userManagement.service.AdminUserManagementService;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementCreateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin User Management API", description = "사용자 관리를 위한 API")
@RestController
@RequestMapping("/api/admin/userManagement")
@RequiredArgsConstructor
class AdminUserManagementController {

    private final AdminUserManagementService adminUserManagementService;

    @Operation(summary = "사용자 등록", description = "사용자를 등록한다.")
    @PostMapping
    ResponseEntity<Boolean> insertAdminUserManagement(@RequestBody AdminUserManagementCreateRequest adminUserManagementCreateRequest) {
        adminUserManagementService.insertAdminUserManagement(adminUserManagementCreateRequest);
        return ResponseEntity.ok(true);
    }

    @Operation(summary = "사용자 등록", description = "사용자 정보를 수정한다.")
    @PutMapping("/{seq}")
    ResponseEntity<Boolean> updateAdminUserManagement(
        @PathVariable Long seq,
        @RequestBody AdminUserManagementCreateRequest adminUserManagementCreateRequest) {
        adminUserManagementService.updateAdminUserManagement(seq, adminUserManagementCreateRequest);
        return ResponseEntity.ok(true);
    }
}
