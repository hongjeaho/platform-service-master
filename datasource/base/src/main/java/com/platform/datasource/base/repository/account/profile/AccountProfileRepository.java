package com.platform.datasource.base.repository.account.profile;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JUser;
import org.jooq.generated.tables.JUserRole;
import org.jooq.generated.tables.JUserRoleMapping;
import org.jooq.generated.tables.pojos.UserEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AccountProfileRepository {

    private final DSLContext dslContext;
    private final JUser USER = JUser.USER;
    private final JUserRole USER_ROLE = JUserRole.USER_ROLE;
    private final JUserRoleMapping USER_ROLE_MAPPING = JUserRoleMapping.USER_ROLE_MAPPING;

    /**
     * 사용자 일련번호로 사용자 정보를 조회한다.
     *
     * @param userSeq 사용자 일련번호
     * @return 사용자 정보
     */
    public UserEntity findByUserSeq(Long userSeq) {
        return dslContext
                .selectFrom(USER)
                .where(USER.SEQ.eq(userSeq))
                .fetchOneInto(UserEntity.class);
    }

    /**
     * 사용자 일련번호로 해당 사용자의 권한 목록을 조회한다.
     *
     * @param userSeq 사용자 일련번호
     * @return 권한명 목록
     */
    public List<String> findRoleNamesByUserSeq(Long userSeq) {
        return dslContext
                .select(USER_ROLE.USER_ROLE_NAME)
                .from(USER_ROLE)
                .join(USER_ROLE_MAPPING).on(USER_ROLE.SEQ.eq(USER_ROLE_MAPPING.ROLE_SEQ))
                .where(USER_ROLE_MAPPING.USER_SEQ.eq(userSeq))
                .fetch(USER_ROLE.USER_ROLE_NAME);
    }
}