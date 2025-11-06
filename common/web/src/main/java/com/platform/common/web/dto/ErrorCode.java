package com.platform.common.web.dto;

/**
 * 표준 에러 코드. 가이드라인의 DOMAIN_REASON 포맷을 따른다.
 */
public enum ErrorCode {
  AUTH_REQUIRED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  VALIDATION_FAILED,
  UNPROCESSABLE,
  INTERNAL_ERROR
}
