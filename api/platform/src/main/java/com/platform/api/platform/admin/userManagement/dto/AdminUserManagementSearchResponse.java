package com.platform.api.platform.admin.userManagement.dto;

import com.platform.datasource.base.dto.admin.userManagement.AdminUserManagementResult;
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
@Schema(name = "AdminUserManagementSearchResponse", description = "회원 관리 목록 조회 결과")
public class AdminUserManagementSearchResponse {
  @Schema(name = "total", description = "전체 count")
  private int total;
  @Schema(name = "resultList", description = "조회 결과")
  private List<AdminUserManagementResult> resultList;
}
