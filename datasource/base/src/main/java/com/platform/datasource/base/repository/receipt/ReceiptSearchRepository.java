package com.platform.datasource.base.repository.receipt;

import static com.platform.datasource.base.util.condition.JooqDateConditionUtil.betweenDateNotNull;
import static com.platform.datasource.base.util.condition.JooqListConditionUtil.inIfNotEmpty;
import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptResult;
import com.platform.datasource.base.dto.receipt.ReceiptSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JLtisCharge;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JLtisStatus;
import org.jooq.generated.tables.JReceiptBusinessInfo;
import org.jooq.generated.tables.JReceiptStatus;
import org.jooq.generated.tables.JSystemCode;
import org.jooq.generated.tables.pojos.LtisInfoEntity;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class ReceiptSearchRepository {

  private final DSLContext dslContext;
  private final JLtisStatus LTIS_STATUS = JLtisStatus.LTIS_STATUS;
  private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
  private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;
  private final JReceiptBusinessInfo RECEIPT_BUSINESS_INFO = JReceiptBusinessInfo.RECEIPT_BUSINESS_INFO;
  private final JSystemCode SYSTEM_CODE = JSystemCode.SYSTEM_CODE;
  private final JReceiptStatus RECEIPT_STATUS = JReceiptStatus.RECEIPT_STATUS;

  /**
   * 재결일련번호로 LTIS  사건 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return LTIS 사건정보 상세
   */
  public LtisInfoEntity findInfoByJudgSeq(Long judgSeq) {
    return dslContext.select(LTIS_INFO.fields())
        .from(LTIS_INFO)
        .where(LTIS_INFO.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(LtisInfoEntity.class);
  }

  /**
   * LTIS 사건 정보 Count
   *
   * @param search 검색조건
   * @return Total Count
   */
  public Integer findTotalSize(ReceiptSearch search) {
    return dslContext.selectCount()
        .from(LTIS_STATUS)
        .leftJoin(LTIS_INFO)
        .on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .leftJoin(LTIS_CHARGE)
        .on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_CHARGE.JUDG_SEQ))
        .leftOuterJoin(RECEIPT_STATUS)
        .on(LTIS_STATUS.JUDG_SEQ.eq(RECEIPT_STATUS.JUDG_SEQ))
        .leftOuterJoin(RECEIPT_BUSINESS_INFO)
        .on(LTIS_STATUS.JUDG_SEQ.eq(RECEIPT_BUSINESS_INFO.JUDG_SEQ))
        .leftOuterJoin(SYSTEM_CODE)
        .on(SYSTEM_CODE.CODE.eq(RECEIPT_STATUS.STATUS_CODE))
        .where(getCondition(search))
        .fetchOne(0, Integer.class);
  }

  /**
   * LTIS 사건 정보 리스트 (페이지)
   *
   * @param search 검색조건
   * @return LTIS 사건 정보
   */
  public List<ReceiptResult> findPage(ReceiptSearch search) {
    return dslContext.select(
            LTIS_STATUS.JUDG_SEQ,
            LTIS_INFO.RECEP_DT,
            LTIS_CHARGE.CHARGE_NM,
            LTIS_INFO.CASE_NO,
            LTIS_INFO.CASE_TITLE,
            LTIS_CHARGE.IMPLEMENTER_NM,
            LTIS_INFO.ADDRESS,
            RECEIPT_STATUS.STATUS_CODE,
            SYSTEM_CODE.CODE_NAME.as("status_name"),
            LTIS_STATUS.STAT_CD.as("ltis_state_code"),
            LTIS_STATUS.STAT_NM.as("ltis_state_name")
        ).from(LTIS_STATUS)
        .leftJoin(LTIS_INFO)
          .on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
        .leftJoin(LTIS_CHARGE)
          .on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_CHARGE.JUDG_SEQ))
        .leftOuterJoin(RECEIPT_STATUS)
          .on(LTIS_STATUS.JUDG_SEQ.eq(RECEIPT_STATUS.JUDG_SEQ))
        .leftOuterJoin(RECEIPT_BUSINESS_INFO)
          .on(LTIS_STATUS.JUDG_SEQ.eq(RECEIPT_BUSINESS_INFO.JUDG_SEQ))
        .leftOuterJoin(SYSTEM_CODE)
          .on(SYSTEM_CODE.CODE.eq(RECEIPT_STATUS.STATUS_CODE))
        .where(getCondition(search))
        .offset(search.getPage() * search.getPageSize())
        .limit(search.getPageSize())
        .fetchInto(ReceiptResult.class);
  }

  /**
   * LTIS 사건 정보 검색 조건을 생성하는 메소드
   * <p>
   * 이 메소드는 사용자가 입력한 검색 조건을 바탕으로 JOOQ Condition 객체를 생성합니다. 생성된 Condition은 LTIS 사건 정보 조회 시 WHERE 절에 사용됩니다.
   * <p>
   * 다음과 같은 검색 조건들이 포함됩니다: 1. 소재지(address) 검색 2. 사건번호(caseNo) 또는 사건명(caseTitle)에 대한 키워드 검색 3. 사업시행자(implementerNm) 검색 4. 접수일(recepDt) 기간 검색 5. 상태 코드(statusCode) 목록 검색
   * <p>
   * 또한 사용자 권한에 따라 검색 범위가 제한됩니다: - 'DECISION' 역할을 가진 사용자는 모든 사건을 볼 수 있습니다. - 그 외 사용자는 자신이 담당하는 사건만 볼 수 있습니다.
   *
   * @param search 검색 조건 객체
   * @return 생성된 JOOQ Condition 객체
   */
  private Condition getCondition(ReceiptSearch search) {

    // 사업 시행자 미접수 코드 제외
    var receiptCodList = search.getStatusCodeList().stream()
        .filter(code -> !"CR001000".equals(code))
        .toList();

    // 사업 시행자 미접수 코드
    var noReceiptCode = search.getStatusCodeList().stream()
        .filter("CR001000"::equals)
        .findFirst().orElse(null);

    // 사업 시행자 미접수 조건
    var noReceiptCodeCondition = noReceiptCode == null ? DSL.noCondition() : RECEIPT_STATUS.STATUS_CODE.isNull();

    var implementerCondition = UserAccountHolder.getRoles()
        .stream()
        .filter(role -> "IMPLEMENTER".equals(role.getRole()))
        .findFirst()
        .map(user -> LTIS_CHARGE.IMPLEMENTER_ID.eq(UserAccountHolder.getUserId()))
        .orElseGet(DSL::noCondition);

    return likeIfNotBlank(LTIS_INFO.ADDRESS, search.getAddress()) // 소재지
        .and(
            likeIfNotBlank(LTIS_INFO.CASE_NO, search.getKeyword()).or(
                likeIfNotBlank(LTIS_INFO.CASE_TITLE, search.getKeyword())
            )
        )
        .and(
            likeIfNotBlank(LTIS_CHARGE.IMPLEMENTER_NM, search.getImplementerNm()) // 사업시행자
        )
        .and(
            betweenDateNotNull(LTIS_INFO.RECEP_DT, search.getStartRecepDt(),
                search.getEndRecepDt()) // 접수일
        )
        .and(inIfNotEmpty(RECEIPT_STATUS.STATUS_CODE, receiptCodList).or(
            noReceiptCodeCondition
        ))
        .and(implementerCondition);
  }
}
