package com.platform.batch.platform.ltis.step.ltisListTmpStep;

import com.platform.datasource.base.mapper.batch.ltisApi.LtisTmpMapper;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.LtisTmpEntity;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LtisListItemWriter implements ItemWriter<LtisTmpEntity> {

  private final LtisTmpMapper ltisTmpMapper;

  @Override
  public void write(Chunk<? extends LtisTmpEntity> chunk) {
    List<LtisTmpEntity> list = new ArrayList<>(chunk.getItems());
    if (list.isEmpty()) {
      return;
    }
    ltisTmpMapper.insertLtisListToTmp(list);
    log.info("[LTIS-WRITER] inserted {} rows into ltis_tmp", list.size());
  }
}
