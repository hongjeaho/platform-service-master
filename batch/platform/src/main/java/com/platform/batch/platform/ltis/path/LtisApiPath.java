package com.platform.batch.platform.ltis.path;

import lombok.Getter;

@Getter
public enum LtisApiPath {

  LIST("/api/apJudgList.do"),
  DETAIL("/api/apJudgInfo.do"),
  REPT_INFO("/api/apReptInfoList.do"),
  OWNR_INFO("/api/apOwnrInfoList.do"),
  REPT_OWNR_INFO("/api/apReptOwnrInfoList.do"),
  RECM_INFO("/api/apRecmInfoList.do");


  private final String path;

  LtisApiPath(String path) {
    this.path = path;
  }
}
