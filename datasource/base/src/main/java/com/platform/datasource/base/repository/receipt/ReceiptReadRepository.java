package com.platform.datasource.base.repository.receipt;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptAttachmentUploadFile;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.JReceiptAgreementDate;
import org.jooq.generated.tables.JReceiptAttachment;
import org.jooq.generated.tables.JReceiptBusinessInfo;
import org.jooq.generated.tables.JReceiptBusinessRecognition;
import org.jooq.generated.tables.JReceiptQuantityReport;
import org.jooq.generated.tables.JReceiptStatus;
import org.jooq.generated.tables.pojos.ReceiptAgreementDateEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessInfoEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessRecognitionEntity;
import org.jooq.generated.tables.pojos.ReceiptQuantityReportEntity;
import org.jooq.generated.tables.pojos.ReceiptStatusEntity;
import org.springframework.stereotype.Repository;

/**
 * 접수 정보를 조회하는 Read Repository 클래스.
 */
@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class ReceiptReadRepository {

  private final DSLContext dslContext;
  private final JReceiptStatus RECEIPT_STATUS = JReceiptStatus.RECEIPT_STATUS;
  private final JReceiptBusinessInfo RECEIPT_BUSINESS_INFO = JReceiptBusinessInfo.RECEIPT_BUSINESS_INFO;
  private final JReceiptQuantityReport RECEIPT_QUANTITY_REPORT = JReceiptQuantityReport.RECEIPT_QUANTITY_REPORT;
  private final JReceiptBusinessRecognition RECEIPT_BUSINESS_RECOGNITION = JReceiptBusinessRecognition.RECEIPT_BUSINESS_RECOGNITION;
  private final JReceiptAgreementDate RECEIPT_AGREEMENT_DATE = JReceiptAgreementDate.RECEIPT_AGREEMENT_DATE;
  private final JReceiptAttachment RECEIPT_ATTACHMENT = JReceiptAttachment.RECEIPT_ATTACHMENT;

  private final JFile FILE = JFile.FILE;


  /**
   * 접수 상태 정보를 조회한다.
   *
   * @param judgSeq 재결일련번호
   * @return 접수 상태 정보
   */
  public ReceiptStatusEntity findReceiptStatus(long judgSeq) {
    return dslContext.select(RECEIPT_STATUS.fields())
        .from(RECEIPT_STATUS)
        .where(RECEIPT_STATUS.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(ReceiptStatusEntity.class);
  }

  /**
   * 접수 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 사업 개요 정보
   */
  public ReceiptBusinessInfoEntity findReceiptBusinessInfoByJudgSeq(long judgSeq) {
    return dslContext.select(RECEIPT_BUSINESS_INFO.fields())
        .from(RECEIPT_BUSINESS_INFO)
        .where(RECEIPT_BUSINESS_INFO.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(ReceiptBusinessInfoEntity.class);
  }

  /**
   * 총물량 조서 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 총물량 조서 정보
   */
  public ReceiptQuantityReportEntity findReceiptQuantityReportByJudgSeq(long judgSeq) {
    return dslContext.select(RECEIPT_QUANTITY_REPORT.fields())
        .from(RECEIPT_QUANTITY_REPORT)
        .where(RECEIPT_QUANTITY_REPORT.JUDG_SEQ.eq(judgSeq))
        .fetchOneInto(ReceiptQuantityReportEntity.class);
  }

  /**
   * 사업인정관계 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 사업인정관계 정보
   */
  public List<ReceiptBusinessRecognitionEntity> findReceiptBusinessRecognitionByJudgSeq(long judgSeq) {
    return dslContext.select(RECEIPT_BUSINESS_RECOGNITION.fields())
        .from(RECEIPT_BUSINESS_RECOGNITION)
        .where(RECEIPT_BUSINESS_RECOGNITION.JUDG_SEQ.eq(judgSeq))
        .orderBy(RECEIPT_BUSINESS_RECOGNITION.SEQ)
        .fetchInto(ReceiptBusinessRecognitionEntity.class);
  }



  /**
   * 협의 날짜 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 협의 날짜 정보
   */
  public List<ReceiptAgreementDateEntity> findReceiptAgreementDateByJudgSeq(long judgSeq) {
    return dslContext.select(RECEIPT_AGREEMENT_DATE.fields())
        .from(RECEIPT_AGREEMENT_DATE)
        .where(RECEIPT_AGREEMENT_DATE.JUDG_SEQ.eq(judgSeq))
        .orderBy(RECEIPT_AGREEMENT_DATE.AGREED_DATE)
        .fetchInto(ReceiptAgreementDateEntity.class);
  }

  /**
   * 사건정보 첨부파일 조회
   *
   * @param judgSeq 재결 일련번호
   * @return 사건정보 첨부파일 리스트
   */
  public List<ReceiptAttachmentUploadFile> findReceiptAttachmentByJudgSeq(long judgSeq) {
    return dslContext.select(
            RECEIPT_ATTACHMENT.SEQ,
            RECEIPT_ATTACHMENT.JUDG_SEQ,
            RECEIPT_ATTACHMENT.ATTACHMENT_FILE_SEQ,
            RECEIPT_ATTACHMENT.ATTACHMENT_TYPE_CODE,
            RECEIPT_ATTACHMENT.ATTACHMENT_ORDER,
            FILE.ORIGINAL_FILE_NAME
        ).from(RECEIPT_ATTACHMENT)
        .leftJoin(FILE).on(RECEIPT_ATTACHMENT.ATTACHMENT_FILE_SEQ.eq(FILE.SEQ))
        .where(RECEIPT_ATTACHMENT.JUDG_SEQ.eq(judgSeq))
        .orderBy(RECEIPT_ATTACHMENT.ATTACHMENT_TYPE_CODE, RECEIPT_ATTACHMENT.ATTACHMENT_ORDER)
        .fetchInto(ReceiptAttachmentUploadFile.class);
  }
}