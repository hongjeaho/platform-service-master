package com.platform.datasource.base.dto.ltis;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;

@Schema(name = "AppraisalInfo", description = "감정평가 정보")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppraisalInfo {
    @Schema(description = "협의평가 종점 금액")
    private long bizOprtPrice;
    @Schema(description = "수용재결 A 금액")
    private long frstCompAmtSum;
    @Schema(description = "수용재결 B 금액")
    private long secdCompAmtSum;
    @Schema(description = "수용재결 평균 금액")
    private long avgCompAmtSum;
    @Schema(description = "수용재결 격차 금액")
    private long increasedAmtSum;
    @Schema(description = "수용재결 상승율")
    private BigDecimal increasedRate;
}
