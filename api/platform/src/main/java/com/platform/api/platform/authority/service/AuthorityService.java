package com.platform.api.platform.authority.service;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.authority.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class AuthorityService {

    private final AuthorityRepository authorityRepository;

    /**
     * 해당 사건의 사업시행자 권한을 확인 한다.
     * 재결관 또는 관리자 권한이 있으면 쿼리 조회 없이 바로 true 반환
     *
     * @param judgSeq 재결일련번호
     * @return 접속 여부
     */
    public Boolean isAuthorizedForCase(Long judgSeq) {
        // 1. 현재 사용자 인증 확인
        if (UserAccountHolder.getSeqNo() == null) {
            throw new AccessDeniedException("인증되지 않은 사용자입니다.");
        }
        
        // 2. 재결관 또는 관리자 권한 체크 - 쿼리 조회 없이 바로 true 반환
        boolean hasAdminOrDecisionRole = UserAccountHolder.getRoles()
                .stream()
                .anyMatch(role -> "ADMIN".equals(role.getRole()) || "DECISION".equals(role.getRole()));
        
        if (hasAdminOrDecisionRole) {
            log.debug("Admin or Decision role detected - judgSeq: {}, returning true without query", judgSeq);
            return true;
        }
            
        // 3. 사업시행자인 경우만 DB 쿼리로 권한 체크
        log.debug("Checking implementer authority via database query - judgSeq: {}", judgSeq);
        return authorityRepository.existsByImplementerByJudgSeq(judgSeq);
    }
}