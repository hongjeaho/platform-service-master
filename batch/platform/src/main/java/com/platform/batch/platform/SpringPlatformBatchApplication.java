package com.platform.batch.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication(scanBasePackages = {
    "com.platform.common.base",
    "com.platform.datasource.base",
    "com.platform.common.core",
    "com.platform.batch"
})
@ConfigurationPropertiesScan("com.platform.batch.platform.common.config.properties")
public class SpringPlatformBatchApplication {

  public static void main(String[] args) {
    final var exitStatus = SpringApplication.exit(
        SpringApplication.run(SpringPlatformBatchApplication.class, args));

    System.exit(exitStatus);
  }
}
