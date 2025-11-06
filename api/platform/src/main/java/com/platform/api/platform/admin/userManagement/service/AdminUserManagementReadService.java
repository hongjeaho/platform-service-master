package com.platform.api.platform.admin.userManagement.service;

import com.platform.api.platform.admin.userManagement.dto.AdminUserManagementSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementResult;
import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementSearch;
import com.platform.datasource.base.repository.admin.userManagement.AdminUserManagementReadRepository;
import com.platform.datasource.base.repository.admin.userManagement.AdminUserManagementSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class AdminUserManagementReadService {

  private final AdminUserManagementSearchRepository adminUserManagementSearchRepository;
  private final AdminUserManagementReadRepository adminUserManagementReadRepository;


  /**
   * 관리자 사용자 관리 목록을 조회합니다.
   *
   * @param adminUserManagementSearch 사용자 관리 검색 조건 객체. 이 객체는 사용자의 이름, 이메일, 및 구분 정보를 포함합니다.
   * @return AdminUserManagementSearchResponse 객체로 검색 조건에 해당하는 사용자 목록 및 총 사용자 수를 포함합니다.
   */
  public AdminUserManagementSearchResponse getAdminUserManagementList(AdminUserManagementSearch adminUserManagementSearch) {
    return AdminUserManagementSearchResponse.builder()
        .total(adminUserManagementSearchRepository.findTotalSize(adminUserManagementSearch))
        .resultList(adminUserManagementSearchRepository.findAll(adminUserManagementSearch))
        .build();
  }

  /**
   * 주어진 일련번호(seq)를 기준으로 사용자 정보를 조회합니다.
   *
   * @param seq 사용자 고유 일련번호
   * @return UserEntity 조회된 사용자 정보를 포함하는 객체
   */
  public AdminUserManagementResult getAdminUserManagement(Long seq) {
    return adminUserManagementReadRepository.findBySeq(seq);
  }

  /**
   * 제공된 사용자 ID의 사용 여부를 확인합니다.
   *
   * @param userId 확인 대상 사용자 ID
   * @return {@code true}이면 사용 중인 ID이고, 그렇지 않으면 {@code false}
   */
  public Boolean hasAdminUserManagementUserIdCheck(String userId) {
    return adminUserManagementReadRepository.hasAdminUserManagementUserIdCheck(userId);
  }
}
