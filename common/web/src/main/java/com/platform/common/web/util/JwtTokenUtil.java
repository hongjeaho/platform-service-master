package com.platform.common.web.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.common.base.auth.AuthUser;
import java.util.Date;
import java.util.Map;

public class JwtTokenUtil {

    private static final String JWT_ISSUER = "platform.go.kr";
    private static final String SECRET = "kr.go.platform.common.core.util.JWTUtil";
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    // 토큰 생성
    public static String makeAuthToken(final AuthUser user) {
        long jwtExpirationPeriod = 24 * 60 * 60 * 1000; // 하루
        return makeAuthToken(user, jwtExpirationPeriod);
    }

    // 토큰을 생성한다.
    public static String makeAuthToken(final AuthUser user, long jwtExpirationPeriod) {
        var currentTimeMillis = System.currentTimeMillis();
        // AuthUser 객체를 Map으로 직렬화
        Map<String, Object> userMap = OBJECT_MAPPER.convertValue(
            user, new com.fasterxml.jackson.core.type.TypeReference<>() {
            }
        );

        return JWT.create()
            .withIssuer(JWT_ISSUER)
            .withSubject(user.getUsername())
            .withIssuedAt(new Date(currentTimeMillis))
            .withExpiresAt(new Date(currentTimeMillis + jwtExpirationPeriod))
            .withClaim("user", userMap)
            .sign(ALGORITHM);
    }

    // 토큰 정보를 조회 한다.
    public static AuthUser verify(final String token) {
        try {
            DecodedJWT verify = JWT.require(ALGORITHM).build().verify(token);
            // user claim 꺼내기
            Map<String, Object> userMap = verify.getClaim("user").asMap();
            var user = OBJECT_MAPPER.convertValue(userMap, AuthUser.class);
            user.setSuccess(true);
            return user;
        } catch (JWTVerificationException ex) {
            return decode(token);
        }
    }

    // 만료 시간을 조회 한다.
    public static Date getExpirationDate(String token) {
        return JWT.require(ALGORITHM).build().verify(token).getExpiresAt();
    }

    private static AuthUser decode(String token) {
        try {
            DecodedJWT decode = JWT.decode(token);
            return AuthUser.builder()
                .name(decode.getSubject())
                .success(false)
                .build();
        } catch (Exception ex) {
            return AuthUser.builder().success(false).build();
        }
    }
}
