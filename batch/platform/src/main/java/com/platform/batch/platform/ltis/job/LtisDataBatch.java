package com.platform.batch.platform.ltis.job;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.JobParametersIncrementer;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@ConditionalOnProperty(name = "spring.batch.job.name", havingValue = "platform.LtisDataBatch")
public class LtisDataBatch {

  public static final String JOB_NAME = "LTIS_DATA_JOB";
  public static final String STEP1_NAME = "LTIS_LIST_TEMP_STEP";
  public static final String STEP2_NAME = "LTIS_DETAIL_TEMP_STEP";
  public static final String STEP7_NAME = "LTIS_DATA_DISTRIBUTION_STEP";
  public static final String STEP3_NAME = "REPT_INFO_STEP";
  public static final String STEP4_NAME = "OWNR_INFO_STEP";
  public static final String STEP5_NAME = "REPT_OWNR_INFO_STEP";
  public static final String STEP6_NAME = "RECM_INFO_STEP";

  @Bean
  public Job ltisDataJOB(JobRepository jobRepository,
      @Qualifier(STEP1_NAME) Step ltisListTmpSTEP,
      @Qualifier(STEP2_NAME) Step ltisDetailTmpSTEP,
      @Qualifier(STEP3_NAME) Step reptInfoSTEP,
      @Qualifier(STEP4_NAME) Step ownrInfoSTEP,
      @Qualifier(STEP5_NAME) Step reptOwnrInfoSTEP,
      @Qualifier(STEP6_NAME) Step recmInfoSTEP,
      @Qualifier(STEP7_NAME) Step ltisDataDistributionStep,
      JobExecutionListener jobExecutionListener, JobParametersIncrementer jobParametersIncrementer) {
    return new JobBuilder(JOB_NAME, jobRepository)
        .incrementer(jobParametersIncrementer)
        .start(ltisListTmpSTEP) // LTIS 리스트 임시
        .next(ltisDetailTmpSTEP) // LTIS 상세 임시
        .next(reptInfoSTEP) // 조서
        .next(ownrInfoSTEP) // 소유자
        .next(reptOwnrInfoSTEP) // 조서-소유자
        .next(recmInfoSTEP) // 평가정보
        .next(ltisDataDistributionStep) // 임시테이블 병합 분배
        .listener(jobExecutionListener)
        .build();
  }
}
