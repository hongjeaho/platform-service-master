package com.platform.datasource.base.dto.admin.committee;

import com.platform.common.base.dto.AbstractPagingDTO;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "CommitteeMemberSearch", description = "위원회 명단 검색 조건")
public class AdminCommitteeMemberSearch extends AbstractPagingDTO {

  @Schema(description = "위원 이름")
  private String committeeName;

  @Schema(description = "구분 (위원장, 위원)")
  private String committeeType;
}
