package com.platform.api.platform.deliberation.schedule.controller;

import com.platform.api.platform.deliberation.schedule.dto.DeliberationScheduleSearchResponse;
import com.platform.api.platform.deliberation.schedule.service.DeliberationScheduleReadService;
import com.platform.datasource.base.dto.deliberation.schedule.DeliberationScheduleSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "deliberation Schedule API", description = "안건 등록 API")
@RestController
@RequestMapping("/api/deliberation/schedule")
@RequiredArgsConstructor
public class DeliberationScheduleReadController {

  private final DeliberationScheduleReadService deliberationScheduleReadService;

  @Operation(summary = "안건 등록 가능한 리스트 조회", description = "안건등록이 가능한 리스트를 내려준다.")
  @GetMapping
  ResponseEntity<DeliberationScheduleSearchResponse> getDeliberationScheduleList(
      @ParameterObject final DeliberationScheduleSearch deliberationScheduleSearch) {
    return ResponseEntity.ok()
        .body(deliberationScheduleReadService.getDeliberationScheduleList(deliberationScheduleSearch));
  }
}