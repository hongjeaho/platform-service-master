package com.platform.batch.platform.ltis.step.ltisReptInfoStep;

import com.platform.batch.platform.ltis.dto.LtisReptInfoDto;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisReptInfoEntity;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class LtisReptInfoItemProcessor implements ItemProcessor<List<LtisReptInfoDto>, List<LtisReptInfoEntity>> {

  @Override
  public List<LtisReptInfoEntity> process(List<LtisReptInfoDto> item) throws Exception {
    return item.stream()
        .map(LtisReptInfoDto::toEntity)
        .toList();
  }
}
