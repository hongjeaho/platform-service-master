package com.platform.datasource.base.util.condition;

import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.impl.DSL;

public class JooqConditionUtil {

  public static <T> Condition eq(Field<T> field, T value) {
    if (value == null) {
      return DSL.noCondition();
    }
    return field.eq(value);
  }
}
