package com.platform.api.platform.receipt.application.dto;

import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalAttachmentUploadFile;
import com.platform.datasource.base.dto.receipt.ReceiptPreviousAppraisalRecommend;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalEntity;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Schema(name = "ReceiptAppraisalResponse", description = "협의 감정평가 정보")
public class ReceiptAppraisalResponse {

  @Schema(name = "receiptPreviousAppraisal", description = "협의 감정평가 정보")
  private ReceiptPreviousAppraisalEntity receiptPreviousAppraisal;

  @Schema(name = "receiptPreviousAppraisalRecommendList", description = "협의 감정평가 추천 정보")
  private List<ReceiptPreviousAppraisalRecommend> receiptPreviousAppraisalRecommendList;

  @Schema(name = "receiptPreviousAppraisalAttachmentUploadFileList", description = "협의 공고 파일 정보")
  private List<ReceiptPreviousAppraisalAttachmentUploadFile> receiptPreviousAppraisalAttachmentUploadFileList;
}