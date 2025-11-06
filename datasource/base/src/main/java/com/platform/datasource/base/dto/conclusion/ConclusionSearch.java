package com.platform.datasource.base.dto.conclusion;


import com.platform.common.base.dto.AbstractPagingDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.ArrayList;
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
@Schema(name = "ConclusionSearch", description = "심의 입력정보 검색 조건")
@Builder
public class ConclusionSearch extends AbstractPagingDTO {

  @Schema(description = "사건 번호 또는 사업명")
  private String keyword;
  @Schema(description = "접수 시작일")
  private LocalDate startRecepDt;
  @Schema(description = "접수 종료일")
  private LocalDate endRecepDt;
  @Schema(description = "검토 진행상태", example = "CC001001")
  @Builder.Default
  private List<String> statusCodeList = new ArrayList<>();
}
