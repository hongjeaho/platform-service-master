package com.platform.api.platform.authority.controller;

import com.platform.api.platform.authority.service.AuthorityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authority API", description = "권한  API")
@RestController
@RequestMapping("/api/authority/implementer")
@RequiredArgsConstructor
@Validated
public class AuthorityController {
    private final AuthorityService authorityService;

    @Operation(summary = "사건 접근 권환 확인", description = "사건 접근 권환 정보를 확인 한다.")
    @GetMapping("/{judgSeq}")
    ResponseEntity<Boolean> isAuthorizedForCase(
            @PathVariable 
            @NotNull(message = "재결 일련번호는 필수입니다.")
            @Min(value = 1, message = "재결 일련번호는 1 이상이어야 합니다.") 
            Long judgSeq) {
        
        return ResponseEntity.ok().body(
                authorityService.isAuthorizedForCase(judgSeq)
        );
    }
}