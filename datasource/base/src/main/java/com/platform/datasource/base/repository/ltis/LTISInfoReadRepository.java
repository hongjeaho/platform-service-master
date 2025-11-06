package com.platform.datasource.base.repository.ltis;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.ltis.AppraisalInfo;
import com.platform.datasource.base.dto.ltis.BusinessSummary;
import com.platform.datasource.base.dto.ltis.LTISImplementerInfo;
import java.math.BigDecimal;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JLtisCharge;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JLtisOwnrInfo;
import org.jooq.generated.tables.JLtisReptInfo;
import org.jooq.generated.tables.JLtisReptOwnrInfo;
import org.jooq.generated.tables.JLtisStatus;
import org.jooq.generated.tables.JReceiptBusinessInfo;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class LTISInfoReadRepository {

  private final DSLContext dslContext;
  private final JLtisStatus LTIS_STATUS = JLtisStatus.LTIS_STATUS;
  private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
  private final JReceiptBusinessInfo RECEIPT_BUSINESS_INFO = JReceiptBusinessInfo.RECEIPT_BUSINESS_INFO;
  private final JLtisReptInfo LTIS_REPT_INFO = JLtisReptInfo.LTIS_REPT_INFO;
  private final JLtisOwnrInfo LTIS_OWNR_INFO = JLtisOwnrInfo.LTIS_OWNR_INFO;
  private final JLtisReptOwnrInfo LTIS_REPT_OWNR_INFO = JLtisReptOwnrInfo.LTIS_REPT_OWNR_INFO;
  private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;



  /**
   * 조서 사업 정보를 조회 한다.
   *
   * @param judgSeq 재결 일련번호
   * @return 사업정보
   */
  public BusinessSummary findBusinessSummaryByJudgSeq(Long judgSeq) {
    return dslContext.select(
            LTIS_INFO.CASE_NO,
            LTIS_INFO.CASE_TITLE,
            LTIS_INFO.RECEP_DT,
            LTIS_STATUS.STAT_NM,
            LTIS_INFO.IMPLEMENTER_DT,
            LTIS_STATUS.JUDG_DIV_NM,
            LTIS_INFO.DESSION_CORP,
            LTIS_INFO.CORP_NM,
            LTIS_INFO.ADDRESS,
            RECEIPT_BUSINESS_INFO.SCALE,
            DSL.ifnull(LTIS_STATUS.UPDATED_TIME, LTIS_STATUS.CREATED_TIME).as("UPDATED_TIME")
        ).from(LTIS_STATUS)
        .leftJoin(LTIS_INFO).on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .leftOuterJoin(RECEIPT_BUSINESS_INFO).on(LTIS_STATUS.JUDG_SEQ.eq(RECEIPT_BUSINESS_INFO.JUDG_SEQ))
        .where(LTIS_STATUS.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(BusinessSummary.class);
  }


  /**
   * 감정평가 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 감정평가 정ㅂ보
   */
  public AppraisalInfo findAppraisalInfo(long judgSeq) {
    var appraisalInfo = dslContext.select(
            LTIS_INFO.JUDG_SEQ,
            (LTIS_INFO.FRST_COMP_AMT_SUM.add(LTIS_INFO.SECD_COMP_AMT_SUM)).div(2).as("avg_comp_amt_sum")
        )
        .from(LTIS_INFO)
        .where(LTIS_INFO.JUDG_SEQ.eq(judgSeq))
        .asTable("appraisal_info");

    return dslContext.select(
            LTIS_INFO.FRST_COMP_AMT_SUM,
            LTIS_INFO.SECD_COMP_AMT_SUM,
            LTIS_INFO.BIZ_OPRT_PRICE,
            appraisalInfo.field("avg_comp_amt_sum"),
            Objects.requireNonNull(appraisalInfo.field("avg_comp_amt_sum")).sub(LTIS_INFO.BIZ_OPRT_PRICE).as("increased_amt_sum"),
            Objects.requireNonNull(appraisalInfo.field("avg_comp_amt_sum")).sub(LTIS_INFO.BIZ_OPRT_PRICE).div(LTIS_INFO.BIZ_OPRT_PRICE).mul(BigDecimal.valueOf(100)).as("increased_rate")
        )
        .from(appraisalInfo)
        .leftJoin(LTIS_INFO).on(LTIS_INFO.JUDG_SEQ.eq(appraisalInfo.field(LTIS_INFO.JUDG_SEQ)))
        .fetchOneInto(AppraisalInfo.class);
  }



  /**
   * 조서 사업시행자 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 사업시행자 정보
   */
  public LTISImplementerInfo findImplementerInfo(long judgSeq) {
    return dslContext.select(
            LTIS_CHARGE.IMPLEMENTER_NM,
            LTIS_CHARGE.IMPLEMENTER_PHONE
        )
        .from(LTIS_CHARGE)
        .where(LTIS_CHARGE.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(LTISImplementerInfo.class);
  }

}
