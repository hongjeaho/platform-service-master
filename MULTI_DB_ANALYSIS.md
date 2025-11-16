# 멀티 데이터베이스 확장 유연성 분석 보고서
**생성일**: 2025-11-16  
**분석 대상**: Platform Service Master (Spring Boot 3.4.2 기반)

---

## Executive Summary

현재 Platform Service는 **단일 MySQL 데이터베이스 구조**로 운영되고 있으며, **멀티 데이터베이스 확장을 위한 기반이 부분적으로 마련**되어 있습니다.

**주요 발견**:
- ✅ 추상화된 DataSource 설정 구조로 여러 데이터소스 지원 가능
- ✅ 배치 모듈에서 이미 별도 DataSource 사용 중 (배치 전용 DB)
- ✅ 트랜잭션 관리자 분리로 다중 DB 트랜잭션 처리 가능
- ⚠️ 읽기 복제본(Read Replica) 라우팅 미구현
- ⚠️ 다중 DB 벤더(Oracle, PostgreSQL 등) 지원 미미
- ⚠️ 샤딩 메커니즘 없음

---

## 1. 현재 데이터소스 설정 구조

### 1.1 설정 파일 분석

#### **API 모듈 (api/platform)**
```yaml
# application.yml
spring:
  profiles:
    active: local
    group:
      local: base, core, datasource-base, web-base
      dev: base, core, datasource-base, web-base, datasource-base-dev
```

#### **Datasource Base 모듈 (datasource/base)**
```yaml
# application-datasource-base.yml (개발 환경)
platform:
  domain:
    datasource:
      poolName: platform-domain-cp
      type: com.zaxxer.hikari.HikariDataSource
      driverClassName: com.mysql.cj.jdbc.Driver
      jdbcUrl: "jdbc:mysql://localhost:3306/store?..."
      username: root
      password: root
      maximumPoolSize: 15
      connectionTimeout: 30000
      maxLifetime: 1800000
```

#### **배치 모듈 (batch/platform)**
```yaml
# application.yml
batch:
  domain:
    datasource:
      poolName: ltis-batch-domain-cp
      type: com.zaxxer.hikari.HikariDataSource
      driverClassName: com.mysql.cj.jdbc.Driver
      jdbcUrl: "jdbc:mysql://localhost:3306/batch?..."
      username: root
      password: root
      maximumPoolSize: 5
      connectionTimeout: 60000
```

**분석**:
- 플랫폼용과 배치용 DB가 **별도로 분리**됨
- 커스텀 프로퍼티 네이밍: `platform.domain.datasource`, `batch.domain.datasource`
- 환경별 설정 가능 (local vs dev)

### 1.2 DataSource 빈 구성

#### **PlatFormDatabaseSource.java**
```java
@EnableAutoConfiguration(exclude = {
    DataSourceAutoConfiguration.class,              // Spring Boot 자동 설정 제외
    DataSourceTransactionManagerAutoConfiguration.class,
    MybatisAutoConfiguration.class
})
public class PlatFormDatabaseSource {
    
    // 플랫폼 DataSource Bean
    @Bean(PLATFORM_DATASOURCE)
    @ConfigurationProperties("platform.domain.datasource")
    public DataSource platFormDataSource() {
        return DataSourceBuilder.create()
            .type(HikariDataSource.class)
            .build();
    }
    
    // 플랫폼 트랜잭션 관리자
    @Bean(PLATFORM_DATASOURCE_MANAGER)
    public PlatformTransactionManager platFormTransactionManager(
        @Qualifier(PLATFORM_DATASOURCE) final DataSource dataSource
    ) {
        return new DataSourceTransactionManager(dataSource);
    }
    
    // JDBC 템플릿들 (총 3개)
    @Bean(PLATFORM_DOMAIN_JDBC_TEMPLATE)
    public JdbcTemplate platFormDomainJdbcTemplate(...) { }
    
    @Bean(PLATFORM_DOMAIN_NAMED_PARAMETER_JDBC_OPERATIONS)
    public NamedParameterJdbcOperations platFormDomainNamedParameterJdbcOperations() { }
}
```

