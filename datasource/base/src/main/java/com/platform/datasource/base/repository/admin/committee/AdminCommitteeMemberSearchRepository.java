package com.platform.datasource.base.repository.admin.committee;

import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.committee.AdminCommitteeMemberSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JAdminCommitteeMember;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminCommitteeMemberSearchRepository {

  private final DSLContext dslContext;
  private final JAdminCommitteeMember ADMIN_COMMITTEE_MEMBER = JAdminCommitteeMember.ADMIN_COMMITTEE_MEMBER;

  public Integer findTotalSize(AdminCommitteeMemberSearch search) {
    return dslContext.selectCount()
        .from(ADMIN_COMMITTEE_MEMBER)
        .where(getCondition(search))
        .fetchOne(0, Integer.class);
  }

  public List<AdminCommitteeMemberEntity> findPage(AdminCommitteeMemberSearch search) {
    return dslContext.select(ADMIN_COMMITTEE_MEMBER.fields())
        .from(ADMIN_COMMITTEE_MEMBER)
        .where(getCondition(search))
        .orderBy(ADMIN_COMMITTEE_MEMBER.COMMITTEE_TYPE.asc())
        .offset(search.getPage() * search.getPageSize())
        .limit(search.getPageSize())
        .fetchInto(AdminCommitteeMemberEntity.class);
  }

  private Condition getCondition(AdminCommitteeMemberSearch search) {
    return likeIfNotBlank(ADMIN_COMMITTEE_MEMBER.COMMITTEE_NAME, search.getCommitteeName())
        .and(likeIfNotBlank(ADMIN_COMMITTEE_MEMBER.COMMITTEE_TYPE, search.getCommitteeType()));
  }
}
