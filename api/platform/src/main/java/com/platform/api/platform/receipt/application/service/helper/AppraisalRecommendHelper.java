package com.platform.api.platform.receipt.application.service.helper;

import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.service.FileService;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalRecommend;
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
public class AppraisalRecommendHelper {

  private final FileService fileService;
  private final ReceiptPreviousAppraisalRepository receiptPreviousAppraisalRepository;
  private final ReceiptPreviousAppraisalReadRepository receiptPreviousAppraisalReadRepository;

  /**
   * 협의 감졍평가 추천 정보를 삭제한다.
   *
   * @param judgSeq                               재결일련번호
   * @param receiptPreviousAppraisalRecommendList 협의 감졍평가 추천 정보
   */
  public void removeReceiptAppraisalRecommendList(long judgSeq, List<ReceiptPreviousAppraisalRecommend> receiptPreviousAppraisalRecommendList) {
    var requestList = receiptPreviousAppraisalRecommendList
        .stream()
        .map(ReceiptPreviousAppraisalRecommend::getRecommendFileSeq)
        .collect(Collectors.toSet());

    // DB에 없는 파일 일련번호를 추출 한다.
    var removeFileSeqSet = receiptPreviousAppraisalReadRepository.findReceiptAppraisalRecommendByJudgSeq(judgSeq)
        .stream()
        .map(ReceiptPreviousAppraisalRecommend::getRecommendFileSeq)
        .filter(seq -> !requestList.contains(seq))
        .collect(Collectors.toSet());

    // 파일 일련번호로 가지고 감졍평가 추천 정보를 삭제한다.
    Flux.fromIterable(removeFileSeqSet)
        .flatMap(fileSeq ->
            Mono.fromRunnable(() -> {
              receiptPreviousAppraisalRepository.deleteAppraisalRecommendByRecommendFileSeq(fileSeq);
              fileService.delete(fileSeq);
            })
        ).subscribe();
  }

  /**
   * 협의 감졍평가 추천 정보를 등록 또는 수정 한다.
   *
   * @param receiptAppraisalSeq               협의감정평가 일련번호
   * @param caseNo                            사건 번호
   * @param receiptPreviousAppraisalRecommend 협의 감졍평가 추천 정보
   */
  public void insertAppraisalRecommend(long receiptAppraisalSeq, String caseNo, ReceiptPreviousAppraisalRecommend receiptPreviousAppraisalRecommend) {
    var recommendFile = receiptPreviousAppraisalRecommend.getAttachment().getFile();

    // 파일 일련번호가 있고, 파일이 없다면 협의 감졍평가 추천 정보
    if (receiptPreviousAppraisalRecommend.getRecommendFileSeq() != null && recommendFile == null) {
      receiptPreviousAppraisalRepository.updateReceiptAppraisalRecommend(receiptAppraisalSeq, receiptPreviousAppraisalRecommend);
      return;
    }

    try {
      // 파일 일련번호가 없다면 파일 다시 업로드 한다.
      if (receiptPreviousAppraisalRecommend.getRecommendFileSeq() != null) {
        fileService.change(receiptPreviousAppraisalRecommend.getRecommendFileSeq(), recommendFile);
        return;
      }

      // 파일을 업로드 하고 협의 감졍평가 추천 정보를 등록한다.
      Long fileSeq = fileService.upload(caseNo, FileTypeCode.APPRAISAL_RECOMMEND_FILE_UPLOAD, recommendFile);
      receiptPreviousAppraisalRecommend.setRecommendFileSeq(fileSeq);
      receiptPreviousAppraisalRepository.insertOrUpdateReceiptAppraisalRecommend(receiptAppraisalSeq, receiptPreviousAppraisalRecommend);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }
}
