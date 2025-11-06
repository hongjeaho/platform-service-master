package com.platform.api.platform.admin.districtCharge.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.admin.district.AdminDistrictChargeRepository;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.AdminDistrictManagerEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class AdminDistrictChargeService {

  private final AdminDistrictChargeRepository adminDistrictChargeRepository;

  public void create(AdminDistrictManagerEntity entity) {
    adminDistrictChargeRepository.insert(entity);
  }

  public void update(long seq, AdminDistrictManagerEntity entity) {
    adminDistrictChargeRepository.update(seq, entity);
  }

  public void delete(long seq) {
    adminDistrictChargeRepository.delete(seq);
  }
}
