package com.platform.api.platform.receipt.application.dto;

import com.platform.datasource.base.dto.receipt.ReceiptResult;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "ReceiptSearchResponse", description = "사건 접수 조회 결과")
public class ReceiptSearchResponse {

  @Schema(name = "total", description = "전체 count")
  private int total;
  @Schema(name = "resultList", description = "조회 결과")
  private List<ReceiptResult> resultList;
}
