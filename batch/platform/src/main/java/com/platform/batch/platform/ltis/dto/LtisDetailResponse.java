package com.platform.batch.platform.ltis.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@NoArgsConstructor
@AllArgsConstructor
@Getter
@JsonIgnoreProperties(ignoreUnknown = true)
public class LtisDetailResponse {

  private String code;

  @JsonProperty("totalCount")
  private int totalCount;

  @JsonProperty("data")
  private LtisApiDto ltisTotalInfoDto = new LtisApiDto();

  public static LtisDetailResponse ofResponse(String data) {
    if ("[{}]".equals(data)) {
      return new LtisDetailResponse();
    }
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      return objectMapper.readValue(data, LtisDetailResponse.class);
    } catch (Exception e) {
      log.error("Failed to parse data", e);
      return new LtisDetailResponse();
    }
  }

}
