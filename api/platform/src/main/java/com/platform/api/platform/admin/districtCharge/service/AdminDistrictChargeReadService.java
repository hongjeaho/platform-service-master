package com.platform.api.platform.admin.districtCharge.service;

import com.platform.api.platform.admin.districtCharge.dto.AdminDistrictChargeSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.district.AdminDistrictChargeSearch;
import com.platform.datasource.base.repository.admin.district.AdminDistrictChargeReadRepository;
import com.platform.datasource.base.repository.admin.district.AdminDistrictChargeSearchRepository;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class AdminDistrictChargeReadService {

  private final AdminDistrictChargeSearchRepository adminDistrictChargeSearchRepository;
  private final AdminDistrictChargeReadRepository adminDistrictChargeReadRepository;

  /**
   * 주어진 검색 조건을 기반으로 구별 담당자의 리스트를 조회합니다.
   *
   * @param search 구별 담당자 검색 조건. 해당 조건은 담당자 이름, 담당구, 전화번호 등으로 구성됩니다.
   * @return 검색 조건에 맞는 구별 담당자 리스트 및 총 결과 수를 포함한 {@code DistrictChargeSearchResponse} 객체.
   */
  public AdminDistrictChargeSearchResponse getDistrictChargeList(AdminDistrictChargeSearch search) {
    return AdminDistrictChargeSearchResponse.builder()
        .total(adminDistrictChargeSearchRepository.findTotalSize(search))
        .resultList(adminDistrictChargeSearchRepository.findPage(search))
        .build();
  }

  /**
   * 주어진 일련번호를 기반으로 구별 담당자를 조회합니다.
   *
   * @param seq 재결일련번호. 조회할 담당자를 식별하는 고유 키.
   * @return 일치하는 구별 담당자 정보를 담고 있는 {@code AdminDistrictManagerEntity} 객체.
   */
  public AdminDistrictManagerEntity getDistrictCharge(Long seq) {
    return adminDistrictChargeReadRepository.findDistrictCharge(seq);
  }
}
