package com.platform.api.platform.account.security.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "PasswordUpdateRequest", description = "비밀번호 변경 요청")
public class PasswordUpdateRequest {

  @NotBlank(message = "현재 비밀번호는 필수입니다.")
  @Schema(description = "현재 비밀번호", example = "currentPassword123!", required = true)
  private String currentPassword;

  @NotBlank(message = "새 비밀번호는 필수입니다.")
  @Schema(description = "새 비밀번호", example = "newPassword123!", required = true)
  private String newPassword;
}