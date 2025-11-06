package com.platform.datasource.base.repository.receipt;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.common.base.type.status.ReceiptStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JReceiptAgreementDate;
import org.jooq.generated.tables.JReceiptAttachment;
import org.jooq.generated.tables.JReceiptBusinessInfo;
import org.jooq.generated.tables.JReceiptBusinessRecognition;
import org.jooq.generated.tables.JReceiptQuantityReport;
import org.jooq.generated.tables.JReceiptStatus;
import org.jooq.generated.tables.pojos.ReceiptAgreementDateEntity;
import org.jooq.generated.tables.pojos.ReceiptAttachmentEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessInfoEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessRecognitionEntity;
import org.jooq.generated.tables.pojos.ReceiptQuantityReportEntity;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class ReceiptRepository {

  private final DSLContext dslContext;
  private final JReceiptBusinessInfo RECEIPT_BUSINESS_INFO = JReceiptBusinessInfo.RECEIPT_BUSINESS_INFO;
  private final JReceiptQuantityReport RECEIPT_QUANTITY_REPORT = JReceiptQuantityReport.RECEIPT_QUANTITY_REPORT;
  private final JReceiptBusinessRecognition RECEIPT_BUSINESS_RECOGNITION = JReceiptBusinessRecognition.RECEIPT_BUSINESS_RECOGNITION;
  private final JReceiptAgreementDate RECEIPT_AGREEMENT_DATE = JReceiptAgreementDate.RECEIPT_AGREEMENT_DATE;
  private final JReceiptAttachment RECEIPT_ATTACHMENT = JReceiptAttachment.RECEIPT_ATTACHMENT;
  private final JReceiptStatus RECEIPT_STATUS = JReceiptStatus.RECEIPT_STATUS;

  /**
   * 사건 정보를 저장 또는 수정 한다. 한다. - 사업 개요
   *
   * @param businessInfoEntity 사업개요 정보
   */
  public void insertOrUpdateBusinessInfo(long judgSeq, ReceiptBusinessInfoEntity businessInfoEntity) {
    dslContext.insertInto(RECEIPT_STATUS,
        RECEIPT_STATUS.JUDG_SEQ,
        RECEIPT_STATUS.STATUS_CODE,
        RECEIPT_STATUS.CREATED_BY,
        RECEIPT_STATUS.CREATED_TIME
        ).values(
          judgSeq,
          ReceiptStatusCode.CASE_INFO.getCode(),
          UserAccountHolder.getSeqNo(),
          LocalDateTime.now()
      ).onDuplicateKeyUpdate()
        .set(RECEIPT_STATUS.JUDG_SEQ, judgSeq) // 업데이트할 컬럼 없음
      .execute();

    dslContext.insertInto(RECEIPT_BUSINESS_INFO,
            RECEIPT_BUSINESS_INFO.JUDG_SEQ,
            RECEIPT_BUSINESS_INFO.SCALE,
            RECEIPT_BUSINESS_INFO.BUSINESS_PERIOD,
            RECEIPT_BUSINESS_INFO.REQUEST_REASON,
            RECEIPT_BUSINESS_INFO.CREATED_BY,
            RECEIPT_BUSINESS_INFO.CREATED_TIME
        )
        .values(
            judgSeq,
            businessInfoEntity.getScale(),
            businessInfoEntity.getBusinessPeriod(),
            businessInfoEntity.getRequestReason(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        )
        .onDuplicateKeyUpdate()
        .set(RECEIPT_BUSINESS_INFO.SCALE, businessInfoEntity.getScale())
        .set(RECEIPT_BUSINESS_INFO.BUSINESS_PERIOD, businessInfoEntity.getBusinessPeriod())
        .set(RECEIPT_BUSINESS_INFO.REQUEST_REASON, businessInfoEntity.getRequestReason())
        .set(RECEIPT_BUSINESS_INFO.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(RECEIPT_BUSINESS_INFO.UPDATED_TIME, LocalDateTime.now())
        .execute();
  }


  /**
   *  접수 정보를 상태 코드를 변경 한다.
   *
   * @param decisionStateCode 상태 코드
   */
  public void updateReceiptStateCode(long judgSeq, ReceiptStatusCode decisionStateCode) {
    dslContext.update(RECEIPT_STATUS)
        .set(RECEIPT_STATUS.STATUS_CODE, decisionStateCode.getCode())
        .set(RECEIPT_STATUS.CREATED_BY, UserAccountHolder.getSeqNo())
        .set(RECEIPT_STATUS.CREATED_TIME, LocalDateTime.now())
        .where(RECEIPT_STATUS.JUDG_SEQ.eq(judgSeq))
        .execute();
  }

  /**
   * 총물량 조서 저장 또는 수정 한다. 한다.
   *
   * @param quantityReportEntity 총물량 조서
   */
  public void insertOrUpdateQuantityReport(long judgSeq,
      ReceiptQuantityReportEntity quantityReportEntity) {
    dslContext.insertInto(RECEIPT_QUANTITY_REPORT,
            RECEIPT_QUANTITY_REPORT.JUDG_SEQ,
            RECEIPT_QUANTITY_REPORT.LAND_CNT,
            RECEIPT_QUANTITY_REPORT.OBJ_CNT,
            RECEIPT_QUANTITY_REPORT.GOODWILL_CNT,
            RECEIPT_QUANTITY_REPORT.ETC_CNT,
            RECEIPT_QUANTITY_REPORT.LAND_AREA,
            RECEIPT_QUANTITY_REPORT.ETC_AREA,
            RECEIPT_QUANTITY_REPORT.LAND_PRICE,
            RECEIPT_QUANTITY_REPORT.OBJ_PRICE,
            RECEIPT_QUANTITY_REPORT.GOODWILL_PRICE,
            RECEIPT_QUANTITY_REPORT.ETC_PRICE,
            RECEIPT_QUANTITY_REPORT.DECISION_LAND_CNT,
            RECEIPT_QUANTITY_REPORT.DECISION_OBJ_CNT,
            RECEIPT_QUANTITY_REPORT.DECISION_GOODWILL_CNT,
            RECEIPT_QUANTITY_REPORT.DECISION_ETC_CNT,
            RECEIPT_QUANTITY_REPORT.DECISION_LAND_AREA,
            RECEIPT_QUANTITY_REPORT.DECISION_ETC_AREA,
            RECEIPT_QUANTITY_REPORT.DECISION_LAND_PRICE,
            RECEIPT_QUANTITY_REPORT.DECISION_OBJ_PRICE,
            RECEIPT_QUANTITY_REPORT.DECISION_GOODWILL_PRICE,
            RECEIPT_QUANTITY_REPORT.DECISION_ETC_PRICE,
            RECEIPT_QUANTITY_REPORT.TOTAL_LAND_CNT,
            RECEIPT_QUANTITY_REPORT.TOTAL_LAND_AREA,
            RECEIPT_QUANTITY_REPORT.TOTAL_LAND_PRICE,
            RECEIPT_QUANTITY_REPORT.TOTAL_OBJ_CNT,
            RECEIPT_QUANTITY_REPORT.TOTAL_OBJ_PRICE,
            RECEIPT_QUANTITY_REPORT.TOTAL_GOODWILL_CNT,
            RECEIPT_QUANTITY_REPORT.TOTAL_GOODWILL_PRICE,
            RECEIPT_QUANTITY_REPORT.TOTAL_ETC_CNT,
            RECEIPT_QUANTITY_REPORT.TOTAL_ETC_AREA,
            RECEIPT_QUANTITY_REPORT.TOTAL_ETC_PRICE,
            RECEIPT_QUANTITY_REPORT.SUM_TOTAL_CNT,
            RECEIPT_QUANTITY_REPORT.SUM_TOTAL_AREA,
            RECEIPT_QUANTITY_REPORT.SUM_TOTAL_PRICE,
            RECEIPT_QUANTITY_REPORT.SUM_CNT,
            RECEIPT_QUANTITY_REPORT.SUM_AREA,
            RECEIPT_QUANTITY_REPORT.SUM_PRICE,
            RECEIPT_QUANTITY_REPORT.SUM_DECISION_CNT,
            RECEIPT_QUANTITY_REPORT.SUM_DECISION_AREA,
            RECEIPT_QUANTITY_REPORT.SUM_DECISION_PRICE,
            RECEIPT_QUANTITY_REPORT.CREATED_BY,
            RECEIPT_QUANTITY_REPORT.CREATED_TIME
        )
        .values(
            judgSeq,
            quantityReportEntity.getLandCnt(),
            quantityReportEntity.getObjCnt(),
            quantityReportEntity.getGoodwillCnt(),
            quantityReportEntity.getEtcCnt(),
            quantityReportEntity.getLandArea(),
            quantityReportEntity.getEtcArea(),
            quantityReportEntity.getLandPrice(),
            quantityReportEntity.getObjPrice(),
            quantityReportEntity.getGoodwillPrice(),
            quantityReportEntity.getEtcPrice(),
            quantityReportEntity.getDecisionLandCnt(),
            quantityReportEntity.getDecisionObjCnt(),
            quantityReportEntity.getDecisionGoodwillCnt(),
            quantityReportEntity.getDecisionEtcCnt(),
            quantityReportEntity.getDecisionLandArea(),
            quantityReportEntity.getDecisionEtcArea(),
            quantityReportEntity.getDecisionLandPrice(),
            quantityReportEntity.getDecisionObjPrice(),
            quantityReportEntity.getDecisionGoodwillPrice(),
            quantityReportEntity.getDecisionEtcPrice(),
            quantityReportEntity.getTotalLandCnt(),
            quantityReportEntity.getTotalLandArea(),
            quantityReportEntity.getTotalLandPrice(),
            quantityReportEntity.getTotalObjCnt(),
            quantityReportEntity.getTotalObjPrice(),
            quantityReportEntity.getTotalGoodwillCnt(),
            quantityReportEntity.getTotalGoodwillPrice(),
            quantityReportEntity.getTotalEtcCnt(),
            quantityReportEntity.getTotalEtcArea(),
            quantityReportEntity.getTotalEtcPrice(),
            quantityReportEntity.getSumTotalCnt(),
            quantityReportEntity.getSumTotalArea(),
            quantityReportEntity.getSumTotalPrice(),
            quantityReportEntity.getSumCnt(),
            quantityReportEntity.getSumArea(),
            quantityReportEntity.getSumPrice(),
            quantityReportEntity.getSumDecisionCnt(),
            quantityReportEntity.getSumDecisionArea(),
            quantityReportEntity.getSumDecisionPrice(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        )
        .onDuplicateKeyUpdate()
        .set(RECEIPT_QUANTITY_REPORT.LAND_CNT, quantityReportEntity.getLandCnt())
        .set(RECEIPT_QUANTITY_REPORT.OBJ_CNT, quantityReportEntity.getObjCnt())
        .set(RECEIPT_QUANTITY_REPORT.GOODWILL_CNT, quantityReportEntity.getGoodwillCnt())
        .set(RECEIPT_QUANTITY_REPORT.ETC_CNT, quantityReportEntity.getEtcCnt())
        .set(RECEIPT_QUANTITY_REPORT.LAND_AREA, quantityReportEntity.getLandArea())
        .set(RECEIPT_QUANTITY_REPORT.ETC_AREA, quantityReportEntity.getEtcArea())
        .set(RECEIPT_QUANTITY_REPORT.LAND_PRICE, quantityReportEntity.getLandPrice())
        .set(RECEIPT_QUANTITY_REPORT.OBJ_PRICE, quantityReportEntity.getObjPrice())
        .set(RECEIPT_QUANTITY_REPORT.GOODWILL_PRICE, quantityReportEntity.getGoodwillPrice())
        .set(RECEIPT_QUANTITY_REPORT.ETC_PRICE, quantityReportEntity.getEtcPrice())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_LAND_CNT, quantityReportEntity.getDecisionLandCnt())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_OBJ_CNT, quantityReportEntity.getDecisionObjCnt())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_GOODWILL_CNT, quantityReportEntity.getDecisionGoodwillCnt())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_ETC_CNT, quantityReportEntity.getDecisionEtcCnt())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_LAND_AREA, quantityReportEntity.getDecisionLandArea())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_ETC_AREA, quantityReportEntity.getDecisionEtcArea())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_LAND_PRICE, quantityReportEntity.getDecisionLandPrice())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_OBJ_PRICE, quantityReportEntity.getDecisionObjPrice())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_GOODWILL_PRICE,
            quantityReportEntity.getDecisionGoodwillPrice())
        .set(RECEIPT_QUANTITY_REPORT.DECISION_ETC_PRICE, quantityReportEntity.getDecisionEtcPrice())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_LAND_CNT, quantityReportEntity.getTotalLandCnt())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_LAND_AREA, quantityReportEntity.getTotalLandArea())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_LAND_PRICE, quantityReportEntity.getTotalLandPrice())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_OBJ_CNT, quantityReportEntity.getTotalObjCnt())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_OBJ_PRICE, quantityReportEntity.getTotalObjPrice())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_GOODWILL_CNT, quantityReportEntity.getTotalGoodwillCnt())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_GOODWILL_PRICE, quantityReportEntity.getTotalGoodwillPrice())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_ETC_CNT, quantityReportEntity.getTotalEtcCnt())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_ETC_AREA, quantityReportEntity.getTotalEtcArea())
        .set(RECEIPT_QUANTITY_REPORT.TOTAL_ETC_PRICE, quantityReportEntity.getTotalEtcPrice())
        .set(RECEIPT_QUANTITY_REPORT.SUM_TOTAL_CNT, quantityReportEntity.getSumTotalCnt())
        .set(RECEIPT_QUANTITY_REPORT.SUM_TOTAL_AREA, quantityReportEntity.getSumTotalArea())
        .set(RECEIPT_QUANTITY_REPORT.SUM_TOTAL_PRICE, quantityReportEntity.getSumTotalPrice())
        .set(RECEIPT_QUANTITY_REPORT.SUM_CNT, quantityReportEntity.getSumCnt())
        .set(RECEIPT_QUANTITY_REPORT.SUM_AREA, quantityReportEntity.getSumArea())
        .set(RECEIPT_QUANTITY_REPORT.SUM_PRICE, quantityReportEntity.getSumPrice())
        .set(RECEIPT_QUANTITY_REPORT.SUM_DECISION_CNT, quantityReportEntity.getSumDecisionCnt())
        .set(RECEIPT_QUANTITY_REPORT.SUM_DECISION_AREA, quantityReportEntity.getSumDecisionArea())
        .set(RECEIPT_QUANTITY_REPORT.SUM_DECISION_PRICE, quantityReportEntity.getSumDecisionPrice())
        .set(RECEIPT_QUANTITY_REPORT.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(RECEIPT_QUANTITY_REPORT.UPDATED_TIME, LocalDateTime.now())
        .execute();
  }

  /**
   * 사업인정관계 (도시계획) 등록한다.
   *
   * @param businessRecognitionEntityList 사업인정관계
   */
  public void insertBusinessRecognitions(long judgSeq,
      List<ReceiptBusinessRecognitionEntity> businessRecognitionEntityList) {
    var userSeq = UserAccountHolder.getSeqNo();
    var createdTime = LocalDateTime.now();

    var rows = businessRecognitionEntityList.stream()
        .map(businessRecognitionEntity -> DSL.row(
            judgSeq,
            businessRecognitionEntity.getTitle(),
            businessRecognitionEntity.getContent(),
            userSeq,
            createdTime
        )).toList();

    dslContext.insertInto(RECEIPT_BUSINESS_RECOGNITION,
            RECEIPT_BUSINESS_RECOGNITION.JUDG_SEQ,
            RECEIPT_BUSINESS_RECOGNITION.TITLE,
            RECEIPT_BUSINESS_RECOGNITION.CONTENT,
            RECEIPT_BUSINESS_RECOGNITION.CREATED_BY,
            RECEIPT_BUSINESS_RECOGNITION.CREATED_TIME
        )
        .valuesOfRows(rows)
        .execute();
  }


  /**
   * 사업인정관계 (도시계획)을 삭제한다.
   *
   * @param judgSeq 재결 일련번호
   */
  public void deleteBusinessRecognition(long judgSeq) {
    dslContext.deleteFrom(RECEIPT_BUSINESS_RECOGNITION)
        .where(RECEIPT_BUSINESS_RECOGNITION.JUDG_SEQ.eq(judgSeq))
        .execute();
  }



  /**
   * 사건 접수 협의 날짜를를 등록 한다.
   *
   * @param agreementDateEntityList 협의 날짜
   */
  public void insertAgreementDates(long judgSeq,
      List<ReceiptAgreementDateEntity> agreementDateEntityList) {
    var userSeq = UserAccountHolder.getSeqNo();
    var createdTime = LocalDateTime.now();

    var rows = agreementDateEntityList.stream()
        .map(agreementDateEntity -> DSL.row(
            judgSeq,
            agreementDateEntity.getAgreedDate(),
            agreementDateEntity.getAgreedDesc(),
            userSeq,
            createdTime
        )).toList();

    dslContext.insertInto(RECEIPT_AGREEMENT_DATE,
            RECEIPT_AGREEMENT_DATE.JUDG_SEQ,
            RECEIPT_AGREEMENT_DATE.AGREED_DATE,
            RECEIPT_AGREEMENT_DATE.AGREED_DESC,
            RECEIPT_AGREEMENT_DATE.CREATED_BY,
            RECEIPT_AGREEMENT_DATE.CREATED_TIME
        )
        .valuesOfRows(rows)
        .execute();
  }

  /**
   * 사건 접수 협의 날짜를 삭제 한다.
   *
   * @param judgSeq 재결 일련번호
   */
  public void deleteAgreementDate(long judgSeq) {
    dslContext.deleteFrom(RECEIPT_AGREEMENT_DATE)
        .where(RECEIPT_AGREEMENT_DATE.JUDG_SEQ.eq(judgSeq))
        .execute();
  }

  /**
   * 사건 접수 첨부파일을 등록한다.
   *
   * @param judgSeq                 재결일련번호
   * @param receiptAttachmentEntity 첨부파일 정보
   */
  public void insertReceiptAttachment(long judgSeq, ReceiptAttachmentEntity receiptAttachmentEntity) {
    dslContext.insertInto(RECEIPT_ATTACHMENT,
            RECEIPT_ATTACHMENT.JUDG_SEQ,
            RECEIPT_ATTACHMENT.ATTACHMENT_TYPE_CODE,
            RECEIPT_ATTACHMENT.ATTACHMENT_ORDER,
            RECEIPT_ATTACHMENT.ATTACHMENT_FILE_SEQ,
            RECEIPT_ATTACHMENT.CREATED_BY,
            RECEIPT_ATTACHMENT.CREATED_TIME
        ).values(
            judgSeq,
            receiptAttachmentEntity.getAttachmentTypeCode(),
            receiptAttachmentEntity.getAttachmentOrder(),
            receiptAttachmentEntity.getAttachmentFileSeq(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).returningResult(RECEIPT_ATTACHMENT.SEQ)
        .fetchOneInto(Long.class);
  }

  /**
   * 사건 접수 첨부파일을 수정한다.
   *
   * @param receiptAttachmentEntity 사건정보 첨부파일 수정 정보
   */
  public void updateCaseInfoFile(ReceiptAttachmentEntity receiptAttachmentEntity) {
    dslContext.update(RECEIPT_ATTACHMENT)
        .set(RECEIPT_ATTACHMENT.UPDATED_TIME, LocalDateTime.now())
        .set(RECEIPT_ATTACHMENT.UPDATED_BY, UserAccountHolder.getSeqNo())
        .where(RECEIPT_ATTACHMENT.SEQ.eq(receiptAttachmentEntity.getSeq()))
        .execute();
  }

  /**
   * 파일일련번호를 가지고 첨부파일 정보를 삭제 한다.
   *
   * @param fileSeq 파일일련번호
   */
  public void deleteCaseInfoFileByFileSeq(Long fileSeq) {
    dslContext.deleteFrom(RECEIPT_ATTACHMENT).where(RECEIPT_ATTACHMENT.ATTACHMENT_FILE_SEQ.eq(fileSeq)).execute();
  }
}