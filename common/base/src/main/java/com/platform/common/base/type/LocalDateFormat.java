package com.platform.common.base.type;

import lombok.Getter;

import java.time.format.DateTimeFormatter;

import static java.time.format.DateTimeFormatter.ofPattern;

@Getter
public  enum LocalDateFormat {

    DATE("yyyy-MM-dd"), DATE_TIME("yyyy-MM-dd HH:mm:ss");

    private final String format;

    LocalDateFormat(final String format) {
        this.format = format;
    }

    public DateTimeFormatter getFormatter() {
        return ofPattern(format);
    }
}