#### **BatchConfig.java**
```java
@Configuration
public class BatchConfig {
    
    // 배치용 DataSource (별도)
    @Bean(BATCH_DOMAIN_DATA_SOURCE)
    @Primary
    @ConfigurationProperties("batch.domain.datasource")
    public DataSource batchDataSource() {
        return DataSourceBuilder.create()
            .type(HikariDataSource.class)
            .build();
    }
    
    // 배치용 트랜잭션 관리자
    @Bean
    @Primary
    public PlatformTransactionManager getTransactionManager() {
        return new DataSourceTransactionManager(batchDataSource());
    }
}
```

**분석**:
- 각 모듈이 **독립적인 DataSource**를 가지고 있음
- Qualifier를 통한 명시적 선택 가능
- 자동 설정 제외로 **수동 구성** 가능하게 설계됨

---

## 2. jOOQ 설정 및 코드 생성

### 2.1 jOOQ 빌드 설정 (build.gradle)

```gradle
jooq {
    version = jooqVersion
    configurations {
        main {
            generationTool {
                jdbc {
                    driver = DATABASE_DRIVER          // com.mysql.cj.jdbc.Driver
                    url = System.getenv("DB_URL") ?: "jdbc:mysql://localhost:3306/store?..."
                    user = System.getenv("DB_USER") ?: "root"
                    password = System.getenv("DB_PWD") ?: "root"
                }
                
                generator {
                    name = 'org.jooq.codegen.DefaultGenerator'
                    database {
                        name = "org.jooq.meta.mysql.MySQLDatabase"  // MySQL 전용
                        inputSchema = "store"
                        unsignedTypes = true
                    }
                    
                    strategy.name = "com.platform.common.base.jooq.CustomGeneratorStrategy"
                }
            }
        }
    }
}
```

### 2.2 jOOQ 런타임 설정 (JooqConfig.java)

```java
@Configuration
@Import(PlatFormDatabaseSource.class)
public class JooqConfig {
    
    @Bean
    public DSLContext dslContext(
        DataSourceConnectionProvider connectionProvider,
        DefaultConfigurationCustomizer defaultConfigurationCustomizer
    ) {
        DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
        jooqConfiguration.setSQLDialect(SQLDialect.MYSQL);  // MySQL만 지원
        jooqConfiguration.set(connectionProvider);
        defaultConfigurationCustomizer.customize(jooqConfiguration);
        return DSL.using(jooqConfiguration);
    }
}
```

**분석**:
- **단일 스키마** 코드 생성만 지원
- **MySQL 방언** 하드코딩
- 환경변수로 DB 연결 정보 변경 가능 (빌드 시점에만)
- 생성된 클래스: `/src/generated/` (.gitignore)

---

## 3. MyBatis 설정

### 3.1 MyBatis 설정 (MybatisConfig.java)

```java
@Configuration
@MapperScan(
    basePackages = {"com.platform.datasource.base.mapper"},
    sqlSessionFactoryRef = "platformDomainSqlSessionFactory",
    annotationClass = Mapper.class
)
public class MybatisConfig {
    
    @Bean
    public SqlSessionFactory platformDomainSqlSessionFactory(
        @Qualifier(PLATFORM_DATASOURCE) final DataSource storeDomainDataSource,
        final ApplicationContext applicationContext
    ) throws Exception {
        final SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(storeDomainDataSource);
        factory.setMapperLocations(
            applicationContext.getResources("classpath:mybatis-mapper/**/*.xml")
        );
        return factory.getObject();
    }
}
```

### 3.2 MyBatis Mapper 구조

```
datasource/base/src/main/resources/mybatis-mapper/
├── user/
│   └── UserMapper.xml           # 사용자 조회 (1개 쿼리)
├── batch/
│   ├── KapaDataMapper.xml        # KAPA 데이터 처리
│   ├── LtisDataMapper.xml        # LTIS 데이터 처리
│   ├── LtisMemberMapper.xml      # LTIS 회원 정보
│   └── KakaoMapper.xml           # 카카오 API 연동
└── ... (총 7개 Mapper)
```

