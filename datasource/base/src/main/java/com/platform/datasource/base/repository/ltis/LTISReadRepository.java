package com.platform.datasource.base.repository.ltis;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JLtisStatus;
import org.jooq.generated.tables.pojos.LtisInfoEntity;
import org.jooq.generated.tables.pojos.LtisStatusEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class LTISReadRepository {
  private final DSLContext dslContext;
  private final JLtisStatus LTIS_STATUS = JLtisStatus.LTIS_STATUS;
  private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;

  /**
   * 재결 일련번호를 기반으로 LTIS 상태 정보를 조회합니다.
   *
   * @param judgSeq 재결일련번호
   * @return LTIS 상태 정보
   */
  public LtisStatusEntity findLtisStatusByJudgSeq(Long judgSeq) {
    return dslContext.selectFrom(LTIS_STATUS)
        .where(LTIS_STATUS.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(LtisStatusEntity.class);
  }

  /**
   * 재결 일련번호를 기반으로 LTIS 정보 엔티티를 조회합니다.
   *
   * @param judgSeq 재결일련번호
   * @return 조회된 LTIS 정보 엔티티
   */
  public LtisInfoEntity findLtisInfoByJudgSeq(Long judgSeq) {
    return dslContext.selectFrom(LTIS_INFO)
        .where(LTIS_INFO.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(LtisInfoEntity.class);
  }
}
