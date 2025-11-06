package com.platform.datasource.base.repository.admin.district;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JAdminDistrictManager;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminDistrictChargeReadRepository {

  private final DSLContext dslContext;
  private final JAdminDistrictManager ADMIN_DISTRICT_MANAGER = JAdminDistrictManager.ADMIN_DISTRICT_MANAGER;


  /**
   * 주어진 고유 식별번호(seq)를 기반으로 행정구역 담당 정보를 조회합니다.
   *
   * @param seq 행정구역 담당의 고유 식별번호
   * @return 조회된 행정구역 담당 정보가 담긴 AdminDistrictManagerEntity 객체
   */
  public AdminDistrictManagerEntity findDistrictCharge(Long seq) {
    return dslContext.select(ADMIN_DISTRICT_MANAGER.fields())
        .from(ADMIN_DISTRICT_MANAGER)
        .where(ADMIN_DISTRICT_MANAGER.SEQ.eq(seq))
        .fetchOneInto(AdminDistrictManagerEntity.class);
  }
}
