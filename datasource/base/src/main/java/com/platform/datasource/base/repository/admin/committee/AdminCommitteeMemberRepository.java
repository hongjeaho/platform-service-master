package com.platform.datasource.base.repository.admin.committee;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JAdminCommitteeMember;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminCommitteeMemberRepository {

  private final DSLContext dslContext;
  private static final JAdminCommitteeMember ADMIN_COMMITTEE_MEMBER = JAdminCommitteeMember.ADMIN_COMMITTEE_MEMBER;

  public void insert(AdminCommitteeMemberEntity adminCommitteeMember) {
    dslContext.insertInto(ADMIN_COMMITTEE_MEMBER,
            ADMIN_COMMITTEE_MEMBER.COMMITTEE_NAME,
            ADMIN_COMMITTEE_MEMBER.COMMITTEE_TYPE,
            ADMIN_COMMITTEE_MEMBER.REMARKS,
            ADMIN_COMMITTEE_MEMBER.CREATED_BY,
            ADMIN_COMMITTEE_MEMBER.CREATED_TIME
        )
        .values(
            adminCommitteeMember.getCommitteeName(),
            adminCommitteeMember.getCommitteeType(),
            adminCommitteeMember.getRemarks(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        )
        .execute();
  }

  public int update(Long seq, AdminCommitteeMemberEntity adminCommitteeMember) {
    return dslContext.update(ADMIN_COMMITTEE_MEMBER)
        .set(ADMIN_COMMITTEE_MEMBER.COMMITTEE_NAME, adminCommitteeMember.getCommitteeName())
        .set(ADMIN_COMMITTEE_MEMBER.COMMITTEE_TYPE, adminCommitteeMember.getCommitteeType())
        .set(ADMIN_COMMITTEE_MEMBER.REMARKS, adminCommitteeMember.getRemarks())
        .set(ADMIN_COMMITTEE_MEMBER.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(ADMIN_COMMITTEE_MEMBER.UPDATED_TIME, LocalDateTime.now())
        .where(ADMIN_COMMITTEE_MEMBER.SEQ.eq(seq))
        .execute();
  }

  public int delete(Long seq) {
    return dslContext.deleteFrom(ADMIN_COMMITTEE_MEMBER)
        .where(ADMIN_COMMITTEE_MEMBER.SEQ.eq(seq))
        .execute();
  }
}
