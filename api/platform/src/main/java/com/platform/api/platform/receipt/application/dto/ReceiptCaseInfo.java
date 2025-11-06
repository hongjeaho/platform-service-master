package com.platform.api.platform.receipt.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.ReceiptAgreementDateEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessInfoEntity;
import org.jooq.generated.tables.pojos.ReceiptBusinessRecognitionEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "ReceiptCaseInfo", description = "사업시행자 사건 접수 정보")
public class ReceiptCaseInfo {

  @Schema(description = "사건 개요 정보")
  private ReceiptBusinessInfoEntity businessInfo;

  @Schema(description = "사업인정관계 정보")
  private List<ReceiptBusinessRecognitionEntity> businessRecognitionList;

  @Schema(description = "햡의 날짜 정보")
  private List<ReceiptAgreementDateEntity> agreementDateList;
}
