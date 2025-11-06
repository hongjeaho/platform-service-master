package com.platform.api.platform.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.platform.api.platform.config.cache.CacheNames;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 커스텀 캐시 설정 - LoadingCache 지원 refreshAfterWrite 기능을 사용하기 위한 LoadingCache 구성
 * <p>
 * 현재 설정된 캐시: - caseTemplate: 케이스 템플릿 캐시
 * <p>
 * 새로운 캐시가 필요한 경우 createCache() 메서드를 참고하여 추가
 */
@Slf4j
@Configuration
@EnableCaching
public class CacheConfig {

  @Bean
  public CacheManager cacheManager() {
    SimpleCacheManager cacheManager = new SimpleCacheManager();

    // 캐시 목록 정의
    List<Cache> caches = List.of(
        createCaseTemplateCache() // 새로운 캐시가 필요하면 여기에 추가
    );

    cacheManager.setCaches(caches);

    String cacheNames = caches.stream()
        .map(Cache::getName)
        .collect(Collectors.joining(", "));
    log.info("Cache manager initialized with caches: [{}]", cacheNames);

    return cacheManager;
  }

  /**
   * caseTemplate 캐시 생성
   * <p>
   * 캐시 만료 정책: - expireAfterWrite: 10분 - 캐시 데이터가 생성되거나 업데이트된 후 10분이 지나면 자동 만료 - expireAfterAccess: 30분 - 캐시 데이터에 마지막으로 접근한 후 30분이 지나면 자동 만료 - refreshAfterWrite: 8분 - 캐시 데이터가 생성/업데이트된 후 8분이 지나면 백그라운드에서
   * 새로고침 - maximumSize: 2000 - 최대 2000개의 캐시 엔트리만 보관
   */
  private Cache createCaseTemplateCache() {
    LoadingCache<Object, Object> cache = Caffeine.newBuilder()
        .expireAfterWrite(Duration.ofMinutes(10)) // 10분
        .expireAfterAccess(Duration.ofMinutes(30)) //30분
        .refreshAfterWrite(Duration.ofMinutes(8)) // 8분
        .maximumSize(2000)
        .recordStats()
        .build(key -> {
          log.debug("Cache miss for caseTemplate key: {}", key);
          return null;
        });

    return new CaffeineCache(CacheNames.OPINION_TEMPLATE_CACHE_NAME, cache);
  }
}