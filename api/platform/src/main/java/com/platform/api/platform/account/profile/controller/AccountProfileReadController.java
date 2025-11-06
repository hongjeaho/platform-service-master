package com.platform.api.platform.account.profile.controller;

import com.platform.api.platform.account.profile.dto.ProfileResponse;
import com.platform.api.platform.account.profile.service.AccountProfileReadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Account Profile API", description = "사용자 프로필을 위한 API")
@RestController
@RequestMapping("/api/account/profile")
@RequiredArgsConstructor
class AccountProfileReadController {

  private final AccountProfileReadService accountProfileReadService;

  @Operation(summary = "사용자 프로필 조회", description = "현재 로그인된 사용자의 프로필 정보를 조회한다.")
  @GetMapping
  ResponseEntity<ProfileResponse> getProfile() {
    return ResponseEntity.ok().body(accountProfileReadService.getProfile());
  }
}