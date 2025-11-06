package com.platform.batch.platform.ltis.step.ltisRecmInfoStep;

import com.platform.datasource.base.mapper.batch.ltisApi.LtisDataMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.LtisRecmInfoEntity;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LtisRecmInfoItemWriter implements ItemWriter<List<LtisRecmInfoEntity>> {

  private final LtisDataMapper ltisDataMapper;

  @Override
  public void write(Chunk<? extends List<LtisRecmInfoEntity>> chunk) throws Exception {
    var list = chunk.getItems();

    if (list.isEmpty()) {
      return;
    }

    chunk.getItems().forEach(ltisDataMapper::insertRecmInfo);
    log.info("[LTIS-WRITER] inserted {} rows into ltis_recm_info", chunk.getItems().size());
  }
}
