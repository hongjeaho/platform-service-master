package com.platform.datasource.base.repository.conclusion.review;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.common.base.type.status.ConclusionStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.conclusion.ConclusionContent;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JConclusionContent;
import org.jooq.generated.tables.JConclusionStatus;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class ConclusionRepository {

	private final DSLContext dslContext;
	private final JConclusionStatus CONCLUSION_STATUS = JConclusionStatus.CONCLUSION_STATUS;
	private final JConclusionContent CONCLUSION_CONTENT = JConclusionContent.CONCLUSION_CONTENT;

	/**
	 * 검토 시작 상태를 삽입하거나, 기존 값이 존재할 경우 업데이트하는 메서드입니다.
	 *
	 * @param judgSeq 재결일련번호
	 */
	public void insertConclusionStart(long judgSeq) {
		dslContext.insertInto(CONCLUSION_STATUS,
						CONCLUSION_STATUS.JUDG_SEQ,
						CONCLUSION_STATUS.STATUS_CODE,
						CONCLUSION_STATUS.CREATED_BY,
						CONCLUSION_STATUS.CREATED_TIME
				)
				.values(
						judgSeq,
						ConclusionStatusCode.START.getCode(),
						UserAccountHolder.getSeqNo(),
						LocalDateTime.now()
				).onDuplicateKeyUpdate()
				.set(CONCLUSION_STATUS.STATUS_CODE, ConclusionStatusCode.START.getCode())
				.set(CONCLUSION_STATUS.UPDATED_BY, UserAccountHolder.getSeqNo())
				.set(CONCLUSION_STATUS.UPDATED_TIME, LocalDateTime.now())
				.execute();
	}

	/**
	 * 검토 상태 코드를 업데이트하는 메서드입니다.
	 *
	 * @param judgSeq    재결일련번호
	 * @param statusCode 업데이트할 상태 코드
	 */
	public void updateConclusionStatus(long judgSeq, String statusCode) {
		dslContext.update(CONCLUSION_STATUS)
				.set(CONCLUSION_STATUS.STATUS_CODE, statusCode)
				.set(CONCLUSION_STATUS.UPDATED_BY, UserAccountHolder.getSeqNo())
				.set(CONCLUSION_STATUS.UPDATED_TIME, LocalDateTime.now())
				.where(CONCLUSION_STATUS.JUDG_SEQ.eq(judgSeq))
				.execute();
	}

	/**
	 * 재결 내용 데이터를 삽입하거나 업데이트하는 메서드입니다.
	 *
	 * @param conclusionStatusSeq 검토마스터일련번호
	 * @param opinionTemplateSeq  의견템플릿 일련번호
	 * @param conclusionContent   삽입하거나 업데이트할 재결 내용 엔터티
	 */
	public void insertOrUpdateConclusionContent(Long conclusionStatusSeq, Long opinionTemplateSeq, ConclusionContent conclusionContent) {
		dslContext.insertInto(CONCLUSION_CONTENT,
						CONCLUSION_CONTENT.CONCLUSION_STATUS_SEQ,
						CONCLUSION_CONTENT.OPINION_TEMPLATE_SEQ,
						CONCLUSION_CONTENT.DECREE_CONTENT,
						CONCLUSION_CONTENT.PRECEDENT_CONTENT,
						CONCLUSION_CONTENT.OPINION_CONTENT,
						CONCLUSION_CONTENT.CONCLUSION_FILE_SEQ,
						CONCLUSION_CONTENT.CONCLUSION_FILE_PAGE_LENGTH,
						CONCLUSION_CONTENT.CREATED_BY,
						CONCLUSION_CONTENT.CREATED_TIME
				).values(
						conclusionStatusSeq,
						opinionTemplateSeq,
						conclusionContent.getDecreeContent(),
						conclusionContent.getPrecedentContent(),
						conclusionContent.getOpinionContent(),
						conclusionContent.getConclusionFileSeq(),
						conclusionContent.getConclusionFilePageLength(),
						UserAccountHolder.getSeqNo(),
						LocalDateTime.now()
				).onDuplicateKeyUpdate()
				.set(CONCLUSION_CONTENT.DECREE_CONTENT, conclusionContent.getDecreeContent())
				.set(CONCLUSION_CONTENT.PRECEDENT_CONTENT, conclusionContent.getPrecedentContent())
				.set(CONCLUSION_CONTENT.OPINION_CONTENT, conclusionContent.getOpinionContent())
				.set(CONCLUSION_CONTENT.CONCLUSION_FILE_SEQ, conclusionContent.getConclusionFileSeq())
				.set(CONCLUSION_CONTENT.CONCLUSION_FILE_PAGE_LENGTH, conclusionContent.getConclusionFilePageLength())
				.set(CONCLUSION_CONTENT.UPDATED_BY, UserAccountHolder.getSeqNo())
				.set(CONCLUSION_CONTENT.UPDATED_TIME, LocalDateTime.now())
				.where(CONCLUSION_CONTENT.CONCLUSION_STATUS_SEQ.eq(conclusionStatusSeq).and(CONCLUSION_CONTENT.OPINION_TEMPLATE_SEQ.eq(opinionTemplateSeq)))
				.execute();
	}
}
