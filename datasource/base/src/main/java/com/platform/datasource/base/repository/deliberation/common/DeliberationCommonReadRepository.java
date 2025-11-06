package com.platform.datasource.base.repository.deliberation.common;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JSystemDeliberationDate;
import org.jooq.generated.tables.JSystemDeliberationGroup;
import org.jooq.generated.tables.pojos.SystemDeliberationDateEntity;
import org.jooq.generated.tables.pojos.SystemDeliberationGroupEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class DeliberationCommonReadRepository {

  private final DSLContext dslContext;
  private final JSystemDeliberationDate SYSTEM_DELIBERATION_DATE = JSystemDeliberationDate.SYSTEM_DELIBERATION_DATE;
  private final JSystemDeliberationGroup SYSTEM_DELIBERATION_GROUP = JSystemDeliberationGroup.SYSTEM_DELIBERATION_GROUP;


  /**
   * 현재 날짜 이후에 예정된 심의 일자 목록을 조회합니다.
   *
   * @return 심의 일자 정보를 담고 있는 DeliberationDateEntity 객체의 리스트
   */
  public List<SystemDeliberationDateEntity> findDeliberationDateList() {
    return dslContext.select(SYSTEM_DELIBERATION_DATE.fields())
        .from(SYSTEM_DELIBERATION_DATE)
        .where(SYSTEM_DELIBERATION_DATE.SCHEDULED_DATE.ge(LocalDate.now()))
        .fetchInto(SystemDeliberationDateEntity.class);
  }

  /**
   * 심의그룹 목록을 조회합니다.
   *
   * @return 심의그룹 정보를 담고 있는 DeliberationGroupEntity 객체의 리스트
   */
  public List<SystemDeliberationGroupEntity> findDeliberationGroupList() {
    return dslContext.select(SYSTEM_DELIBERATION_GROUP.fields())
        .from(SYSTEM_DELIBERATION_GROUP)
        .fetchInto(SystemDeliberationGroupEntity.class);
  }
}
