package com.platform.datasource.base.repository.conclusion.review;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.conclusion.ConclusionContent;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JConclusionContent;
import org.jooq.generated.tables.JConclusionStatus;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.JOpinionCaseComment;
import org.jooq.generated.tables.JOpinionCaseTemplate;
import org.jooq.generated.tables.pojos.ConclusionStatusEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class ConclusionReadRepository {

	private final DSLContext dslContext;
	private final JConclusionStatus CONCLUSION_STATUS = JConclusionStatus.CONCLUSION_STATUS;
	private final JConclusionContent CONCLUSION_CONTENT = JConclusionContent.CONCLUSION_CONTENT;
	private final JFile FILE = JFile.FILE;
	private final JOpinionCaseTemplate OPINION_CASE_TEMPLATE = JOpinionCaseTemplate.OPINION_CASE_TEMPLATE;
	private final JOpinionCaseComment OPINION_CASE_COMMENT = JOpinionCaseComment.OPINION_CASE_COMMENT;

	/**
	 * 주어진 재결일련번호(judgSeq)를 기준으로 검토 상태를 조회합니다.
	 *
	 * @param judgSeq 재결일련번호
	 * @return 주어진 재결일련번호에 해당하는 검토 상태를 나타내는 ConclusionStatusEntity 객체
	 */
	public ConclusionStatusEntity findConclusionStatusByJudgSeq(Long judgSeq) {
		return dslContext.select(CONCLUSION_STATUS.fields())
				.from(CONCLUSION_STATUS)
				.where(CONCLUSION_STATUS.JUDG_SEQ.eq(judgSeq))
				.fetchOneInto(ConclusionStatusEntity.class);
	}

	/**
	 * 주어진 결론 상태 일련번호(conclusionStatusSeq)와 의견 템플릿 일련번호(opinionTemplateSeq)를 기준으로 결론 내용을 조회합니다.
	 *
	 * @param judgSeq            재결 일련번호
	 * @param opinionTemplateSeq 의견 템플릿 일련번호
	 * @return 주어진 조건에 해당하는 결론 내용을 나타내는 ConclusionContentEntity 객체
	 */
	public ConclusionContent findConclusionContent(Long judgSeq, Long opinionTemplateSeq) {
		return dslContext.select(
						CONCLUSION_CONTENT.CONCLUSION_STATUS_SEQ,
						CONCLUSION_CONTENT.OPINION_TEMPLATE_SEQ,
						CONCLUSION_CONTENT.PRECEDENT_CONTENT,
						CONCLUSION_CONTENT.DECREE_CONTENT,
						CONCLUSION_CONTENT.OPINION_CONTENT,
						CONCLUSION_CONTENT.CONCLUSION_FILE_SEQ,
						FILE.ORIGINAL_FILE_NAME
				)
				.from(CONCLUSION_STATUS)
				.join(CONCLUSION_CONTENT).on(CONCLUSION_CONTENT.CONCLUSION_STATUS_SEQ.eq(CONCLUSION_STATUS.SEQ))
				.leftOuterJoin(FILE).on(CONCLUSION_CONTENT.CONCLUSION_FILE_SEQ.eq(FILE.SEQ))
				.where(CONCLUSION_STATUS.JUDG_SEQ.eq(judgSeq).and(CONCLUSION_CONTENT.OPINION_TEMPLATE_SEQ.eq(opinionTemplateSeq)))
				.fetchOneInto(ConclusionContent.class);
	}

	/**
	 * 주어진 재결일련번호(judgSeq)에 대해 모든 검토 의견 내용이 등록되었는지 확인합니다. opinion_case_comment 테이블에 있는 opinion_case_template_seq 수만큼 모두 conclusion_content 테이블이 등록 되어야 합니다.
	 *
	 * @param judgSeq 재결일련번호
	 * @return 모든 검토 의견 내용이 등록되었으면 true, 그렇지 않으면 false
	 */
	public Boolean isAllConclusionContentRegistered(Long judgSeq) {
		// 1. 해당 재결에 대한 검토 상태 일련번호 조회
		ConclusionStatusEntity conclusionStatus = findConclusionStatusByJudgSeq(judgSeq);
		if (conclusionStatus == null) {
			return false;
		}

		// 2. 사업시행의 의견 일련번호를 조회 한다.
		var opinionTemplateSeqList = dslContext
				.selectDistinct(OPINION_CASE_TEMPLATE.SEQ)
				.from(OPINION_CASE_COMMENT)
				.join(OPINION_CASE_TEMPLATE).on(OPINION_CASE_COMMENT.OPINION_CASE_TEMPLATE_SEQ.eq(OPINION_CASE_TEMPLATE.SEQ))
				.where(OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(judgSeq))
				.fetchInto(Long.class);

		// 3. 재결관이 등록한 의견 일련본호를 조회 한다.
		var conclusionOpinionList = dslContext.select(CONCLUSION_CONTENT.OPINION_TEMPLATE_SEQ)
				.from(CONCLUSION_STATUS)
				.join(CONCLUSION_CONTENT).on(CONCLUSION_CONTENT.CONCLUSION_STATUS_SEQ.eq(CONCLUSION_STATUS.SEQ))
				.where(CONCLUSION_STATUS.JUDG_SEQ.eq(judgSeq).and(CONCLUSION_CONTENT.OPINION_TEMPLATE_SEQ.in(opinionTemplateSeqList)))
				.fetchInto(Long.class);

		return opinionTemplateSeqList.size() == conclusionOpinionList.size();
	}
}
