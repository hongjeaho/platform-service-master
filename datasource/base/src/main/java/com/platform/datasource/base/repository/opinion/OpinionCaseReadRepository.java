package com.platform.datasource.base.repository.opinion;

import static org.jooq.impl.DSL.row;
import static org.jooq.impl.DSL.select;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.opinioin.OpinionCaseTemplate;
import com.platform.datasource.base.dto.opinioin.OpinionCaseTemplateCommit;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.JOpinionCaseComment;
import org.jooq.generated.tables.JOpinionCaseTemplate;
import org.jooq.generated.tables.JOpinionTemplate;
import org.jooq.generated.tables.pojos.OpinionCaseCommentEntity;
import org.jooq.generated.tables.pojos.OpinionCaseTemplateEntity;
import org.jooq.generated.tables.pojos.OpinionTemplateEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class OpinionCaseReadRepository {

  private final DSLContext dslContext;
  private final JOpinionCaseTemplate OPINION_CASE_TEMPLATE = JOpinionCaseTemplate.OPINION_CASE_TEMPLATE;
  private final JOpinionCaseComment OPINION_CASE_COMMENT = JOpinionCaseComment.OPINION_CASE_COMMENT;
  private final JOpinionTemplate OPINION_TEMPLATE = JOpinionTemplate.OPINION_TEMPLATE;
  private final JFile FILE = JFile.FILE;

  /**
   * 사업시행자 의견 템플릿 정보를 조회한다.
   *
   * @param judgSeq            재졀일련번호
   * @param opinionCaseTemplateSeq 의견마스터 일련번호
   * @return 사업시행자 의견 템플릿 정보
   */
  public OpinionCaseTemplateEntity findImplementerTemplateByOpinionCaseTemplateSeq(long judgSeq, long opinionCaseTemplateSeq) {
    return dslContext.select(OPINION_CASE_TEMPLATE.fields()).from(OPINION_CASE_TEMPLATE)
        .where(
            OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(judgSeq).and(OPINION_CASE_TEMPLATE.SEQ.eq(opinionCaseTemplateSeq))
        ).fetchOneInto(OpinionCaseTemplateEntity.class);
  }

  /**
   * 사업시행자 의견 템플릿 리스트를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 사업시행자 의견 템플릿 리스트
   */
  public List<OpinionCaseTemplateEntity> findImplementerTemplateByJudgSeq(long judgSeq) {
    return dslContext.select(OPINION_CASE_TEMPLATE.fields()).from(OPINION_CASE_TEMPLATE)
        .where(
            OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(judgSeq)
        ).fetchInto(OpinionCaseTemplateEntity.class);
  }

  /**
   * 사업시행자 의견 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 사업시행자 의견 정보
   */
  public List<OpinionCaseTemplateCommit> findOpinionTemplateCommentByJudgSeq(long judgSeq) {
    var templateMap = dslContext.select(
            row(OPINION_CASE_TEMPLATE.SEQ,
                OPINION_CASE_TEMPLATE.JUDG_SEQ,
                OPINION_CASE_TEMPLATE.OPINION_TEMPLATE_SEQ,
                OPINION_TEMPLATE.TEMPLATE_NAME,
                OPINION_TEMPLATE.TEMPLATE_REQUIRED,
                OPINION_CASE_TEMPLATE.OPINION_FILE_SEQ,
                FILE.ORIGINAL_FILE_NAME).as("template"),
            row(OPINION_CASE_COMMENT.JUDG_TARGET,
                OPINION_CASE_COMMENT.IMPLEMENTER_COMMENT,
                OPINION_CASE_COMMENT.OWNER_COMMENT,
                OPINION_CASE_COMMENT.OPINION_CASE_COMMENT_ORDER).as("comment")
        ).from(OPINION_CASE_TEMPLATE)
        .join(OPINION_CASE_COMMENT).on(OPINION_CASE_TEMPLATE.SEQ.eq(OPINION_CASE_COMMENT.OPINION_CASE_TEMPLATE_SEQ))
        .join(OPINION_TEMPLATE).on(OPINION_CASE_TEMPLATE.OPINION_TEMPLATE_SEQ.eq(OPINION_TEMPLATE.SEQ))
        .leftOuterJoin(FILE).on(OPINION_CASE_TEMPLATE.OPINION_FILE_SEQ.eq(FILE.SEQ))
        .where(OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(judgSeq))
        .orderBy(OPINION_CASE_TEMPLATE.OPINION_TEMPLATE_SEQ.asc())
        .fetchGroups(
            record -> record.get("template", OpinionCaseTemplate.class),
            record -> record.get("comment", OpinionCaseCommentEntity.class)
        );

    return templateMap.entrySet().stream()
        .map(entry -> new OpinionCaseTemplateCommit(entry.getKey(), entry.getValue())
        ).collect(Collectors.toList());
  }

  public List<OpinionTemplateEntity> getOpinionTemplateList(long judgSeq) {
    return dslContext.select(OPINION_TEMPLATE.fields())
        .from(OPINION_TEMPLATE)
        .where(OPINION_TEMPLATE.SEQ.notIn(
            select(OPINION_CASE_TEMPLATE.OPINION_TEMPLATE_SEQ).from(OPINION_CASE_TEMPLATE)
                .where(OPINION_CASE_TEMPLATE.JUDG_SEQ.eq(judgSeq))
            )
        ).fetchInto(OpinionTemplateEntity.class);
  }
}