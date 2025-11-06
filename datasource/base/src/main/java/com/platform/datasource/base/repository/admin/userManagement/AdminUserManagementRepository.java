package com.platform.datasource.base.repository.admin.userManagement;

import static org.jooq.impl.DSL.noField;
import static org.jooq.impl.DSL.val;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JUser;
import org.jooq.generated.tables.JUserRole;
import org.jooq.generated.tables.JUserRoleMapping;
import org.jooq.generated.tables.pojos.UserEntity;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminUserManagementRepository {

    private final DSLContext dslContext;
    private final JUser USER = JUser.USER;
    private final JUserRole USER_ROLE = JUserRole.USER_ROLE;
    private final JUserRoleMapping USER_ROLE_MAPPING = JUserRoleMapping.USER_ROLE_MAPPING;

    /**
     * 새로운 사용자를 USER 테이블에 삽입합니다.
     * 이미 동일한 키가 존재하는 경우 삽입을 무시하고 작동을 종료합니다.
     *
     * @param user 삽입하려는 사용자 정보를 포함하는 {@link UserEntity} 객체
     * @return 삽입된 사용자의 고유 일련번호 (SEQ 컬럼 값)
     */
    public Long insertUser(UserEntity user) {
        return dslContext.insertInto(USER,
                USER.USER_EMAIL,
                USER.USER_NAME,
                USER.USER_ID,
                USER.USER_PASSWORD,
                USER.CREATED_BY,
                USER.CREATED_TIME
            )
            .values(
                user.getUserEmail(),
                user.getUserName(),
                user.getUserId(),
                user.getUserPassword(),
                UserAccountHolder.getSeqNo(),
                LocalDateTime.now()
            )
            .onDuplicateKeyIgnore()
            .returningResult(USER.SEQ)
            .fetchOneInto(Long.class);
    }

    /**
     * 사용자의 역할 매핑 정보를 USER_ROLE_MAPPING 테이블에 삽입합니다.
     * 동일한 역할 매핑이 이미 존재하는 경우 삽입을 무시합니다.
     *
     * @param userSeq 역할을 부여할 사용자의 고유 일련번호
     * @param roleName 사용자에게 부여할 역할의 이름
     * @throws IllegalArgumentException 등록할 수 없는 권한 이름을 전달한 경우
     */
    public void insertUserRoleMapping(Long userSeq, String roleName) {

        var userRoleSeq = dslContext.select(USER_ROLE.SEQ)
            .from(USER_ROLE)
            .where(USER_ROLE.USER_ROLE_NAME.eq(roleName))
            .fetchOneInto(Long.class);

        if (userRoleSeq == null) {
            throw new IllegalArgumentException("등록 할 수 없는 권한입니다.");
        }

        dslContext.insertInto(USER_ROLE_MAPPING,
                USER_ROLE_MAPPING.USER_SEQ,
                USER_ROLE_MAPPING.ROLE_SEQ,
                USER_ROLE_MAPPING.CREATED_BY,
                USER_ROLE_MAPPING.CREATED_TIME
            ).values(
                userSeq,
                userRoleSeq,
                UserAccountHolder.getSeqNo(),
                LocalDateTime.now()
            ).onDuplicateKeyIgnore()
            .execute();
    }

    /**
     * 사용자의 정보를 업데이트합니다.
     * 지정된 사용자의 일련번호를 기반으로 USER 테이블의 데이터를 갱신합니다.
     *
     * @param seq 업데이트할 사용자의 고유 일련번호
     * @param userEntity 업데이트에 사용할 사용자 정보가 포함된 {@link UserEntity} 객체
     */
    public void updateUser(Long seq, UserEntity userEntity) {
        var userPassword = userEntity.getUserPassword();
        var userPasswordField = StringUtils.hasText(userPassword) ? val(userPassword) : noField(USER.USER_PASSWORD);

        dslContext.update(USER)
            .set(USER.USER_NAME, userEntity.getUserName())
            .set(USER.USER_EMAIL, userEntity.getUserEmail())
            .set(USER.USER_PASSWORD, userPasswordField)
            .where(USER.SEQ.eq(seq))
            .execute();
    }
}
