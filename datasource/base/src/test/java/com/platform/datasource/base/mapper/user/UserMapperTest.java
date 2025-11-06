package com.platform.datasource.base.mapper.user;

import com.platform.common.base.BaseSpringBootTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class UserMapperTest extends BaseSpringBootTest {

    @Autowired
    private UserMapper userMapper;

    @DisplayName("id를 이용해서 사용자 조회")
    @Test
    public void findUserByIdTest() {
        var user = userMapper.findUserById("admin");

        assertEquals("admin@gmail.com", user.getUserEmail());
        assertEquals("admin", user.getUserId());
        assertEquals("어드민", user.getUserName()
        );
    }
}
