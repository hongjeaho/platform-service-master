package com.platform.batch.platform.ltis.step.ltisOwnrInfoStep;

import com.platform.batch.platform.ltis.dto.LtisOwnrInfoDto;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisOwnrInfoEntity;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class LtisOwnrInfoItemProcessor implements ItemProcessor<List<LtisOwnrInfoDto>, List<LtisOwnrInfoEntity>> {

  @Override
  public List<LtisOwnrInfoEntity> process(List<LtisOwnrInfoDto> item) throws Exception {
    return item.stream()
        .map(LtisOwnrInfoDto::toEntity)
        .toList();
  }
}
