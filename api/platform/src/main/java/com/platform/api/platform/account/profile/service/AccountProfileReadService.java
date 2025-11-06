package com.platform.api.platform.account.profile.service;

import com.platform.api.platform.account.profile.dto.ProfileResponse;
import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.repository.account.profile.AccountProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountProfileReadService {

    private final AccountProfileRepository accountProfileRepository;

    /**
     * 현재 로그인된 사용자의 프로필 정보를 조회한다.
     *
     * @return 사용자 프로필 정보
     */
    public ProfileResponse getProfile() {
        Long userSeq = UserAccountHolder.getSeqNo();

        var userEntity = accountProfileRepository.findByUserSeq(userSeq);
        if (userEntity == null) {
            throw new IllegalStateException("사용자 정보를 찾을 수 없습니다.");
        }

        List<String> roleNames = accountProfileRepository.findRoleNamesByUserSeq(userSeq);

        return new ProfileResponse(userEntity, roleNames);
    }
}