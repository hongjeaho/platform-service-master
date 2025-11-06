package com.platform.batch.platform.common.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.TransientDataAccessException;

@Slf4j
public class RetryUtils {

  private RetryUtils() {
    // 유틸 클래스이므로 인스턴스화 방지
  }

  /**
   * 간단한 재시도 유틸리티(최대 3회, 지수 백오프)
   */
  public static void executeWithRetry(Runnable action) {
    int attempts = 0;
    long backoff = 500L;

    while (true) {
      try {
        action.run();
        return;
      } catch (RuntimeException e) {
        attempts++;

        // 즉시 실패 대상
        if (e instanceof DataIntegrityViolationException) {
          throw e;
        }

        // 재시도 대상 예외가 아니면 바로 throw
        if (!(e instanceof TransientDataAccessException)) {
          throw e;
        }

        // 최대 횟수 초과 시 throw
        if (attempts >= 3) {
          throw e;
        }

        log.warn("[RetryUtils] transient error detected, retry attempt={} in {}ms",
            attempts, backoff, e);

        try {
          Thread.sleep(backoff);
        } catch (InterruptedException ie) {
          Thread.currentThread().interrupt();
        }

        backoff = Math.min(backoff * 2, 5000L);
      }
    }
  }
}
