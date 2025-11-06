package com.platform.datasource.base.repository.deliberation.agenda;

import static com.platform.datasource.base.util.condition.JooqDateConditionUtil.betweenDateNotNull;
import static org.jooq.impl.DSL.count;

import com.platform.common.base.type.status.ConclusionStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaResult;
import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaSearch;
import com.platform.datasource.base.dto.deliberation.agenda.DeliberationAgendaSubResult;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JConclusionStatus;
import org.jooq.generated.tables.JDeliberationStatus;
import org.jooq.generated.tables.JDeliberationTarget;
import org.jooq.generated.tables.JLtisCharge;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JOpinionCaseComment;
import org.jooq.generated.tables.JOpinionCaseTemplate;
import org.jooq.generated.tables.JSystemDeliberationDate;
import org.jooq.generated.tables.JSystemDeliberationGroup;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class DeliberationAgendaSearchReadRepository {

  private final DSLContext dslContext;
  private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
  private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;
  private final JConclusionStatus CONCLUSION_STATUS = JConclusionStatus.CONCLUSION_STATUS;
  private final JDeliberationStatus DELIBERATION_STATUS = JDeliberationStatus.DELIBERATION_STATUS;
  private final JDeliberationTarget DELIBERATION_TARGET = JDeliberationTarget.DELIBERATION_TARGET;
  private final JSystemDeliberationDate SYSTEM_DELIBERATION_DATE = JSystemDeliberationDate.SYSTEM_DELIBERATION_DATE;
  private final JSystemDeliberationGroup SYSTEM_DELIBERATION_GROUP = JSystemDeliberationGroup.SYSTEM_DELIBERATION_GROUP;
  private final JOpinionCaseTemplate OPINION_CASE_TEMPLATE = JOpinionCaseTemplate.OPINION_CASE_TEMPLATE;
  private final JOpinionCaseComment OPINION_CASE_COMMENT = JOpinionCaseComment.OPINION_CASE_COMMENT;

  /**
   *  심의 차수 Count
   *
   * @param deliberationAgendaSearch 검색조건
   * @return Total Count
   */
  public Integer findTotalSize(DeliberationAgendaSearch deliberationAgendaSearch) {
    return dslContext.selectCount()
        .from(DELIBERATION_STATUS)
        .join(SYSTEM_DELIBERATION_DATE).on(DELIBERATION_STATUS.SCHEDULE_DATE_SEQ.eq(SYSTEM_DELIBERATION_DATE.SEQ))
        .join(SYSTEM_DELIBERATION_GROUP).on(DELIBERATION_STATUS.SCHEDULE_GROUP_SEQ.eq(SYSTEM_DELIBERATION_GROUP.SEQ))
        .where(getCondition(deliberationAgendaSearch))
        .fetchOne(0, Integer.class);
  }

  /**
   * 심의 차수 리스트 (페이지)
   *
   * @param deliberationAgendaSearch 검색조건
   * @return 안건 리스트
   */
  public List<DeliberationAgendaResult> findPage(DeliberationAgendaSearch deliberationAgendaSearch) {
    // 서브쿼리 생성
    var caseTitleSubquery = DSL.select(
            DSL.case_()
                .when(DSL.count().eq(1), DSL.min(LTIS_INFO.CASE_TITLE))
                .otherwise(
                    DSL.concat(
                        DSL.min(LTIS_INFO.CASE_TITLE),
                        DSL.val(" 외 "),
                        count().minus(1),
                        DSL.val("개")
                    )
                )
        ).from(DELIBERATION_TARGET)
        .join(LTIS_INFO).on(DELIBERATION_TARGET.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .where(DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ.eq(DELIBERATION_STATUS.SEQ))
        .groupBy(DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ)
        .orderBy(DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ)
        .asField("caseTitle");

    return dslContext
        .select(
            DELIBERATION_STATUS.SEQ,
            SYSTEM_DELIBERATION_DATE.SCHEDULED_DATE.as("scheduleDate"),
            SYSTEM_DELIBERATION_GROUP.GROUP_NAME.as("scheduleGroup"),
            caseTitleSubquery
        )
        .from(DELIBERATION_STATUS)
        .join(SYSTEM_DELIBERATION_DATE).on(DELIBERATION_STATUS.SCHEDULE_DATE_SEQ.eq(SYSTEM_DELIBERATION_DATE.SEQ))
        .join(SYSTEM_DELIBERATION_GROUP).on(DELIBERATION_STATUS.SCHEDULE_GROUP_SEQ.eq(SYSTEM_DELIBERATION_GROUP.SEQ))
        .where(getCondition(deliberationAgendaSearch))
        .offset(deliberationAgendaSearch.getPage() * deliberationAgendaSearch.getPageSize())
        .limit(deliberationAgendaSearch.getPageSize())
        .fetchInto(DeliberationAgendaResult.class);
  }

  /**
   * 주어진 검색 조건을 기반으로 심의 차수 검색을 위한 SQL 조건을 생성합니다.
   *
   * @param deliberationAgendaSearch 검색 조건을 포함한 객체
   * - scheduleStartDt: 심의 시작 일자
   * - scheduleEndDt: 심의 마지막 일자
   * @return 생성된 SQL 조건 객체
   */
  private Condition getCondition(DeliberationAgendaSearch deliberationAgendaSearch) {
    return (
        betweenDateNotNull(SYSTEM_DELIBERATION_DATE.SCHEDULED_DATE, deliberationAgendaSearch.getScheduleStartDt(), deliberationAgendaSearch.getScheduleEndDt())
    ).and(DSL.exists(
        DSL.selectOne()
            .from(DELIBERATION_TARGET)
            .leftJoin(CONCLUSION_STATUS).on(DELIBERATION_TARGET.JUDG_SEQ.eq(CONCLUSION_STATUS.JUDG_SEQ))
            .where(DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ.eq(DELIBERATION_STATUS.SEQ).and(CONCLUSION_STATUS.STATUS_CODE.eq(ConclusionStatusCode.COMPLETE.getCode())))
    ));
  }
  
  /**
   * 주어진 재결 상태 일련번호(deliberationStatusSeq)를 기준으로 LTIS 정보 목록을 조회합니다.
   *
   * @param deliberationStatusSeq 검토 상태 일련번호 (심의 상태 정보에 사용)
   * @return 주어진 상태에 해당하는 LTIS 정보 목록
   */
  public List<DeliberationAgendaSubResult> getDeliberationAgendaSubList(long deliberationStatusSeq) {
    // 서브쿼리 생성
    var opinionCountSubquery = DSL.selectCount()
        .from(OPINION_CASE_TEMPLATE)
        .join(OPINION_CASE_COMMENT).on(OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(OPINION_CASE_COMMENT.OPINION_CASE_TEMPLATE_SEQ))
        .where(OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(DELIBERATION_TARGET.JUDG_SEQ))
        .asField("opinionCount");

    return dslContext.select(
        LTIS_INFO.CASE_NO,
            LTIS_INFO.CASE_TITLE,
            LTIS_CHARGE.CHARGE_NM,
            opinionCountSubquery
        )
        .from(DELIBERATION_TARGET)
        .join(LTIS_INFO).on(DELIBERATION_TARGET.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .join(LTIS_CHARGE).on(LTIS_INFO.JUDG_SEQ.eq(LTIS_CHARGE.JUDG_SEQ))
        .where(DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ.eq(deliberationStatusSeq))
        .fetchInto(DeliberationAgendaSubResult.class);
  }

}