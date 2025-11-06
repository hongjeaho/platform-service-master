package com.platform.api.platform.admin.committee.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.admin.committee.AdminCommitteeMemberRepository;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class AdminCommitteeMemberService {

  private final AdminCommitteeMemberRepository adminCommitteeMemberRepository;

  public void create(AdminCommitteeMemberEntity entity) {
    adminCommitteeMemberRepository.insert(entity);
  }

  public void update(long seq, AdminCommitteeMemberEntity entity) {
    adminCommitteeMemberRepository.update(seq, entity);
  }

  public void delete(long seq) {
    adminCommitteeMemberRepository.delete(seq);
  }
}
