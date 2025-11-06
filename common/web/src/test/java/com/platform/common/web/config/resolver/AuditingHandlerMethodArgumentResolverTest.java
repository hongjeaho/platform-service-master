package com.platform.common.web.config.resolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.common.base.BaseSpringBootTest;
import com.platform.common.base.auth.AuthUser;
import com.platform.common.base.auth.BasicAuthority;
import com.platform.common.web.dto.UserTestComplexDTO;
import com.platform.common.web.dto.UserTestDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;

import java.util.List;
import java.util.Set;

import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class AuditingHandlerMethodArgumentResolverTest extends BaseSpringBootTest {

    @Autowired
    private WebApplicationContext webApplicationContext;
    private MockMvc mockMvc;

    private static final AuthUser USER = AuthUser.builder()
            .seq(1L)
            .userId("ADMIN")
            .roles(Set.of(new BasicAuthority(1L, "DECISION")))
            .build();

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .addFilters(new CharacterEncodingFilter("UTF-8", true))
                .alwaysDo(print())
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("단건 정보 Auditing 검증")
    public void requesting_Auditing_info()
            throws Exception {
        var username = "admin";
        var email = "email@email.com";

        var userEntity = UserTestDTO.builder().username(username).email(email).build();
        var json = new ObjectMapper().writeValueAsString(userEntity);

        mockMvc.perform(
                        post("/auditing-test/user-dto")
                                .with(user(USER))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value(username))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.createdBy").value(USER.getSeq().intValue()))
                .andExpect(jsonPath("$.updatedBy").value(USER.getSeq().intValue()));
    }


    @Test
    @DisplayName("리스트 정보 Auditing 검증")
    public void requesting_List_Auditing_Info() throws Exception {
        var list = List.of(
                UserTestDTO.builder().username("admin1").email("1@email.com").build(),
                UserTestDTO.builder().username("admin2").email("2@email.com").build()
        );
        var json = new ObjectMapper().writeValueAsString(list);

        mockMvc.perform(
                        post("/auditing-test/user-list-dto")
                                .with(user(USER))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].username", containsInAnyOrder("admin1", "admin2")))
                .andExpect(jsonPath("$[*].email", containsInAnyOrder("1@email.com", "2@email.com")))
                .andExpect(jsonPath("$[*].createdBy",
                        containsInAnyOrder(USER.getSeq().intValue(), USER.getSeq().intValue())))
                .andExpect(jsonPath("$[*].updatedBy",
                        containsInAnyOrder(USER.getSeq().intValue(), USER.getSeq().intValue())));
    }


    @Test
    @DisplayName("서브 Auditing 검증")
    public void requesting_List_Entities_Successfully_Set_Auditing_Info() throws Exception {
        var username = "admin";
        var email = "email@email.com";

        var subUserEntity = UserTestDTO.builder().username("sub").email("sub@email.com").build();
        var userEntity = UserTestComplexDTO.builder().username("admin").email("email@email.com")
                .subUser(subUserEntity).build();

        userEntity.setSubUser(subUserEntity);

        var json = new ObjectMapper().writeValueAsString(userEntity);

        mockMvc.perform(
                        post("/auditing-test/user-sub-dto")
                                .with(user(USER))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(json)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subUser.username").value(subUserEntity.getUsername()))
                .andExpect(jsonPath("$.subUser.email").value(subUserEntity.getEmail()))
                .andExpect(jsonPath("$.subUser.createdBy").value(USER.getSeq().intValue()))
                .andExpect(jsonPath("$.subUser.updatedBy").value(USER.getSeq().intValue()));
    }
}
