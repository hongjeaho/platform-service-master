package com.platform.datasource.base.util.condition;

import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.impl.DSL;
import org.jooq.tools.StringUtils;

public class JooqStringConditionUtil {

  public static Condition likeIfNotBlank(Field<String> field, String value) {
    if (StringUtils.isBlank(value)) {
      return DSL.noCondition();
    }
    return field.like("%" + value + "%");
  }

  public static Condition eqIfNotBlank(Field<String> field, String value) {
    if (value == null) {
      return DSL.noCondition();
    }
    return field.eq(value);
  }
}
