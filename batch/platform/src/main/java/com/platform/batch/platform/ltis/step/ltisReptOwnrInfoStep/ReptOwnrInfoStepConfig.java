package com.platform.batch.platform.ltis.step.ltisReptOwnrInfoStep;

import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.ltis.dto.LtisReptOwnrInfoDto;
import com.platform.batch.platform.ltis.job.LtisDataBatch;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisReptOwnrInfoEntity;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
class ReptOwnrInfoStepConfig {

  @Bean(LtisDataBatch.STEP5_NAME)
  Step reptOwnrInfoStep(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager,
      ReptOwnrInfoHttpItemReader reptOwnrInfoHttpItemReader,
      ReptOwnrInfoItemProcessor reptOwnrInfoItemProcessor,
      ReptOwnrInfoItemWriter reptOwnrInfoItemWriter
  ) {
    return new StepBuilder(LtisDataBatch.STEP5_NAME, jobRepository)
        .<List<LtisReptOwnrInfoDto>, List<LtisReptOwnrInfoEntity>>chunk(500, transactionManager)
        .reader(reptOwnrInfoHttpItemReader)
        .processor(reptOwnrInfoItemProcessor)
        .writer(reptOwnrInfoItemWriter)
        .faultTolerant()
        .retry(ItemStreamException.class)
        .retryLimit(3)
        .build();
  }
}
