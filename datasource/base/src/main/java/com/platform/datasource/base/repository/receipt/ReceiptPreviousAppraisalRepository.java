package com.platform.datasource.base.repository.receipt;


import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalRecommend;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JReceiptPreviousAppraisal;
import org.jooq.generated.tables.JReceiptPreviousAppraisalAttachment;
import org.jooq.generated.tables.JReceiptPreviousAppraisalRecommend;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalAttachmentEntity;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalEntity;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalRecommendEntity;
import org.springframework.stereotype.Repository;

/**
 * 접수된 협의 감정 평가 정보를 조회 한다.
 */
@Repository
@RequiredArgsConstructor
public class ReceiptPreviousAppraisalRepository {

  private final DSLContext dslContext;
  private final JReceiptPreviousAppraisal RECEIPT_PREVIOUS_APPRAISAL = JReceiptPreviousAppraisal.RECEIPT_PREVIOUS_APPRAISAL;
  private final JReceiptPreviousAppraisalRecommend RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND = JReceiptPreviousAppraisalRecommend.RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND;
  private final JReceiptPreviousAppraisalAttachment RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT = JReceiptPreviousAppraisalAttachment.RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT;

  /**
   * 협의 감정 평가 정보를 저장한다.
   *
   * @param judgSeq          재결일련번호
   * @param receiptAppraisal 협의 감정 평가 정보
   * @return 협의 감정 평가 정보 일련번호
   */
  public Long insertOrUpdateReceiptAppraisal(long judgSeq, ReceiptPreviousAppraisalEntity receiptAppraisal) {
    dslContext.insertInto(RECEIPT_PREVIOUS_APPRAISAL,
            RECEIPT_PREVIOUS_APPRAISAL.JUDG_SEQ,
            RECEIPT_PREVIOUS_APPRAISAL.GOVERNOR_RECOMMENDATION,
            RECEIPT_PREVIOUS_APPRAISAL.GOVERNOR_NOT_RECOMMENDATION,
            RECEIPT_PREVIOUS_APPRAISAL.OPTIONAL_IMPLEMENTER_RECOMMENDATION,
            RECEIPT_PREVIOUS_APPRAISAL.OPTIONAL_LAND_OWNER_RECOMMENDATION,
            RECEIPT_PREVIOUS_APPRAISAL.CREATED_BY,
            RECEIPT_PREVIOUS_APPRAISAL.CREATED_TIME
        ).values(
            judgSeq,
            receiptAppraisal.getGovernorRecommendation(),
            receiptAppraisal.getGovernorNotRecommendation(),
            receiptAppraisal.getOptionalImplementerRecommendation(),
            receiptAppraisal.getOptionalLandOwnerRecommendation(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).onDuplicateKeyUpdate()
        .set(RECEIPT_PREVIOUS_APPRAISAL.GOVERNOR_RECOMMENDATION, receiptAppraisal.getGovernorRecommendation())
        .set(RECEIPT_PREVIOUS_APPRAISAL.GOVERNOR_NOT_RECOMMENDATION, receiptAppraisal.getGovernorNotRecommendation())
        .set(RECEIPT_PREVIOUS_APPRAISAL.OPTIONAL_IMPLEMENTER_RECOMMENDATION, receiptAppraisal.getOptionalImplementerRecommendation())
        .set(RECEIPT_PREVIOUS_APPRAISAL.OPTIONAL_LAND_OWNER_RECOMMENDATION, receiptAppraisal.getOptionalLandOwnerRecommendation())
        .set(RECEIPT_PREVIOUS_APPRAISAL.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(RECEIPT_PREVIOUS_APPRAISAL.UPDATED_TIME, LocalDateTime.now()).execute();

    return dslContext.select(RECEIPT_PREVIOUS_APPRAISAL.SEQ)
        .from(RECEIPT_PREVIOUS_APPRAISAL)
        .where(RECEIPT_PREVIOUS_APPRAISAL.JUDG_SEQ.eq(judgSeq)).fetchOneInto(Long.class);
  }

  /**
   * 협의 감정 평가 추천 정보를 저장한다.
   *
   * @param receiptPreviousAppraisalSeq       협의감정평가 정보 일련번호
   * @param receiptPreviousAppraisalRecommend 협의 감정평가 추천 정보
   */
  public void insertOrUpdateReceiptAppraisalRecommend(long receiptPreviousAppraisalSeq, ReceiptPreviousAppraisalRecommendEntity receiptPreviousAppraisalRecommend) {
    dslContext.insertInto(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECEIPT_PREVIOUS_APPRAISAL_SEQ,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_TYPE_CODE,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_CORPORATION_NAME,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_PRICE,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_FILE_SEQ,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.CREATED_BY,
            RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.CREATED_TIME
        )
        .values(
            receiptPreviousAppraisalSeq
            , receiptPreviousAppraisalRecommend.getRecommendTypeCode()
            , receiptPreviousAppraisalRecommend.getRecommendCorporationName()
            , receiptPreviousAppraisalRecommend.getRecommendPrice()
            , receiptPreviousAppraisalRecommend.getRecommendFileSeq()
            , UserAccountHolder.getSeqNo()
            , LocalDateTime.now()
        ).onDuplicateKeyUpdate()
        .set(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_CORPORATION_NAME, receiptPreviousAppraisalRecommend.getRecommendCorporationName())
        .set(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_PRICE, receiptPreviousAppraisalRecommend.getRecommendPrice())
        .set(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.UPDATED_TIME, LocalDateTime.now())
        .execute();
  }


  /**
   * 협의 공고 파일을 등록한다.
   *
   * @param judgSeq                재결 일련번호
   * @param receiptPreviousAppraisalAttachment 혐의 공고 파일 정보
   */
  public void insertPreviousAppraisal(long judgSeq, ReceiptPreviousAppraisalAttachmentEntity receiptPreviousAppraisalAttachment) {
    dslContext.insertInto(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT,
        RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.JUDG_SEQ,
        RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_FILE_SEQ,
        RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_TYPE_CODE,
        RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.CREATED_BY,
        RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.CREATED_TIME
    ).values(
        judgSeq,
        receiptPreviousAppraisalAttachment.getPreviousAppraisalFileSeq(),
        receiptPreviousAppraisalAttachment.getPreviousAppraisalTypeCode(),
        UserAccountHolder.getSeqNo(),
        LocalDateTime.now()
    ).execute();
  }

  public void updatePreviousAppraisalAttachment(ReceiptPreviousAppraisalAttachmentEntity receiptPreviousAppraisalAttachment) {
    dslContext.update(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT)
        .set(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.UPDATED_TIME, LocalDateTime.now())
        .where(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.JUDG_SEQ.eq(receiptPreviousAppraisalAttachment.getJudgSeq())
            .and(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_TYPE_CODE.eq(receiptPreviousAppraisalAttachment.getPreviousAppraisalTypeCode()
            )))
        .execute();
  }

  /**
   * 협의 공고 파일을 삭제한다.
   *
   * @param fileSeq 파일일련번호
   */
  public void deletePreviousAppraisalRepositoryByFileSeq(long fileSeq) {
    dslContext.deleteFrom(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT).where(RECEIPT_PREVIOUS_APPRAISAL_ATTACHMENT.PREVIOUS_APPRAISAL_FILE_SEQ.eq(fileSeq))
        .execute();
  }

  /**
   * 협의 감정 평가 추천 정보를 삭제한다.
   *
   * @param recommendFileSeq 협의감정평가 정보 일련번호
   */
  public void deleteAppraisalRecommendByRecommendFileSeq(Long recommendFileSeq) {
    dslContext.deleteFrom(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND)
        .where(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_FILE_SEQ.eq(recommendFileSeq))
        .execute();
  }

  /**
   * 협의 감정 평가 추천 정보를 수정한다. 추천 코드와 협의 감졍 정보 일련정보를 기준으로 수정 한다.
   *
   * @param receiptPreviousAppraisalRecommend 협의감정평가 정보 일련번호
   */
  public void updateReceiptAppraisalRecommend(long receiptPreviousAppraisalSeq, ReceiptPreviousAppraisalRecommend receiptPreviousAppraisalRecommend) {
    dslContext.update(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND)
        .set(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_CORPORATION_NAME, receiptPreviousAppraisalRecommend.getRecommendCorporationName())
        .set(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_PRICE, receiptPreviousAppraisalRecommend.getRecommendPrice())
        .where(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECOMMEND_TYPE_CODE.eq(receiptPreviousAppraisalRecommend.getRecommendTypeCode())
            .and(RECEIPT_PREVIOUS_APPRAISAL_RECOMMEND.RECEIPT_PREVIOUS_APPRAISAL_SEQ.eq(receiptPreviousAppraisalSeq)))
        .execute();
  }
}