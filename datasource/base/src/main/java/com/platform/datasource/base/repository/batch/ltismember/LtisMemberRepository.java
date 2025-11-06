package com.platform.datasource.base.repository.batch.ltismember;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Row4;
import org.jooq.generated.tables.JLtisCharge;
import org.jooq.generated.tables.JUser;
import org.jooq.generated.tables.JUserRole;
import org.jooq.generated.tables.JUserRoleMapping;
import org.jooq.generated.tables.pojos.UserEntity;
import org.jooq.generated.tables.pojos.UserRoleMappingEntity;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

/**
 * 사용자 테이블에 필요한 정보를 배치를 통해 해당되는 테이블에 데이터를 최신화하기 위한 클래스입니다.
 */
@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class LtisMemberRepository {

  private final DSLContext dslContext;
  private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;
  private final JUser USER = JUser.USER;
  private final JUserRole USER_ROLE = JUserRole.USER_ROLE;
  private final JUserRoleMapping USER_ROLE_MAPPING = JUserRoleMapping.USER_ROLE_MAPPING;

  public Integer findRowCountForUserInsertion() {

    return dslContext.selectCount().from(LTIS_CHARGE)
        .leftJoin(USER).on(LTIS_CHARGE.IMPLEMENTER_ID.eq(USER.USER_ID)).where(USER.SEQ.isNull())
        .fetchOneInto(Integer.class);

  }

  public List<UserEntity> findImplementorInfoIntoUserTable(int offset, int pageSize) {

    return
        dslContext.select(
                LTIS_CHARGE.IMPLEMENTER_ID.as(USER.USER_ID),
                LTIS_CHARGE.IMPLEMENTER_NM.as(USER.USER_NAME),
                DSL.val((String) null).as(USER.USER_PASSWORD),
                LTIS_CHARGE.IMPLEMENTER_EMAIL.as(USER.USER_EMAIL),
                DSL.val(UserAccountHolder.getSeqNo()).as(USER.CREATED_BY),
                DSL.val(LocalDateTime.now()).as(USER.CREATED_TIME)
            ).from(LTIS_CHARGE)
            .leftJoin(USER).on(LTIS_CHARGE.IMPLEMENTER_ID.eq(USER.USER_ID))
            .where(USER.SEQ.isNull())
            .orderBy(LTIS_CHARGE.IMPLEMENTER_ID)
            .offset(offset)
            .limit(pageSize)
            .fetchInto(UserEntity.class);
  }

  public List<Long> insertImplementerRoleToRoleMapping(
      List<UserRoleMappingEntity> userRoleMappingEntityList) {

    Collection<Row4<Long, Long, Long, LocalDateTime>> userRoleMappingCollection =
        userRoleMappingEntityList.stream().map(userRoleMappingEntity -> DSL.row(
            userRoleMappingEntity.getUserSeq(),
            userRoleMappingEntity.getRoleSeq(),
            userRoleMappingEntity.getCreatedBy(),
            userRoleMappingEntity.getCreatedTime()
        )).collect(Collectors.toSet());

    return dslContext.insertInto(USER_ROLE_MAPPING, USER_ROLE_MAPPING.USER_SEQ,
            USER_ROLE_MAPPING.ROLE_SEQ,
            USER_ROLE_MAPPING.CREATED_BY, USER_ROLE_MAPPING.CREATED_TIME)
        .valuesOfRows(userRoleMappingCollection)
        .returningResult(USER_ROLE_MAPPING.SEQ)
        .fetch(USER_ROLE_MAPPING.SEQ);
  }

}
