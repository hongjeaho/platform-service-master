package com.platform.batch.platform.common.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateFromDateTimeDeserializer extends JsonDeserializer<LocalDate> {

  @Override
  public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    String dateTimeStr = p.getText();

    // yyyyMMdd 형식 처리
    if (dateTimeStr.length() == 8 && dateTimeStr.matches("\\d{8}")) {
      return LocalDate.parse(dateTimeStr, DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

    // yyyy-MM-dd HH:mm:ss 형식 처리
    if (dateTimeStr.contains(" ")) {
      LocalDateTime dateTime = LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
      return dateTime.toLocalDate();
    }

    // yyyy-MM-dd 형식 처리
    return LocalDate.parse(dateTimeStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
  }
}