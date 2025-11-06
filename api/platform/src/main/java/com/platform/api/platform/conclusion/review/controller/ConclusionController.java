package com.platform.api.platform.conclusion.review.controller;

import com.platform.api.platform.conclusion.review.service.ConclusionService;
import com.platform.datasource.base.dto.conclusion.ConclusionContent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "conclusion base API", description = "검토 관련 API")
@RestController
@RequestMapping("/api/conclusion/base")
@RequiredArgsConstructor
public class ConclusionController {

	private final ConclusionService conclusionService;

	@Operation(summary = "검토 시작 또는 검토 중으로 상태 변경", description = "검토 중으로 상태를 변경한다.")
	@PostMapping("{judgSeq}/start")
	ResponseEntity<Boolean> insertOrUpdateStartConclusion(@PathVariable Long judgSeq) {
		conclusionService.startConclusion(judgSeq);
		return ResponseEntity.ok().body(true);
	}

	@Operation(summary = "검토 의견 등록", description = "재결관 검토을 등록 한다.")
	@PostMapping(value = "{judgSeq}/{opinionTemplateSeq}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	ResponseEntity<Boolean> insertOrUpdateConclusionContent(
			@PathVariable Long judgSeq,
			@PathVariable Long opinionTemplateSeq,
			@Parameter(
					description = "재결관 의견",
					content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
			)
			@RequestPart ConclusionContent conclusionContent,
			@Parameter(
					description = "재결관 의견 첨부 파일.",
					content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
			)
			@RequestPart(required = false) MultipartFile file
	) throws Exception {

		conclusionContent.attachFile(file);
		conclusionService.insertOrUpdateConclusionContent(judgSeq, opinionTemplateSeq, conclusionContent);
		return ResponseEntity.ok().body(true);
	}

	@Operation(summary = "검토 완료", description = "검토 완료 처리를 한다.")
	@PostMapping("{judgSeq}/complete")
	ResponseEntity<Boolean> completeConclusion(@PathVariable Long judgSeq) {
		conclusionService.completeConclusion(judgSeq);
		return ResponseEntity.ok().body(true);
	}
}
