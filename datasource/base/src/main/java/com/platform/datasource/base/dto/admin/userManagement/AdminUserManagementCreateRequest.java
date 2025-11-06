package com.platform.datasource.base.dto.admin.userManagement;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.UserEntity;
import org.springframework.util.StringUtils;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "AdminUserManagementCreateRequest", description = "회원 관리 등록")
public class AdminUserManagementCreateRequest extends UserEntity {

  private String userRole;
  private String  userPasswordConfirm;

  public UserEntity ofCreateUserEntity(final String password) {
    var userEntity = new UserEntity();
    userEntity.setUserId(this.getUserId());
    userEntity.setUserEmail(this.getUserEmail());
    userEntity.setUserName(this.getUserName());
    userEntity.setUserPassword(password);

    return userEntity;
  }

  public UserEntity ofUpdateUserEntity(final String password) {
    var userEntity = new UserEntity();
    userEntity.setUserEmail(this.getUserEmail());
    userEntity.setUserName(this.getUserName());

    if(StringUtils.hasText(password)) {
      userEntity.setUserPassword(password);
    }

    return userEntity;
  }
}
