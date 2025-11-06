package com.platform.common.web.config;

import com.platform.common.base.auth.AuthUser;
import com.platform.common.base.auth.BasicAuthority;
import com.platform.common.web.util.JwtTokenUtil;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import java.util.Set;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("local")
@Configuration
public class SwaggerConfig {

    @Bean
    OpenAPI openAPI() {
        return new OpenAPI()
            .components(new Components())
            .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
            .title("service-platform-web")
            .description("platform API")
            .version("1.0");
    }

    @Bean
    public String createSwaggerJwtToken() {
        AuthUser authUser = new AuthUser();
        authUser.setSeq(1L);
        authUser.setUserId("admin");
        authUser.setRoles(Set.of(
            BasicAuthority.builder().role("ADMIN").build(),
            BasicAuthority.builder().role("DECISION").build(),
            BasicAuthority.builder().role("IMPLEMENTER").build()
        ));
        return "Bearer " + JwtTokenUtil.makeAuthToken(authUser);
    }
}
