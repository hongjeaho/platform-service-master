package com.platform.batch.platform.ltis.step.ltisReptOwnrInfoStep;

import com.platform.datasource.base.mapper.batch.ltisApi.LtisDataMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.LtisReptOwnrInfoEntity;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReptOwnrInfoItemWriter implements ItemWriter<List<LtisReptOwnrInfoEntity>> {

  private final LtisDataMapper ltisDataMapper;

  @Override
  public void write(Chunk<? extends List<LtisReptOwnrInfoEntity>> chunk) throws Exception {
    var list = chunk.getItems();

    if (list.isEmpty()) {
      return;
    }

    chunk.getItems().forEach(ltisDataMapper::insertReptOwnrInfo);
    log.info("[LTIS-WRITER] inserted {} rows into ltis_rept_ownr_info", chunk.getItems().size());
  }
}
