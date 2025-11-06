package com.platform.datasource.base.repository.deliberation.schedule;

import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.common.base.type.status.ConclusionStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.deliberation.schedule.DeliberationScheduleResult;
import com.platform.datasource.base.dto.deliberation.schedule.DeliberationScheduleSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JConclusionStatus;
import org.jooq.generated.tables.JDeliberationStatus;
import org.jooq.generated.tables.JDeliberationTarget;
import org.jooq.generated.tables.JLtisCharge;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JReceiptStatus;
import org.jooq.generated.tables.JSystemDeliberationDate;
import org.jooq.generated.tables.JSystemDeliberationGroup;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class DeliberationScheduleSearchReadRepository {

  private final DSLContext dslContext;
  private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
  private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;
  private final JConclusionStatus CONCLUSION_STATUS = JConclusionStatus.CONCLUSION_STATUS;
  private final JReceiptStatus RECEIPT_STATUS = JReceiptStatus.RECEIPT_STATUS;
  private final JDeliberationStatus DELIBERATION_STATUS = JDeliberationStatus.DELIBERATION_STATUS;
  private final JDeliberationTarget DELIBERATION_TARGET = JDeliberationTarget.DELIBERATION_TARGET;
  private final JSystemDeliberationDate SYSTEM_DELIBERATION_DATE = JSystemDeliberationDate.SYSTEM_DELIBERATION_DATE;
  private final JSystemDeliberationGroup SYSTEM_DELIBERATION_GROUP = JSystemDeliberationGroup.SYSTEM_DELIBERATION_GROUP;

  /**
   *  심의 차수 등록 리스트 Count
   *
   * @param deliberationScheduleSearch 검색조건
   * @return Total Count
   */
  public Integer findTotalSize(DeliberationScheduleSearch deliberationScheduleSearch) {
    return dslContext.selectCount()
        .from(RECEIPT_STATUS)
        .leftJoin(CONCLUSION_STATUS).on(RECEIPT_STATUS.JUDG_SEQ.eq(CONCLUSION_STATUS.JUDG_SEQ))
        .leftJoin(LTIS_INFO).on(RECEIPT_STATUS.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .leftJoin(LTIS_CHARGE).on(RECEIPT_STATUS.JUDG_SEQ.eq(LTIS_CHARGE.JUDG_SEQ))
        .leftOuterJoin(DELIBERATION_TARGET).on(RECEIPT_STATUS.JUDG_SEQ.eq(DELIBERATION_TARGET.JUDG_SEQ))
        .leftJoin(DELIBERATION_STATUS).on(DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ.eq(DELIBERATION_STATUS.SEQ))
        .leftOuterJoin(SYSTEM_DELIBERATION_DATE).on(DELIBERATION_STATUS.SCHEDULE_DATE_SEQ.eq(SYSTEM_DELIBERATION_DATE.SEQ))
        .leftOuterJoin(SYSTEM_DELIBERATION_GROUP).on(DELIBERATION_STATUS.SCHEDULE_GROUP_SEQ.eq(SYSTEM_DELIBERATION_GROUP.SEQ))
        .where(getCondition(deliberationScheduleSearch))
        .fetchOne(0, Integer.class);
  }

  /**
   * 심의 차수 등록 리스트 (페이지)
   *
   * @param deliberationScheduleSearch 검색조건
   * @return 안건 등록 리스트
   */
  public List<DeliberationScheduleResult> findPage(DeliberationScheduleSearch deliberationScheduleSearch) {
    return dslContext.select(
            RECEIPT_STATUS.JUDG_SEQ,
            LTIS_INFO.CASE_NO,
            LTIS_INFO.CASE_TITLE,
            LTIS_CHARGE.CHARGE_NM,
            SYSTEM_DELIBERATION_DATE.SCHEDULED_DATE.as("scheduleDate"),
            SYSTEM_DELIBERATION_GROUP.GROUP_NAME.as("scheduleGroup")
        ).from(RECEIPT_STATUS)
        .leftJoin(CONCLUSION_STATUS).on(RECEIPT_STATUS.JUDG_SEQ.eq(CONCLUSION_STATUS.JUDG_SEQ))
        .leftJoin(LTIS_INFO).on(RECEIPT_STATUS.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .leftJoin(LTIS_CHARGE).on(RECEIPT_STATUS.JUDG_SEQ.eq(LTIS_CHARGE.JUDG_SEQ))
        .leftOuterJoin(DELIBERATION_TARGET).on(RECEIPT_STATUS.JUDG_SEQ.eq(DELIBERATION_TARGET.JUDG_SEQ))
        .leftJoin(DELIBERATION_STATUS).on(DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ.eq(DELIBERATION_STATUS.SEQ))
        .leftOuterJoin(SYSTEM_DELIBERATION_DATE).on(DELIBERATION_STATUS.SCHEDULE_DATE_SEQ.eq(SYSTEM_DELIBERATION_DATE.SEQ))
        .leftOuterJoin(SYSTEM_DELIBERATION_GROUP).on(DELIBERATION_STATUS.SCHEDULE_GROUP_SEQ.eq(SYSTEM_DELIBERATION_GROUP.SEQ))
        .where(getCondition(deliberationScheduleSearch))
        .offset(deliberationScheduleSearch.getPage() * deliberationScheduleSearch.getPageSize())
        .limit(deliberationScheduleSearch.getPageSize())
        .fetchInto(DeliberationScheduleResult.class);
  }

  private Condition getCondition(DeliberationScheduleSearch deliberationScheduleSearch) {
    return (CONCLUSION_STATUS.STATUS_CODE.eq(ConclusionStatusCode.COMPLETE.getCode()))
        .and(
            likeIfNotBlank(LTIS_INFO.CASE_NO, deliberationScheduleSearch.getKeyword()).or(
                likeIfNotBlank(LTIS_INFO.CASE_TITLE, deliberationScheduleSearch.getKeyword())
            )
        ).and(
            likeIfNotBlank(LTIS_CHARGE.CHARGE_NM, deliberationScheduleSearch.getChargeNm()) // ekaekdwk
        );
  }
}
