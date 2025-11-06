package com.platform.batch.platform.ltis.step.ltisRecmInfoStep;

import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.ltis.dto.LtisRecmInfoDto;
import com.platform.batch.platform.ltis.job.LtisDataBatch;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisRecmInfoEntity;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
class LtisRecmInfoStepConfig {

  @Bean(LtisDataBatch.STEP6_NAME)
  Step recmInfoStep(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager,
      LtisRecmInfoHttpItemReader ltisRecmInfoHttpItemReader,
      LtisRecmInfoItemProcessor ltisRecmInfoItemProcessor,
      LtisRecmInfoItemWriter ltisRecmInfoItemWriter
  ) {
    return new StepBuilder(LtisDataBatch.STEP6_NAME, jobRepository)
        .<List<LtisRecmInfoDto>, List<LtisRecmInfoEntity>>chunk(500, transactionManager)
        .reader(ltisRecmInfoHttpItemReader)
        .processor(ltisRecmInfoItemProcessor)
        .writer(ltisRecmInfoItemWriter)
        .faultTolerant()
        .retry(ItemStreamException.class)
        .retryLimit(3)
        .build();
  }
}
