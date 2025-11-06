package com.platform.datasource.base.repository.admin.district;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JAdminDistrictManager;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class AdminDistrictChargeRepository {

  private final DSLContext dslContext;
  private static final JAdminDistrictManager ADMIN_DISTRICT_MANAGER = JAdminDistrictManager.ADMIN_DISTRICT_MANAGER;

  public void insert(AdminDistrictManagerEntity adminDistrictManager) {
    dslContext.insertInto(ADMIN_DISTRICT_MANAGER,
            ADMIN_DISTRICT_MANAGER.MANAGER_NAME,
            ADMIN_DISTRICT_MANAGER.DISTRICT,
            ADMIN_DISTRICT_MANAGER.PHONE_NUMBER,
            ADMIN_DISTRICT_MANAGER.CREATED_BY,
            ADMIN_DISTRICT_MANAGER.CREATED_TIME
        )
        .values(
            adminDistrictManager.getManagerName(),
            adminDistrictManager.getDistrict(),
            adminDistrictManager.getPhoneNumber(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).execute();
  }

  public int update(Long seq, AdminDistrictManagerEntity adminDistrictManager) {
    return dslContext.update(ADMIN_DISTRICT_MANAGER)
        .set(ADMIN_DISTRICT_MANAGER.MANAGER_NAME, adminDistrictManager.getManagerName())
        .set(ADMIN_DISTRICT_MANAGER.DISTRICT, adminDistrictManager.getDistrict())
        .set(ADMIN_DISTRICT_MANAGER.PHONE_NUMBER, adminDistrictManager.getPhoneNumber())
        .set(ADMIN_DISTRICT_MANAGER.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(ADMIN_DISTRICT_MANAGER.UPDATED_TIME, LocalDateTime.now())
        .where(ADMIN_DISTRICT_MANAGER.SEQ.eq(seq))
        .execute();
  }

  public int delete(Long seq) {
    return dslContext.deleteFrom(ADMIN_DISTRICT_MANAGER)
        .where(ADMIN_DISTRICT_MANAGER.SEQ.eq(seq))
        .execute();
  }
}
