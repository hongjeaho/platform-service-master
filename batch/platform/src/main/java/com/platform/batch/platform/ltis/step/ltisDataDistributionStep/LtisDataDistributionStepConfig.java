package com.platform.batch.platform.ltis.step.ltisDataDistributionStep;

import com.platform.batch.platform.ltis.job.LtisDataBatch;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LtisDataDistributionStepConfig {

  public static final String STEP7_DISTRIBUTE_INFO = "LTIS_DATA_DISTRIBUTE_INFO_STEP";
  public static final String STEP7_DISTRIBUTE_CHARGE = "LTIS_DATA_DISTRIBUTE_CHARGE_STEP";
  public static final String STEP7_DISTRIBUTE_STATUS = "LTIS_DATA_DISTRIBUTE_STATUS_STEP";
  public static final String STEP7_DISTRIBUTE_PNU = "LTIS_DATA_DISTRIBUTE_PNU_STEP";
  public static final String STEP7_DELETE_TEMP = "LTIS_DELETE_TEMP_STEP";

  // FlowStep으로 5개 소단계를 묶어 단일 Step처럼 노출
  @Bean(LtisDataBatch.STEP7_NAME)
  Step ltisDataDistributionStep(JobRepository jobRepository,
      @Qualifier(STEP7_DISTRIBUTE_INFO) Step distributeInfoSTEP,
      @Qualifier(STEP7_DISTRIBUTE_CHARGE) Step distributeChargeSTEP,
      @Qualifier(STEP7_DISTRIBUTE_STATUS) Step distributeStatusSTEP,
      @Qualifier(STEP7_DISTRIBUTE_PNU) Step distributePnuSTEP,
      @Qualifier(STEP7_DELETE_TEMP) Step deleteTmpSTEP) {

    org.springframework.batch.core.job.flow.Flow flow =
        new org.springframework.batch.core.job.builder.FlowBuilder<org.springframework.batch.core.job.flow.Flow>("LTIS_DATA_DISTRIBUTION_FLOW")
            .start(distributeInfoSTEP)
            .next(distributeChargeSTEP)
            .next(distributeStatusSTEP)
            .next(distributePnuSTEP)
            .next(deleteTmpSTEP)
            .build();

    org.springframework.batch.core.job.flow.FlowStep flowStep = new org.springframework.batch.core.job.flow.FlowStep();
    flowStep.setName(LtisDataBatch.STEP3_NAME);
    flowStep.setFlow(flow);
    flowStep.setJobRepository(jobRepository);
    return flowStep;
  }
}
