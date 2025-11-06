package com.platform.datasource.base.dto.ltis;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.LtisInfoEntity;

@Schema(name = "LTISInfo", description = "조서 정보")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LTISInfo extends LtisInfoEntity {
    @Schema(description = "면적")
    private BigDecimal areaAmot;
}