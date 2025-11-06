package com.platform.datasource.base.dto.admin.userManagement;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.UserEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "AdminUserManagementResult", description = "회원 관리 조회 결과")
public class AdminUserManagementResult extends UserEntity {
  private String userRole;
}
