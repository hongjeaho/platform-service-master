package com.platform.api.platform.system.deliberation.controller;

import com.platform.api.platform.system.deliberation.service.SystemDeliberationReadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.SystemDeliberationDateEntity;
import org.jooq.generated.tables.pojos.SystemDeliberationGroupEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "System Deliberation API", description = "시스템 심의 관련 API")
@RestController
@RequestMapping("/api/system/deliberation")
@RequiredArgsConstructor
public class SystemDeliberationReadController {

  private final SystemDeliberationReadService systemDeliberationReadService;

  @Operation(summary = "심의 일자 리스트", description = "심의 일자 리스트를 조회 한다.")
  @GetMapping("/deliberationDateList")
  ResponseEntity<List<SystemDeliberationDateEntity>> getSystemDeliberationDateList() {
    return ResponseEntity.ok().body(systemDeliberationReadService.getDeliberationDateList());
  }

  @Operation(summary = "심의 그룹 리스트", description = "심의 그룹 리스트를 조회 한다.")
  @GetMapping("/deliberationGroupList")
  ResponseEntity<List<SystemDeliberationGroupEntity>> getSystemDeliberationGroupList() {
    return ResponseEntity.ok().body(systemDeliberationReadService.getDeliberationGroupList());
  }
}
