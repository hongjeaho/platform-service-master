package com.platform.datasource.base.repository.authority;


import com.platform.common.base.BaseSpringBootTest;
import com.platform.common.base.auth.BasicAuthority;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class AuthorityRepositoryTest extends BaseSpringBootTest {

    @Autowired
    private AuthorityRepository authorityRepository;

    @DisplayName("id를 이용해서 사용자 조회")
    @Test
    public void testFindById() {
        var user = authorityRepository.findAuthorById("admin");

        assertEquals("admin@gmail.com", user.getUserEmail());
        assertEquals("admin", user.getUserId());
        assertEquals("어드민", user.getName());
        assertEquals(2, user.getRoles().size());

        assertThat(user.getRoles())
                .extracting(BasicAuthority::getAuthority)
                .containsExactlyInAnyOrder("IMPLEMENTER", "DECISION");
    }
}