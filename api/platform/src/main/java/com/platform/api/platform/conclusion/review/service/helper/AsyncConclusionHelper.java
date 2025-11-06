package com.platform.api.platform.conclusion.review.service.helper;

import com.platform.common.core.service.PDFService;
import com.platform.common.core.util.pdf.TocEntry;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.conclusion.review.ConclusionBookmarkRepository;
import com.platform.datasource.base.repository.conclusion.review.ConclusionReadRepository;
import com.platform.datasource.base.repository.conclusion.review.ConclusionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.ConclusionStatusEntity;
import org.jooq.generated.tables.pojos.FileEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class AsyncConclusionHelper {

	private final PDFService pdfService;
	private final ConclusionBookmarkRepository conclusionBookmarkRepository;
	private final ConclusionReadRepository conclusionReadRepository;
	private final ConclusionRepository conclusionRepository;

	@Async("pdfTaskExecutor")
	public void convertPdfToJpgAsync(FileEntity fileEntity, ConclusionStatusEntity conclusionStatus, Long opinionTemplateSeq) {
		try {
			int pageLength = pdfService.pdfToJpgConvertReturnPageLength(fileEntity, opinionTemplateSeq);

			var conclusionContent = conclusionReadRepository.findConclusionContent(conclusionStatus.getJudgSeq(), opinionTemplateSeq);
			conclusionContent.setConclusionFileSeq(fileEntity.getSeq());
			conclusionContent.setConclusionFilePageLength(pageLength);

			conclusionRepository.insertOrUpdateConclusionContent(conclusionStatus.getSeq(), opinionTemplateSeq, conclusionContent);
		} catch (Exception e) {
			throw new IllegalStateException("PDF 이미지 변환 중 오류가 발생했습니다", e);
		}
	}

	@Async("pdfTaskExecutor")
	public void extractTableOfContentsAsync(FileEntity fileEntity, ConclusionStatusEntity conclusionStatus, Long opinionTemplateSeq) {
		List<TocEntry> tocEntries = pdfService.getPDFExtractTableOfContents(fileEntity);

		conclusionBookmarkRepository.removeConclusionBookMark(conclusionStatus.getSeq());
		insertConclusionBookMark(conclusionStatus.getSeq(), opinionTemplateSeq, tocEntries, null);
	}

	/**
	 * 재결관 의견 북마크를 삽입하는 메서드입니다. 주어진 목차 엔트리 목록을 순회하며 북마크를 생성하고, 자식 목차 정보를 재귀적으로 처리합니다.
	 *
	 * @param conclusionStatusSeq         재결일련번호
	 * @param opinionTemplateSeq          의견 템플릿 일련번호
	 * @param tocEntries                  북마크 생성에 사용할 목차 엔트리 리스트
	 * @param parentConclusionBookmarkSeq 부모 북마크 일련번호 (최상위 북마크의 경우 null)
	 */
	private void insertConclusionBookMark(Long conclusionStatusSeq, Long opinionTemplateSeq, List<TocEntry> tocEntries, Long parentConclusionBookmarkSeq) {
		tocEntries.forEach(tocEntry -> {
			var seq = conclusionBookmarkRepository.insertConclusionBookmark(conclusionStatusSeq, opinionTemplateSeq, tocEntry.ofConclusionBookmarkEntity(), parentConclusionBookmarkSeq);

			if (!tocEntry.getChildren().isEmpty()) {
				insertConclusionBookMark(conclusionStatusSeq, opinionTemplateSeq, tocEntry.getChildren(), seq);
			}
		});
	}
}
