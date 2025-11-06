package com.platform.batch.platform.ltis.step.ltisRecmInfoStep;

import com.platform.batch.platform.ltis.dto.LtisRecmInfoDto;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisRecmInfoEntity;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class LtisRecmInfoItemProcessor implements ItemProcessor<List<LtisRecmInfoDto>, List<LtisRecmInfoEntity>> {

  @Override
  public List<LtisRecmInfoEntity> process(List<LtisRecmInfoDto> item) throws Exception {
    return item.stream()
        .map(LtisRecmInfoDto::toEntity)
        .toList();
  }
}
