package com.platform.api.platform.receipt.application.service;

import com.platform.api.platform.receipt.application.dto.ReceiptAppraisalResponse;
import com.platform.api.platform.receipt.application.dto.ReceiptSearchResponse;
import com.platform.common.base.type.status.ReceiptStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalRecommend;
import com.platform.datasource.base.dto.receipt.ReceiptSearch;
import com.platform.datasource.base.repository.receipt.ReceiptPreviousAppraisalReadRepository;
import com.platform.datasource.base.repository.receipt.ReceiptReadRepository;
import com.platform.datasource.base.repository.receipt.ReceiptSearchRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.ReceiptAgreementDateEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessInfoEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessRecognitionEntity;
import org.jooq.generated.tables.pojos.ReceiptQuantityReportEntity;
import org.jooq.generated.tables.pojos.ReceiptStatusEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class ReceiptReadService {

  private final ReceiptSearchRepository receiptSearchRepository;
  private final ReceiptReadRepository receiptReadRepository;
  private final ReceiptPreviousAppraisalReadRepository receiptPreviousAppraisalReadRepository;

  /**
   * 접수 목록을  조회 한다.
   *
   * @param search 검색조건
   * @return 검색결과
   */
  public ReceiptSearchResponse getReceiptList(ReceiptSearch search) {
    return ReceiptSearchResponse.builder()
        .total(receiptSearchRepository.findTotalSize(search))
        .resultList(receiptSearchRepository.findPage(search))
        .build();
  }

  /**
   * 작성중인 사건의 진생 상태를 반환 한다
   *
   * @param judgSeq 재결일련번호
   * @return 진행상태
   */
  public String getReceiptCurrentStatusCode(long judgSeq) {
    return Optional.ofNullable(getReceiptStatus(judgSeq))
        .map(ReceiptStatusEntity::getStatusCode)
        .orElse(ReceiptStatusCode.ZERO.getCode());
  }

  /**
   * 지정된 재결일련번호에 해당하는 접수 진행 상태 정보를 조회합니다.
   *
   * @param judgSeq 재결일련번호
   * @return 접수 진행 상태 정보
   */
  public ReceiptStatusEntity getReceiptStatus(long judgSeq) {
    return receiptReadRepository.findReceiptStatus(judgSeq);
  }

  /**
   * 사건 정보 - 사업 개요 정보 조회
   *
   * @param judgSeq 재결 일련번호
   * @return 사업 개요 정보
   */
  public ReceiptBusinessInfoEntity getReceiptBusinessInfoByJudgSeq(long judgSeq) {
    return receiptReadRepository.findReceiptBusinessInfoByJudgSeq(judgSeq);
  }

  /**
   * 사건 정보 - 총물량조서 정보 조회
   *
   * @param judgSeq 재결 일련번호
   * @return 총물량조서 정보
   */
  public ReceiptQuantityReportEntity getReceiptQuantityReportByJudgSeq(long judgSeq) {
    return receiptReadRepository.findReceiptQuantityReportByJudgSeq(judgSeq);
  }

  /**
   * 사건 정보 - 사업인정관계 정보 조회
   *
   * @param judgSeq 재결 일련번호
   * @return 사업인정관계 정보
   */
  public List<ReceiptBusinessRecognitionEntity> getReceiptBusinessRecognitionByJudgSeq(long judgSeq) {
    return receiptReadRepository.findReceiptBusinessRecognitionByJudgSeq(judgSeq);
  }


  /**
   * 건 정보 -  협의 감정평가 정보를 조회 한다.
   *
   * @param judgSeq 재결일련번호
   * @return 협의 감정평가 정보
   */
  public ReceiptAppraisalResponse getReceiptPreviousAppraisalByJudgSeq(long judgSeq) {
    var receiptPreviousAppraisal = receiptPreviousAppraisalReadRepository.findReceiptAppraisalByJudgSeq(judgSeq);
    var receiptPreviousAppraisalRecommendList = receiptPreviousAppraisalReadRepository.findReceiptAppraisalRecommendByJudgSeq(judgSeq);
    var receiptPreviousAppraisalAttachmentList = receiptPreviousAppraisalReadRepository.findReceiptPreviousAppraisalAttachmentUploadFileByJudgSeq(judgSeq);

    receiptPreviousAppraisalRecommendList.forEach(ReceiptPreviousAppraisalRecommend::attachmentSetting);
    receiptPreviousAppraisalAttachmentList.forEach(ReceiptPreviousAppraisalAttachmentUploadFile::attachmentSetting);

    return ReceiptAppraisalResponse.builder()
        .receiptPreviousAppraisal(receiptPreviousAppraisal)
        .receiptPreviousAppraisalRecommendList(receiptPreviousAppraisalRecommendList)
        .receiptPreviousAppraisalAttachmentUploadFileList(receiptPreviousAppraisalAttachmentList)
        .build();
  }

  /**
   * 사건 정보 - 협의 날짜 정보 조회
   *
   * @param judgSeq 재결 일련번호
   * @return 협의 날짜 정보
   */
  public List<ReceiptAgreementDateEntity> getAgreementDateByJudgSeq(long judgSeq) {
    return receiptReadRepository.findReceiptAgreementDateByJudgSeq(judgSeq);
  }

  /**
   * 접수 첨부 파일 조회
   *
   * @param judgSeq 재결 일련번호
   * @return 첨부 파일 리스트
   */
  public List<ReceiptAttachmentUploadFile> getReceiptAttachmentByJudgSeq(long judgSeq) {
    var receiptAttachmentList = receiptReadRepository.findReceiptAttachmentByJudgSeq(judgSeq);
    receiptAttachmentList.forEach(ReceiptAttachmentUploadFile::attachmentSetting);
    return receiptAttachmentList;
  }

}