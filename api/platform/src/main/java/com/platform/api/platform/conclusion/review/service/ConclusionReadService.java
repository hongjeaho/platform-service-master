package com.platform.api.platform.conclusion.review.service;

import com.platform.api.platform.conclusion.review.dto.ConclusionInfoSearchResponse;
import com.platform.common.base.type.status.ConclusionStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.conclusion.ConclusionContent;
import com.platform.datasource.base.dto.conclusion.ConclusionSearch;
import com.platform.datasource.base.repository.conclusion.review.ConclusionReadRepository;
import com.platform.datasource.base.repository.conclusion.review.ConclusionSearchRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.ConclusionStatusEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class ConclusionReadService {

	private final ConclusionSearchRepository conclusionSearchRepository;
	private final ConclusionReadRepository conclusionReadRepository;


	/**
	 * 목록을  조회 한다.
	 *
	 * @param conclusionSearch 검색조건
	 * @return 검색결과
	 */
	public ConclusionInfoSearchResponse getConclusionList(ConclusionSearch conclusionSearch) {
		return ConclusionInfoSearchResponse.builder()
				.total(conclusionSearchRepository.findTotalSize(conclusionSearch))
				.resultList(conclusionSearchRepository.findPage(conclusionSearch))
				.build();
	}

	/**
	 * 주어진 재결일련번호(judgSeq)를 기반으로 현재 결론 상태 코드를 조회합니다.
	 *
	 * @param judgSeq 재결일련번호
	 * @return 결론 상태 코드 (해당하는 상태 코드가 없을 경우 빈 문자열 반환)
	 */
	public String getConclusionCurrentStatusCodeByJudgSeq(Long judgSeq) {
		return Optional.ofNullable(conclusionReadRepository.findConclusionStatusByJudgSeq(judgSeq))
				.map(ConclusionStatusEntity::getStatusCode)
				.orElse(ConclusionStatusCode.ZERO.getCode());
	}

	/**
	 * 주어진 검토 상태 일련번호(conclusionStatusSeq)와 의견 템플릿 일련번호(opinionTemplateSeq)를 기반으로 결론 내용을 조회하여 반환합니다.
	 *
	 * @param judgSeq            검토 상태 일련번호
	 * @param opinionTemplateSeq 의견 템플릿 일련번호
	 * @return 조회된 결론 내용을 나타내는 ConclusionContent 객체
	 */
	public ConclusionContent getConclusionContent(Long judgSeq, Long opinionTemplateSeq) {
		return conclusionReadRepository.findConclusionContent(judgSeq, opinionTemplateSeq);
	}

	/**
	 * 주어진 재결일련번호(judgSeq)를 기반으로 검트의견 등록 상태를 확인합니다.
	 *
	 * @param judgSeq 재결일련번호
	 * @return 모든 컨트 의견을 등록했다면 true, 등록 하지 않았다면 false
	 */
	public Boolean isAllConclusionContentRegistered(Long judgSeq) {
		return conclusionReadRepository.isAllConclusionContentRegistered(judgSeq);
	}
}