package com.platform.api.platform.references.decree.dto;

import com.platform.datasource.base.dto.decree.DecreeResult;
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
@Schema(name = "DecreeInfoSearchResponse", description = "법령 정보 조회 결과")
public class DecreeInfoSearchResponse {

  @Schema(name = "total", description = "전체 count")
  private int total;

  @Schema(name = "resultList", description = "조회 결과")
  private List<DecreeResult> resultList;
}
