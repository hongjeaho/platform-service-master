package com.platform.api.platform.authority.controller;

import com.platform.api.platform.authority.service.PublicAuthorityService;
import com.platform.common.base.auth.AuthRequest;
import com.platform.common.base.auth.AuthUser;
import com.platform.common.web.util.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Public Authority API", description = "인증에 처리 API")
@RestController
@RequestMapping("/api/public/authority")
@RequiredArgsConstructor
public class PublicAuthorityController {

    // token 만료 시간
    @Value("${jwt.expiration.period:86400000}") // 기본 하루 (1 * 24 * 60 * 60 * 1000)
    private long jwtExpirationPeriod;

    private final PublicAuthorityService publicAuthorityService;

    @Operation(summary = "로그인 처리", description = "로그인 처리 후 인증된 정보를 내려준다.")
    @PostMapping("/login")
    ResponseEntity<AuthUser> login(
            @RequestBody AuthRequest authRequest
    ) {
        final var user = publicAuthorityService.login(authRequest);
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, JwtTokenUtil.makeAuthToken(user, jwtExpirationPeriod))
                .body(user);
    }


}
