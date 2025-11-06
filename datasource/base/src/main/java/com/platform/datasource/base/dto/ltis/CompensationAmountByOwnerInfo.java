package com.platform.datasource.base.dto.ltis;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Schema(name = "CompensationAmountByOwnerInfo", description = "소유자 보상 정보")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompensationAmountByOwnerInfo {
    @Schema(description = "소유자 일련번호")
    private long ownrSeq;
    @Schema(description = "소유자 이름")
    private String ownrIntrNm;
    @Schema(description = "토지 건수")
    private int landCnt;
    @Schema(description = "물건 건수")
    private int objectCnt;
    @Schema(description = "종전금액")
    private long bizOprtPrice;
    @Schema(description = "A 평가 금액")
    private long frstCompAmtSum;
    @Schema(description = "B 평가 금액")
    private long secdCompAmtSum;
    @Schema(description = "평균 금액")
    private long avgCompAmtSum;
    @Schema(description = "종전 금액 격차")
    private long increasedAmtSum;
    @Schema(description = "종점 금액 상승율")
    private BigDecimal increasedRate;
}