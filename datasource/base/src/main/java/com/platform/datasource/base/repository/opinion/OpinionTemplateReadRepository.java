package com.platform.datasource.base.repository.opinion;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JOpinionTemplate;
import org.jooq.generated.tables.pojos.OpinionTemplateEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class OpinionTemplateReadRepository {

  private final DSLContext dslContext;
  private final JOpinionTemplate OPINION_TEMPLATE = JOpinionTemplate.OPINION_TEMPLATE;

  public List<OpinionTemplateEntity> findCaseTemplateList() {
    return dslContext.select(OPINION_TEMPLATE.fields())
        .from(OPINION_TEMPLATE)
        .where(OPINION_TEMPLATE.SEQ.notEqual(99L))
        .fetchInto(OpinionTemplateEntity.class);
  }
}
