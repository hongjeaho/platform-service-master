package com.platform.datasource.base.repository.reference;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JReferenceDecreeDetail;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class DecreeRepository {

  private final DSLContext dslContext;
  private final JReferenceDecreeDetail REFERENCE_DECREE_DETAIL = JReferenceDecreeDetail.REFERENCE_DECREE_DETAIL;

  /**
   * 법령 및 시행규칙 상세보기를 위해 행 클릭시 조회 수 +1 업데이트를 수행하는 메서드
   *
   * @param decreeDetailSeq 법령 및 시행규칙 상세 정보 일련번호
   */
  public void updateDecreeViewCnt(long decreeDetailSeq) {
    dslContext.update(REFERENCE_DECREE_DETAIL)
        .set(REFERENCE_DECREE_DETAIL.VIEW_COUNT, REFERENCE_DECREE_DETAIL.VIEW_COUNT.plus(1))
        .where(REFERENCE_DECREE_DETAIL.SEQ.eq(decreeDetailSeq)).execute();
  }

  /**
   * 법령 및 시행규칙 상세 정보에 대한 참조 수를 1 증가시키는 메서드
   *
   * @param decreeDetailSeq 법령 및 시행규칙 상세 정보 일련번호
   */
  public void updateDecreeRefCnt(long decreeDetailSeq) {
    dslContext.update(REFERENCE_DECREE_DETAIL)
        .set(REFERENCE_DECREE_DETAIL.REF_COUNT, REFERENCE_DECREE_DETAIL.REF_COUNT.plus(1))
        .where(REFERENCE_DECREE_DETAIL.SEQ.eq(decreeDetailSeq)).execute();
  }
}