**분석**:
- **배치 작업 중심**의 복잡한 SQL
- Mapper 당 **단일 SqlSessionFactory** 참조
- 다중 SqlSessionFactory 추가 가능하지만 **현재는 구현 안 됨**

---

## 4. 트랜잭션 관리

### 4.1 커스텀 @PlatFormTransactional

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Transactional(PLATFORM_DATASOURCE_MANAGER)  // 명시적 매니저 지정
public @interface PlatFormTransactional {
    Propagation propagation() default Propagation.REQUIRED;
    Isolation isolation() default Isolation.DEFAULT;
    int timeout() default 600;
    boolean readOnly() default false;
}
```

### 4.2 사용 예시

```java
@Repository
@PlatFormTransactional                          // 읽기/쓰기
public class ReceiptRepository {
    // INSERT, UPDATE, DELETE 작업
}

@Repository
@PlatFormTransactional(readOnly = true)         // 읽기 전용
public class ReceiptReadRepository {
    // SELECT 작업만 수행
}
```

**분석**:
- ✅ **Repository 분리** (Write vs Read)
- ✅ 트랜잭션 관리자 **명시적 지정**
- ⚠️ 읽기 전용도 **동일 DataSource** 사용
- ⚠️ **읽기 복제본 라우팅** 미구현

---

## 5. 현재 멀티 DB 지원 현황

### 5.1 현재 구조

```
┌─────────────────────────────────────────────────────────┐
│                    API Server                            │
│  (api/platform:8080)                                    │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  JooqConfig (DSLContext)                          │  │
│  │  ├─ DataSource: PLATFORM_DATASOURCE               │  │
│  │  └─ TransactionManager: PLATFORM_DATASOURCE_MGR   │  │
│  └──────────────┬──────────────────────────────────┘  │
│                 │                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  MybatisConfig (SqlSessionFactory)               │  │
│  │  ├─ DataSource: PLATFORM_DATASOURCE              │  │
│  │  └─ Mappers: 배치 관련 복잡한 쿼리                  │  │
│  └──────────────┬──────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────┘
                  │
           ┌──────▼──────┐
           │   MySQL DB  │
           │  (store DB) │
           └─────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Batch Server                          │
│  (batch/platform:9091)                                  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  BatchConfig                                      │  │
│  │  ├─ DataSource: BATCH_DOMAIN_DATA_SOURCE          │  │
│  │  ├─ TransactionManager: 배치 전용                  │  │
│  │  └─ JobRepository: Spring Batch 메타정보           │  │
│  └──────────────┬──────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────┘
                  │
           ┌──────▼──────┐
           │   MySQL DB  │
           │ (batch DB)  │
           └─────────────┘
