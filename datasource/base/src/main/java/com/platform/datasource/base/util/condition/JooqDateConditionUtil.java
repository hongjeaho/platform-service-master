package com.platform.datasource.base.util.condition;

import java.time.LocalDate;
import org.jooq.Condition;
import org.jooq.Field;
import org.jooq.impl.DSL;

public class JooqDateConditionUtil {

  public static Condition betweenDateNotNull(Field<LocalDate> field, LocalDate startDate,
      LocalDate endDate) {
    if (startDate == null || endDate == null) {
      return DSL.noCondition();
    }
    return field.between(startDate, endDate);
  }

  public static Condition dateNotNull(Field<LocalDate> field, LocalDate startDate) {
    if (startDate == null) {
      return DSL.noCondition();
    }
    return field.eq(startDate);
  }
}
