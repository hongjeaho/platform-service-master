package com.platform.batch.platform.kapa.path;

import lombok.Getter;

@Getter
public enum KapaApiPath {
  LAND_OFFICIAL_PRICE("/connect/{year}/{pnu}/officiallyAnnouncedLandPrice.do"),
  LAND_STANDARD_PRICE("/connect/{year}/{reg}/{num}/standardAnnouncedLandPrice.do");

  private final String path;

  KapaApiPath(String path) {
    this.path = path;
  }
}
