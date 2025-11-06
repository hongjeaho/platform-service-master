package com.platform.batch.platform.kapa.job;

import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE_MANAGER;

import com.platform.batch.platform.kapa.dto.OfficialPriceDto;
import com.platform.batch.platform.kapa.dto.OfficialPriceResponse;
import com.platform.batch.platform.kapa.dto.StandardPriceDto;
import com.platform.batch.platform.kapa.dto.StandardPriceResponse;
import com.platform.batch.platform.kapa.path.KakaoApiPath;
import com.platform.batch.platform.kapa.path.KapaApiPath;
import com.platform.batch.platform.kapa.path.MyBatisIdPath;
import com.platform.batch.platform.kapa.service.KapaDataService;
import com.platform.batch.platform.kapa.service.TransferGeoService;
import com.platform.datasource.base.dto.batch.KapaPriceRequest;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.jooq.generated.tables.pojos.KapaOfficialPriceEntity;
import org.jooq.generated.tables.pojos.KapaStandardPriceEntity;
import org.mybatis.spring.batch.builder.MyBatisPagingItemReaderBuilder;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.JobParametersIncrementer;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

@Slf4j
@Configuration
@ConditionalOnProperty(name = "spring.batch.job.name", havingValue = "platform.KapaDataBatch")
public class KapaDataBatch {

  public static final String JOB_NAME = "kapaDataJOB";
  public static final String STEP1_NAME = "officialPriceTmpSTEP";
  public static final String STEP2_NAME = "officialPriceSTEP";
  public static final String STEP3_NAME = "standardPriceTmpSTEP";
  public static final String STEP4_NAME = "standardPriceSTEP";
  public static final String STEP5_NAME = "insertEmptyRequestStep";
  public static final String STEP6_NAME = "transferOfficialGeoSTEP";
  public static final String STEP7_NAME = "transferStandardGeoSTEP";

  private final WebClient kapaWebClient;
  private final WebClient kakaoWebClient;
  private final SqlSessionFactory sqlSessionFactory;
  private final KapaDataService kapaDataService;
  private final TransferGeoService transferGeoService;

  public KapaDataBatch(
      @Qualifier("kapaWebClient") WebClient kapaWebClient,
      @Qualifier("kakaoWebClient") WebClient kakaoWebClient,
      @Qualifier("platformDomainSqlSessionFactory") SqlSessionFactory sqlSessionFactory,
      KapaDataService kapaDataService,
      TransferGeoService transferGeoService) {
    this.kapaWebClient = kapaWebClient;
    this.kakaoWebClient = kakaoWebClient;
    this.sqlSessionFactory = sqlSessionFactory;
    this.kapaDataService = kapaDataService;
    this.transferGeoService = transferGeoService;
  }

  @Bean
  public Job kapaDataJOB(JobRepository jobRepository,
      @Qualifier(STEP1_NAME) Step officialPriceTmpSTEP,
      @Qualifier(STEP2_NAME) Step OfficialPriceSTEP,
      @Qualifier(STEP3_NAME) Step standardPriceTmpSTEP,
      @Qualifier(STEP4_NAME) Step standardPriceSTEP,
      @Qualifier(STEP5_NAME) Step insertEmptyRequestStep,
      @Qualifier(STEP6_NAME) Step transferOfficialGeoStep,
      @Qualifier(STEP7_NAME) Step transferStandardGeoStep,
      JobExecutionListener jobExecutionListener, JobParametersIncrementer jobParametersIncrementer) {
    return new JobBuilder(JOB_NAME, jobRepository)
        .incrementer(jobParametersIncrementer)
        .start(officialPriceTmpSTEP) //공시지가 호출용 임시테이블 생성
        .next(OfficialPriceSTEP) //공시지가
        .next(standardPriceTmpSTEP) // 표준지 공시지가 호출용 임시테이블 생성
        .next(standardPriceSTEP) // 표준지 공시지가
        .next(insertEmptyRequestStep) //공시지가 반복 호출 제외를 위한 빈 데이터 삽입
        .next(transferOfficialGeoStep) // 공시지가 좌표변환 (좌표변환 일일 쿼터 총 100,000건)
        .next(transferStandardGeoStep) // 표준지 공시지가 좌표변환
        .listener(jobExecutionListener)
        .build();
  }

