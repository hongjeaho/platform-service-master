package com.platform.api.platform.deliberation.schedule.controller;

import com.platform.api.platform.deliberation.schedule.dto.DeliberationSchedule;
import com.platform.api.platform.deliberation.schedule.service.DeliberationScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "deliberation Schedule API", description = "안건 일자 API")
@RestController
@RequestMapping("/api/deliberation/schedule")
@RequiredArgsConstructor
public class DeliberationScheduleController {

  private final DeliberationScheduleService deliberationScheduleService;

  @Operation(summary = "안건 일자 등록 또는 수정", description = "안건일자등록처리를 한다.")
  @PostMapping
  ResponseEntity<Boolean> insertOrUpdateDeliberationSchedule(
      @RequestBody DeliberationSchedule deliberationSchedule) {
    deliberationScheduleService.insertOrUpdateDeliberationSchedule(deliberationSchedule);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "안건 일자 삭제", description = "안건일자를 삭제 한다.")
  @DeleteMapping
  ResponseEntity<Boolean> deleteDeliberationSchedule(
      @RequestBody List<Long> judgSeqList) {
    deliberationScheduleService.deleteDeliberationSchedule(judgSeqList);
    return ResponseEntity.ok().body(true);
  }
}
