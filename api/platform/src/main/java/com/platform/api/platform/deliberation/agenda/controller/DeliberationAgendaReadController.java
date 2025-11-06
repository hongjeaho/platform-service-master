package com.platform.api.platform.deliberation.agenda.controller;

import com.platform.api.platform.deliberation.agenda.dto.DeliberationAgendaSearchResponse;
import com.platform.api.platform.deliberation.agenda.service.DeliberationAgendaReadService;
import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaSearch;
import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaSubResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "deliberation agenda API", description = "안건  API")
@RestController
@RequestMapping("/api/deliberation/agenda")
@RequiredArgsConstructor
public class DeliberationAgendaReadController {

  private final DeliberationAgendaReadService deliberationAgendaReadService;

  @Operation(summary = "안건 차수 리스트 조회", description = "안건 차수 리스트 조회.")
  @GetMapping
  public ResponseEntity<DeliberationAgendaSearchResponse> getDeliberationAgendaList(
      @ParameterObject final DeliberationAgendaSearch deliberationAgendaSearch
  ) {
    return ResponseEntity
        .ok()
        .body(deliberationAgendaReadService.getDeliberationAgendaList(deliberationAgendaSearch));
  }


  @Operation(summary = "안건 상세 리스트 조회", description = "안건 상세 리스트를 내려준다.")
  @GetMapping("/{deliberationStatusSeq}")
  public ResponseEntity<List<DeliberationAgendaSubResult>> getDeliberationAgendaSubList(
      @PathVariable final long deliberationStatusSeq
  ) {
    return ResponseEntity
        .ok()
        .body(deliberationAgendaReadService.getDeliberationAgendaSubList(deliberationStatusSeq));
  }
}
