package com.platform.api.platform.opinion.application.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.opinioin.OpinionCaseTemplateCommit;
import com.platform.datasource.base.repository.opinion.OpinionCaseReadRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.OpinionTemplateEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class OpinionCaseTemplateReadService {

  private final OpinionCaseReadRepository opinionCaseReadRepository;

  /**
   * 사업 시행자 의견 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 사업 시행자 의견 정보
   */
  public List<OpinionCaseTemplateCommit> getOpinionCaseTemplateCommitList(long judgSeq) {
    var commitList = opinionCaseReadRepository.findOpinionTemplateCommentByJudgSeq(judgSeq);
    return commitList;
  }

  /**
   * 검토 상태별 의견 템플릿 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 의견 템플릿 정보 리스트
   */
  public List<OpinionTemplateEntity> getOpinionTemplateList(long judgSeq) {
    return opinionCaseReadRepository.getOpinionTemplateList(judgSeq);
  }
}