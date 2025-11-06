package com.platform.datasource.base.repository.conclusion.review;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JConclusionBookmark;
import org.jooq.generated.tables.pojos.ConclusionBookmarkEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class ConclusionBookmarkRepository {

	private final DSLContext dslContext;
	private final JConclusionBookmark CONCLUSION_BOOKMARK = JConclusionBookmark.CONCLUSION_BOOKMARK;

	/**
	 * 주어진 재결 상태 시퀀스, 의견 템플릿 시퀀스, 결론 북마크 데이터를 기반으로 결론 북마크를 데이터베이스에 삽입합니다.
	 *
	 * @param conclusionStatusSeq 재결 상태 시퀀스 (judgSeq - 재결일련번호)
	 * @param opinionTemplateSeq  의견 템플릿 시퀀스
	 * @param conclusionBookmark  삽입할 결론 북마크 엔터티 객체
	 * @return 생성된 결론 북마크의 시퀀스 번호 반환
	 */
	public Long insertConclusionBookmark(Long conclusionStatusSeq, Long opinionTemplateSeq, ConclusionBookmarkEntity conclusionBookmark, Long parentConclusionBookmarkSeq) {
		return dslContext.insertInto(CONCLUSION_BOOKMARK,
						CONCLUSION_BOOKMARK.CONCLUSION_STATUS_SEQ,
						CONCLUSION_BOOKMARK.OPINION_TEMPLATE_SEQ,
						CONCLUSION_BOOKMARK.BOOKMARK_NAME,
						CONCLUSION_BOOKMARK.BOOKMARK_NUMBER,
						CONCLUSION_BOOKMARK.DEPTH,
						CONCLUSION_BOOKMARK.PARENT_CONCLUSION_BOOKMARK_SEQ,
						CONCLUSION_BOOKMARK.CREATED_BY,
						CONCLUSION_BOOKMARK.CREATED_TIME
				).values(
						conclusionStatusSeq,
						opinionTemplateSeq,
						conclusionBookmark.getBookmarkName(),
						conclusionBookmark.getBookmarkNumber(),
						conclusionBookmark.getDepth(),
						parentConclusionBookmarkSeq,
						UserAccountHolder.getSeqNo(),
						LocalDateTime.now()
				).returningResult(CONCLUSION_BOOKMARK.SEQ)
				.fetchOneInto(Long.class);
	}

	/**
	 * 주어진 검토 상태 일련번호(conclusionStatusSeq)를 기반으로 데이터베이스에서 검토 북마크를 삭제하는 메서드입니다.
	 *
	 * @param conclusionStatusSeq 결론 상태 시퀀스 (judgSeq - 재결일련번호)
	 */
	public void removeConclusionBookMark(Long conclusionStatusSeq) {
		dslContext.deleteFrom(CONCLUSION_BOOKMARK)
				.where(CONCLUSION_BOOKMARK.CONCLUSION_STATUS_SEQ.eq(conclusionStatusSeq))
				.execute();
	}
}
