package com.platform.api.platform.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.common.web.config.filter.JWTCheckFilter;
import com.platform.common.web.dto.ErrorCode;
import com.platform.common.web.dto.ErrorResponse;
import com.platform.datasource.base.repository.authority.AuthorityRepository;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  private final PasswordEncoder passwordEncoder;
  private final AuthorityRepository authorityRepository;
  private final JWTCheckFilter jwtCheckFilter;
  private final OncePerRequestFilter platformHeaderFilter;
  private final ObjectMapper objectMapper;

  private static final List<String> ALLOWED_ORIGINS = List.of(
      "http://localhost",
      "http://localhost:3000",
      "https://dev.platform.go.kr"
  );

  public SecurityConfig(AuthorityRepository authorityRepository, JWTCheckFilter jwtCheckFilter,
      PasswordEncoder passwordEncoder,
      @Qualifier("platformHeaderFilter") OncePerRequestFilter platformHeaderFilter
      , ObjectMapper objectMapper) {
    this.passwordEncoder = passwordEncoder;
    this.authorityRepository = authorityRepository;
    this.jwtCheckFilter = jwtCheckFilter;
    this.platformHeaderFilter = platformHeaderFilter;
    this.objectMapper = objectMapper;
  }

  @Bean
  UserDetailsService userDetailsService() {
    return authorityRepository::findAuthorById;
  }

  @Bean
  AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    var authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder.userDetailsService(userDetailsService())
        .passwordEncoder(passwordEncoder);
    return authenticationManagerBuilder.build();
  }

  @Bean
  SecurityFilterChain configure(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)  // CSRF(Cross-Site Request Forgery) 보호를 비활성화
        .cors(security -> security.configurationSource(corsConfigurationSource())) // cors 설정
        .exceptionHandling(security -> {
          security.authenticationEntryPoint(restAuthenticationEntryPoint());
          security.accessDeniedHandler(accessDeniedHandler());
        })
        .sessionManagement(session ->   // 세션 관리 정책을 설정
            session.sessionCreationPolicy(
                SessionCreationPolicy.STATELESS)) //  상태 없는(stateless) API로 동작
        .authorizeHttpRequests(authorizeRequests ->
            authorizeRequests
                .requestMatchers("/public/swagger-ui/**").permitAll()
                .requestMatchers("/public/platform/actuator/**").permitAll()
                .requestMatchers("/error", "/api/public/**").permitAll() // 인증 없이 접근 설정
                .anyRequest().authenticated()); //  모든 요청에 대해 인증을 요구하도록 설정

    // JWT 토큰 검증 처리
    http.addFilterBefore(platformHeaderFilter, UsernamePasswordAuthenticationFilter.class);
    http.addFilterAt(jwtCheckFilter, BasicAuthenticationFilter.class);

    // 메인 쓰레드 SecurityContext를 공유 하도록 설정한다.
    SecurityContextHolder.setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    return http.build();
  }

  // 권한 Prefix (default = ROLE_)
  @Bean
  GrantedAuthorityDefaults grantedAuthorityDefaults() {
    return new GrantedAuthorityDefaults("");
  }

  // 인증이 되지않은 유저가 요청을 했을때 동작
  private AuthenticationEntryPoint restAuthenticationEntryPoint() {
    return (request, response, ex) -> {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.setCharacterEncoding("UTF-8");
      objectMapper.writeValue(response.getWriter(),
          ErrorResponse.of(ErrorCode.AUTH_REQUIRED, "인증이 필요합니다."));
    };
  }

  //  권한을 체크후 액세스 할 수 없는 요청을 했을시 동작
  private AccessDeniedHandler accessDeniedHandler() {
    return (request, response, ex) -> {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.setCharacterEncoding("UTF-8");
      objectMapper.writeValue(response.getWriter(),
          ErrorResponse.of(ErrorCode.FORBIDDEN, "접근이 거부되었습니다."));
    };
  }

  // cors 설정
  private CorsConfigurationSource corsConfigurationSource() {
    var config = new CorsConfiguration();
    ALLOWED_ORIGINS.forEach(config::addAllowedOrigin);

    config.addAllowedHeader("*");
    config.addAllowedMethod("*");

    // config.addExposedHeader("*");
    config.setExposedHeaders(
        List.of("Content-Disposition", "Content-Length", "Content-Type", "Authorization",
            "x-token-expired"));

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
  }
}
