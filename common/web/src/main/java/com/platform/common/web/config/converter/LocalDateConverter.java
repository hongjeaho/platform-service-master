package com.platform.common.web.config.converter;

import com.platform.common.base.type.LocalDateFormat;
import org.springframework.core.convert.converter.Converter;

import java.time.LocalDate;


public class LocalDateConverter implements Converter<String, LocalDate> {

    @Override
    public LocalDate convert(final String value) {
        return LocalDate.parse(value, LocalDateFormat.DATE.getFormatter());
    }
}