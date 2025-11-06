package com.platform.api.platform.admin.committee.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.AdminCommitteeMemberEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "AdminCommitteeMemberSearchResponse", description = "위원회 명단 조회 결과")
public class AdminCommitteeMemberSearchResponse {

  @Schema(name = "total", description = "전체 count")
  private int total;
  @Schema(name = "resultList", description = "조회 결과")
  private List<AdminCommitteeMemberEntity> resultList;
}
