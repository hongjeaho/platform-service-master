package com.platform.datasource.base.repository.account.security;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JUser;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AccountSecurityRepository {

    private final DSLContext dslContext;
    private final JUser USER = JUser.USER;

    /**
     * 사용자의 현재 비밀번호를 조회한다.
     *
     * @param userSeq 사용자 일련번호
     * @return 암호화된 비밀번호
     */
    public String findPasswordByUserSeq(Long userSeq) {
        return dslContext
                .select(USER.USER_PASSWORD)
                .from(USER)
                .where(USER.SEQ.eq(userSeq))
                .fetchOneInto(String.class);
    }

    /**
     * 사용자의 비밀번호를 업데이트한다.
     *
     * @param userSeq 사용자 일련번호
     * @param encodedPassword 새로운 암호화된 비밀번호
     */
    public void updatePassword(Long userSeq, String encodedPassword) {
        dslContext.update(USER)
                .set(USER.USER_PASSWORD, encodedPassword)
                .set(USER.UPDATED_BY, UserAccountHolder.getSeqNo())
                .set(USER.UPDATED_TIME, LocalDateTime.now())
                .where(USER.SEQ.eq(userSeq))
                .execute();
    }
}