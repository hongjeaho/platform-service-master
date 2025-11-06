package com.platform.common.web.config.converter;

import com.platform.common.base.type.LocalDateFormat;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

public class LocalDateTimeConverter implements Converter<String, LocalDateTime> {

    @Override
    public LocalDateTime convert(final @NonNull String value) {
        return LocalDateTime.parse(value, LocalDateFormat.DATE_TIME.getFormatter());
    }
}