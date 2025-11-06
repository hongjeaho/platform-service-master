package com.platform.datasource.base.repository.reference;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JReferencePrecedent;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class PrecedentRepository {

  private final DSLContext dslContext;
  private final JReferencePrecedent REFERENCE_PRECEDENT = JReferencePrecedent.REFERENCE_PRECEDENT;

  /**
   * 판례 상세보기를 위해 행 클릭시 조회 수 +1 업데이트를 수행하는 메서드
   *
   * @param precedentSeq 판례 상세 정보 일련번호
   */
  public void updatePrecedentViewCount(long precedentSeq) {
    dslContext.update(REFERENCE_PRECEDENT)
        .set(REFERENCE_PRECEDENT.VIEW_COUNT, REFERENCE_PRECEDENT.VIEW_COUNT.plus(1))
        .where(REFERENCE_PRECEDENT.SEQ.eq(precedentSeq)).execute();
  }


  public void updatePrecedentRefCount(long precedentSeq) {
    dslContext.update(REFERENCE_PRECEDENT)
        .set(REFERENCE_PRECEDENT.REF_COUNT, REFERENCE_PRECEDENT.REF_COUNT.plus(1))
        .where(REFERENCE_PRECEDENT.SEQ.eq(precedentSeq)).execute();
  }
}
