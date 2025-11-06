package com.platform.datasource.base.repository.reference;

import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.reference.PrecedentDetailInfo;
import com.platform.datasource.base.dto.reference.PrecedentResult;
import com.platform.datasource.base.dto.reference.PrecedentSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JOpinionTemplate;
import org.jooq.generated.tables.JReferencePrecedent;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class PrecedentSearchRepository {

  private final DSLContext dslContext;
  private final JReferencePrecedent REFERENCE_PRECEDENT = JReferencePrecedent.REFERENCE_PRECEDENT;
  private final JOpinionTemplate OPINION_TEMPLATE = JOpinionTemplate.OPINION_TEMPLATE;

  /**
   * 사용자가 입력한 검색 조건에 따라 판례 리스트 조회 행 수를 카운트하는 메서드
   *
   * @param precedentSearch 판례 조회 검색 조건
   */
  public Integer findTotalSize(PrecedentSearch precedentSearch) {
    return dslContext.selectCount()
        .from(REFERENCE_PRECEDENT)
        .leftJoin(OPINION_TEMPLATE)
        .on(REFERENCE_PRECEDENT.TEMPLATE_SEQ_NO.eq(OPINION_TEMPLATE.SEQ))
        .where(getCondition(precedentSearch))
        .fetchOne(0, Integer.class);
  }

  /**
   * 사용자로부터 검색조건을 받아 판례 목록을 조회하는 쿼리
   *
   * @param precedentSearch 판례 검색 조건
   */
  public List<PrecedentResult> findPage(PrecedentSearch precedentSearch) {

    return dslContext.select(
            REFERENCE_PRECEDENT.SEQ
            , REFERENCE_PRECEDENT.CASE_NO
            , REFERENCE_PRECEDENT.CASE_TITLE
            , REFERENCE_PRECEDENT.PRECEDENT_CASE_NO
            , OPINION_TEMPLATE.TEMPLATE_NAME
            , REFERENCE_PRECEDENT.VIEW_COUNT)
        .from(REFERENCE_PRECEDENT)
        .join(OPINION_TEMPLATE)
        .on(REFERENCE_PRECEDENT.TEMPLATE_SEQ_NO.eq(OPINION_TEMPLATE.SEQ))
        .where(getCondition(precedentSearch))
        .orderBy(REFERENCE_PRECEDENT.SEQ)
        .offset(precedentSearch.getPage() * precedentSearch.getPageSize())
        .limit(precedentSearch.getPageSize())
        .fetchInto(PrecedentResult.class);
  }


  /**
   * 사용자가 선택한 판례에 대한 상세정보를 조회한다.
   *
   * @param lawPrecedentSeq 판례 참고 사건의 일련번호
   */
  public PrecedentDetailInfo findLawPrecedentInfo(long lawPrecedentSeq) {
    return dslContext.select(
            OPINION_TEMPLATE.TEMPLATE_NAME
            , REFERENCE_PRECEDENT.CASE_TITLE
            , REFERENCE_PRECEDENT.CASE_NO
            , REFERENCE_PRECEDENT.PRECEDENT_CASE_NO
            , REFERENCE_PRECEDENT.COURT_NAME
            , REFERENCE_PRECEDENT.PRECEDENT_CONTENT
            , REFERENCE_PRECEDENT.REF_COUNT
        ).from(REFERENCE_PRECEDENT)
        .join(OPINION_TEMPLATE)
        .on(REFERENCE_PRECEDENT.SEQ.eq(lawPrecedentSeq))
        .and(REFERENCE_PRECEDENT.TEMPLATE_SEQ_NO.eq(OPINION_TEMPLATE.SEQ))
        .fetchOneInto(PrecedentDetailInfo.class);
  }

  /**
   * 사용자가 입력한 검색 조건을 반영하여 법령 및 시행규칙 조회 검색 조건을 따로 분리한 메서드
   *
   * @param precedentSearch 판례 조회 검색 조건
   */
  private Condition getCondition(PrecedentSearch precedentSearch) {
    return (REFERENCE_PRECEDENT.DEL_CHECK.eq(0L))
        .and(precedentSearch.getTemplateNameSeq() > 0 ?
            (getSearchContentTitleCondition(precedentSearch).and(
                OPINION_TEMPLATE.SEQ.eq(precedentSearch.getTemplateNameSeq())))
            : (getSearchContentTitleCondition(precedentSearch)));
  }

  /**
   * 사용자가 입력한 검색 조건 중 본문 및 내용 검색 조건만 따로 분리한 조건
   *
   * @param precedentSearch 판례 조회 검색 조건
   */
  private Condition getSearchContentTitleCondition(PrecedentSearch precedentSearch) {
    return likeIfNotBlank(REFERENCE_PRECEDENT.CASE_TITLE, precedentSearch.getKeyword()).or(
        likeIfNotBlank(REFERENCE_PRECEDENT.PRECEDENT_CONTENT,
            precedentSearch.getKeyword()));
  }

}
