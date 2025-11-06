package com.platform.common.base;


import com.platform.common.base.resolver.BaseActiveProfilesResolver;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles(resolver = BaseActiveProfilesResolver.class)
public class BaseSpringBootTest {
}
