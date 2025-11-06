package com.platform.datasource.base.repository.reference;

import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.decree.DecreeDetailInfo;
import com.platform.datasource.base.dto.decree.DecreeResult;
import com.platform.datasource.base.dto.decree.DecreeSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JReferenceDecree;
import org.jooq.generated.tables.JReferenceDecreeDetail;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class DecreeSearchRepository {

  private final DSLContext dslContext;
  private final JReferenceDecree REFERENCE_DECREE = JReferenceDecree.REFERENCE_DECREE;
  private final JReferenceDecreeDetail REFERENCE_DECREE_DETAIL = JReferenceDecreeDetail.REFERENCE_DECREE_DETAIL;

  /**
   * 사용자가 입력한 검색 조건에 따라 법령 및 시행규칙 리스트 조회 행 수를 카운트하는 메서드
   *
   * @param decreeSearch 법령 및 시행규칙 조회 검색 조건
   */
  public Integer findTotalSize(DecreeSearch decreeSearch) {
    return dslContext.selectCount()
        .from(REFERENCE_DECREE)
        .leftJoin(REFERENCE_DECREE_DETAIL)
        .on(REFERENCE_DECREE.SEQ.eq(REFERENCE_DECREE_DETAIL.DECREE_SEQ))
        .where(getCondition(decreeSearch))
        .fetchOne(0, Integer.class);
  }

  /**
   * 사용자가 입력한 검색 조건에 따라 법령 및 시행규칙 리스트를 페이지별로 조회하는 메서드
   *
   * @param decreeSearch 법령 및 시행규칙 조회 검색 조건
   */
  public List<DecreeResult> findPage(DecreeSearch decreeSearch) {
    return dslContext.select(REFERENCE_DECREE.SEQ.as("decreeSeq")
            , REFERENCE_DECREE_DETAIL.SEQ.as("decreeDetailSeq")
            , REFERENCE_DECREE.DECREE_NAME
            , REFERENCE_DECREE_DETAIL.ARTICLE_NO
            , REFERENCE_DECREE.DECREE_CATEGORY_CODE
            , REFERENCE_DECREE_DETAIL.REF_COUNT
            , REFERENCE_DECREE_DETAIL.VIEW_COUNT)
        .from(REFERENCE_DECREE)
        .leftJoin(REFERENCE_DECREE_DETAIL)
        .on(REFERENCE_DECREE.SEQ.eq(REFERENCE_DECREE_DETAIL.DECREE_SEQ))
        .where(getCondition(decreeSearch))
        .orderBy(REFERENCE_DECREE_DETAIL.SEQ)
        .offset(decreeSearch.getPage() * decreeSearch.getPageSize())
        .limit(decreeSearch.getPageSize())
        .fetchInto(DecreeResult.class);
  }

  public DecreeDetailInfo findDecreeDetailInfo(long decreeDetailSeq) {
    return dslContext.select(REFERENCE_DECREE.DECREE_NAME
            , REFERENCE_DECREE_DETAIL.ARTICLE_NO
            , REFERENCE_DECREE_DETAIL.DECREE_CONTENT
            , REFERENCE_DECREE.DECREE_CATEGORY_CODE
            , REFERENCE_DECREE_DETAIL.REF_COUNT)
        .from(REFERENCE_DECREE)
        .join(REFERENCE_DECREE_DETAIL)
        .on(REFERENCE_DECREE_DETAIL.SEQ.eq(decreeDetailSeq))
        .and(REFERENCE_DECREE_DETAIL.DECREE_SEQ.eq(REFERENCE_DECREE.SEQ))
        .fetchOneInto(DecreeDetailInfo.class);
  }

  /**
   * 사용자가 입력한 검색 조건을 반영하여 법령 및 시행규칙 조회 검색 조건을 따로 분리한 메서드
   *
   * @param decreeSearch 법령 및 시행규칙 조회 검색 조건
   */
  private Condition getCondition(DecreeSearch decreeSearch) {
    return (REFERENCE_DECREE.SEQ.isNotNull())
        .and(REFERENCE_DECREE_DETAIL.SEQ.isNotNull())
        .and(REFERENCE_DECREE.DEL_CHECK.eq(0L))
        .and(REFERENCE_DECREE_DETAIL.DEL_CHECK.eq(0L))
        .and(decreeSearch.getDecreeCategoryCode() == null ?
            (getSearchContentCondition(decreeSearch).or(getSearchNameCondition(decreeSearch)))
            : (likeIfNotBlank(REFERENCE_DECREE.DECREE_CATEGORY_CODE,
                decreeSearch.getDecreeCategoryCode())).and(getSearchNameCondition(decreeSearch)));
  }

  /**
   * 사용자가 입력한 검색 조건 중 본문 검색 조건만 따로 분리한 조건
   *
   * @param decreeSearch 법령 및 시행규칙 조회 검색 조건
   */
  private Condition getSearchContentCondition(DecreeSearch decreeSearch) {
    return likeIfNotBlank(REFERENCE_DECREE_DETAIL.DECREE_CONTENT, decreeSearch.getKeyword());
  }

  /**
   * 사용자가 입력한 검색 조건 중 법령 및 시행규칙 명 검색 조건만 따로 분리한 조건
   *
   * @param decreeSearch 법령 및 시행규칙 조회 검색 조건
   */
  private Condition getSearchNameCondition(DecreeSearch decreeSearch) {
    return likeIfNotBlank(REFERENCE_DECREE.DECREE_NAME, decreeSearch.getKeyword());
  }

}
