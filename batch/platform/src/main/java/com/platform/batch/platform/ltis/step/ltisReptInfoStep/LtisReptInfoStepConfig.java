package com.platform.batch.platform.ltis.step.ltisReptInfoStep;

import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.ltis.dto.LtisReptInfoDto;
import com.platform.batch.platform.ltis.job.LtisDataBatch;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisReptInfoEntity;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
class LtisReptInfoStepConfig {

  @Bean(LtisDataBatch.STEP3_NAME)
  Step reptInfoStep(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager,
      LtisReptInfoHttpItemReader ltisReptInfoHttpItemReader,
      LtisReptInfoItemProcessor ltisReptInfoItemProcessor,
      LtisReptInfoItemWriter ltisReptInfoItemWriter
  ) {
    return new StepBuilder(LtisDataBatch.STEP3_NAME, jobRepository)
        .<List<LtisReptInfoDto>, List<LtisReptInfoEntity>>chunk(500, transactionManager)
        .reader(ltisReptInfoHttpItemReader)
        .processor(ltisReptInfoItemProcessor)
        .writer(ltisReptInfoItemWriter)
        .faultTolerant()
        .retry(ItemStreamException.class)
        .retryLimit(3)
        .build();
  }
}
