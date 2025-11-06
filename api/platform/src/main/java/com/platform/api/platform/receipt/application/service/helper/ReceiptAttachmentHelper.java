package com.platform.api.platform.receipt.application.service.helper;

import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.service.FileService;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptAttachmentUploadFile;
import com.platform.datasource.base.repository.receipt.ReceiptReadRepository;
import com.platform.datasource.base.repository.receipt.ReceiptRepository;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
@PlatFormTransactional
public class ReceiptAttachmentHelper {

  private final FileService fileService;
  private final ReceiptRepository receiptRepository;
  private final ReceiptReadRepository receiptReadRepository;

  /**
   * 첨부 파일을 등록한다.
   *
   * @param judgSeq                     재결일련번호
   * @param caseNo                      재결사건번호
   * @param receiptAttachmentUploadFile 첨부파일 정보
   */
  public void insertReceiptAttachment(long judgSeq, String caseNo, ReceiptAttachmentUploadFile receiptAttachmentUploadFile) {
    var receiptAttachmentFile = receiptAttachmentUploadFile.getAttachment().getFile();

    if (receiptAttachmentUploadFile.getAttachmentFileSeq() != null && receiptAttachmentFile == null) {
      receiptRepository.updateCaseInfoFile(receiptAttachmentUploadFile);
    } else if (receiptAttachmentUploadFile.getAttachmentFileSeq() != null && receiptAttachmentFile != null) {
      fileService.change(receiptAttachmentUploadFile.getAttachmentFileSeq(), receiptAttachmentFile);
    } else {
      uploadAndInsertCaseFile(judgSeq, caseNo, receiptAttachmentUploadFile);
    }
  }

  /**
   * 파일을 업로드하고, 데이터베이스에 정보를 저장한다.
   *
   * @param judgSeq                     재결일련번호
   * @param caseNo                      재결사건번호
   * @param receiptAttachmentUploadFile 첨부파일 정보
   */
  private void uploadAndInsertCaseFile(long judgSeq, String caseNo, ReceiptAttachmentUploadFile receiptAttachmentUploadFile) {
    try {
      var receiptAttachmentFile = receiptAttachmentUploadFile.getAttachment().getFile();
      if (receiptAttachmentFile == null) {
        return;
      }

      // 파일 업로드
      Long fileSeq = fileService.upload(caseNo, FileTypeCode.RECEIPT_FILE_UPLOAD, receiptAttachmentFile);
      receiptAttachmentUploadFile.setAttachmentFileSeq(fileSeq);

      // 접수 첨부파일 정보 등록
      receiptRepository.insertReceiptAttachment(judgSeq, receiptAttachmentUploadFile);

    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 첨부 파일 목록에서 삭제된 파일을 삭제한다.
   *
   * @param judgSeq                         재결일련번호
   * @param receiptAttachmentUploadFileList 사건접수 첨부파일 목록
   */
  public void removeReceiptAttachment(long judgSeq, List<ReceiptAttachmentUploadFile> receiptAttachmentUploadFileList) {
    var requestList = extractFileSeqSet(receiptAttachmentUploadFileList);

    var removeFileSeqSet = extractFileSeqSet(receiptReadRepository.findReceiptAttachmentByJudgSeq(judgSeq)).stream()
        .filter(seq -> !requestList.contains(seq))
        .collect(Collectors.toSet());

    Flux.fromIterable(removeFileSeqSet)
        .flatMap(fileSeq ->
            Mono.fromRunnable(() -> {
              receiptRepository.deleteCaseInfoFileByFileSeq(fileSeq);
              fileService.delete(fileSeq);
            })
        ).subscribe();
  }

  /**
   * 파일일련번호 추출
   *
   * @param list 추출 대상
   * @return 파일일련번호 set
   */
  public static Set<Long> extractFileSeqSet(List<ReceiptAttachmentUploadFile> list) {
    return list.stream()
        .map(ReceiptAttachmentUploadFile::getAttachmentFileSeq)
        .collect(Collectors.toSet());
  }
}
