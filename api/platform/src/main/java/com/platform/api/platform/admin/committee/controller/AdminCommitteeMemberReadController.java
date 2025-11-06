package com.platform.api.platform.admin.committee.controller;

import com.platform.api.platform.admin.committee.dto.AdminCommitteeMemberSearchResponse;
import com.platform.api.platform.admin.committee.service.AdminCommitteeMemberReadService;
import com.platform.datasource.base.dto.admin.committee.AdminCommitteeMemberSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin Committee Member API", description = "위원회 관리를 위한 API")
@RestController
@RequestMapping("/api/admin/committeeMember")
@RequiredArgsConstructor
public class AdminCommitteeMemberReadController {

  private final AdminCommitteeMemberReadService adminCommitteeMemberReadService;

  @Operation(summary = "위원회 명단 리스트 조회", description = "위원회 명단 정보를 내려준다.")
  @GetMapping
  public ResponseEntity<AdminCommitteeMemberSearchResponse> getAdminCommitteeMemberList(
      @ParameterObject AdminCommitteeMemberSearch search
  ) {
    return ResponseEntity.ok(adminCommitteeMemberReadService.getCommitteeMemberList(search));
  }

  @Operation(summary = "위원회 명단 리스트 조회", description = "위원회 명단 정보를 내려준다.")
  @GetMapping("/{seq}")
  public ResponseEntity<AdminCommitteeMemberEntity> getAdminCommitteeMember(@PathVariable Long seq) {
    return ResponseEntity.ok(adminCommitteeMemberReadService.getCommitteeMember(seq));
  }
}
