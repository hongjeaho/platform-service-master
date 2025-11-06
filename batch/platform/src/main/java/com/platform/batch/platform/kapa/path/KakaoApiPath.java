package com.platform.batch.platform.kapa.path;

import lombok.Getter;

@Getter
public enum KakaoApiPath {
  API_COORD("/v2/local/geo/transcoord.json");

  private final String path;

  KakaoApiPath(String path) {
    this.path = path;
  }
}
