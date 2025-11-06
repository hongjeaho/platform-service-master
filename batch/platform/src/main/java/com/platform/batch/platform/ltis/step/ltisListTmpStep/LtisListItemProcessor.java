package com.platform.batch.platform.ltis.step.ltisListTmpStep;

import com.platform.batch.platform.ltis.dto.LtisApiDto;
import org.jooq.generated.tables.pojos.LtisTmpEntity;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class LtisListItemProcessor implements ItemProcessor<LtisApiDto, LtisTmpEntity> {

  @Override
  public LtisTmpEntity process(LtisApiDto item) {
    return item.totalDtoToTmpEntity();
  }
}
