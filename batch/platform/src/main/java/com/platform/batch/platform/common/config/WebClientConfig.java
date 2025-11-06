package com.platform.batch.platform.common.config;

import com.platform.batch.platform.common.config.properties.KakaoApiProperties;
import com.platform.batch.platform.common.config.properties.KapaApiProperties;
import com.platform.batch.platform.common.config.properties.LtisApiProperties;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class WebClientConfig {

  public static final String LTIS_WEB_CLIENT = "ltisWebClient";
  public static final String KAKAO_WEB_CLIENT = "kakaoWebClient";
  public static final String KAPA_WEB_CLIENT = "kapaWebClient";
  private final KapaApiProperties kapaApiProperties;
  private final LtisApiProperties ltisApiProperties;
  private final KakaoApiProperties kakaoApiProperties;

  private static ExchangeStrategies getExchangeStrategies() {
    return ExchangeStrategies.builder()
        .codecs(configurer ->
            configurer.defaultCodecs().maxInMemorySize(100 * 1024 * 1024)
        ).build();
  }

  private static HttpClient createHttpClient() {
    ConnectionProvider connectionProvider = ConnectionProvider.builder("batch-connection")
        .maxConnections(30)                           // 커넥션 풀 갯수
        .pendingAcquireTimeout(Duration.ofMinutes(30)) // 커넥션 풀에서 커넥션을 얻기 위해 기다리는 최대 시간
        .pendingAcquireMaxCount(-1)                    // 커넥션 풀에서 커넥션을 가져오는 시도 횟수 (-1: no limit)
        .maxIdleTime(Duration.ofMinutes(30))        // 연결이 풀에 남아 있는 동안 사용되지 않은 최대 시간.
        .maxLifeTime(Duration.ofMinutes(30))        // 연결이 풀에 존재할 수 있는 최대 시간.
        .build();

    return HttpClient.create(connectionProvider)
        .option(ChannelOption.SO_KEEPALIVE, true)
        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 60000) // 10분
        .doOnConnected(conn ->
            conn.addHandlerLast(new ReadTimeoutHandler(600))  // Set read timeout
                .addHandlerLast(new WriteTimeoutHandler(600))) // Set write timeout
        .responseTimeout(Duration.ofMinutes(30));// Set response timeout
    // .wiretap(WebClientConfig.class.getName(), LogLevel.DEBUG, AdvancedByteBufFormat.TEXTUAL);  // Enable logging
  }

  @Bean(KAPA_WEB_CLIENT)
  public WebClient kapaWebClient() {
    return WebClient.builder()
        .clientConnector(new ReactorClientHttpConnector(createHttpClient()))
        .exchangeStrategies(getExchangeStrategies())
        .baseUrl(kapaApiProperties.getApi())
        .defaultHeaders(httpHeaders -> httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE))
        .build();
  }

  @Bean(LTIS_WEB_CLIENT)
  public WebClient ltisWebClient() {
    return WebClient.builder()
        .clientConnector(new ReactorClientHttpConnector(createHttpClient()))
        .exchangeStrategies(getExchangeStrategies())
        .baseUrl(ltisApiProperties.getApi())
        .defaultHeaders(httpHeaders -> httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE))
        .build();
  }

  @Bean(KAKAO_WEB_CLIENT)
  public WebClient kakaoWebClient() {
    return WebClient.builder()
        .clientConnector(new ReactorClientHttpConnector(createHttpClient()))
        .exchangeStrategies(getExchangeStrategies())
        .baseUrl(kakaoApiProperties.getApi())
        .defaultHeaders(httpHeaders -> {
          httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
          httpHeaders.add(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoApiProperties.getAppKey());
        })
        .build();
  }
}
