package com.platform.batch.platform.common.config;


import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.JobParametersIncrementer;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.launch.support.TaskExecutorJobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.repository.support.JobRepositoryFactoryBean;
import org.springframework.batch.support.DatabaseType;
import org.springframework.boot.autoconfigure.batch.BatchProperties;
import org.springframework.boot.autoconfigure.batch.JobLauncherApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableConfigurationProperties(BatchProperties.class)
@RequiredArgsConstructor
public class BatchConfig {

  public static final String BATCH_DOMAIN_DATA_SOURCE = "batchDomainDataSource";

  @Bean(name = BATCH_DOMAIN_DATA_SOURCE)
  @Primary
  @ConfigurationProperties("batch.domain.datasource")
  public DataSource batchDataSource() {
    return DataSourceBuilder.create().type(HikariDataSource.class).build();
  }

  @Bean
  public JobParametersIncrementer jobParametersIncrementer() {
    return new RunIdIncrementer(); // 고유한 RunId로 파라미터 생성
  }

  @Bean
  @Primary
  public PlatformTransactionManager getTransactionManager() {
    final var dataSourceTransactionManager = new DataSourceTransactionManager(batchDataSource());
    dataSourceTransactionManager.setGlobalRollbackOnParticipationFailure(false);

    return dataSourceTransactionManager;
  }

  @Bean
  @Primary
  public JobRepository getJobRepository() throws Exception {
    final var factoryBean = new JobRepositoryFactoryBean();
    factoryBean.setDatabaseType(DatabaseType.MYSQL.name());
    factoryBean.setDataSource(batchDataSource());
    factoryBean.setTransactionManager(getTransactionManager());
    factoryBean.setIsolationLevelForCreate("ISOLATION_READ_COMMITTED");
    factoryBean.afterPropertiesSet();

    return factoryBean.getObject();
  }

  @Bean
  public JobLauncher getJobLauncher() throws Exception {
    final var jobLauncher = new TaskExecutorJobLauncher();
    jobLauncher.setJobRepository(getJobRepository());
    jobLauncher.afterPropertiesSet();
    return jobLauncher;
  }

  @Bean
  @ConditionalOnMissingBean
  public JobLauncherApplicationRunner jobLauncherApplicationRunner(
      JobRepository jobRepository,
      JobLauncher jobLauncher,
      JobExplorer jobExplorer) {

    return new JobLauncherApplicationRunner(jobLauncher, jobExplorer, jobRepository);
  }
}
