package com.platform.datasource.base.repository.admin.committee;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JAdminCommitteeMember;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminCommitteeMemberReadRepository {

  private final DSLContext dslContext;
  private final JAdminCommitteeMember ADMIN_COMMITTEE_MEMBER = JAdminCommitteeMember.ADMIN_COMMITTEE_MEMBER;

  /**
   * 주어진 재결일련번호(seq)에 해당하는 위원회 구성원 엔티티를 조회합니다.
   *
   * @param seq 재결일련번호
   * @return 주어진 재결일련번호에 해당하는 위원회 구성원 엔티티. 해당하는 데이터가 없는 경우 null을 반환합니다.
   */
  public AdminCommitteeMemberEntity findCommitteeMember(Long seq) {
    return dslContext.select(ADMIN_COMMITTEE_MEMBER.fields())
        .from(ADMIN_COMMITTEE_MEMBER)
        .where(ADMIN_COMMITTEE_MEMBER.SEQ.eq(seq))
        .fetchOneInto(AdminCommitteeMemberEntity.class);
  }
}
