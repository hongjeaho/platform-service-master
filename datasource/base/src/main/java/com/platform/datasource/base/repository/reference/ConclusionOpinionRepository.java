package com.platform.datasource.base.repository.reference;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JReferenceConclusionOpinion;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class ConclusionOpinionRepository {

  private final DSLContext dslContext;
  private final JReferenceConclusionOpinion REFERENCE_CONCLUSION_OPINION = JReferenceConclusionOpinion.REFERENCE_CONCLUSION_OPINION;

  /**
   * 재결관 의견 상세보기를 위해 행 클릭시 조회 수 +1 업데이트를 수행하는 메서드
   *
   * @param conclusionOpinionSeq 재결관 의견 상세 정보 일련번호
   */
  public void updateViewCount(long conclusionOpinionSeq) {
    dslContext.update(REFERENCE_CONCLUSION_OPINION)
        .set(REFERENCE_CONCLUSION_OPINION.VIEW_COUNT,
            REFERENCE_CONCLUSION_OPINION.VIEW_COUNT.plus(1))
        .where(REFERENCE_CONCLUSION_OPINION.SEQ.eq(conclusionOpinionSeq)).execute();
  }


  /**
   * 재결관 의견 참조수를 +1 업데이트하는 메서드
   *
   * @param conclusionOpinionSeq 재결관 의견 상세 정보 일련번호
   */
  public void updateRefCont(long conclusionOpinionSeq) {
    dslContext.update(REFERENCE_CONCLUSION_OPINION)
        .set(REFERENCE_CONCLUSION_OPINION.REF_COUNT,
            REFERENCE_CONCLUSION_OPINION.REF_COUNT.plus(1))
        .where(REFERENCE_CONCLUSION_OPINION.SEQ.eq(conclusionOpinionSeq)).execute();
  }
}