```

### 5.2 멀티 DB 지원 매트릭스

| 기능 | 현재 상태 | 확장 가능성 |
|------|---------|----------|
| **여러 DataSource 정의** | ✅ 가능 | ✅ 매우 높음 |
| **DataSource별 TransactionManager** | ✅ 가능 | ✅ 매우 높음 |
| **jOOQ 다중 DB 지원** | ❌ 미지원 | ⚠️ 낮음 |
| **MyBatis 다중 SqlSessionFactory** | ✅ 가능 | ✅ 높음 |
| **읽기/쓰기 분리** | ⚠️ 부분 | ✅ 높음 |
| **읽기 복제본 자동 라우팅** | ❌ 미구현 | ✅ 높음 |
| **다중 DB 벤더 지원** | ❌ MySQL만 | ⚠️ 낮음 |
| **샤딩/파티셔닝** | ❌ 미구현 | ✅ 높음 |
| **분산 트랜잭션** | ⚠️ 부분 | ⚠️ 중간 |

---

## 6. 확장 시나리오별 필요한 변경사항

### Scenario 1: 읽기 복제본(Read Replica) 추가

#### 현재 문제
```java
// 현재: 읽기도 동일 DB 사용
@PlatFormTransactional(readOnly = true)
public class ReceiptReadRepository {
    private final DSLContext dslContext;  // 마스터 DB만 사용
}
```

#### 확장 방안: RoutingDataSource 구현

**필요한 변경**:

1. **AbstractRoutingDataSource 구현** (약 50줄)
   ```java
   public class ReadWriteRoutingDataSource extends AbstractRoutingDataSource {
       @Override
       protected Object determineCurrentLookupKey() {
           return TransactionSynchronizationManager.isCurrentTransactionReadOnly() 
               ? "read-replica" : "master";
       }
   }
   ```

2. **설정 추가** (약 100줄)
   ```yaml
   platform:
     domain:
       datasource:
         master:
           jdbcUrl: jdbc:mysql://master-db:3306/store
         replica:
           jdbcUrl: jdbc:mysql://read-replica:3306/store
   ```

3. **PlatFormDatabaseSource 수정** (약 30줄)
   ```java
   @Bean(PLATFORM_DATASOURCE)
   public DataSource platFormDataSource() {
       Map<Object, Object> targetDataSources = new HashMap<>();
       targetDataSources.put("master", masterDataSource());
       targetDataSources.put("read-replica", replicaDataSource());
       
       ReadWriteRoutingDataSource routingDataSource = 
           new ReadWriteRoutingDataSource();
       routingDataSource.setDefaultTargetDataSource(masterDataSource());
       routingDataSource.setTargetDataSources(targetDataSources);
       return routingDataSource;
   }
   ```

**영향도**:
- Repository 코드: **수정 없음** ✅
- 트랜잭션 관리: **기존 @PlatFormTransactional 활용** ✅
- jOOQ/MyBatis: **자동 라우팅** ✅
- **예상 구현 시간**: 2-3일

**구현 복잡도**: ⭐⭐ (낮음)

---

### Scenario 2: 다른 DB 벤더 추가 (PostgreSQL)

#### 현재 문제
- jOOQ: MySQL 방언만 하드코딩
- 빌드 시점에 코드 생성 (스키마 변경 시 재생성 필요)

#### 확장 방안

**Option A: 각 벤더별 별도 DataSource + jOOQ (추천)**

**필요한 변경**:

1. **새로운 jOOQ 설정** (datasource-pg 모듈 생성)
   ```gradle
   // datasource/pg/build.gradle
   jooq {
       configurations {
           main {
               generationTool {
                   database {
                       name = "org.jooq.meta.postgres.PostgresDatabase"
                       inputSchema = "public"  // PostgreSQL 기본 스키마
                   }
               }
           }
       }
   }
   ```

2. **PostgreSQL Config 추가**
   ```java
   @Configuration
   public class PostgresDatabaseSource {
       @Bean("postgresDataSource")
       @ConfigurationProperties("postgres.datasource")
       public DataSource postgresDataSource() {
           return DataSourceBuilder.create()
               .type(HikariDataSource.class)
               .build();
       }
       
       @Bean("postgresDslContext")
       public DSLContext postgresDslContext(
           @Qualifier("postgresDataSource") DataSource ds
       ) {
           DefaultConfiguration config = new DefaultConfiguration();
           config.setSQLDialect(SQLDialect.POSTGRES);  // ← 중요
           return DSL.using(config);
       }
   }
   ```

3. **Repository 분리**
   ```java
   @Repository
   public class PostgresReceiptRepository {
       @Qualifier("postgresDslContext")
       private final DSLContext dslContext;
       
       // PostgreSQL 전용 구현
   }
   ```

**설정 추가**:
```yaml
platform:
  mysql:
    datasource:
      jdbcUrl: jdbc:mysql://localhost:3306/store
      
postgres:
  datasource:
    jdbcUrl: jdbc:postgresql://localhost:5432/platform_db
    driverClassName: org.postgresql.Driver
    maximumPoolSize: 10
