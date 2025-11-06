package com.platform.datasource.base.dto.ltis;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(name = "BusinessSummary", description = "조서 사업 정보")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BusinessSummary {
    @Schema(description = "사건번호")
    private String caseNo;
    @Schema(description = "사건 이름")
    private String caseTitle;
    @Schema(description = "접수 일자")
    private LocalDate recepDt;
    @Schema(description = "진행 상태")
    private String statNm;
    @Schema(description = "시행자가격시점")
    private LocalDate implementerDt;
    @Schema(description = "재결구분")
    private String judgDivNm;
    @Schema(description = "수용재결기관")
    private String dessionCorp;
    @Schema(description = "협의 평가법인")
    private String corpNm;
    @Schema(description = "위치")
    private String address;
    @Schema(description = "규모")
    private String scale;
    @Schema(description = "업데이트 일시")
    private LocalDateTime updatedTime;
}
