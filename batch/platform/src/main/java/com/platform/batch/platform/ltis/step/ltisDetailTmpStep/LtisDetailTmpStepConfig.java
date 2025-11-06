package com.platform.batch.platform.ltis.step.ltisDetailTmpStep;

import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.ltis.dto.LtisApiDto;
import com.platform.batch.platform.ltis.job.LtisDataBatch;
import org.jooq.generated.tables.pojos.LtisTmpEntity;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemStreamException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
class LtisDetailTmpStepConfig {

  @Bean(LtisDataBatch.STEP2_NAME)
  Step ltisDetailTmpSTEP(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager,
      LtisDetailHttpItemReader ltisDetailHttpItemReader,
      LtisDetailItemProcessor ltisDetailItemProcessor,
      LtisDetailItemWriter ltisDetailItemWriter) {
    return new StepBuilder(LtisDataBatch.STEP2_NAME, jobRepository)
        .<LtisApiDto, LtisTmpEntity>chunk(500, transactionManager)
        .reader(ltisDetailHttpItemReader)
        .processor(ltisDetailItemProcessor)
        .writer(ltisDetailItemWriter)
        .faultTolerant()
        .retry(ItemStreamException.class)
        .retryLimit(3)
        .build();
  }
}
