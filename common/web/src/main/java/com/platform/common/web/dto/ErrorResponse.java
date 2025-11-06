package com.platform.common.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.slf4j.MDC;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "ErrorResponse", title = "에러 응답")
public class ErrorResponse {

  private boolean success; // 항상 false
  private ErrorBody error;
  private String traceId;
  private LocalDateTime timestamp;

  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ErrorBody {

    private String code;
    private String message;
    private List<ErrorDetail> details;
  }

  public static ErrorResponse of(ErrorCode code, String message) {
    return of(code, message, null, currentTraceId());
  }

  public static ErrorResponse of(ErrorCode code, String message, List<ErrorDetail> details) {
    return of(code, message, details, currentTraceId());
  }

  public static ErrorResponse of(ErrorCode code, String message, List<ErrorDetail> details,
      String traceId) {
    return ErrorResponse.builder()
        .success(false)
        .error(ErrorBody.builder()
            .code(code.name())
            .message(message)
            .details(details)
            .build())
        .traceId(traceId)
        .timestamp(LocalDateTime.now())
        .build();
  }

  private static String currentTraceId() {
    return MDC.get("traceId");
  }
}
