package com.platform.api.platform.conclusion.review.controller;

import com.platform.api.platform.conclusion.review.dto.ConclusionInfoSearchResponse;
import com.platform.api.platform.conclusion.review.service.ConclusionReadService;
import com.platform.datasource.base.dto.conclusion.ConclusionContent;
import com.platform.datasource.base.dto.conclusion.ConclusionSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "conclusion base API", description = "검토 관련 API")
@RestController
@RequestMapping("/api/conclusion/base")
@RequiredArgsConstructor
public class ConclusionReadController {

	private final ConclusionReadService conclusionReadService;

	@Operation(summary = "검토 리스트 조회", description = "검토 정보를 내려준다.")
	@GetMapping
	ResponseEntity<ConclusionInfoSearchResponse> getConclusionInfoList(
			@ParameterObject ConclusionSearch conclusionSearch) {
		return ResponseEntity.ok()
				.body(conclusionReadService.getConclusionList(conclusionSearch));
	}

	@Operation(summary = "검토 상태 조회", description = "검토 상태를 내려준다.")
	@GetMapping("/{judgSeq}/currentStatusCode")
	ResponseEntity<String> getConclusionCurrentStatusCode(@PathVariable Long judgSeq) {
		return ResponseEntity.ok()
				.body(conclusionReadService.getConclusionCurrentStatusCodeByJudgSeq(judgSeq));
	}

	@Operation(summary = "검토 의견 조회", description = "검토 의견 정보를 조회한다.")
	@GetMapping("/{judgSeq}/{opinionTemplateSeq}")
	ResponseEntity<ConclusionContent> getConclusionContent(@PathVariable Long judgSeq, @PathVariable Long opinionTemplateSeq) {
		return ResponseEntity.ok()
				.body(conclusionReadService.getConclusionContent(judgSeq, opinionTemplateSeq));
	}

	@Operation(summary = "검토 의견 등록 상태를 조회한다.", description = "모든 검토 의견을 등록 하였는지 확인한다..")
	@GetMapping("/{judgSeq}/check/isAllConclusionContent")
	ResponseEntity<Boolean> isAllConclusionContentRegistered(@PathVariable Long judgSeq) {
		return ResponseEntity.ok().body(conclusionReadService.isAllConclusionContentRegistered(judgSeq));
	}
}