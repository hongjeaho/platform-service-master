package com.platform.common.web.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.platform.common.base.auth.AuthUser;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@Slf4j
public class JwtTokenUtilTest {

    @DisplayName("JWT 토큰 성생")
    @Test
    public void createJwtToken() {
        AuthUser authUser = new AuthUser();
        authUser.setUserId("admin");

        String token = JwtTokenUtil.makeAuthToken(authUser);
        log.info(token);
    }

    @DisplayName("JWT 토큰 인증 성공")
    @Test
    public void verifyJwtToken() {
        AuthUser authUser = new AuthUser();
        authUser.setUserId("admin");

        String token = JwtTokenUtil.makeAuthToken(authUser);
        var verify = JwtTokenUtil.verify(token);

        assertTrue(verify.isSuccess());
    }

    @DisplayName("JWT 토큰 인증 실패")
    @Test
    public void verifyJwtTokenFail() throws InterruptedException {
        AuthUser authUser = new AuthUser();
        authUser.setUserId("admin");

        String token = JwtTokenUtil.makeAuthToken(authUser, 1);
        Thread.sleep(1000);
        var verify = JwtTokenUtil.verify(token);

        assertFalse(verify.isSuccess());
    }
}
