package com.platform.batch.platform.ltis.dto;

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
public class LtisRecmInfoResponse {

  private String code;

  @JsonProperty("data")
  private List<LtisRecmInfoDto> recmInfoList;

  public static LtisRecmInfoResponse ofResponse(String data) {
    if (data == null || data.trim().isEmpty()) {
      return new LtisRecmInfoResponse();
    }
    String trimmed = data.trim();
    if ("[]".equals(trimmed) || "[{}]".equals(trimmed)) {
      return new LtisRecmInfoResponse();
    }
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      return objectMapper.readValue(data, LtisRecmInfoResponse.class);
    } catch (Exception e) {
      log.error("Failed to parse JSON data: {}", data, e);
      return new LtisRecmInfoResponse();
    }
  }
}
