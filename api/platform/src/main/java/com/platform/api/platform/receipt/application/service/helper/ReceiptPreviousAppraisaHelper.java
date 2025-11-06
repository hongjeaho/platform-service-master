package com.platform.api.platform.receipt.application.service.helper;

import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.service.FileService;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalAttachmentUploadFile;
import com.platform.datasource.base.repository.receipt.ReceiptPreviousAppraisalReadRepository;
import com.platform.datasource.base.repository.receipt.ReceiptPreviousAppraisalRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class ReceiptPreviousAppraisaHelper {

  private final FileService fileService;
  private final ReceiptPreviousAppraisalRepository receiptPreviousAppraisalRepository;
  private final ReceiptPreviousAppraisalReadRepository receiptPreviousAppraisalReadRepository;

  /**
   * 협의 공고 첨부 파일을 삭제한다.
   *
   * @param judgSeq                                          재결일련번호
   * @param receiptPreviousAppraisalAttachmentUploadFileList 협의 공고 파일 정보
   */
  public void removePreviousAppraisalAttachment(long judgSeq, List<ReceiptPreviousAppraisalAttachmentUploadFile> receiptPreviousAppraisalAttachmentUploadFileList) {
    var requestList = receiptPreviousAppraisalAttachmentUploadFileList
        .stream()
        .map(ReceiptPreviousAppraisalAttachmentUploadFile::getPreviousAppraisalFileSeq)
        .collect(Collectors.toSet());

    var removeFileSeqSet = receiptPreviousAppraisalReadRepository.findReceiptPreviousAppraisalAttachmentUploadFileByJudgSeq(judgSeq)
        .stream()
        .map(ReceiptPreviousAppraisalAttachmentUploadFile::getPreviousAppraisalFileSeq)
        .filter(seq -> !requestList.contains(seq))
        .collect(Collectors.toSet());

    Flux.fromIterable(removeFileSeqSet)
        .flatMap(fileSeq ->
            Mono.fromRunnable(() -> {
              receiptPreviousAppraisalRepository.deletePreviousAppraisalRepositoryByFileSeq(fileSeq);
              fileService.delete(fileSeq);
            })
        ).subscribe();
  }

  /**
   * 협의 공고 첨부 파일을 등록한다.
   *
   * @param judgSeq                               재결일련번호
   * @param caseNo                                사건번호
   * @param previousAppraisalAttachmentUploadFile 파일 정보
   */
  public void insertPreviousAppraisalAttachment(long judgSeq, String caseNo, ReceiptPreviousAppraisalAttachmentUploadFile previousAppraisalAttachmentUploadFile) {
    var previousAppraisalAttachmentFile = previousAppraisalAttachmentUploadFile.getAttachment().getFile();

    // 파일 일련번호가 있고, 파일이 없다면 협의 공고 첨부 파일 정보를 수정한다.
    if (previousAppraisalAttachmentUploadFile.getPreviousAppraisalFileSeq() != null && previousAppraisalAttachmentFile == null) {
      receiptPreviousAppraisalRepository.updatePreviousAppraisalAttachment(previousAppraisalAttachmentUploadFile);
      return;
    }

    try {
      // 파일 일련번호가 없다면 파일 다시 업로드 한다.
      if (previousAppraisalAttachmentUploadFile.getPreviousAppraisalFileSeq() != null) {
        fileService.change(previousAppraisalAttachmentUploadFile.getPreviousAppraisalFileSeq(), previousAppraisalAttachmentFile);
        return;
      }

      // 파일을 업로드 하고 협의 공고  정보를 등록한다.
      Long fileSeq = fileService.upload(caseNo, FileTypeCode.RECEIPT_FILE_UPLOAD, previousAppraisalAttachmentFile);
      previousAppraisalAttachmentUploadFile.setPreviousAppraisalFileSeq(fileSeq);
      receiptPreviousAppraisalRepository.insertPreviousAppraisal(judgSeq, previousAppraisalAttachmentUploadFile);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }
}