  @Bean(STEP1_NAME)
  public Step officialPriceTmpSTEP(Tasklet officialPriceTmpTasklet, JobRepository jobRepository, @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder(STEP1_NAME, jobRepository)
        .tasklet(officialPriceTmpTasklet, transactionManager)
        .build();
  }

  @Bean
  public Tasklet officialPriceTmpTasklet() {
    return (contribution, chunkContext) -> {
      kapaDataService.processOfficialPriceTmp();
      return RepeatStatus.FINISHED;
    };
  }

  @Bean(STEP2_NAME)
  public Step officialPriceSTEP(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder(STEP2_NAME, jobRepository)
        .<KapaPriceRequest, List<KapaOfficialPriceEntity>>chunk(2, transactionManager)
        .reader(officialPriceReader())
        .processor(officialPriceProcessor())
        .writer(officialPriceWriter())
        .transactionManager(transactionManager)
        .build();
  }

  @Bean
  public ItemReader<KapaPriceRequest> officialPriceReader() {
    return new MyBatisPagingItemReaderBuilder<KapaPriceRequest>()
        .sqlSessionFactory(sqlSessionFactory)
        .queryId(MyBatisIdPath.OFFICIAL_QUERY_ID.getPath())
        .pageSize(100)
        .build();
  }

  @Bean
  public ItemProcessor<KapaPriceRequest, List<KapaOfficialPriceEntity>> officialPriceProcessor() {
    return landPriceRequest -> {
      OfficialPriceResponse response = kapaWebClient
          .get()
          .uri(uriBuilder -> uriBuilder.path(KapaApiPath.LAND_OFFICIAL_PRICE.getPath())
              .build(landPriceRequest.getYear(), landPriceRequest.getPnu()))
          .retrieve()
          .bodyToMono(OfficialPriceResponse.class)
          .block();
      return Objects.requireNonNull(response).getOfficialPriceData().stream()
          .map(OfficialPriceDto::toEntity)
          .collect(Collectors.toList());
    };
  }

  @Bean
  public ItemWriter<List<KapaOfficialPriceEntity>> officialPriceWriter() {
    return items -> {
      List<KapaOfficialPriceEntity> entities = items.getItems().stream()
          .flatMap(List::stream)
          .collect(Collectors.toList());
      kapaDataService.saveOfficialPriceData(entities);
    };
  }

  @Bean(STEP3_NAME)
  public Step standardPriceTmpSTEP(Tasklet standardPriceTmpTasklet, JobRepository jobRepository, @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder(STEP3_NAME, jobRepository)
        .tasklet(standardPriceTmpTasklet, transactionManager)
        .build();
  }

  @Bean
  public Tasklet standardPriceTmpTasklet() {
    return (contribution, chunkContext) -> {
      kapaDataService.processStandardPriceTmp();
      return RepeatStatus.FINISHED;
    };
  }

  @Bean(STEP4_NAME)
  public Step standardPriceSTEP(JobRepository jobRepository,
      @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder(STEP3_NAME, jobRepository)
        .<KapaPriceRequest, List<KapaStandardPriceEntity>>chunk(2, transactionManager)
        .reader(standardPriceReader())
        .processor(standardPriceProcessor())
        .writer(standardPriceWriter())
        .build();
  }

  @Bean
  public ItemReader<KapaPriceRequest> standardPriceReader() {
    return new MyBatisPagingItemReaderBuilder<KapaPriceRequest>()
        .sqlSessionFactory(sqlSessionFactory)
        .queryId(MyBatisIdPath.STANDARD_QUERY_ID.getPath())
        .pageSize(100)
        .build();
  }

  @Bean
  public ItemProcessor<KapaPriceRequest, List<KapaStandardPriceEntity>> standardPriceProcessor() {
    return landPriceRequest -> {
      StandardPriceResponse response = kapaWebClient
          .get()
          .uri(uriBuilder -> uriBuilder.path(KapaApiPath.LAND_STANDARD_PRICE.getPath())
              .build(landPriceRequest.getYear(), landPriceRequest.getReg(), landPriceRequest.getNum()))
          .retrieve()
          .bodyToMono(StandardPriceResponse.class)
          .block();
      return Objects.requireNonNull(response).getStandardPriceData().stream()
          .map(StandardPriceDto::toEntity)
          .collect(Collectors.toList());
    };
  }

