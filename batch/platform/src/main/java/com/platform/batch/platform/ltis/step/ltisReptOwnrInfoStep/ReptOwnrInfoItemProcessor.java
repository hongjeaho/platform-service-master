package com.platform.batch.platform.ltis.step.ltisReptOwnrInfoStep;

import com.platform.batch.platform.ltis.dto.LtisReptOwnrInfoDto;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisReptOwnrInfoEntity;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

@Component
public class ReptOwnrInfoItemProcessor implements ItemProcessor<List<LtisReptOwnrInfoDto>, List<LtisReptOwnrInfoEntity>> {


  @Override
  public List<LtisReptOwnrInfoEntity> process(List<LtisReptOwnrInfoDto> item) throws Exception {
    return item.stream()
        .map(LtisReptOwnrInfoDto::toEntity)
        .toList();
  }
}
