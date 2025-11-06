package com.platform.common.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetail {

  @Schema(description = "에러가 발생한 필드명", example = "email")
  private String field;

  @Schema(description = "사유 코드", example = "NotBlank|Size|typeMismatch|duplicate|notFound")
  private String reason;

  @Schema(description = "사유 설명", example = "이메일은 필수입니다")
  private String message;
}
