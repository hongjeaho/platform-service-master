package com.platform.batch.platform.ltis.step.ltisOwnrInfoStep;

import com.platform.datasource.base.mapper.batch.ltisApi.LtisDataMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.LtisOwnrInfoEntity;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LtisOwnrInfoItemWriter implements ItemWriter<List<LtisOwnrInfoEntity>> {

  private final LtisDataMapper ltisDataMapper;

  @Override
  public void write(Chunk<? extends List<LtisOwnrInfoEntity>> chunk) throws Exception {
    var list = chunk.getItems();

    if (list.isEmpty()) {
      return;
    }

    chunk.getItems().forEach(ltisDataMapper::insertOwnrInfo);
    log.info("[LTIS-WRITER] inserted {} rows into ltis_ownr", chunk.getItems().size());
  }
}
