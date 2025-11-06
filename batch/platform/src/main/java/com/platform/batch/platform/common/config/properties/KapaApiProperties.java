package com.platform.batch.platform.common.config.properties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;


@Getter
@AllArgsConstructor
@ConfigurationProperties(prefix = "api.kapa")
public class KapaApiProperties {

  private final String api;
  private final String path;
}