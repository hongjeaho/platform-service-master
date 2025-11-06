package com.platform.datasource.base.dto.batch;

import com.platform.common.base.context.UserAccountHolder;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
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
@Schema(name = "UserEntireInfoDto", description = "사용자 전체 정보")
public class UserEntireInfoDto extends UserEntity {

  @Schema(description = "사용자 Role 일련번호")
  private Long userRoleMappingSeq;

  @Schema(description = "사용자 일련번호 (Role Mapping)")
  private Long userSeq;

  @Schema(description = "권한 일련번호")
  private Long roleSeq;

  @Schema(description = "권한 매핑 생성자")
  private Long roleMappingCreatedBy;

  @Schema(description = "권한 매핑 생성일")
  private LocalDateTime roleMappingCreatedTime;

  /**
   * UserEntity 객체를 받아서 UserEntireInfoDto의 UserEntity 관련 필드들을 설정하는 메서드
   *
   * @param userEntity 설정할 UserEntity 객체
   */
  public void setUserEntityFields(UserEntity userEntity) {
    if (userEntity != null) {
      this.setSeq(userEntity.getSeq());
      this.setUserEmail(userEntity.getUserEmail());
      this.setUserName(userEntity.getUserName());
      this.setUserId(userEntity.getUserId());
      this.setUserPassword(userEntity.getUserPassword());
      this.setCreatedBy(userEntity.getCreatedBy());
      this.setCreatedTime(LocalDateTime.now());
    }
  }

  public void setUserRoleEntity(long userRoleSeq, long createdBy) {
    this.setUserRoleMappingSeq(userRoleSeq);
    this.setRoleMappingCreatedBy(createdBy);
    this.setRoleMappingCreatedTime(LocalDateTime.now());
  }

  /**
   * UserEntity 객체를 받아서 UserEntireInfoDto 객체를 생성하는 정적 팩토리 메서드
   *
   * @param userEntity 기반이 되는 UserEntity 객체
   * @return UserEntireInfoDto 객체
   */
  public static UserEntireInfoDto fromUserEntity(UserEntity userEntity) {
    UserEntireInfoDto dto = new UserEntireInfoDto();
    dto.setUserEntityFields(userEntity);
    dto.setRoleMappingCreatedBy(UserAccountHolder.getSeqNo());
    return dto;
  }
}
