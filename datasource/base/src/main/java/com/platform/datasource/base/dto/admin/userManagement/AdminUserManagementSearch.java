package com.platform.datasource.base.dto.admin.userManagement;

import com.platform.common.base.dto.AbstractPagingDTO;
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
@Schema(name = "AdminUserManagementSearch", description = "회원 관리 검색 조건")
public class AdminUserManagementSearch extends AbstractPagingDTO {

  @Schema(description = "검색 키워드")
  private String keyword;

  @Schema(description = "검색 구분")
  private String searchType;

  @Schema(description = "권한 구분")
  private List<String> userRoles;
}
