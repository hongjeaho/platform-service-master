package com.platform.api.platform.receipt.application.controller;

import com.platform.api.platform.receipt.application.dto.ReceiptCaseInfo;
import com.platform.api.platform.receipt.application.service.ReceiptService;
import com.platform.datasource.base.dto.receipt.ReceiptAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalRecommend;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalEntity;
import org.jooq.generated.tables.pojos.ReceiptQuantityReportEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Receipt base API", description = "사건 접수 정보 API")
@RestController
@RequestMapping("/api/receipt/base")
@RequiredArgsConstructor
public class ReceiptController {

  private final ReceiptService receiptService;

  @Operation(summary = "사업 개요", description = "사업개요 정보를 등록한다.")
  @PostMapping("/{judgSeq}")
  ResponseEntity<Boolean> insertOrUpdateReceiptCaseInfo(
      @PathVariable long judgSeq,
      @RequestBody ReceiptCaseInfo receiptCaseInfo
  ) {
    receiptService.insertOrUpdateReceiptCaseInfo(judgSeq, receiptCaseInfo);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "총 물량조서", description = "총 물량조서 정보를 등록한다.")
  @PostMapping("/{judgSeq}/totalQuantityReport")
  ResponseEntity<Boolean> insertOrUpdateReceiptQuantityReport(
      @PathVariable long judgSeq,
      @RequestBody ReceiptQuantityReportEntity quantityReport
  ) {
    receiptService.insertOrUpdateQuantityReport(judgSeq, quantityReport);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "협의 감정평가 정보 ", description = "협의 감정평가 정보 정보를 등록한다.")
  @PostMapping(value = "/{judgSeq}/previousAppraisal", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  ResponseEntity<Boolean> insertOrUpdateReceiptAppraisal(
      @PathVariable long judgSeq,
      @Parameter(description = "협의 감정평가 정보.")
      @RequestPart ReceiptPreviousAppraisalEntity receiptPreviousAppraisal,
      @Parameter(description = "협의 공고 첨부파일 정보.")
      @RequestPart List<ReceiptPreviousAppraisalAttachmentUploadFile> receiptPreviousAppraisalAttachmentUploadFileList,
      @Parameter(description = "협의 공고 첨부파일 파일.", content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE))
      @RequestPart(required = false) List<MultipartFile> receiptPreviousAppraisalAttachmentUploadFiles,

      @Parameter(description = "협의 감정 추천 정보")
      @RequestPart List<ReceiptPreviousAppraisalRecommend> receiptPreviousAppraisalRecommendList,
      @Parameter(
          description = "협의 감정 추천 정보 첨부파일 파일.",
          content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
      )
      @RequestPart(required = false) List<MultipartFile> receiptPreviousAppraisalRecommendFiles
  ) {

    // 협의 파일 정제
    for (int index = 0; index < receiptPreviousAppraisalAttachmentUploadFileList.size(); index++) {
      var request = receiptPreviousAppraisalAttachmentUploadFileList.get(index);
      request.attachFile(receiptPreviousAppraisalAttachmentUploadFiles.get(index));
    }

    // 감정평가서 파일 정제
    for (int index = 0; index < receiptPreviousAppraisalRecommendList.size(); index++) {
      var request = receiptPreviousAppraisalRecommendList.get(index);
      request.attachFile(receiptPreviousAppraisalRecommendFiles.get(index));
    }

    receiptService.insertOrUpdateReceiptAppraisal(judgSeq, receiptPreviousAppraisal, receiptPreviousAppraisalRecommendList, receiptPreviousAppraisalAttachmentUploadFileList);
    return ResponseEntity.ok().body(true);
  }

  /**
   * 사건 접수 첨부파일을 등록하거나 업데이트하는 메서드입니다.
   *
   * @param judgSeq                         재결일련번호
   * @param receiptAttachmentUploadFileList 첨부파일 정보 리스트
   * @param files                           첨부 파일 리스트 (선택사항)
   * @return 첨부파일 등록 또는 업데이트 성공 여부
   */
  @Operation(summary = "사건접수  첨부파일 등록", description = "첨부파일을 등록한다.")
  @PostMapping(value = "/{judgSeq}/receiptAttachment",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  ResponseEntity<Boolean> insertOrUpdateReceiptAttachment(
      @PathVariable long judgSeq,
      @Parameter(
          description = "첨부파일 정보 리스트를 받습니다.",
          content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
      )
      @RequestPart List<ReceiptAttachmentUploadFile> receiptAttachmentUploadFileList,
      @Parameter(
          description = "첨부 파일 리스트를 받습니다.",
          content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
      )
      @RequestPart(required = false) List<MultipartFile> files
  ) {

    for (int index = 0; index < receiptAttachmentUploadFileList.size(); index++) {
      ReceiptAttachmentUploadFile receiptAttachmentUploadFile = receiptAttachmentUploadFileList.get(index);
      receiptAttachmentUploadFile.attachFile(files.get(index));
    }

    receiptService.insertOrUpdateAttachment(judgSeq, receiptAttachmentUploadFileList);
    return ResponseEntity.ok().body(true);
  }

  @Operation(summary = "접수 완료 처리", description = "사업시행자 접수 완료 처리 한다.")
  @PostMapping("{judgSeq}/complete")
  public ResponseEntity<Boolean> sendReceiptComplete(@PathVariable long judgSeq) {
    receiptService.sendReceiptComplete(judgSeq);
    return ResponseEntity.ok(true);
  }
}