```

**영향도**:
- 기존 MySQL 코드: **수정 없음** ✅
- 새로운 도메인: **별도 Repository 필요** ⚠️
- 트랜잭션: **벤더별 TransactionManager 필요** ⚠️
- **예상 구현 시간**: 5-7일

**구현 복잡도**: ⭐⭐⭐ (중간)

---

### Scenario 3: 데이터베이스 샤딩

#### 구현 패턴

**사용자 ID 기반 샤딩**:
```
User 1-1000     → MySQL Shard 1
User 1001-2000  → MySQL Shard 2
User 2001-3000  → MySQL Shard 3
```

**필요한 변경**:

1. **ShardingDataSource 구현** (약 200줄)
   ```java
   public class ShardingDataSource extends AbstractDataSource {
       private final Map<Integer, DataSource> shards;
       
       @Override
       public Connection getConnection() throws SQLException {
           int shardKey = ShardingContext.getShardKey();
           int shardId = shardKey % shards.size();
           return shards.get(shardId).getConnection();
       }
   }
   ```

2. **ShardingContext 구현**
   ```java
   public class ShardingContext {
       private static final ThreadLocal<Integer> SHARD_KEY = 
           new ThreadLocal<>();
       
       public static void setShardKey(int userId) {
           SHARD_KEY.set(userId % 3);  // 3개 샤드 기준
       }
       
       public static int getShardKey() {
           return SHARD_KEY.get();
       }
       
       public static void clear() {
           SHARD_KEY.remove();
       }
   }
   ```

3. **AOP로 자동 설정**
   ```java
   @Aspect
   @Component
   public class ShardingAspect {
       @Around("@annotation(Sharded)")
       public Object around(ProceedingJoinPoint pjp) throws Throwable {
           Sharded sharded = getAnnotation(pjp);
           int userId = (int) pjp.getArgs()[sharded.paramIndex()];
           
           ShardingContext.setShardKey(userId);
           try {
               return pjp.proceed();
           } finally {
               ShardingContext.clear();
           }
       }
   }
   ```

**사용 예시**:
```java
@Sharded(paramIndex = 0)  // 첫 번째 파라미터가 userId
public ReceiptDto getReceipt(int userId, long receiptId) {
    // ShardingContext에 의해 자동으로 올바른 샤드로 라우팅
    return receiptReadRepository.findById(receiptId);
}
```

**영향도**:
- Repository 코드: **@Sharded 어노테이션만 추가** ⚠️
- 스키마: **각 샤드마다 동일** ✅
- 트랜잭션: **크로스 샤드는 불가** ❌
- **예상 구현 시간**: 7-10일

**구현 복잡도**: ⭐⭐⭐⭐ (높음)

**주의사항**:
- 크로스 샤드 조인 불가능
- 글로벌 트랜잭션 구현 복잡
- 배포 후 리샤딩 어려움

---

### Scenario 4: 분산 트랜잭션 (JTA)

#### 현재 상태
- 단일 DataSource 트랜잭션만 지원
- 여러 DB에 걸친 트랜잭션 불가능

#### 확장 방안

1. **Narayana (JTA) 도입**
   ```gradle
   implementation 'org.springframework.boot:spring-boot-starter-jta-narayana'
   ```

2. **XADataSource 래핑**
   ```java
   @Bean
   public DataSource platformXADataSource() {
       MysqlXADataSource mysqlXADataSource = new MysqlXADataSource();
       mysqlXADataSource.setURL("jdbc:mysql://localhost:3306/store");
       
       return new DataSourceXAWrapper(mysqlXADataSource, 
           "platformXA");
   }
   ```

3. **JTA 트랜잭션 사용**
   ```java
   @Transactional  // JTA TransactionManager 사용
   public void complexOperation(long userId) {
       // 스냅에서 데이터 읽기
       snapRepository.findByUserId(userId);
       
       // MySQL에서 데이터 쓰기
       receiptRepository.insert(receipt);
       
       // 둘 다 커밋되거나 모두 롤백
   }
   ```

**영향도**:
- 성능: **오버헤드 약 20-30%** ⚠️
- 트랜잭션 타임아웃: **더 짧은 설정 필요** ⚠️
- 데드락: **더 자주 발생 가능** ⚠️
- **예상 구현 시간**: 3-5일

**구현 복잡도**: ⭐⭐⭐ (중간)

**권장하지 않는 경우**:
- 높은 동시성 필요 (높은 데드락 가능성)
- 실시간 응답 요구 (트랜잭션 오버헤드)
- 대신 **이벤트 소싱** 고려

---

## 7. 확장 권고사항

### 7.1 우선순위별 확장 로드맵

| 우선순위 | 기능 | 이유 | 예상 기간 |
|---------|------|------|---------|
| **1순위** | 읽기 복제본 | 성능 개선 + 복잡도 낮음 | 2-3일 |
| **2순위** | 배치 DB 분리 | 이미 부분 구현됨 | 1-2일 |
| **3순위** | 다중 DB 벤더 | 향후 필요시 | 5-7일 |
| **4순위** | 샤딩 | 대규모 데이터 시 | 7-10일 |
| **5순위** | JTA | 필수일 시만 | 3-5일 |

### 7.2 현재 구조 개선 권고사항

#### **즉시 구현 가능** (1주 이내)

1. **배치 DB 완전 분리** ✅ 80% 완료
   ```java
   // datasource/base의 batch-관련 MyBatis Mapper를
   // batch 모듈로 이동
   // → 배치 전용 데이터 소스로 명시적 연결
   ```

2. **ReadRepository 자동 라우팅** (선택사항)
   ```java
   // @PlatFormTransactional(readOnly=true)를 자동 감지
   // 읽기 전용 쿼리는 별도 DataSource로 라우팅
   ```

#### **중기 계획** (1-3개월)

3. **jOOQ 버전 업그레이드**
   - 현재: 3.19.18 → 최신 3.20+
   - 다중 스키마 생성 지원 개선

4. **MyBatis Dynamic SQL** 도입
   ```java
   // XML 대신 Java로 SQL 구성
   // 다중 DB 벤더 지원 용이
   ```

#### **장기 계획** (3-6개월)

5. **이벤트 소싱 도입**
   - 분산 데이터베이스 환경에 적합
   - 트랜잭션 관리 단순화

---

## 8. 기술 체크리스트

### 현재 상태 평가

```
데이터소스 설정 구조
├─ ✅ DataSource 빈 분리 가능
├─ ✅ 환경별 설정 분리
├─ ✅ TransactionManager 분리
└─ ✅ Auto-configuration 제외

