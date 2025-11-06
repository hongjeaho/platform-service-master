package com.platform.batch.platform.ltis.step.ltisReptInfoStep;

import com.platform.datasource.base.mapper.batch.ltisApi.LtisDataMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.LtisReptInfoEntity;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LtisReptInfoItemWriter implements ItemWriter<List<LtisReptInfoEntity>> {

  private final LtisDataMapper ltisDataMapper;

  @Override
  public void write(Chunk<? extends List<LtisReptInfoEntity>> chunk) {
    var list = chunk.getItems();

    if (list.isEmpty()) {
      return;
    }

    chunk.getItems().forEach(ltisDataMapper::insertReptInfo);
    log.info("[LTIS-WRITER] inserted {} rows into ltis_rept_info", chunk.getItems().size());
  }
}
