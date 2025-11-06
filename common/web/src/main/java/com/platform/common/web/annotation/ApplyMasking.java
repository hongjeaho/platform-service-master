package com.platform.common.web.annotation;

import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface ApplyMasking {
    MaskingPattern pattern() default MaskingPattern.DEFAULT;
}
