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
public class LtisOwnrInfoResponse {

  private String code;

  @JsonProperty("data")
  private List<LtisOwnrInfoDto> ownrInfoList;

  public static LtisOwnrInfoResponse ofResponse(String data) {
    if (data == null || data.trim().isEmpty()) {
      return new LtisOwnrInfoResponse();
    }
    String trimmed = data.trim();
    if ("[]".equals(trimmed) || "[{}]".equals(trimmed)) {
      return new LtisOwnrInfoResponse();
    }
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      return objectMapper.readValue(data, LtisOwnrInfoResponse.class);
    } catch (Exception e) {
      return new LtisOwnrInfoResponse();
    }
  }
}
