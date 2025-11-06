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
public class LtisReptOwnrInfoResponse {

  private String code;

  @JsonProperty("data")
  private List<LtisReptOwnrInfoDto> reptOwnrInfoList;

  public static LtisReptOwnrInfoResponse ofResponse(String data) {
    if (data == null || data.trim().isEmpty()) {
      return new LtisReptOwnrInfoResponse();
    }
    String trimmed = data.trim();
    if ("[]".equals(trimmed) || "[{}]".equals(trimmed)) {
      return new LtisReptOwnrInfoResponse();
    }
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      return objectMapper.readValue(data, LtisReptOwnrInfoResponse.class);
    } catch (Exception e) {
      log.error("Failed to parse JSON data: {}", data, e);
      return new LtisReptOwnrInfoResponse();
    }
  }
}
