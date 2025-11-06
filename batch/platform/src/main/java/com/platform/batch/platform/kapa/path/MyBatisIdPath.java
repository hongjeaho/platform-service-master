package com.platform.batch.platform.kapa.path;

import lombok.Getter;

@Getter
public enum MyBatisIdPath {
  OFFICIAL_QUERY_ID("com.platform.datasource.base.mapper.batch.kapaApi.KapaDataMapper.selectOfficialPriceRequests"),
  STANDARD_QUERY_ID("com.platform.datasource.base.mapper.batch.kapaApi.KapaDataMapper.selectStandardPriceRequests");

  private final String path;

  MyBatisIdPath(String path) {
    this.path = path;
  }
}
