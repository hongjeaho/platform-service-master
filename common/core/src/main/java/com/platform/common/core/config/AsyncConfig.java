package com.platform.common.core.config;

import java.util.concurrent.Executor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * 비동기 작업 실행을 위한 구성 클래스.
 * 이 클래스는 비동기 작업, 특히 PDF 처리 작업을 처리하기 위한
 * ThreadPoolTaskExecutor를 구성합니다.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
  /**
   * 비동기 작업 실행을 위한 ThreadPoolTaskExecutor를 생성하고 구성합니다.
   * 
   * @return 다음 설정으로 구성된 Executor:
   *         - 기본 풀 크기: 2개 스레드
   *         - 최대 풀 크기: 10개 스레드
   *         - 대기열 용량: 100개 작업
   *         - 스레드 이름 접두사: "PDF-Async-"
   *         - 유휴 스레드 유지 시간: 60초
   *         - 종료 시 작업 완료 대기: 활성화
   *         - 종료 대기 시간: 30초
   */
  @Bean(name = "pdfTaskExecutor")
  public Executor pdfTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(10);
    executor.setQueueCapacity(100);
    executor.setThreadNamePrefix("PDF-Async-");
    executor.setKeepAliveSeconds(60);
    executor.setWaitForTasksToCompleteOnShutdown(true);
    executor.setAwaitTerminationSeconds(30);
    executor.initialize();
    return executor;
  }
}
