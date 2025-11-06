package com.platform.batch.platform.ltismember.job;


import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.ltismember.service.LtisMemberDataService;
import com.platform.datasource.base.dto.batch.UserEntireInfoDto;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.jooq.generated.tables.pojos.UserEntity;
import org.mybatis.spring.batch.builder.MyBatisPagingItemReaderBuilder;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.JobParametersIncrementer;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@Configuration
@ConditionalOnProperty(name = "spring.batch.job.name", havingValue = "platform.LtisMemberDataBatch")
/**
 * LTIS 시스템의 구성원 정보를 플랫폼 사용자 테이블로 동기화하는 Spring Batch 잡 구성 클래스입니다.
 *
 * 구성 개요
 * - Step1(implementerInsertSTEP): 미등록 시행자(implementer)를 조회하여 기본 비밀번호 설정 및 사용자/권한 데이터 저장
 * - Step2(decisionInsertSTEP): 미등록 재결관(decision)을 조회하여 기본 비밀번호 설정 및 사용자/권한 데이터 저장
 * - Reader: MyBatis PagingItemReader로 미등록 사용자 목록을 페이징 조회
 * - Processor: 사용자 기본 비밀번호를 암호화하여 설정하고, 권한 정보(UserEntireInfoDto)로 매핑
 * - Writer: 서비스 계층(LtisMemberDataService)을 통해 사용자 및 권한 엔터티를 트랜잭션으로 저장
 *
 * 활성화 조건
 * - application 설정의 'spring.batch.job.name=platform.LtisMemberDataBatch'일 때만 빈이 활성화됩니다.
 */
public class LtisMemberDataBatch {

  /**
   * 잡 이름 상수
   */
  public static final String JOB_NAME = "ltisMemberDataJOB";
  /**
   * 시행자 조회용 MyBatis 쿼리 ID
   */
  public static final String IMPLEMENTER_QUERY_ID = "com.platform.datasource.base.mapper.batch.ltisMemberApi.LtisMemberMapper.findImplementorInfoIntoUserTable";
  /**
   * 재결관 조회용 MyBatis 쿼리 ID
   */
  public static final String DECISION_QUERY_ID = "com.platform.datasource.base.mapper.batch.ltisMemberApi.LtisMemberMapper.findDecisionUserInfoIntoUserTable";
  /**
   * 신규 사용자 기본 비밀번호(암호화되어 저장됨)
   */
  public static final String DEFAULT_PASSWORD = "wlxhdnl";
  /**
   * 시행자 권한 시퀀스
   */
  public static final int IMPLEMENTER_ROLE_SEQ = 1;
  /**
   * 재결관 권한 시퀀스
   */
  public static final int DECISION_ROLE_SEQ = 2;
  /**
   * 생성자(감사) 사용자 번호
   */
  public static final int CREATED_BY = 1;
  /**
   * Step1 이름: 시행자 등록
   */
  public static final String STEP1_NAME = "implementerInsertSTEP";
  /**
   * Step2 이름: 재결관 등록
   */
  public static final String STEP2_NAME = "decisionInsertSTEP";


  /**
   * 플랫폼 도메인용 MyBatis SqlSessionFactory
   */
  private final SqlSessionFactory sqlSessionFactory;
  /**
   * 비밀번호 암호화를 위한 Spring Security PasswordEncoder - common-core에서 등록된 빈을 찾아 의존성 주입
   */
  private final PasswordEncoder passwordEncoder;
  /**
   * 사용자 및 권한 저장을 담당하는 서비스
   */
  private final LtisMemberDataService ltisMemberDataService;

