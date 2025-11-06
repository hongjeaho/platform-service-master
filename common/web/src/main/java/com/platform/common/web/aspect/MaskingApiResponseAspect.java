package com.platform.common.web.aspect;

import com.platform.common.base.dto.AbstractDTO;
import com.platform.common.web.annotation.ApplyMasking;
import com.platform.common.web.annotation.MaskingPattern;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.List;

@Slf4j
@Aspect
@Component
public class MaskingApiResponseAspect {

    private static final String ASTERISK = "*";

    @Pointcut("@annotation(com.platform.common.web.annotation.ApplyMasking)")
    public void shouldMaskedMethodPointcut() {
    }

    @Pointcut("execution ( * com.platform..controller..*.*(..)) && shouldMaskedMethodPointcut()")
    public void controllerExecutionPointcut() {
    }

    @Around(value = "controllerExecutionPointcut()")
    public Object aroundShouldMaskedControllerMethodReturned(ProceedingJoinPoint pjp) throws Throwable {
        Object result = pjp.proceed();

        if (result instanceof List<?>) {
            maskDataList((List<?>) result);
        } else if (result != null) {
            maskData(result);
        }

        return result;
    }

    private void maskDataList(List<?> dataList) {
        if (dataList == null || dataList.isEmpty()) {
            return;
        }

        dataList.forEach(this::maskData);
    }

    private void maskData(Object data) {
        if (data == null) {
            return;
        }

        var currentClass = data.getClass();
        while (currentClass != Object.class) {
            Field[] allFields = currentClass.getDeclaredFields();
            for (Field field : allFields) {
                if (AbstractDTO.class.isAssignableFrom(field.getType())) {
                    field.setAccessible(true);
                    try {
                        maskData(field.get(data));
                    } catch (IllegalAccessException e) {
                        log.error("Error accessing field for masking", e);
                    }
                }

                if (field.isAnnotationPresent(ApplyMasking.class) && field.getType() == String.class) {
                    maskField(field, data, field.getAnnotation(ApplyMasking.class).pattern());
                }
            }
            currentClass = currentClass.getSuperclass();
        }
    }

    private void maskField(Field field, Object data, MaskingPattern maskingPattern) {
        try {
            field.setAccessible(true);
            var currentValue = (String) field.get(data);

            if (currentValue == null || currentValue.isEmpty()) {
                return;
            }

            field.set(data, maskValue(currentValue, maskingPattern.get()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Cannot mask field: " + field, e);
        }
    }

    private String maskValue(final String value, final String regexPattern) {
        final var length = value.length();
        switch (length) {
            case 0:
                return value;
            case 1:
                return ASTERISK;
            case 2:
                return value.charAt(0) + ASTERISK;
            default:
                break;
        }

        if (regexPattern.isEmpty()) {
            return value.charAt(0) + ASTERISK.repeat(length - 1);
        }
        return value.replaceAll(regexPattern, ASTERISK);
    }
}