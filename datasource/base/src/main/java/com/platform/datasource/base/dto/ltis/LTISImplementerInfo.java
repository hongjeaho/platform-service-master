package com.platform.datasource.base.dto.ltis;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "ReptEtcInfo", description = "조서 비고(사업시행자) 정보")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LTISImplementerInfo {
    @Schema(description = "사업시행자 이름")
    private String implementerNm;
    @Schema(description = "사업시행자 전화번호")
    private String implementerPhone;
}