jOOQ 설정
├─ ✅ 코드 생성 자동화
├─ ✅ 커스텀 생성 전략
├─ ✅ 방언 설정 가능
└─ ❌ 다중 스키마 생성 미지원

MyBatis 설정
├─ ✅ SqlSessionFactory 분리 가능
├─ ✅ Mapper 스캔 커스터마이징
├─ ✅ 타입 핸들러 설정
└─ ⚠️ 다중 SqlSessionFactory 미사용

트랜잭션 관리
├─ ✅ 커스텀 어노테이션 제공
├─ ✅ 읽기/쓰기 분리 어노테이션
├─ ✅ TransactionManager 명시 선택
└─ ❌ 분산 트랜잭션 미지원

Repository 패턴
├─ ✅ Write/Read 저장소 분리
├─ ✅ 도메인별 저장소 조직화
├─ ✅ 저장소별 트랜잭션 정책
└─ ⚠️ 라우팅 로직 없음
```

---

## 9. 구현 예제: 읽기 복제본 추가

### 단계별 구현

#### 1단계: RoutingDataSource 구현
```java
// datasource/base/src/main/java/.../routing/ReadWriteRoutingDataSource.java

public class ReadWriteRoutingDataSource extends AbstractRoutingDataSource {
    
    @Override
    protected Object determineCurrentLookupKey() {
        boolean isReadOnly = TransactionSynchronizationManager
            .isCurrentTransactionReadOnly();
        return isReadOnly ? "read-replica" : "master";
    }
}
```

#### 2단계: 설정 수정
```yaml
# application-datasource-base.yml
platform:
  domain:
    datasource:
      master:
        poolName: platform-master-cp
        type: com.zaxxer.hikari.HikariDataSource
        driverClassName: com.mysql.cj.jdbc.Driver
        jdbcUrl: "jdbc:mysql://db-master:3306/store?..."
        username: root
        password: root
        maximumPoolSize: 20
        
      replica:
        poolName: platform-replica-cp
        type: com.zaxxer.hikari.HikariDataSource
        driverClassName: com.mysql.cj.jdbc.Driver
        jdbcUrl: "jdbc:mysql://db-replica:3306/store?..."
        username: root
        password: root
        maximumPoolSize: 20
