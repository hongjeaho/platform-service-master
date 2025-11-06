package com.platform.datasource.base.util.condition;

import java.util.List;
import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.impl.DSL;
import org.springframework.util.CollectionUtils;

public class JooqListConditionUtil {

  public static <T> Condition inIfNotEmpty(Field<T> field, List<T> list) {
    if (CollectionUtils.isEmpty(list)) {
      return DSL.noCondition();
    }
    
    return field.in(list);
  }
}
