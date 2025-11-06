package com.platform.datasource.base.dto.reference;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.ReferencePrecedentEntity;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
@Schema(name = "PrecedentDetailInfo", description = "판례 조회 상세 결과")
public class PrecedentDetailInfo extends ReferencePrecedentEntity {

  @Schema(name = "templateName", description = "쟁점의견")
  private String templateName;

}
