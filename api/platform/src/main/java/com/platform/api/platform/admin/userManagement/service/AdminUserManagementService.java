package com.platform.api.platform.admin.userManagement.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementCreateRequest;
import com.platform.datasource.base.repository.admin.userManagement.AdminUserManagementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class AdminUserManagementService {

    private final AdminUserManagementRepository adminUserManagementRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 사용자 정보를 등록합니다.
     * 입력된 사용자 정보를 기반으로 사용자 계정 및 역할 매핑을 생성합니다.
     *
     * @param adminUserManagementCreateRequest 사용자 관리 등록 요청 객체
     *        이 객체에는 사용자 ID, 이메일, 이름, 비밀번호, 역할 정보가 포함됩니다.
     */
    public void insertAdminUserManagement(AdminUserManagementCreateRequest adminUserManagementCreateRequest) {
        var encPassword = getPassword(adminUserManagementCreateRequest.getUserPassword());
        var userEntity = adminUserManagementCreateRequest.ofCreateUserEntity(encPassword);
        var userSeq = adminUserManagementRepository.insertUser(userEntity);

        adminUserManagementRepository.insertUserRoleMapping(userSeq, adminUserManagementCreateRequest.getUserRole());
    }

    /**
     * 관리자 사용자 정보를 수정합니다.
     * 주어진 사용자 일련번호(seq)를 기준으로 사용자 정보를 업데이트합니다.
     *
     * @param seq 수정할 사용자 고유 일련번호
     * @param adminUserManagementCreateRequest 사용자 관리 수정 요청 객체
     *        이 객체에는 사용자 ID, 이메일, 이름, 비밀번호, 역할 정보가 포함됩니다.
     */
    public void updateAdminUserManagement(Long seq, AdminUserManagementCreateRequest adminUserManagementCreateRequest) {
        var encPassword = getPassword(adminUserManagementCreateRequest.getUserPassword());
        var userEntity = adminUserManagementCreateRequest.ofUpdateUserEntity(encPassword);
        adminUserManagementRepository.updateUser(seq, userEntity);
    }

    /**
     * 주어진 비밀번호를 인코딩된 형태로 변환하여 반환합니다.
     * 비밀번호가 null이거나 공백일 경우 null을 반환합니다.
     *
     * @param password 비밀번호 문자열. 암호화 대상의 원본 비밀번호입니다.
     * @return 인코딩된 비밀번호 문자열. 입력된 비밀번호가 null 또는 비어있으면 null을 반환합니다.
     */
    private String getPassword(String password) {
        if(password == null || password.isBlank()) {
            return null;
        }

        return passwordEncoder.encode(password);
    }
}