package com.platform.datasource.base.repository.reference;

import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.reference.ConclusionOpinionDetailInfo;
import com.platform.datasource.base.dto.reference.ConclusionOpinionResult;
import com.platform.datasource.base.dto.reference.ConclusionOpinionSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JLtisCharge;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JOpinionTemplate;
import org.jooq.generated.tables.JReferenceConclusionOpinion;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class ConclusionOpinionSearchRepository {

  private final DSLContext dslContext;
  private final JReferenceConclusionOpinion REFERENCE_CONCLUSION_OPINION = JReferenceConclusionOpinion.REFERENCE_CONCLUSION_OPINION;
  private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
  private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;
  private final JOpinionTemplate OPINION_TEMPLATE = JOpinionTemplate.OPINION_TEMPLATE;

  /**
   * 사용자가 입력한 검색 조건에 따라 재결관 의견 리스트 조회 행 수를 카운트하는 메서드
   *
   * @param conclusionOpinionSearch 재결관 의견 조회 검색 조건
   */
  public Integer findTotalSize(ConclusionOpinionSearch conclusionOpinionSearch) {
    return dslContext.select(DSL.countDistinct(LTIS_INFO.JUDG_SEQ))
        .from(REFERENCE_CONCLUSION_OPINION)
        .join(OPINION_TEMPLATE)
        .on(REFERENCE_CONCLUSION_OPINION.TEMPLATE_SEQ_NO.eq(OPINION_TEMPLATE.SEQ))
        .join(LTIS_INFO)
        .on(REFERENCE_CONCLUSION_OPINION.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .leftJoin(LTIS_CHARGE)
        .on(LTIS_CHARGE.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .where(getCondition(conclusionOpinionSearch))
        .fetchOne(0, Integer.class);
  }

  /**
   * 사용자로부터 검색조건을 받아 재결관 의견  목록을 조회하는 쿼리
   *
   * @param conclusionOpinionSearch 재결관 의견  검색 조건
   */
  public List<ConclusionOpinionResult> findPage(ConclusionOpinionSearch conclusionOpinionSearch) {

    return dslContext.select(
            REFERENCE_CONCLUSION_OPINION.SEQ
            , REFERENCE_CONCLUSION_OPINION.DELIBERATION_PERIOD
            , REFERENCE_CONCLUSION_OPINION.VIEW_COUNT
            , REFERENCE_CONCLUSION_OPINION.DELIBERATION_DATE
            , OPINION_TEMPLATE.TEMPLATE_NAME
            , LTIS_INFO.CASE_NO
            , LTIS_INFO.CASE_TITLE
            , LTIS_CHARGE.CHARGE_NM
        ).from(REFERENCE_CONCLUSION_OPINION)
        .join(OPINION_TEMPLATE)
        .on(REFERENCE_CONCLUSION_OPINION.TEMPLATE_SEQ_NO.eq(OPINION_TEMPLATE.SEQ))
        .join(LTIS_INFO)
        .on(REFERENCE_CONCLUSION_OPINION.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .join(LTIS_CHARGE)
        .on(LTIS_CHARGE.JUDG_SEQ.eq(REFERENCE_CONCLUSION_OPINION.JUDG_SEQ))
        .where(getCondition(conclusionOpinionSearch))
        .groupBy(
            LTIS_INFO.JUDG_SEQ,
            REFERENCE_CONCLUSION_OPINION.SEQ,
            REFERENCE_CONCLUSION_OPINION.DELIBERATION_PERIOD,
            REFERENCE_CONCLUSION_OPINION.VIEW_COUNT,
            REFERENCE_CONCLUSION_OPINION.DELIBERATION_DATE,
            OPINION_TEMPLATE.TEMPLATE_NAME,
            LTIS_INFO.CASE_NO,
            LTIS_INFO.CASE_TITLE,
            LTIS_CHARGE.CHARGE_NM
        )
        .orderBy(REFERENCE_CONCLUSION_OPINION.SEQ)
        .offset(conclusionOpinionSearch.getPage()
            * conclusionOpinionSearch.getPageSize())
        .limit(conclusionOpinionSearch.getPageSize())
        .fetchInto(ConclusionOpinionResult.class);

  }

  /**
   * 사용자로부터 선택한 행의 재결관 의견 상세 정보를 조회한다.
   *
   * @param conclusionOpinionSeq 재결관 의견  일련번호
   */
  public ConclusionOpinionDetailInfo findConclusionOpinionInfo(long conclusionOpinionSeq) {
    return dslContext.select(
            OPINION_TEMPLATE.TEMPLATE_NAME
            , LTIS_INFO.CASE_TITLE
            , REFERENCE_CONCLUSION_OPINION.DELIBERATION_DATE
            , LTIS_CHARGE.CHARGE_NM
            , REFERENCE_CONCLUSION_OPINION.CONCLUSION_OPINION_CONTENT
            , REFERENCE_CONCLUSION_OPINION.REF_COUNT
        ).from(REFERENCE_CONCLUSION_OPINION)
        .join(OPINION_TEMPLATE)
        .on(REFERENCE_CONCLUSION_OPINION.SEQ.eq(conclusionOpinionSeq))
        .and(REFERENCE_CONCLUSION_OPINION.TEMPLATE_SEQ_NO.eq(OPINION_TEMPLATE.SEQ))
        .join(LTIS_INFO)
        .on(REFERENCE_CONCLUSION_OPINION.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .leftJoin(LTIS_CHARGE)
        .on(LTIS_CHARGE.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .where(REFERENCE_CONCLUSION_OPINION.SEQ.eq(conclusionOpinionSeq))
        .groupBy(
            OPINION_TEMPLATE.TEMPLATE_NAME,
            LTIS_INFO.CASE_TITLE,
            REFERENCE_CONCLUSION_OPINION.DELIBERATION_DATE,
            LTIS_CHARGE.CHARGE_NM,
            REFERENCE_CONCLUSION_OPINION.CONCLUSION_OPINION_CONTENT,
            REFERENCE_CONCLUSION_OPINION.REF_COUNT
        )
        .fetchOneInto(ConclusionOpinionDetailInfo.class);
  }

  /**
   * 사용자가 입력한 검색 조건을 반영하여  재결관 의견  조회 검색 조건을 따로 분리한 메서드
   *
   * @param conclusionOpinionSearch 재결관 의견  조회 검색 조건
   */
  private Condition getCondition(

      ConclusionOpinionSearch conclusionOpinionSearch) {

    if (conclusionOpinionSearch.getOpinionTemplateSeq() == null) {
      return getSearchContentTitleCondition(conclusionOpinionSearch);
    }

    return getSearchContentTitleCondition(conclusionOpinionSearch).and(
        OPINION_TEMPLATE.SEQ.eq(conclusionOpinionSearch.getOpinionTemplateSeq()));
  }

  /**
   * 사용자가 입력한 검색 조건 중 본문 및 내용 검색 조건만 따로 분리한 조건
   *
   * @param conclusionOpinionSearch 재결관 의견  조회 검색 조건
   */
  private Condition getSearchContentTitleCondition(
      ConclusionOpinionSearch conclusionOpinionSearch) {
    return likeIfNotBlank(LTIS_INFO.CASE_TITLE,
        conclusionOpinionSearch.getKeyword()).or(
        likeIfNotBlank(REFERENCE_CONCLUSION_OPINION.CONCLUSION_OPINION_CONTENT,
            conclusionOpinionSearch.getKeyword()));
  }

}
