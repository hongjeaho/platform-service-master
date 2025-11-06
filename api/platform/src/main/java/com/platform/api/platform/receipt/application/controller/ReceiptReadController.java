package com.platform.api.platform.receipt.application.controller;

import com.platform.api.platform.receipt.application.dto.ReceiptAppraisalResponse;
import com.platform.api.platform.receipt.application.dto.ReceiptCaseInfo;
import com.platform.api.platform.receipt.application.dto.ReceiptSearchResponse;
import com.platform.api.platform.receipt.application.service.ReceiptReadService;
import com.platform.datasource.base.dto.receipt.ReceiptAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.ReceiptQuantityReportEntity;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Receipt base API", description = "사건 접수 정보 API")
@RestController
@RequestMapping("/api/receipt/base")
@RequiredArgsConstructor
public class ReceiptReadController {

  private final ReceiptReadService receiptReadService;

  @Operation(summary = "접수 리스트 조회", description = "접수된 정보를 내려준다.")
  @GetMapping
  ResponseEntity<ReceiptSearchResponse> getReceiptCaseInfoList(
      @ParameterObject ReceiptSearch search) {
    return ResponseEntity.ok().body(receiptReadService.getReceiptList(search));
  }

  @Operation(summary = "사건 접수 진행 상태 조회", description = "작성중인 사건의 진생 상태 코드를 반환 한다.")
  @GetMapping("/{judgSeq}/currentStatusCode")
  ResponseEntity<String> getReceiptCurrentStatusCode(@PathVariable long judgSeq) {
    return ResponseEntity.ok().body(receiptReadService.getReceiptCurrentStatusCode(judgSeq));
  }

  @Operation(summary = "재결 접수 - 사업개요 정보 조회", description = "사업 정보와 협의 일자를 조회 한다.")
  @GetMapping("/{judgSeq}/businessInfo")
  ResponseEntity<ReceiptCaseInfo> getReceiptCaseInfoByJudgSeq(@PathVariable Long judgSeq) {
    return ResponseEntity.ok().body(
        ReceiptCaseInfo.builder()
            .businessInfo(receiptReadService.getReceiptBusinessInfoByJudgSeq(judgSeq))
            .businessRecognitionList(receiptReadService.getReceiptBusinessRecognitionByJudgSeq(judgSeq))
            .agreementDateList(receiptReadService.getAgreementDateByJudgSeq(judgSeq))
            .build()
    );
  }

  @Operation(summary = "재결 접수 - 총물량조서 정보 조회", description = "총물량조서 정보 조회 한다.")
  @GetMapping("/{judgSeq}/quantityReport")
  ResponseEntity<ReceiptQuantityReportEntity> getReceiptQuantityReportByJudgSeq(@PathVariable Long judgSeq) {
    return ResponseEntity.ok().body(receiptReadService.getReceiptQuantityReportByJudgSeq(judgSeq));
  }


  @Operation(summary = "재결 접수 - 협의 감정평가  조회", description = "협의 감정평가 정보 조회 한다.")
  @GetMapping("/{judgSeq}/previousAppraisal")
  ResponseEntity<ReceiptAppraisalResponse> getReceiptPreviousAppraisalByJudgSeq(@PathVariable Long judgSeq) {
    return ResponseEntity.ok().body(receiptReadService.getReceiptPreviousAppraisalByJudgSeq(judgSeq));
  }


  @Operation(summary = "재결 접수 첨부파일 정보 조회", description = "첨부파일 정보 조회 한다.")
  @GetMapping("/{judgSeq}/attachment")
  ResponseEntity<List<ReceiptAttachmentUploadFile>> getReceiptAttachmentByJudgSeq(@PathVariable Long judgSeq) {
    return ResponseEntity.ok().body(receiptReadService.getReceiptAttachmentByJudgSeq(judgSeq));
  }
}
