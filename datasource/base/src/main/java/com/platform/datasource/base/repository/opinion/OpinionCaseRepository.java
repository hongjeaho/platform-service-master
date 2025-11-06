package com.platform.datasource.base.repository.opinion;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JOpinionCaseComment;
import org.jooq.generated.tables.JOpinionCaseTemplate;
import org.jooq.generated.tables.pojos.OpinionCaseCommentEntity;
import org.jooq.generated.tables.pojos.OpinionCaseTemplateEntity;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class OpinionCaseRepository {

  private final DSLContext dslContext;
  private final JOpinionCaseTemplate OPINION_CASE_TEMPLATE = JOpinionCaseTemplate.OPINION_CASE_TEMPLATE;
  private final JOpinionCaseComment OPINION_CASE_COMMENT = JOpinionCaseComment.OPINION_CASE_COMMENT;

  /**
   * 의견 템플릿 등록
   *
   * @param opinionCaseTemplateEntity 의견 템플릿 정보
   * @return 의견 템플릿 일련번호
   */
  public Long insertInsertOpinionCase(OpinionCaseTemplateEntity opinionCaseTemplateEntity) {
    return dslContext.insertInto(OPINION_CASE_TEMPLATE,
            OPINION_CASE_TEMPLATE.JUDG_SEQ,
            OPINION_CASE_TEMPLATE.OPINION_TEMPLATE_SEQ,
            OPINION_CASE_TEMPLATE.OPINION_FILE_SEQ,
            OPINION_CASE_TEMPLATE.CREATED_BY,
            OPINION_CASE_TEMPLATE.CREATED_TIME
        )
        .values(
            opinionCaseTemplateEntity.getJudgSeq(),
            opinionCaseTemplateEntity.getOpinionTemplateSeq(),
            opinionCaseTemplateEntity.getOpinionFileSeq(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).returningResult(OPINION_CASE_TEMPLATE.SEQ)
        .fetchOneInto(Long.class);
  }

  /**
   * 의견 템플릿 파일 일련번호를 업데이트한다.
   *
   * @param opinionCaseTemplateSeq 의견 템플릿 일련번호
   * @param opinionFileSeq          의견 파일 일련번호
   */
  public void updateOpinionCaseTemplateFileSeq(Long opinionCaseTemplateSeq, Long opinionFileSeq) {
    dslContext.update(OPINION_CASE_TEMPLATE)
        .set(OPINION_CASE_TEMPLATE.OPINION_FILE_SEQ, opinionFileSeq)
        .set(OPINION_CASE_TEMPLATE.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(OPINION_CASE_TEMPLATE.UPDATED_TIME, LocalDateTime.now())
        .where(OPINION_CASE_TEMPLATE.SEQ.eq(opinionCaseTemplateSeq))
        .execute();
  }

  /**
   * 의견 등록
   *
   * @param opinionCaseTemplateSeq 의견 템플릿 일련번호
   * @param opinionCaseCommentList 의견 정보
   */
  public void insertOpinionCaseComment(long opinionCaseTemplateSeq, List<OpinionCaseCommentEntity> opinionCaseCommentList) {
    var rows = opinionCaseCommentList.stream()
        .map(opinionCaseComment -> DSL.row(
            opinionCaseTemplateSeq,
            opinionCaseComment.getJudgTarget(),
            opinionCaseComment.getImplementerComment(),
            opinionCaseComment.getOwnerComment(),
            opinionCaseComment.getOpinionCaseCommentOrder(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        )).toList();

    //  의견 정보 저장
    dslContext.insertInto(OPINION_CASE_COMMENT,
            OPINION_CASE_COMMENT.OPINION_CASE_TEMPLATE_SEQ,
            OPINION_CASE_COMMENT.JUDG_TARGET,
            OPINION_CASE_COMMENT.IMPLEMENTER_COMMENT,
            OPINION_CASE_COMMENT.OWNER_COMMENT,
            OPINION_CASE_COMMENT.OPINION_CASE_COMMENT_ORDER,
            OPINION_CASE_COMMENT.CREATED_BY,
            OPINION_CASE_COMMENT.CREATED_TIME
        ).valuesOfRows(rows)
        .execute();
  }

  /**
   * 의견을 삭제한다.
   *
   * @param judgSeq            재결일련번호
   * @param opinionCaseTemplateSeq 의견 마스터 일련번호
   */
  public void deleteOpinionTemplateCommentByOpinionCaseTemplateSeq(long judgSeq, long opinionCaseTemplateSeq) {
    dslContext.deleteFrom(OPINION_CASE_COMMENT)
        .where(OPINION_CASE_COMMENT.OPINION_CASE_TEMPLATE_SEQ.eq(opinionCaseTemplateSeq)
            .andExists(
              DSL.selectOne()
                  .from(OPINION_CASE_TEMPLATE)
                  .where(OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(judgSeq)
                      .and(OPINION_CASE_TEMPLATE.SEQ.eq(opinionCaseTemplateSeq))
                  )
            )
        )
        .execute();
  }

  /**
   * 의견 템플릿을 삭제한다.
   *
   * @param judgSeq 재결일련번호
   * @param opinionCaseTemplateSeq 의견 마스터 일련번호
   */
  public void deleteOpinionTemplateByOpinionCaseTemplateSeq(long judgSeq, long opinionCaseTemplateSeq) {
    dslContext.deleteFrom(OPINION_CASE_TEMPLATE)
        .where(OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(judgSeq)
            .and(OPINION_CASE_TEMPLATE.SEQ.eq(opinionCaseTemplateSeq)))
        .execute();
  }
}