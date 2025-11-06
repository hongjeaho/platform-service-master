package com.platform.datasource.base.dto.decree;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.ReferenceDecreeDetailEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "DecreeDetailInfo", description = "법령 정보 조회 상세 결과")
public class DecreeDetailInfo extends ReferenceDecreeDetailEntity {

  @Schema(name = "decreeName", description = "법령 및 시행규칙 명")
  private String decreeName;

  @Schema(name = "decreeCategoryCode", description = "법령 및 시행규칙 분류코드")
  private String decreeCategoryCode;
  
}
