package com.platform.api.platform.receipt.application.service;

import com.platform.api.platform.opinion.application.service.OpinionCaseTemplateService;
import com.platform.api.platform.receipt.application.dto.ReceiptCaseInfo;
import com.platform.api.platform.receipt.application.service.helper.AppraisalRecommendHelper;
import com.platform.api.platform.receipt.application.service.helper.ReceiptAttachmentHelper;
import com.platform.api.platform.receipt.application.service.helper.ReceiptPreviousAppraisaHelper;
import com.platform.common.base.type.status.ReceiptStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalRecommend;
import com.platform.datasource.base.repository.receipt.ReceiptPreviousAppraisalReadRepository;
import com.platform.datasource.base.repository.receipt.ReceiptPreviousAppraisalRepository;
import com.platform.datasource.base.repository.receipt.ReceiptReadRepository;
import com.platform.datasource.base.repository.receipt.ReceiptRepository;
import com.platform.datasource.base.repository.receipt.ReceiptSearchRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.ReceiptAgreementDateEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessInfoEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessRecognitionEntity;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalEntity;
import org.jooq.generated.tables.pojos.ReceiptQuantityReportEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class ReceiptService {

  private final ReceiptRepository receiptRepository;
  private final ReceiptSearchRepository ReceiptSearchRepository;
  private final ReceiptAttachmentHelper receiptAttachmentHelper;
  private final AppraisalRecommendHelper appraisalRecommendHelper;
  private final OpinionCaseTemplateService opinionCaseTemplateService;

  private final ReceiptPreviousAppraisaHelper receiptPreviousAppraisaHelper;
  private final ReceiptReadRepository receiptReadRepository;
  private final ReceiptPreviousAppraisalReadRepository receiptPreviousAppraisalReadRepository;
  private final ReceiptPreviousAppraisalRepository receiptPreviousAppraisalRepository;

  /**
   * 사업시행자 접수 정보 저장
   *
   * @param judgSeq         재결일련번호
   * @param receiptCaseInfo 사업시행자 접수 정보
   */
  public void insertOrUpdateReceiptCaseInfo(long judgSeq, ReceiptCaseInfo receiptCaseInfo) {
    insertOrUpdateBusinessInfo(judgSeq, receiptCaseInfo.getBusinessInfo());
    insertOrUpdateBusinessRecognition(judgSeq, receiptCaseInfo.getBusinessRecognitionList());
    insertOrUpdateAgreementDate(judgSeq, receiptCaseInfo.getAgreementDateList());
  }

  /**
   * 사업 개요 정보 저장
   *
   * @param judgSeq      재결 일련번호
   * @param businessInfo 사업개요 정보
   */
  public void insertOrUpdateBusinessInfo(long judgSeq, ReceiptBusinessInfoEntity businessInfo) {
    receiptRepository.insertOrUpdateBusinessInfo(judgSeq, businessInfo);
  }

  /**
   * 사업인정 관계 저장
   *
   * @param judgSeq                     재결 일련번호
   * @param businessRecognitionEntities 사업인정 관계 목록
   */
  public void insertOrUpdateBusinessRecognition(long judgSeq,
      List<ReceiptBusinessRecognitionEntity> businessRecognitionEntities) {
    receiptRepository.deleteBusinessRecognition(judgSeq);
    receiptRepository.insertBusinessRecognitions(judgSeq, businessRecognitionEntities);
  }

  /**
   * 협의 날짜 정보 저장
   *
   * @param judgSeq               재결 일련번호
   * @param agreementDateEntities 협의 날짜
   */
  public void insertOrUpdateAgreementDate(long judgSeq,
      List<ReceiptAgreementDateEntity> agreementDateEntities) {
    receiptRepository.deleteAgreementDate(judgSeq);
    receiptRepository.insertAgreementDates(judgSeq, agreementDateEntities);
  }


  /**
   * 총 물량조서 저장
   *
   * @param judgSeq              재결 일련번호
   * @param quantityReportEntity 총 물량조서
   */
  public void insertOrUpdateQuantityReport(long judgSeq,
      ReceiptQuantityReportEntity quantityReportEntity) {
    // 최초 등록인 경우에만 상태를 업데이트 한다.
    var receiptQuantityReport = receiptReadRepository.findReceiptQuantityReportByJudgSeq(judgSeq);
    if (receiptQuantityReport == null) {
      receiptRepository.updateReceiptStateCode(judgSeq, ReceiptStatusCode.BEFORE_APPRAISAL);
    }

    receiptRepository.insertOrUpdateQuantityReport(judgSeq, quantityReportEntity);
  }


  /**
   * 협의 감정평가 정보 등록
   *
   * @param judgSeq                                          재결일련정보
   * @param receiptPreviousAppraisal                         혐의 감정평가 정보
   * @param receiptPreviousAppraisalRecommendList            협의 감정평가 추천 정보
   * @param receiptPreviousAppraisalAttachmentUploadFileList 공고 첨부파일 목록
   */
  public void insertOrUpdateReceiptAppraisal(long judgSeq,
      ReceiptPreviousAppraisalEntity receiptPreviousAppraisal,
      List<ReceiptPreviousAppraisalRecommend> receiptPreviousAppraisalRecommendList,
      List<ReceiptPreviousAppraisalAttachmentUploadFile> receiptPreviousAppraisalAttachmentUploadFileList

  ) {
    // 최초 등록인 경우에만 상태를 업데이트 한다.
    var receiptAppraisal = receiptPreviousAppraisalReadRepository.findReceiptAppraisalByJudgSeq(judgSeq);
    if (receiptAppraisal == null) {
      receiptRepository.updateReceiptStateCode(judgSeq, ReceiptStatusCode.ATTACHMENT);
    }

    // ltis  접수 정보
    var ltisInfo = ReceiptSearchRepository.findInfoByJudgSeq(judgSeq);

    // 협의 정보를 저정한다.
    var receiptAppraisalSeq = receiptPreviousAppraisalRepository.insertOrUpdateReceiptAppraisal(judgSeq, receiptPreviousAppraisal);

    // 사용하지 않는 협의 감졍평가 추천 정보를  삭제 한다.
    appraisalRecommendHelper.removeReceiptAppraisalRecommendList(judgSeq, receiptPreviousAppraisalRecommendList);
    Flux.fromIterable(receiptPreviousAppraisalRecommendList)
        .flatMap(fileRequest ->
            Mono.fromRunnable(() -> appraisalRecommendHelper.insertAppraisalRecommend(receiptAppraisalSeq, ltisInfo.getCaseNo(), fileRequest))
        ).subscribe();

    // 사용하지 않는 협의 공고 파일  삭제 한다.
    receiptPreviousAppraisaHelper.removePreviousAppraisalAttachment(judgSeq, receiptPreviousAppraisalAttachmentUploadFileList);
    Flux.fromIterable(receiptPreviousAppraisalAttachmentUploadFileList)
        .flatMap(fileRequest ->
            Mono.fromRunnable(() -> receiptPreviousAppraisaHelper.insertPreviousAppraisalAttachment(judgSeq, ltisInfo.getCaseNo(), fileRequest))
        ).subscribe();
  }


  /**
   * 사건 정보 첨부 파일을 등록 또는 수정 한다.
   *
   * @param judgSeq                         재결일련번호
   * @param receiptAttachmentUploadFileList 첨부파일
   */
  public void insertOrUpdateAttachment(long judgSeq, List<ReceiptAttachmentUploadFile> receiptAttachmentUploadFileList) {
    var ltisInfo = ReceiptSearchRepository.findInfoByJudgSeq(judgSeq);
    receiptAttachmentHelper.removeReceiptAttachment(judgSeq, receiptAttachmentUploadFileList);

    Flux.fromIterable(receiptAttachmentUploadFileList)
        .flatMap(fileRequest ->
            Mono.fromRunnable(() -> receiptAttachmentHelper.insertReceiptAttachment(judgSeq, ltisInfo.getCaseNo(), fileRequest))
        ).subscribe();

    receiptRepository.updateReceiptStateCode(judgSeq, ReceiptStatusCode.NOTICE_END);
  }


  /**
   * 사업시행의 완료 처리
   *
   * @param judgSeq 재결일련번호
   */
  public void sendReceiptComplete(long judgSeq) {
    opinionCaseTemplateService.createImplementerNoTemplate(judgSeq);
    receiptRepository.updateReceiptStateCode(judgSeq, ReceiptStatusCode.DECISION_START);
  }
}