package com.platform.datasource.base.repository.admin.userManagement;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementResult;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JUser;
import org.jooq.generated.tables.JUserRole;
import org.jooq.generated.tables.JUserRoleMapping;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminUserManagementReadRepository {

  private final DSLContext dslContext;
  private final JUser USER = JUser.USER;
  private final JUserRoleMapping USER_ROLE_MAPPING = JUserRoleMapping.USER_ROLE_MAPPING;
  private final JUserRole USER_ROLE = JUserRole.USER_ROLE;


  /**
   * 주어진 사용자 고유 일련번호(seq)를 기준으로 사용자 정보를 조회합니다.
   *
   * @param seq 조회할 사용자의 고유 일련번호
   * @return AdminUserManagementResult 조회된 사용자 정보를 포함하는 결과 객체
   */
  public AdminUserManagementResult findBySeq(Long seq) {
    return dslContext
        .select(USER.fields())
        .select(USER_ROLE.USER_ROLE_NAME.as("user_role"))
        .from(USER)
        .join(USER_ROLE_MAPPING).on(USER.SEQ.eq(USER_ROLE_MAPPING.USER_SEQ))
        .join(USER_ROLE).on(USER_ROLE_MAPPING.ROLE_SEQ.eq(USER_ROLE.SEQ))
        .where(USER.SEQ.eq(seq))
        .fetchOneInto(AdminUserManagementResult.class);
  }

  /**
   * 관리자 사용자 관리 시스템에서 주어진 사용자 ID가 존재하는지 확인합니다.
   *
   * @param userId 확인하려는 사용자 ID
   * @return 주어진 사용자 ID가 존재하면 true, 그렇지 않으면 false
   */
  public Boolean hasAdminUserManagementUserIdCheck(String userId) {
    return dslContext.fetchExists(
        dslContext.selectFrom(USER)
            .where(USER.USER_ID.eq(userId))
    );
  }
}
