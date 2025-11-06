package com.platform.batch.platform.common.config.properties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@AllArgsConstructor
@ConfigurationProperties(prefix = "api.ltis")
public class LtisApiProperties {

  private final String api;
  private final String path;
}