package com.platform.api.platform.admin.committee.controller;

import com.platform.api.platform.admin.committee.service.AdminCommitteeMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin Committee Member API", description = "위원회 관리를 위한 API")
@RestController
@RequestMapping("/api/admin/committeeMember")
@RequiredArgsConstructor
public class AdminCommitteeMemberController {

  private final AdminCommitteeMemberService adminCommitteeMemberService;

  @Operation(summary = "위원회 명단 등록", description = "위원회 명단 정보를 등록한다.")
  @PostMapping
  ResponseEntity<Boolean> insertAdminCommitteeMember(@RequestBody AdminCommitteeMemberEntity entity) {
    adminCommitteeMemberService.create(entity);
    return ResponseEntity.ok(true);
  }

  @Operation(summary = "위원회 명단 수정", description = "위원회 명단 정보를 수정한다.")
  @PutMapping("/{seq}")
  ResponseEntity<Boolean> updateAdminCommitteeMember(@PathVariable long seq, @RequestBody AdminCommitteeMemberEntity entity) {
    adminCommitteeMemberService.update(seq, entity);
    return ResponseEntity.ok(true);
  }

  @Operation(summary = "위원회 명단 삭제", description = "위원회 명단 정보를 삭제한다.")
  @DeleteMapping("/{seq}")
  ResponseEntity<Boolean> deleteAdminCommitteeMember(@PathVariable long seq) {
    adminCommitteeMemberService.delete(seq);
    return ResponseEntity.ok(true);
  }
}
