package com.platform.api.platform.authority.service;


import com.platform.common.base.auth.AuthRequest;
import com.platform.common.base.auth.AuthUser;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class PublicAuthorityService {
    private final AuthenticationManager authenticationManager;

    /**
     * 로그인 인증 여부를 검사하고 사용자 정보를 return 한다.
     *
     * @param authRequest 로그인 정보
     * @return 사용자 정보
     */
    public AuthUser login(AuthRequest authRequest) {
        final var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getId(),
                        authRequest.getPassword()));

        return (AuthUser) authentication.getPrincipal();
    }
}
