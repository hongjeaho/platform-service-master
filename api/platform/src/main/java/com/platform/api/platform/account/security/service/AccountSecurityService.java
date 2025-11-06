package com.platform.api.platform.account.security.service;

import com.platform.api.platform.account.security.dto.PasswordUpdateRequest;
import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.repository.account.security.AccountSecurityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountSecurityService {

    private final AccountSecurityRepository accountSecurityRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 현재 로그인된 사용자의 비밀번호를 변경한다.
     *
     * @param request 비밀번호 변경 요청 정보
     */
    public void updatePassword(PasswordUpdateRequest request) {
        Long userSeq = UserAccountHolder.getSeqNo();

        // 현재 비밀번호 확인
        String currentEncodedPassword = accountSecurityRepository.findPasswordByUserSeq(userSeq);
        if (currentEncodedPassword == null) {
            throw new IllegalStateException("사용자 정보를 찾을 수 없습니다.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), currentEncodedPassword)) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호 암호화 및 업데이트
        String newEncodedPassword = passwordEncoder.encode(request.getNewPassword());
        accountSecurityRepository.updatePassword(userSeq, newEncodedPassword);
    }
}