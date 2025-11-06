package com.platform.datasource.base.repository.ltis;

import static org.jooq.impl.DSL.case_;
import static org.jooq.impl.DSL.count;
import static org.jooq.impl.DSL.select;
import static org.jooq.impl.DSL.selectOne;
import static org.jooq.impl.DSL.sum;

import com.platform.common.base.dto.AbstractPagingDTO;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.ltis.CompensationAmountByOwnerInfo;
import com.platform.datasource.base.dto.ltis.LTISInfo;
import com.platform.datasource.base.dto.ltis.LTISReptInfo;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JLtisOwnrInfo;
import org.jooq.generated.tables.JLtisReptInfo;
import org.jooq.generated.tables.JLtisReptOwnrInfo;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class LTISReptInfoReadRepository {

  private final DSLContext dslContext;
  private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
  private final JLtisReptInfo LTIS_REPT_INFO = JLtisReptInfo.LTIS_REPT_INFO;
  private final JLtisOwnrInfo LTIS_OWNR_INFO = JLtisOwnrInfo.LTIS_OWNR_INFO;
  private final JLtisReptOwnrInfo LTIS_REPT_OWNR_INFO = JLtisReptOwnrInfo.LTIS_REPT_OWNR_INFO;

  /**
   * 조서 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 조서 정보
   */
  public LTISInfo findReptReportInfoByJudgSeq(Long judgSeq) {
    return dslContext.select(
            select(sum(case_()
                .when(LTIS_REPT_INFO.LAND_OBST_KIND_CD.eq("L"), LTIS_REPT_INFO.AREA_AMOT)
                .otherwise(BigDecimal.ZERO))
            ).from(LTIS_REPT_INFO)
                .where(LTIS_REPT_INFO.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
                .asField("areaAmot"),
            LTIS_INFO.BIZ_OPRT_PRICE,          /* 종점금액 */
            LTIS_INFO.LAND_CNT,               /* 필지 수 */
            LTIS_INFO.LAND_OWNER_CNT,         /* 필지 소유자 수 */
            LTIS_INFO.OBJECT_CNT,             /* 지장물 수 */
            LTIS_INFO.OBJECT_OWNER_CNT        /* 지장물 소우자수  */
        )
        .from(LTIS_INFO)
        .where(LTIS_INFO.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(LTISInfo.class);
  }

  public List<LTISReptInfo> getLtisReptLand(long judgSeq) {
    return dslContext.select(LTIS_REPT_INFO.fields())
        .from(LTIS_REPT_INFO)
        .where(LTIS_REPT_INFO.JUDG_SEQ.eq(judgSeq))
        .and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.eq("L"))
        .fetchInto(LTISReptInfo.class);
  }

  public List<LTISReptInfo> getLtisReptLandOwner(long judgSeq) {
    return dslContext.select(LTIS_REPT_INFO.fields())
        .select( LTIS_OWNR_INFO.OWNR_INTR_NM)
        .from(LTIS_REPT_OWNR_INFO)
        .leftJoin(LTIS_OWNR_INFO)
          .on(LTIS_REPT_OWNR_INFO.OWNR_SEQ.eq(LTIS_OWNR_INFO.OWNR_SEQ).and(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(LTIS_OWNR_INFO.JUDG_SEQ)))
        .leftJoin(LTIS_REPT_INFO)
          .on(LTIS_REPT_OWNR_INFO.REPT_SEQ.eq(LTIS_REPT_INFO.REPT_SEQ).and(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(LTIS_REPT_OWNR_INFO.JUDG_SEQ)))
        .where(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(judgSeq).and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.eq("L")))
        .fetchInto(LTISReptInfo.class);
  }

  public List<LTISReptInfo> getLtisReptObject(long judgSeq) {
    return dslContext.select(LTIS_REPT_INFO.fields())
        .from(LTIS_REPT_INFO)
        .where(LTIS_REPT_INFO.JUDG_SEQ.eq(judgSeq))
        .and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.notEqual("L"))
        .fetchInto(LTISReptInfo.class);
  }

  public List<LTISReptInfo> getLtisReptObjectOwner(long judgSeq) {
    return dslContext.select(LTIS_REPT_INFO.fields())
        .select(LTIS_REPT_OWNR_INFO.LAND_SHRE)
        .select( LTIS_OWNR_INFO.OWNR_INTR_NM)
        .from(LTIS_REPT_OWNR_INFO)
        .leftJoin(LTIS_OWNR_INFO)
        .on(LTIS_REPT_OWNR_INFO.OWNR_SEQ.eq(LTIS_OWNR_INFO.OWNR_SEQ).and(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(LTIS_OWNR_INFO.JUDG_SEQ)))
        .leftJoin(LTIS_REPT_INFO)
        .on(LTIS_REPT_OWNR_INFO.REPT_SEQ.eq(LTIS_REPT_INFO.REPT_SEQ).and(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(LTIS_REPT_OWNR_INFO.JUDG_SEQ)))
        .where(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(judgSeq).and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.notEqual("L")))
        .fetchInto(LTISReptInfo.class);
  }

  /**
   * 소유자별 보상액을 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @param paging  페이지 정보
   * @return 소유자별 보상액
   */
  public List<CompensationAmountByOwnerInfo> findCompensationAmountByOwnerInfo(long judgSeq, AbstractPagingDTO paging) {
    // 토지수
    var landCntTable = dslContext.select(
            LTIS_REPT_OWNR_INFO.OWNR_SEQ
            , count().as("land_cnt")
        ).from(LTIS_REPT_OWNR_INFO)
        .where(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(judgSeq))
        .and(LTIS_REPT_OWNR_INFO.OWNR_INTR_YN.eq("O"))
        .andExists(
            selectOne().from(LTIS_REPT_INFO)
                .where(LTIS_REPT_INFO.JUDG_SEQ.eq(judgSeq))
                .and(LTIS_REPT_INFO.REPT_SEQ.eq(LTIS_REPT_OWNR_INFO.REPT_SEQ))
                .and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.eq("L")))
        .groupBy(LTIS_REPT_OWNR_INFO.OWNR_SEQ)
        .asTable("lend_cnt_table");
    // 지장물수
    var objectCntTable = dslContext.select(
            LTIS_REPT_OWNR_INFO.OWNR_SEQ
            , count().as("object_cnt")
        ).from(LTIS_REPT_OWNR_INFO)
        .where(LTIS_REPT_OWNR_INFO.JUDG_SEQ.eq(judgSeq))
        .and(LTIS_REPT_OWNR_INFO.OWNR_INTR_YN.eq("O"))
        .andExists(
            selectOne().from(LTIS_REPT_INFO)
                .where(LTIS_REPT_INFO.JUDG_SEQ.eq(judgSeq))
                .and(LTIS_REPT_INFO.REPT_SEQ.eq(LTIS_REPT_OWNR_INFO.REPT_SEQ))
                .and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.ne("L")))
        .groupBy(LTIS_REPT_OWNR_INFO.OWNR_SEQ)
        .asTable("object_cnt_table");

    return dslContext.select(
            LTIS_REPT_OWNR_INFO.OWNR_SEQ
            , LTIS_OWNR_INFO.OWNR_INTR_NM
            , landCntTable.field("land_cnt")
            , objectCntTable.field("object_cnt")
            , sum(LTIS_REPT_OWNR_INFO.COMP_AVRG_AMT).as("avg_comp_amt_sum")
            , sum(LTIS_REPT_OWNR_INFO.BEF_AMT).as("biz_oprt_price")
            , sum(LTIS_REPT_OWNR_INFO.FRST_COMP_AMT).as("frst_comp_amt_sum")
            , sum(LTIS_REPT_OWNR_INFO.SECD_COMP_AMT).as("secd_comp_amt_sum")
            , sum(LTIS_REPT_OWNR_INFO.COMP_AVRG_AMT).sub(sum(LTIS_REPT_OWNR_INFO.BEF_AMT)).as("increased_amt_sum")
            , sum(LTIS_REPT_OWNR_INFO.COMP_AVRG_AMT)
                .sub(sum(LTIS_REPT_OWNR_INFO.BEF_AMT))
                .div(sum(LTIS_REPT_OWNR_INFO.BEF_AMT))
                .mul(BigDecimal.valueOf(100)).as("increased_rate")
        )
        .from(LTIS_INFO)
        .innerJoin(LTIS_REPT_INFO).on(LTIS_INFO.JUDG_SEQ.eq(LTIS_REPT_INFO.JUDG_SEQ))
        .innerJoin(LTIS_OWNR_INFO).on(LTIS_INFO.JUDG_SEQ.eq(LTIS_OWNR_INFO.JUDG_SEQ))
        .innerJoin(LTIS_REPT_OWNR_INFO)
        .on(
            LTIS_INFO.JUDG_SEQ.eq(LTIS_REPT_OWNR_INFO.JUDG_SEQ))
        .and(LTIS_OWNR_INFO.OWNR_SEQ.eq(LTIS_REPT_OWNR_INFO.OWNR_SEQ)
            .and(LTIS_REPT_INFO.REPT_SEQ.eq(LTIS_REPT_OWNR_INFO.REPT_SEQ)))
        .leftJoin(landCntTable).on(LTIS_REPT_OWNR_INFO.OWNR_SEQ.eq(landCntTable.field(LTIS_REPT_OWNR_INFO.OWNR_SEQ)))
        .leftJoin(objectCntTable).on(LTIS_REPT_OWNR_INFO.OWNR_SEQ.eq(objectCntTable.field(LTIS_REPT_OWNR_INFO.OWNR_SEQ)))
        .where(LTIS_INFO.JUDG_SEQ.eq(judgSeq))
        .groupBy(LTIS_REPT_OWNR_INFO.OWNR_SEQ)
        .orderBy(LTIS_REPT_OWNR_INFO.OWNR_SEQ)
        .offset(paging.getPage() * paging.getPageSize())
        .limit(paging.getPageSize())
        .fetchInto(CompensationAmountByOwnerInfo.class);
  }

  /**
   * 소유자별 보상액을 전체 카운터 조회
   *
   * @param judgSeq 재결 일련번호
   * @return 소유자별 보상액을 전체 카운터
   */
  public Integer findCompensationAmountByOwnerInfoTotalCount(long judgSeq) {
    return dslContext.selectCount()
        .from(selectOne().from(LTIS_INFO)
            .innerJoin(LTIS_OWNR_INFO).on(LTIS_INFO.JUDG_SEQ.eq(LTIS_OWNR_INFO.JUDG_SEQ))
            .innerJoin(LTIS_REPT_OWNR_INFO).on(LTIS_INFO.JUDG_SEQ.eq(LTIS_REPT_OWNR_INFO.JUDG_SEQ)).and(LTIS_OWNR_INFO.OWNR_SEQ.eq(LTIS_REPT_OWNR_INFO.OWNR_SEQ))
            .where(LTIS_INFO.JUDG_SEQ.eq(judgSeq))
            .groupBy(LTIS_REPT_OWNR_INFO.OWNR_SEQ)
        )
        .fetchOne(0, Integer.class);
  }
}
