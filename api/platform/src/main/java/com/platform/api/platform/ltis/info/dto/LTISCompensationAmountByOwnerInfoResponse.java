package com.platform.api.platform.ltis.info.dto;

import com.platform.datasource.base.dto.ltis.CompensationAmountByOwnerInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "CompensationAmountByOwnerInfoResponse", description = "소유자별 보상액 결과")
public class LTISCompensationAmountByOwnerInfoResponse {

    @Schema(name = "total", description = "전체 count")
    private int total;
    @Schema(name = "resultList", description = "조회 결과")
    private List<CompensationAmountByOwnerInfo> resultList;
}
