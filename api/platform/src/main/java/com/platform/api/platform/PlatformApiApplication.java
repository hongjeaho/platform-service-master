package com.platform.api.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {
        "com.platform.common.base",
        "com.platform.datasource.base",
        "com.platform.common.core",
        "com.platform.common.web",
        "com.platform.api.platform",
})

@EnableCaching
@EnableScheduling
public class PlatformApiApplication {
    public static void main(final String[] args) {
        SpringApplication.run(PlatformApiApplication.class, args);
    }
}