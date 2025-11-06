package com.platform.api.platform.conclusion.review.dto;

import com.platform.datasource.base.dto.conclusion.ConclusionResult;
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
@Schema(name = "DecisionInfoSearchResponse", description = "LTIS 심의 정보 조회 결과")
public class ConclusionInfoSearchResponse {

	@Schema(name = "total", description = "전체 count")
	private int total;
	@Schema(name = "resultList", description = "조회 결과")
	private List<ConclusionResult> resultList;
}
