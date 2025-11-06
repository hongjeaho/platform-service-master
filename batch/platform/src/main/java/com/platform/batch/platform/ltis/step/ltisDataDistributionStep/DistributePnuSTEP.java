package com.platform.batch.platform.ltis.step.ltisDataDistributionStep;

import static com.platform.batch.platform.common.utils.RetryUtils.executeWithRetry;
import static com.platform.batch.platform.ltis.step.ltisDataDistributionStep.LtisDataDistributionStepConfig.STEP7_DISTRIBUTE_PNU;
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
public class DistributePnuSTEP {

  private final LtisDataService ltisDataService;

  public DistributePnuSTEP(LtisDataService ltisDataService) {
    this.ltisDataService = ltisDataService;
  }

  // 4) PNU 삽입
  @Bean(STEP7_DISTRIBUTE_PNU)
  Step distributePnuStep(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager tx,
      Tasklet distributePnuTasklet) {
    return new StepBuilder(STEP7_DISTRIBUTE_PNU, jobRepository)
        .tasklet(distributePnuTasklet, tx)
        .allowStartIfComplete(true)
        .build();
  }

  @Bean
  Tasklet distributePnuTasklet() {
    return (contribution, ctx) -> {
      long start = System.currentTimeMillis();
      executeWithRetry(ltisDataService::mergeIntoLtisPnu);
      long took = System.currentTimeMillis() - start;
      log.info("[LTIS-DIST] pnu inserted, took={}ms", took);
      return RepeatStatus.FINISHED;
    };
  }
}
