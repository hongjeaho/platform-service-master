package com.platform.batch.platform.kapa.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class OfficialPriceResponse {

  @JsonProperty("status")
  String status;

  @JsonProperty("message")
  String message;

  @JsonProperty("body")
  private List<OfficialPriceDto> OfficialPriceData;
}
