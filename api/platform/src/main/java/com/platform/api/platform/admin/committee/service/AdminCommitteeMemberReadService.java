package com.platform.api.platform.admin.committee.service;

import com.platform.api.platform.admin.committee.dto.AdminCommitteeMemberSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.committee.AdminCommitteeMemberSearch;
import com.platform.datasource.base.repository.admin.committee.AdminCommitteeMemberReadRepository;
import com.platform.datasource.base.repository.admin.committee.AdminCommitteeMemberSearchRepository;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class AdminCommitteeMemberReadService {

  private final AdminCommitteeMemberSearchRepository adminCommitteeMemberSearchRepository;
  private final AdminCommitteeMemberReadRepository adminCommitteeMemberReadRepository;

  /**
   * 위원회 명단 리스트를 조회합니다.
   *
   * @param search 위원회 명단 검색 조건을 포함한 객체
   * @return 위원회 명단 조회 결과를 포함한 {@link AdminCommitteeMemberSearchResponse} 객체
   */
  public AdminCommitteeMemberSearchResponse getCommitteeMemberList(AdminCommitteeMemberSearch search) {
    return AdminCommitteeMemberSearchResponse.builder()
        .total(adminCommitteeMemberSearchRepository.findTotalSize(search))
        .resultList(adminCommitteeMemberSearchRepository.findPage(search))
        .build();
  }

  /**
   * 지정된 일련번호(seq)를 기반으로 위원회 명단 정보를 조회합니다.
   *
   * @param seq 조회할 위원회의 일련번호
   * @return 조회된 위원회의 명단 정보를 담은 {@link AdminCommitteeMemberSearchResponse} 객체
   */
  public AdminCommitteeMemberEntity getCommitteeMember(Long seq) {
    return adminCommitteeMemberReadRepository.findCommitteeMember(seq);
  }
}