  /**
   * 생성자를 통한 의존성 주입 .
   */
  public LtisMemberDataBatch(
      @Qualifier("platformDomainSqlSessionFactory") SqlSessionFactory sqlSessionFactory,
      LtisMemberDataService ltisMemberDataService,
      PasswordEncoder passwordEncoder
  ) {
    this.sqlSessionFactory = sqlSessionFactory;
    this.ltisMemberDataService = ltisMemberDataService;
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * LTIS 구성원 동기화 배치 잡 정의.
   * <p>
   * 흐름: Step1(시행자) -> Step2(재결관)
   */
  @Bean
  public Job ltisMemberDataJOB(JobRepository jobRepository,
      @Qualifier(STEP1_NAME) Step implementerInsertSTEP,
      @Qualifier(STEP2_NAME) Step decisionInsertSTEP,
      JobExecutionListener jobExecutionListener,
      JobParametersIncrementer jobParametersIncrementer
  ) {
    return new JobBuilder(JOB_NAME, jobRepository)
        .incrementer(jobParametersIncrementer) // 동일 잡의 재실행을 위한 파라미터 증가자
        .listener(jobExecutionListener)        // 잡 리스너 등록(로그/모니터링 등)
        .start(implementerInsertSTEP)
        .next(decisionInsertSTEP)
        .build();
  }

  /**
   * Step1: 미등록 시행자 사용자 등록 단계. - Reader: 시행자 쿼리로 미등록 사용자 조회 - Processor: 기본 비밀번호 암호화 및 권한 정보 구성 - Writer: 사용자/권한 일괄 저장
   */
  @Bean(STEP1_NAME)
  public Step implementerInsertSTEP(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager
  ) {
    return new StepBuilder("implementerInsertSTEP", jobRepository)
        .<UserEntity, UserEntireInfoDto>chunk(100, transactionManager)
        .reader(ltisImplementerNotRegisteredReader())
        .processor(ltisImplementerSetDefaultPassword())
        .writer(ltisChargeInfoForInsertionUser())
        .transactionManager(transactionManager)
        .build();
  }

  /**
   * Step2: 미등록 재결관 사용자 등록 단계. - Reader: 재결관 쿼리로 미등록 사용자 조회 - Processor: 기본 비밀번호 암호화 및 권한 정보 구성 - Writer: 사용자/권한 일괄 저장
   */
  @Bean(STEP2_NAME)
  public Step decisionInsertSTEP(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder("decisionInsertSTEP", jobRepository)
        .<UserEntity, UserEntireInfoDto>chunk(100, transactionManager)
        .reader(ltisDecisionNotRegisteredReader())
        .processor(ltisDecisionSetDefaultPassword())
        .writer(ltisChargeInfoForInsertionUser())
        .transactionManager(transactionManager)
        .build();
  }


  /**
   * 미등록 시행자 조회를 위한 MyBatis 페이징 리더. createdDate 파라미터는 쿼리에서 사용될 수 있는 기준 시간 값입니다.
   */
  @Bean
  public ItemReader<UserEntity> ltisImplementerNotRegisteredReader() {
    return new MyBatisPagingItemReaderBuilder<UserEntity>()
        .sqlSessionFactory(sqlSessionFactory)
        .queryId(IMPLEMENTER_QUERY_ID)
        .pageSize(100)
        .parameterValues(Map.of("createdDate", LocalDateTime.now()))
        .build();
  }

  /**
   * 미등록 재결관 조회를 위한 MyBatis 페이징 리더.
   */
  @Bean
  public ItemReader<UserEntity> ltisDecisionNotRegisteredReader() {
    return new MyBatisPagingItemReaderBuilder<UserEntity>()
        .sqlSessionFactory(sqlSessionFactory)
        .queryId(DECISION_QUERY_ID)
        .pageSize(100)
        .parameterValues(Map.of("createdDate", LocalDateTime.now()))
        .build();
  }

  /**
   * 시행자 사용자에 대한 기본 비밀번호/권한 정보를 설정하는 프로세서 빈.
   */
  @Bean
  public ItemProcessor<UserEntity, UserEntireInfoDto> ltisImplementerSetDefaultPassword() {

    return getUserEntityUserEntireInfoDtoItemProcessor(IMPLEMENTER_ROLE_SEQ);

  }

  /**
   * 재결관 사용자에 대한 기본 비밀번호/권한 정보를 설정하는 프로세서 빈.
   */
  @Bean
  public ItemProcessor<UserEntity, UserEntireInfoDto> ltisDecisionSetDefaultPassword() {

    return getUserEntityUserEntireInfoDtoItemProcessor(DECISION_ROLE_SEQ);

  }

  /**
   * 공통 프로세서 팩토리 메서드. 주어진 역할 시퀀스(roleSeq)에 따라 사용자 엔티티를 UserEntireInfoDto로 변환합니다. - 비밀번호는 DEFAULT_PASSWORD를 PasswordEncoder로 암호화하여 설정합니다. - 역할 및 생성자(CREATED_BY) 권한 정보를 설정합니다.
   */
  private ItemProcessor<UserEntity, UserEntireInfoDto> getUserEntityUserEntireInfoDtoItemProcessor(
      int roleSeq) {
    return userEntity -> {
      log.info("처리 예정 userEntity [{}]", userEntity);
      UserEntireInfoDto userEntireInfoDto = new UserEntireInfoDto();
      // 기본 비밀번호를 암호화하여 설정
      userEntity.setUserPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
      // 사용자 엔터티 필드 매핑
      userEntireInfoDto.setUserEntityFields(userEntity);
      // 권한 시퀀스 및 사용자-권한 엔터티 구성
      userEntireInfoDto.setRoleSeq((long) roleSeq);
      userEntireInfoDto.setUserRoleEntity(roleSeq, (long) CREATED_BY);
      log.info("처리 예정 userEntireInfoDto [{}]", userEntireInfoDto);
      return userEntireInfoDto;
    };
  }


  /**
   * 사용자 및 권한 정보를 일괄 저장하는 Writer 구현. - 저장 실패 항목을 수집하여 처리 후 로그로 남깁니다.
   */
  @Bean
  public ItemWriter<UserEntireInfoDto> ltisChargeInfoForInsertionUser() {
    List<UserEntireInfoDto> failedItems = new ArrayList<>();
    return items -> {
      items.forEach(item -> {
        // 서비스 계층 호출로 트랜잭션 처리 및 저장 시도
        boolean result = ltisMemberDataService.saveUserEntireInfoData(item);
        if (!result) {
          failedItems.add(item);
          log.warn("사용자 저장 실패: userId={}", item.getUserId());
        } else {
          log.info("사용자 저장 성공: userId={}", item.getUserId());
        }
      });

      // 실패 항목 집계 로그
      if (!failedItems.isEmpty()) {
        log.error("총 {} 개의 사용자 저장 실패", failedItems.size());
        failedItems.clear();
      }

    };

  }


}



