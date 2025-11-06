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
@Schema(name = "PrecedentResult", description = "판례 전체 내용 조회 결과")
public class PrecedentResult extends ReferencePrecedentEntity {

  @Schema(name = "templateName", description = "쟁점의견")
  private String templateName;

}
