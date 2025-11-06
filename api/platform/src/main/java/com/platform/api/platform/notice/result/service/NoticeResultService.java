package com.platform.api.platform.notice.result.service;

import com.platform.api.platform.notice.result.service.helper.NoticeResultFileUploadHelper;
import com.platform.common.base.type.status.ReceiptStatusCode;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.notice.NoticeAttachmentFile;
import com.platform.datasource.base.repository.notice.NoticeRepository;
import com.platform.datasource.base.repository.receipt.ReceiptRepository;
import com.platform.datasource.base.repository.receipt.ReceiptSearchRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.NoticeInfoEntity;
import org.springframework.stereotype.Service;

/**
 * 열람공고 애플리케이션 서비스
 * <p>
 * 열람공고  등록 및 업데이트 기능을 제공하는 서비스 클래스입니다.  열람공고 정보와 관련 파일을 처리하고, 케이스 상태를 업데이트합니다.
 */
@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class NoticeResultService {

  private final ReceiptSearchRepository ReceiptSearchRepository;

  private final NoticeResultFileUploadHelper noticeResultFileUploadHelper;

  private final ReceiptRepository receiptRepository;

  private final NoticeRepository noticeRepository;

  /**
   * 열람공고 결과 등록
   *
   * @param judgSeq                  재결일련번호
   * @param noticeInfoEntity         열람공고 등록 결과 입력 정보
   * @param noticeAttachmentFileList 공고의뢰 결과 첨부파일 리스트
   */
  public void insertOrUpdateNoticeResult(long judgSeq, NoticeInfoEntity noticeInfoEntity, List<NoticeAttachmentFile> noticeAttachmentFileList) {

    var ltisInfo = ReceiptSearchRepository.findInfoByJudgSeq(judgSeq);

    // 열람공고 등록
    var noticeInfoSeq = noticeRepository.insertOrUpdateNoticeResult(judgSeq, noticeInfoEntity);

    // 열람공고 첨부 파일 삭제
    noticeResultFileUploadHelper.removeNoticeResultFileList(judgSeq, noticeAttachmentFileList);

    for (NoticeAttachmentFile noticeAttachmentFile : noticeAttachmentFileList) {
      noticeResultFileUploadHelper.insertOrUpdateNoticeResultFile(noticeInfoSeq, ltisInfo.getCaseNo(), noticeAttachmentFile);
    }

    receiptRepository.updateReceiptStateCode(judgSeq, ReceiptStatusCode.OPINION_WRITE);
  }

  /**
   * 열람공고 의뢰 등록
   *
   * @param judgSeq                  재결일련번호
   * @param noticeEntity             열람공고 등록 결과 입력 정보
   * @param noticeAttachmentFileList 공고의뢰 결과 첨부파일 리스트
   */
  public void insertOrUpdateNoticeRequest(long judgSeq, NoticeInfoEntity noticeEntity, List<NoticeAttachmentFile> noticeAttachmentFileList) {

  }
}