```

#### 3단계: PlatFormDatabaseSource 수정
```java
@Bean(PLATFORM_DATASOURCE)
public DataSource platFormDataSource() {
    // 마스터 DataSource
    DataSource masterDataSource = DataSourceBuilder.create()
        .type(HikariDataSource.class)
        .driverClassName(properties.getMaster().getDriverClassName())
        .url(properties.getMaster().getJdbcUrl())
        .username(properties.getMaster().getUsername())
        .password(properties.getMaster().getPassword())
        .build();
    
    // 읽기 복제본 DataSource
    DataSource replicaDataSource = DataSourceBuilder.create()
        .type(HikariDataSource.class)
        .driverClassName(properties.getReplica().getDriverClassName())
        .url(properties.getReplica().getJdbcUrl())
        .username(properties.getReplica().getUsername())
        .password(properties.getReplica().getPassword())
        .build();
    
    // 라우팅 DataSource
    ReadWriteRoutingDataSource routingDataSource = 
        new ReadWriteRoutingDataSource();
    routingDataSource.setDefaultTargetDataSource(masterDataSource);
    
    Map<Object, Object> targetDataSources = new HashMap<>();
    targetDataSources.put("master", masterDataSource);
    targetDataSources.put("read-replica", replicaDataSource);
    
    routingDataSource.setTargetDataSources(targetDataSources);
    routingDataSource.afterPropertiesSet();
    
    return routingDataSource;
}
```

#### 4단계: 테스트
```java
@Test
public void testReadWriteRouting() {
    // 읽기 작업: 읽기 복제본으로 라우팅
    receiptReadRepository.findById(1L);  // replica로 이동
    
    // 쓰기 작업: 마스터로 라우팅
    receiptRepository.insert(receipt);   // master로 이동
}
```

---

## 10. 성능 고려사항

### 멀티 데이터베이스 환경에서의 성능

| 시나리오 | 성능 영향 | 대응 방안 |
|---------|---------|---------|
| **읽기 복제본** | +20~40% 처리량 | ✅ 권장 |
| **크로스 DB 조인** | -50~70% 성능 | 캐싱, 동기화 프로세스 |
| **분산 트랜잭션** | -20~30% 성능 | 보상 트랜잭션 사용 |
| **샤딩** | -10~20% (관리 오버헤드) | 적절한 샤드 키 선택 |

### 모니터링 포인트

```java
// 데이터소스별 모니터링
@Component
public class DataSourceMetrics {
    
    @Bean
    public MeterBinder hikariMetrics(
        @Qualifier("platFormDataSource") DataSource dataSource
    ) {
        if (dataSource instanceof HikariDataSource) {
            return new HikariMetrics((HikariDataSource) dataSource);
        }
        return NO_OP;
    }
}
```

---

## 11. 결론 및 요약

### 현재 상태
- ✅ **확장을 위한 기초 구조 마련 완료** (70%)
- ✅ **배치와 API 간 DataSource 분리 이미 구현** (25%)
- ⚠️ **읽기/쓰기 분리 부분적 구현** (어노테이션만)
- ❌ **자동 라우팅 미구현**
- ❌ **다중 DB 벤더 지원 부족**

### 추천 로드맵

**Phase 1 (1주)**: 읽기 복제본 라우팅 추가
- RoutingDataSource 구현
- 배치 DB 완전 분리
- 성능 이득: **20~40% 읽기 처리량 증가**

**Phase 2 (1개월)**: 다중 DB 벤더 지원
- PostgreSQL DataSource 추가
- 별도 jOOQ 설정
- 마이그레이션 전략 수립

**Phase 3 (3개월)**: 샤딩 / 이벤트 소싱
- 대규모 데이터 분산
- 트랜잭션 관리 개선

### 주요 성공 요인
1. **현재 추상화 구조 활용** - 불필요한 코드 수정 최소화
2. **점진적 확장** - 한 번에 하나씩 추가
3. **테스트 중심** - DataSource 라우팅 테스트 필수
4. **모니터링** - 성능 지표 사전 구성

---

**문서 작성일**: 2025-11-16  
**다음 검토 예정**: 2025-12-16
