package com.platform.datasource.base.repository.admin.userManagement;

import static com.platform.datasource.base.util.condition.JooqListConditionUtil.inIfNotEmpty;
import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementResult;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JUser;
import org.jooq.generated.tables.JUserRole;
import org.jooq.generated.tables.JUserRoleMapping;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminUserManagementSearchRepository {

  private final DSLContext dslContext;
  private final JUser USER = JUser.USER;
  private final JUserRole USER_ROLE = JUserRole.USER_ROLE;
  private final JUserRoleMapping USER_ROLE_MAPPING = JUserRoleMapping.USER_ROLE_MAPPING;

  /**
   * AdminUserManagementSearch 조건에 따라 USER 테이블의 전체 데이터를 검색하여 개수를 반환합니다.
   *
   * @param search 검색 조건을 포함하는 {@link AdminUserManagementSearch} 객체
   * @return 검색 조건에 따라 USER 테이블에서 조회된 데이터의 총 개수
   */
  public Integer findTotalSize(AdminUserManagementSearch search) {
    return dslContext.selectCount()
        .from(USER)
        .where(getCondition(search))
        .fetchOne(0, Integer.class);
  }

  /**
   * AdminUserManagementSearch 조건에 따라 사용자 데이터와 역할 정보를 조회하여 반환합니다.
   *
   * @param search 검색 조건을 포함하는 {@link AdminUserManagementSearch} 객체
   * @return 검색 조건에 따라 조회된 {@link AdminUserManagementResult} 객체 목록
   */
  public List<AdminUserManagementResult> findAll(AdminUserManagementSearch search) {
    return dslContext.select(
            USER.SEQ,
            USER.USER_ID,
            USER.USER_NAME,
            USER.USER_EMAIL,
            DSL.groupConcat(USER_ROLE.USER_ROLE_NAME).separator(",").as("user_roles")
        )
        .from(USER)
        .leftJoin(USER_ROLE_MAPPING).on(USER.SEQ.eq(USER_ROLE_MAPPING.USER_SEQ))
        .leftJoin(USER_ROLE).on(USER_ROLE_MAPPING.ROLE_SEQ.eq(USER_ROLE.SEQ))
        .where(getCondition(search))
        .groupBy(USER.SEQ, USER.USER_NAME, USER.USER_EMAIL)
        .orderBy(USER.SEQ.desc())
        .fetchInto(AdminUserManagementResult.class);

  }

  /**
   * 주어진 검색 조건을 기반으로 사용자 데이터 검색에 필요한 조건을 생성하여 반환합니다.
   *
   * @param search 사용자 검색 조건을 포함하는 {@link AdminUserManagementSearch} 객체
   * @return 검색 조건으로 생성된 {@link Condition} 객체
   */
  private Condition getCondition(AdminUserManagementSearch search) {
    Condition roleCondition = buildRoleCondition(search);
    Condition searchCondition = buildSearchCondition(search);
    
    return roleCondition.and(searchCondition);
}

  /**
   * 사용자 역할 조건을 생성하여 반환합니다.
   * 주어진 검색 조건에 따라 USER_ROLE 테이블과 USER_ROLE_MAPPING 테이블을 기반으로 조건을 구성합니다.
   *
   * @param search 사용자 검색 조건을 포함하는 {@link AdminUserManagementSearch} 객체
   * @return 검색 조건을 기반으로 생성된 {@link Condition} 객체
   */
  private Condition buildRoleCondition(AdminUserManagementSearch search) {
    return DSL.exists(
        dslContext.selectOne()
            .from(USER_ROLE)
            .join(USER_ROLE_MAPPING).on(USER_ROLE.SEQ.eq(USER_ROLE_MAPPING.ROLE_SEQ))
            .where(inIfNotEmpty(USER_ROLE.USER_ROLE_NAME, search.getUserRoles()))
            .and(USER_ROLE_MAPPING.USER_SEQ.eq(USER.SEQ))
    );
}

  /**
   * 주어진 사용자 검색 조건을 기반으로 검색 조건(Condition) 객체를 생성하여 반환합니다.
   *
   * @param search 사용자 검색 조건을 포함하는 {@link AdminUserManagementSearch} 객체
   *               - 검색 키워드(keyword): 검색에 사용할 키워드
   *               - 검색 구분(searchType): 검색 유형 (예: 사용자 ID 또는 이름 등)
   * @return 검색 조건에 따라 생성된 {@link Condition} 객체
   *         - 검색 키워드가 없으면 {@link DSL#noCondition()}을 반환
   *         - 검색 유형이 "userId"면 USER.USER_ID 필드에서 검색
   *         - 검색 유형이 "userName"면 USER.USER_NAME 필드에서 검색
   *         - 검색 유형이 비어 있으면 USER.USER_ID와 USER.USER_NAME 필드에서 둘 다 검색
   */
  private Condition buildSearchCondition(AdminUserManagementSearch search) {
    String searchType = search.getSearchType();
    String keyword = search.getKeyword();
    
    if (keyword == null || keyword.trim().isEmpty()) {
        return DSL.noCondition();
    }
    
    return switch (searchType) {
        case "userId" -> likeIfNotBlank(USER.USER_ID, keyword);
        case "userName" -> likeIfNotBlank(USER.USER_NAME, keyword);
        case "all" -> likeIfNotBlank(USER.USER_ID, keyword)
                    .or(likeIfNotBlank(USER.USER_NAME, keyword));
        default -> DSL.noCondition();
    };
}
}