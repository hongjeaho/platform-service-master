package com.platform.common.web.exception;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.platform.common.web.dto.ErrorCode;
import com.platform.common.web.dto.ErrorDetail;
import com.platform.common.web.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * 애플리케이션의 전역 예외 처리기. 다양한 예외를 처리하고 적절한 오류 응답을 반환합니다.
 */
@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * 인증 관련 예외 처리
   */
  @ExceptionHandler(JWTDecodeException.class)
  public ResponseEntity<ErrorResponse> handleJwtException(
      final HttpServletRequest request,
      final JWTDecodeException ex) {
    log.error("JWT Exception at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    return ResponseEntity
        .status(HttpStatus.UNAUTHORIZED)
        .body(ErrorResponse.of(ErrorCode.AUTH_REQUIRED, "인증이 필요합니다."));
  }

  /**
   * 유효성 검사 관련 예외 처리
   */
  @ExceptionHandler(ValidationException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      final HttpServletRequest request,
      final ValidationException ex) {
    log.error("Validation Exception at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, ex.getMessage()));
  }

  /**
   * 잘못된 인자 예외 처리
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      final HttpServletRequest request,
      final IllegalArgumentException ex) {
    log.error("Illegal Argument Exception at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, ex.getMessage()));
  }

  /**
   * 메소드 인자 유효성 검사 실패 처리
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
      final HttpServletRequest request,
      final MethodArgumentNotValidException ex) {
    log.error("Method Argument Not Valid at {}: {}", request.getRequestURI(), ex.getMessage(), ex);

    List<ErrorDetail> details = ex.getBindingResult().getFieldErrors().stream()
        .map(this::toDetail)
        .collect(Collectors.toList());

    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, "요청 값 검증에 실패했습니다.", details));
  }

  private ErrorDetail toDetail(FieldError fe) {
    return ErrorDetail.builder()
        .field(fe.getField())
        .reason(fe.getCode())
        .message(fe.getDefaultMessage())
        .build();
  }

  /**
   * 요청 파라미터 타입 불일치 처리
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(
      final HttpServletRequest request,
      final MethodArgumentTypeMismatchException ex) {
    log.error("Type Mismatch at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, "요청 파라미터 타입이 올바르지 않습니다."));
  }

  /**
   * 누락된 요청 파라미터 처리
   */
  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(
      final HttpServletRequest request,
      final MissingServletRequestParameterException ex) {
    log.error("Missing Parameter at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, "필수 요청 파라미터가 누락되었습니다: " + ex.getParameterName()));
  }

  /**
   * 잘못된 형식의 요청 본문 처리
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
      final HttpServletRequest request,
      final HttpMessageNotReadableException ex) {
    log.error("Message Not Readable at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(ErrorResponse.of(ErrorCode.VALIDATION_FAILED, "JSON 파싱 오류"));
  }

  /**
   * 기타 모든 예외에 대한 대체 처리기
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
      final HttpServletRequest request,
      final Exception ex) {
    log.error("Unhandled Exception at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ErrorResponse.of(ErrorCode.INTERNAL_ERROR, "서버 내부 오류"));
  }
}
