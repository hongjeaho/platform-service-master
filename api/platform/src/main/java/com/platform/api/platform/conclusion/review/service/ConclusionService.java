package com.platform.api.platform.conclusion.review.service;

import com.platform.api.platform.conclusion.review.service.helper.AsyncConclusionHelper;
import com.platform.common.base.type.FileTypeCode;
import com.platform.common.base.type.status.ConclusionStatusCode;
import com.platform.common.core.service.FileService;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.conclusion.ConclusionContent;
import com.platform.datasource.base.repository.conclusion.review.ConclusionBookmarkRepository;
import com.platform.datasource.base.repository.conclusion.review.ConclusionReadRepository;
import com.platform.datasource.base.repository.conclusion.review.ConclusionRepository;
import com.platform.datasource.base.repository.ltis.LTISReadRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 결론 관련 비즈니스 로직을 처리하는 서비스 클래스입니다. 검토 프로세스의 시작, 결론 내용 관리, 완료 등의 기능을 제공합니다.
 */
@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class ConclusionService {

	private final LTISReadRepository ltisReadRepository;
	private final ConclusionRepository conclusionRepository;
	private final ConclusionReadRepository conclusionReadRepository;
	private final ConclusionBookmarkRepository conclusionBookmarkRepository;

	private final FileService fileService;
	private final AsyncConclusionHelper asyncConclusionHelper;

	/**
	 * 검토 프로세스를 시작하는 메서드입니다.
	 *
	 * @param judgSeq 재결일련번호
	 */
	public void startConclusion(Long judgSeq) {
		conclusionRepository.insertConclusionStart(judgSeq);
	}

	/**
	 * 주어진 재결일련번호(judgSeq)와 의견 템플릿 일련번호(opinionTemplateSeq)를 바탕으로 결론 내용을 삽입하거나 업데이트하는 메서드입니다.
	 *
	 * @param judgSeq            재결일련번호
	 * @param opinionTemplateSeq 의견 템플릿 일련번호
	 * @param conclusionContent  결론 내용 데이터 객체
	 * @throws Exception 결론 내용을 삽입 또는 업데이트하는 과정에서 발생할 수 있는 모든 예외
	 */
	public void insertOrUpdateConclusionContent(Long judgSeq, Long opinionTemplateSeq, ConclusionContent conclusionContent) throws Exception {
		var ltisInfo = ltisReadRepository.findLtisInfoByJudgSeq(judgSeq);
		var conclusionStatus = Optional.ofNullable(conclusionReadRepository.findConclusionStatusByJudgSeq(judgSeq))
				.orElseThrow(() -> new IllegalArgumentException("해당 재결일련번호에 대한 검토 상태가 존재하지 않습니다: " + judgSeq));

		if (conclusionContent.getAttachment() != null) {
			var attachment = conclusionContent.getAttachment();
			var fileSeq = fileService.upload(ltisInfo.getCaseNo(), FileTypeCode.CONCLUSION_OPINION_FILE_UPLOAD, attachment.getFile());
			var fileEntity = fileService.findFileBySeq(fileSeq);

			asyncConclusionHelper.convertPdfToJpgAsync(fileEntity, conclusionStatus, opinionTemplateSeq);
			asyncConclusionHelper.extractTableOfContentsAsync(fileEntity, conclusionStatus, opinionTemplateSeq);
		} else if (conclusionContent.getConclusionFileSeq() == null) {
			conclusionBookmarkRepository.removeConclusionBookMark(conclusionContent.getConclusionStatusSeq());
		}

		conclusionRepository.insertOrUpdateConclusionContent(conclusionStatus.getSeq(), opinionTemplateSeq, conclusionContent);
	}


	/**
	 * 검토 프로세스를 완료하는 메서드입니다.
	 *
	 * @param judgSeq 재결일련번호
	 */
	public void completeConclusion(Long judgSeq) {
		conclusionRepository.updateConclusionStatus(judgSeq, ConclusionStatusCode.COMPLETE.getCode());
	}

}
