package com.platform.batch.platform.kapa.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@NoArgsConstructor
@AllArgsConstructor
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoApiResponse {

  @JsonProperty("documents")
  private List<TransCoordResult> documents;

  public static KakaoApiResponse ofResponse(String data) {
    if ("[{}]".equals(data)) {
      return new KakaoApiResponse();
    }

    try {
      ObjectMapper objectMapper = new ObjectMapper();
      return objectMapper.readValue(data, KakaoApiResponse.class);
    } catch (Exception e) {
      log.error("Failed to parse data", e);
      return new KakaoApiResponse();
    }
  }

  @NoArgsConstructor
  @AllArgsConstructor
  @Getter
  @JsonIgnoreProperties(ignoreUnknown = true)
  public static class TransCoordResult {

    private String x;
    private String y;
  }

}
