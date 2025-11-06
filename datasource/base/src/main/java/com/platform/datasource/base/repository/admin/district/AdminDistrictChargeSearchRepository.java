package com.platform.datasource.base.repository.admin.district;

import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.admin.district.AdminDistrictChargeSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JAdminDistrictManager;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminDistrictChargeSearchRepository {

  private final DSLContext dslContext;
  private final JAdminDistrictManager ADMIN_DISTRICT_MANAGER = JAdminDistrictManager.ADMIN_DISTRICT_MANAGER;

  public Integer findTotalSize(AdminDistrictChargeSearch search) {
    return dslContext.selectCount()
        .from(ADMIN_DISTRICT_MANAGER)
        .where(getCondition(search))
        .fetchOne(0, Integer.class);
  }

  public List<AdminDistrictManagerEntity> findPage(AdminDistrictChargeSearch search) {
    return dslContext.select(ADMIN_DISTRICT_MANAGER.fields())
        .from(ADMIN_DISTRICT_MANAGER)
        .where(getCondition(search))
        .orderBy(ADMIN_DISTRICT_MANAGER.SEQ.asc())
        .offset(search.getPage() * search.getPageSize())
        .limit(search.getPageSize())
        .fetchInto(AdminDistrictManagerEntity.class);
  }

  private Condition getCondition(AdminDistrictChargeSearch search) {
    return likeIfNotBlank(ADMIN_DISTRICT_MANAGER.MANAGER_NAME, search.getManagerName())
        .and(likeIfNotBlank(ADMIN_DISTRICT_MANAGER.DISTRICT, search.getDistrict()))
        .and(likeIfNotBlank(ADMIN_DISTRICT_MANAGER.PHONE_NUMBER, search.getPhoneNumber()));
  }
}