  @Bean
  public ItemWriter<List<KapaStandardPriceEntity>> standardPriceWriter() {
    return items -> {
      List<KapaStandardPriceEntity> entities = items.getItems().stream()
          .flatMap(List::stream)
          .collect(Collectors.toList());
      kapaDataService.saveStandardPriceData(entities);
    };
  }

  @Bean(STEP5_NAME)
  public Step insertEmptyRequestStep(Tasklet insertEmptyRequestTasklet, JobRepository jobRepository, @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder(STEP5_NAME, jobRepository)
        .tasklet(insertEmptyRequestTasklet, transactionManager)
        .build();
  }

  @Bean
  public Tasklet insertEmptyRequestTasklet() {
    return (contribution, chunkContext) -> {
      kapaDataService.insertEmptyRequest();
      return RepeatStatus.FINISHED;
    };
  }

  @Bean(STEP6_NAME)
  public Step transferOfficialGeoStep(Tasklet transferOfficialGeoTasklet, JobRepository jobRepository, @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder(STEP6_NAME, jobRepository)
        .tasklet(transferOfficialGeoTasklet, transactionManager)
        .build();
  }

  @Bean(STEP7_NAME)
  public Step transferStandardGeoStep(Tasklet transferStandardGeoTasklet, JobRepository jobRepository, @Qualifier(PLATFORM_DATASOURCE_MANAGER) PlatformTransactionManager transactionManager) {
    return new StepBuilder(STEP7_NAME, jobRepository)
        .tasklet(transferStandardGeoTasklet, transactionManager)
        .build();
  }

  @Bean
  public Tasklet transferOfficialGeoTasklet() {
    return (contribution, chunkContext) -> {

      List<KapaOfficialPriceEntity> geoPoints = transferGeoService.getOfficialGeoPointsNeedUpdate();
      if (geoPoints.isEmpty()) {
        return RepeatStatus.FINISHED;
      }
      Flux.fromIterable(geoPoints)
          .limitRate(100) // 한 번에 처리할 최대 요청 수
          .flatMap(point -> kakaoWebClient.get()
                  .uri(uriBuilder -> uriBuilder
                      .path(KakaoApiPath.API_COORD.getPath())
                      .queryParam("x", point.getTmX())
                      .queryParam("y", point.getTmY())
                      .queryParam("input_coord", "TM")
                      .queryParam("output_coord", "WGS84")
                      .build())
                  .retrieve()
                  .bodyToMono(String.class)
                  .publishOn(Schedulers.boundedElastic())
                  .doOnNext(responseData -> transferGeoService.processOfficialSaveCoordinates(responseData, point))
                  .doOnError(e -> log.error("KAKAO API official failed: {}", point.getPnu(), e))
              , 5) // flatMap의 동시성 제한 (concurrent = 5)
          .blockLast();

      return RepeatStatus.FINISHED;
    };
  }

  @Bean
  public Tasklet transferStandardGeoTasklet() {
    return (contribution, chunkContext) -> {

      List<KapaStandardPriceEntity> geoPoints = transferGeoService.getStandardGeoPointsNeedUpdate();
      if (geoPoints.isEmpty()) {
        return RepeatStatus.FINISHED;
      }

      Flux.fromIterable(geoPoints)
          .limitRate(100) // 한 번에 처리할 최대 요청 수
          .flatMap(point -> kakaoWebClient.get()
                  .uri(uriBuilder -> uriBuilder
                      .path(KakaoApiPath.API_COORD.getPath())
                      .queryParam("input_coord", "TM")
                      .queryParam("output_coord", "WGS84")
                      .queryParam("x", point.getTmX())
                      .queryParam("y", point.getTmY())
                      .build())
                  .retrieve()
                  .bodyToMono(String.class)
                  .publishOn(Schedulers.boundedElastic())
                  .doOnNext(responseData -> transferGeoService.processStandardAndSaveCoordinates(responseData, point))
                  .doOnError(e -> log.error("KAKAO API standard failed: {}", point.getSReg(), e))
              , 5) // flatMap의 동시성 제한 (concurrent = 5)
          .blockLast();

      return RepeatStatus.FINISHED;
    };
  }
}
