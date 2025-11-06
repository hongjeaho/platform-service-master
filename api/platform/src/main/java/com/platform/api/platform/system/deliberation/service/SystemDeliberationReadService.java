package com.platform.api.platform.system.deliberation.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.deliberation.common.DeliberationCommonReadRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.SystemDeliberationDateEntity;
import org.jooq.generated.tables.pojos.SystemDeliberationGroupEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class SystemDeliberationReadService {

  private final DeliberationCommonReadRepository deliberationCommonReadRepository;

  /**
   * 재결일련번호(judgSeq)를 기준으로 재결 날짜 리스트를 반환하는 메서드입니다.
   *
   * @return 재결 날짜 정보를 담고 있는 {@link SystemDeliberationDateEntity} 객체의 리스트.
   */
  public List<SystemDeliberationDateEntity> getDeliberationDateList() {
    return deliberationCommonReadRepository.findDeliberationDateList();
  }

  /**
   * 재결 그룹 리스트를 반환하는 메서드입니다.
   *
   * @return 재결 그룹 정보를 담고 있는 {@link SystemDeliberationGroupEntity} 객체의 리스트.
   */
  public List<SystemDeliberationGroupEntity> getDeliberationGroupList() {
    return deliberationCommonReadRepository.findDeliberationGroupList();
  }
}
