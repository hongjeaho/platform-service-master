package com.platform.batch.platform.ltis.step.ltisDataDistributionStep;

import static com.platform.batch.platform.common.utils.RetryUtils.executeWithRetry;
import static com.platform.batch.platform.ltis.step.ltisDataDistributionStep.LtisDataDistributionStepConfig.STEP7_DELETE_TEMP;
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
public class DeleteDistributeTempSTEP {

  private final LtisDataService ltisDataService;

  public DeleteDistributeTempSTEP(LtisDataService ltisDataService) {
    this.ltisDataService = ltisDataService;
  }

  // 5) TMP 삭제(마지막 독립 트랜잭션)
  @Bean(STEP7_DELETE_TEMP)
  Step deleteTmpStep(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager tx,
      Tasklet deleteTmpTasklet) {
    return new StepBuilder(STEP7_DELETE_TEMP, jobRepository)
        .tasklet(deleteTmpTasklet, tx)
        .allowStartIfComplete(true)
        .build();
  }

  @Bean
  Tasklet deleteTmpTasklet() {
    return (contribution, ctx) -> {
      long start = System.currentTimeMillis();
      executeWithRetry(ltisDataService::deleteLtisTmpData);
      long took = System.currentTimeMillis() - start;
      log.info("[LTIS-DIST] tmp deleted, took={}ms", took);
      return RepeatStatus.FINISHED;
    };
  }
}
