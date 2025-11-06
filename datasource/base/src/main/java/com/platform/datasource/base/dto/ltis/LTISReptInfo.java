package com.platform.datasource.base.dto.ltis;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.LtisReptInfoEntity;

@Schema(name = "LTISReptInfo", description = "조서 정보")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LTISReptInfo extends LtisReptInfoEntity {

  private String ownrIntrNm;
  private String landShre;
}
