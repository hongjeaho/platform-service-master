package com.platform.batch.platform.ltis.step.ltisDataDistributionStep;

import static com.platform.batch.platform.common.utils.RetryUtils.executeWithRetry;
import static com.platform.batch.platform.ltis.step.ltisDataDistributionStep.LtisDataDistributionStepConfig.STEP7_DISTRIBUTE_INFO;
import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.ltis.service.LtisDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@Configuration
public class DistributeLtisInfoSTEP {

  private final LtisDataService ltisDataService;

  public DistributeLtisInfoSTEP(LtisDataService ltisDataService) {
    this.ltisDataService = ltisDataService;
  }

  // 1) LTIS Info
  @Bean(STEP7_DISTRIBUTE_INFO)
  Step distributeInfoStep(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager tx,
      Tasklet distributeInfoTasklet) {
    return new StepBuilder(STEP7_DISTRIBUTE_INFO, jobRepository)
        .tasklet(distributeInfoTasklet, tx)
        .allowStartIfComplete(true)
        .build();
  }

  @Bean
  Tasklet distributeInfoTasklet() {
    return (contribution, ctx) -> {
      long start = System.currentTimeMillis();
      executeWithRetry(ltisDataService::mergeIntoLtisInfo);
      long took = System.currentTimeMillis() - start;
      log.info("[LTIS-DIST] info merged, took={}ms", took);
      return RepeatStatus.FINISHED;
    };
  }
}
