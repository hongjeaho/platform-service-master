package com.platform.batch.platform.ltis.step.ltisOwnrInfoStep;

import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.ltis.dto.LtisOwnrInfoDto;
import com.platform.batch.platform.ltis.job.LtisDataBatch;
import java.util.List;
import org.jooq.generated.tables.pojos.LtisOwnrInfoEntity;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
class LtisOwnrInfoStepConfig {

  @Bean(LtisDataBatch.STEP4_NAME)
  Step ownrInfoStep(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager,
      LtisOwnrInfoHttpItemReader ltisOwnrInfoHttpItemReader,
      LtisOwnrInfoItemProcessor ltisOwnrInfoItemProcessor,
      LtisOwnrInfoItemWriter ltisOwnrInfoItemWriter
  ) {
    return new StepBuilder(LtisDataBatch.STEP4_NAME, jobRepository)
        .<List<LtisOwnrInfoDto>, List<LtisOwnrInfoEntity>>chunk(500, transactionManager)
        .reader(ltisOwnrInfoHttpItemReader)
        .processor(ltisOwnrInfoItemProcessor)
        .writer(ltisOwnrInfoItemWriter)
        .faultTolerant()
        .retry(ItemStreamException.class)
        .retryLimit(3)
        .build();
  }
}
