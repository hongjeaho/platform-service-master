package com.platform.datasource.base.repository.conclusion.review;

import static com.platform.datasource.base.util.condition.JooqDateConditionUtil.betweenDateNotNull;
import static com.platform.datasource.base.util.condition.JooqListConditionUtil.inIfNotEmpty;
import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.common.base.type.status.ReceiptStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.conclusion.ConclusionResult;
import com.platform.datasource.base.dto.conclusion.ConclusionSearch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JConclusionStatus;
import org.jooq.generated.tables.JLtisCharge;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JLtisStatus;
import org.jooq.generated.tables.JReceiptBusinessInfo;
import org.jooq.generated.tables.JReceiptStatus;
import org.jooq.generated.tables.JSystemCode;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class ConclusionSearchRepository {

	private final DSLContext dslContext;
	private final JLtisStatus LTIS_STATUS = JLtisStatus.LTIS_STATUS;
	private final JReceiptBusinessInfo RECEIPT_BUSINESS_INFO = JReceiptBusinessInfo.RECEIPT_BUSINESS_INFO;
	private final JSystemCode SYSTEM_CODE = JSystemCode.SYSTEM_CODE;
	private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
	private final JLtisCharge LTIS_CHARGE = JLtisCharge.LTIS_CHARGE;
	private final JConclusionStatus CONCLUSION_STATUS = JConclusionStatus.CONCLUSION_STATUS;
	private final JReceiptStatus RECEIPT_STATUS = JReceiptStatus.RECEIPT_STATUS;

	/**
	 * 검토 접수 리스트 Count
	 *
	 * @param conclusionSearch 검색조건
	 * @return Total Count
	 */
	public Integer findTotalSize(ConclusionSearch conclusionSearch) {
		return dslContext.selectCount()
				.from(RECEIPT_STATUS)
				.join(RECEIPT_BUSINESS_INFO)
				.on(RECEIPT_STATUS.JUDG_SEQ.eq(RECEIPT_BUSINESS_INFO.JUDG_SEQ))
				.join(LTIS_STATUS)
				.on(RECEIPT_BUSINESS_INFO.JUDG_SEQ.eq(LTIS_STATUS.JUDG_SEQ))
				.leftOuterJoin(CONCLUSION_STATUS)
				.on(RECEIPT_BUSINESS_INFO.JUDG_SEQ.eq(CONCLUSION_STATUS.JUDG_SEQ))
				.leftJoin(LTIS_INFO)
				.on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
				.leftJoin(LTIS_CHARGE)
				.on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_CHARGE.JUDG_SEQ))
				.leftOuterJoin(SYSTEM_CODE)
				.on(SYSTEM_CODE.CODE.eq(CONCLUSION_STATUS.STATUS_CODE))
				.where(getCondition(conclusionSearch))
				.fetchOne(0, Integer.class);
	}

	/**
	 * 검토 정보 리스트 (페이지)
	 *
	 * @param conclusionSearch 검색조건
	 * @return 검토 정보 리스트
	 */
	public List<ConclusionResult> findPage(ConclusionSearch conclusionSearch) {
		return dslContext.select(
						RECEIPT_BUSINESS_INFO.JUDG_SEQ,
						LTIS_INFO.CASE_NO,
						LTIS_INFO.CASE_TITLE,
						LTIS_CHARGE.CHARGE_NM,
						CONCLUSION_STATUS.STATUS_CODE,
						DSL.nvl(SYSTEM_CODE.CODE_NAME, "검토 대기").as("status_name"),
						LTIS_STATUS.STAT_CD.as("ltis_stat_code"),
						LTIS_STATUS.STAT_NM.as("ltis_stat_name")
				).from(RECEIPT_STATUS)
				.join(RECEIPT_BUSINESS_INFO)
				.on(RECEIPT_STATUS.JUDG_SEQ.eq(RECEIPT_BUSINESS_INFO.JUDG_SEQ))
				.join(LTIS_STATUS)
				.on(RECEIPT_BUSINESS_INFO.JUDG_SEQ.eq(LTIS_STATUS.JUDG_SEQ))
				.leftOuterJoin(CONCLUSION_STATUS)
				.on(RECEIPT_BUSINESS_INFO.JUDG_SEQ.eq(CONCLUSION_STATUS.JUDG_SEQ))
				.leftJoin(LTIS_INFO).on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_INFO.JUDG_SEQ))
				.leftJoin(LTIS_CHARGE).on(LTIS_STATUS.JUDG_SEQ.eq(LTIS_CHARGE.JUDG_SEQ))
				.leftOuterJoin(SYSTEM_CODE).on(SYSTEM_CODE.CODE.eq(CONCLUSION_STATUS.STATUS_CODE))
				.where(getCondition(conclusionSearch))
				.offset(conclusionSearch.getPage() * conclusionSearch.getPageSize())
				.limit(conclusionSearch.getPageSize())
				.fetchInto(ConclusionResult.class);
	}


	private Condition getCondition(ConclusionSearch conclusionSearch) {

		var condition = (
				likeIfNotBlank(LTIS_INFO.CASE_NO, conclusionSearch.getKeyword()).or(
						likeIfNotBlank(LTIS_INFO.CASE_TITLE, conclusionSearch.getKeyword())
				)
		).and(
				betweenDateNotNull(LTIS_INFO.RECEP_DT, conclusionSearch.getStartRecepDt(), conclusionSearch.getEndRecepDt()) // 접수일
		).and(
				RECEIPT_STATUS.STATUS_CODE.in(ReceiptStatusCode.DECISION_START.getCode())
		);

		// 검토 대기 상태 처리를 위한 조건 추가
		if (conclusionSearch.getStatusCodeList() != null && !conclusionSearch.getStatusCodeList().isEmpty()) {
			boolean includesWaitingStatus = conclusionSearch.getStatusCodeList().contains("CC001000");

			if (includesWaitingStatus) {
				// 검토 대기(빈 문자열) 포함: NULL 값 또는 리스트의 값과 일치하는 경우
				condition = condition.and(
						CONCLUSION_STATUS.STATUS_CODE.isNull()
								.or(inIfNotEmpty(CONCLUSION_STATUS.STATUS_CODE, conclusionSearch.getStatusCodeList()))
				);
			} else {
				// 검토 대기 미포함: 리스트의 값과 일치하는 경우만
				condition = condition.and(
						inIfNotEmpty(CONCLUSION_STATUS.STATUS_CODE, conclusionSearch.getStatusCodeList())
				);
			}
		}

		return condition;
	}
}
