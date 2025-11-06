package com.platform.api.platform.account.security.controller;

import com.platform.api.platform.account.security.dto.PasswordUpdateRequest;
import com.platform.api.platform.account.security.service.AccountSecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Account Security API", description = "사용자 보안을 위한 API")
@RestController
@RequestMapping("/api/account/security")
@RequiredArgsConstructor
class AccountSecurityController {

  private final AccountSecurityService accountSecurityService;

  @Operation(summary = "비밀번호 변경", description = "현재 로그인된 사용자의 비밀번호를 변경한다.")
  @PutMapping
  ResponseEntity<Boolean> updatePassword(@Valid @RequestBody PasswordUpdateRequest request) {
    accountSecurityService.updatePassword(request);
    return ResponseEntity.ok().body(true);
  }
}