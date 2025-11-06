package com.platform.datasource.base.repository.receipt;


import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalRecommend;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.JReceiptPreviousAppraisal;
import org.jooq.generated.tables.JReceiptPreviousAppraisalAttachment;
import org.jooq.generated.tables.JReceiptPreviousAppraisalRecommend;
import org.jooq.generated.tables.JSystemCode;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalEntity;
import org.springframework.stereotype.Repository;

/**
 * 접수된 협의 감정 평가 정보를 조회 한다.
 */
@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class ReceiptPreviousAppraisalReadRepository {

  private final DSLContext dslContext;
  private final JReceiptPreviousAppraisal RECEIPT_PREVIOUS_APPRAISAL = JReceiptPreviousAppraisal.RECEIPT_PREVIOUS_APPRAISAL;
  private final JReceiptPreviousAppraisalRecommend RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND = JReceiptPreviousAppraisalRecommend.RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND;
  private final JReceiptPreviousAppraisalAttachment RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT = JReceiptPreviousAppraisalAttachment.RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT;
  private final JSystemCode SYSTEM_CODE = JSystemCode.SYSTEM_CODE;
  private final JFile FILE = JFile.FILE;

  /**
   * 협의 감정 평가정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 협의 감정 평가정보
   */
  public ReceiptPreviousAppraisalEntity findReceiptAppraisalByJudgSeq(long judgSeq) {
    return dslContext.select(RECEIPT_PREVIOUS_APPRAISAL.fields())
        .from(RECEIPT_PREVIOUS_APPRAISAL)
        .where(RECEIPT_PREVIOUS_APPRAISAL.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(ReceiptPreviousAppraisalEntity.class);
  }


  /**
   * 협의 감정 평가 추천 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 협의 감정 평가 추천 평가정보
   */
  public List<ReceiptPreviousAppraisalRecommend> findReceiptAppraisalRecommendByJudgSeq(long judgSeq) {
    return dslContext.select(
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_TYPE_CODE,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_CORPORATION_NAME,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_PRICE,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_FILE_SEQ,
            FILE.ORIGINAL_FILE_NAME
        )
        .from(RECEIPT_PREVIOUS_APPRAISAL)
        .join(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND).on(RECEIPT_PREVIOUS_APPRAISAL.SEQ.eq(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECEIPT_PREVIOUS_APPRAISAL_SEQ))
        .join(FILE).on(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_FILE_SEQ.eq(FILE.SEQ))
        .where(RECEIPT_PREVIOUS_APPRAISAL.JUDG_SEQ.eq(judgSeq))
        .fetchInto(ReceiptPreviousAppraisalRecommend.class);
  }


  /**
   * 협의 공고 파일 정보를 조회 한다.
   *
   * @param judgSeq 재결 일련번호
   * @return 혐의 공고 정보
   */
  public List<ReceiptPreviousAppraisalAttachmentUploadFile> findReceiptPreviousAppraisalAttachmentUploadFileByJudgSeq(long judgSeq) {
    return dslContext.select(
            RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.JUDG_SEQ,
            RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_FILE_SEQ,
            RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_TYPE_CODE,
            FILE.ORIGINAL_FILE_NAME,
            SYSTEM_CODE.CODE_NAME.as("previousAppraisalTypeName")
        )
        .from(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT)
        .leftJoin(FILE)
        .on(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_FILE_SEQ.eq(FILE.SEQ))
        .leftJoin(SYSTEM_CODE)
        .on(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_TYPE_CODE.eq(SYSTEM_CODE.CODE))
        .where(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.JUDG_SEQ.eq(judgSeq))
        .fetchInto(ReceiptPreviousAppraisalAttachmentUploadFile.class);
  }
}
