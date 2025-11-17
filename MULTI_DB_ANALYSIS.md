# 멀티 데이터베이스 확장 유연성 분석 보고서
**생성일**: 2025-11-16
**분석 대상**: Platform Service Master (Spring Boot 3.4.2 기반)

---

## Executive Summary

현재 Platform Service는 **datasource 모듈 추가 방식**으로 멀티 데이터베이스를 지원하도록 설계되어 있습니다. 각 DB마다 독립적인 모듈을 생성하여 확장하는 구조입니다.

**주요 발견**:
- ✅ **모듈화된 datasource 구조**: 각 DB마다 독립 모듈 추가 가능
- ✅ 배치 모듈에서 이미 별도 DataSource 사용 중 (배치 전용 DB)
- ✅ 각 모듈마다 독립적인 jOOQ, Flyway, Repository, TransactionManager
- ✅ api/batch 모듈에서 필요한 datasource 모듈들을 선택적으로 의존
- ⚠️ 현재는 datasource/base (MySQL) 모듈만 존재
- ⚠️ 읽기 복제본(Read Replica) 라우팅 미구현

**아키텍처 철학**:
```
각 데이터베이스 = 독립적인 datasource 모듈

datasource/
├── base/          # MySQL 전용 모듈
│   ├── flyway/    # MySQL 마이그레이션
│   ├── jOOQ       # MySQL 코드 생성
│   ├── repository/# MySQL 리포지토리
│   └── mapper/    # MySQL 매퍼
│
├── postgres/      # PostgreSQL 추가 시 (미래)
│   ├── flyway/    # PostgreSQL 마이그레이션
│   ├── jOOQ       # PostgreSQL 코드 생성
│   ├── repository/# PostgreSQL 리포지토리
│   └── mapper/    # PostgreSQL 매퍼
│
└── oracle/        # Oracle 추가 시 (미래)
    └── ...        # 동일 구조
```

---

## 1. 현재 데이터소스 모듈 구조

### 1.1 datasource/base 모듈 (MySQL 전용)

#### 모듈 구조
```
datasource/base/
├── build.gradle                    # jOOQ, Flyway 플러그인 설정
├── flyway/                         # MySQL 마이그레이션 스크립트
│   ├── V20250204000000__init.sql
│   ├── V20250205000000__add_users.sql
│   └── ... (32개 마이그레이션)
│
├── src/
│   ├── main/
│   │   ├── java/com/platform/datasource/base/
│   │   │   ├── config/
│   │   │   │   ├── database/PlatFormDatabaseSource.java    # DataSource 설정
│   │   │   │   ├── database/PlatFormTransactional.java     # 트랜잭션 어노테이션
│   │   │   │   ├── JooqConfig.java                        # jOOQ 설정
│   │   │   │   └── MybatisConfig.java                     # MyBatis 설정
│   │   │   ├── repository/                                # jOOQ 리포지토리
│   │   │   │   ├── receipt/ReceiptRepository.java
│   │   │   │   ├── receipt/ReceiptReadRepository.java
│   │   │   │   ├── board/BoardRepository.java
│   │   │   │   └── ... (15개 도메인)
│   │   │   └── mapper/                                    # MyBatis 인터페이스
│   │   │       ├── user/UserMapper.java
│   │   │       └── batch/KapaDataMapper.java
│   │   └── resources/
│   │       ├── application-datasource-base.yml           # 기본 설정
│   │       ├── application-datasource-base-dev.yml       # 개발 환경
│   │       └── mybatis-mapper/                           # MyBatis XML
│   │           ├── user/UserMapper.xml
│   │           └── batch/*.xml
│   └── generated/                                         # jOOQ 생성 코드 (.gitignore)
│       └── org/jooq/generated/
│           ├── tables/
│           ├── records/
│           └── daos/
```

#### 설정 파일 (application-datasource-base.yml)
```yaml
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

#### DataSource 빈 구성 (PlatFormDatabaseSource.java)
```java
@Configuration
@EnableAutoConfiguration(exclude = {
    DataSourceAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class,
    MybatisAutoConfiguration.class
})
public class PlatFormDatabaseSource {

    // MySQL DataSource Bean
    @Bean(PLATFORM_DATASOURCE)
    @ConfigurationProperties("platform.domain.datasource")
    public DataSource platFormDataSource() {
        return DataSourceBuilder.create()
            .type(HikariDataSource.class)
            .build();
    }

    // MySQL 전용 트랜잭션 관리자
    @Bean(PLATFORM_DATASOURCE_MANAGER)
    public PlatformTransactionManager platFormTransactionManager(
        @Qualifier(PLATFORM_DATASOURCE) final DataSource dataSource
    ) {
        return new DataSourceTransactionManager(dataSource);
    }

    // JDBC 템플릿
    @Bean(PLATFORM_DOMAIN_JDBC_TEMPLATE)
    public JdbcTemplate platFormDomainJdbcTemplate(...) { }
}
```

**특징**:
- ✅ MySQL 전용 독립 모듈
- ✅ 자동 설정 제외로 수동 구성 가능
- ✅ HikariCP 연결 풀 사용
- ✅ 환경별 설정 분리 (local, dev)

---

### 1.2 batch/platform 모듈의 별도 DataSource

배치 모듈은 자체적으로 DataSource를 정의합니다:

#### BatchConfig.java
```java
@Configuration
public class BatchConfig {

    // 배치용 DataSource (별도 DB)
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
- 배치는 datasource/base 모듈을 사용하지 않음
- 자체 DataSource 정의 (batch DB)
- 향후 datasource/batch 모듈로 분리 가능

---

## 2. jOOQ 설정 및 코드 생성 (모듈별 독립)

### 2.1 datasource/base의 jOOQ 설정

#### build.gradle
```gradle
plugins {
    id 'nu.studer.jooq' version '9.0'
    id 'org.flywaydb.flyway' version '9.22.0'
}

jooq {
    version = jooqVersion
    configurations {
        main {
            generationTool {
                jdbc {
                    driver = "com.mysql.cj.jdbc.Driver"
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
                        excludes = "flyway_schema_history|BATCH_.*"
                    }

                    generate {
                        daos = true
                        records = true
                        pojos = true
                        interfaces = true
                    }

                    target {
                        packageName = 'org.jooq.generated'
                        directory = 'src/generated/java'
                    }

                    strategy.name = "com.platform.common.base.jooq.CustomGeneratorStrategy"
                }
            }
        }
    }
}

flyway {
    url = System.getenv("DB_URL") ?: "jdbc:mysql://localhost:3306/store?..."
    user = System.getenv("DB_USER") ?: "root"
    password = System.getenv("DB_PWD") ?: "root"
    locations = ["filesystem:${project.projectDir}/flyway"]
    encoding = "UTF-8"
    outOfOrder = true
    validateOnMigrate = true
}
```

#### JooqConfig.java
```java
@Configuration
@Import(PlatFormDatabaseSource.class)
public class JooqConfig {

    @Bean
    public DSLContext dslContext(
        DataSourceConnectionProvider connectionProvider,
        DefaultConfigurationCustomizer customizer
    ) {
        DefaultConfiguration jooqConfiguration = new DefaultConfiguration();
        jooqConfiguration.setSQLDialect(SQLDialect.MYSQL);  // MySQL 방언
        jooqConfiguration.set(connectionProvider);
        customizer.customize(jooqConfiguration);
        return DSL.using(jooqConfiguration);
    }
}
```

**특징**:
- ✅ MySQL 스키마 전용 코드 생성
- ✅ Flyway 마이그레이션 후 jOOQ 생성 자동화
- ✅ 생성된 코드: `src/generated/` (.gitignore)
- ✅ 커스텀 생성 전략으로 일관성 유지

---

### 2.2 새 DB 추가 시: datasource/postgres 모듈 예시

#### 디렉토리 구조 (미래)
```
datasource/postgres/
├── build.gradle                    # PostgreSQL 전용 jOOQ, Flyway
├── flyway/                         # PostgreSQL 마이그레이션
│   ├── V1__init_postgres.sql
│   └── ...
├── src/
│   ├── main/
│   │   ├── java/com/platform/datasource/postgres/
│   │   │   ├── config/
│   │   │   │   ├── PostgresDatabaseSource.java
│   │   │   │   ├── PostgresTransactional.java
│   │   │   │   ├── PostgresJooqConfig.java
│   │   │   │   └── PostgresMybatisConfig.java
│   │   │   ├── repository/
│   │   │   │   ├── user/UserRepository.java
│   │   │   │   └── ...
│   │   │   └── mapper/
│   │   └── resources/
│   │       ├── application-datasource-postgres.yml
│   │       └── mybatis-mapper/
│   └── generated/                  # PostgreSQL jOOQ 생성 코드
```

#### build.gradle (PostgreSQL 전용)
```gradle
jooq {
    configurations {
        main {
            generationTool {
                jdbc {
                    driver = "org.postgresql.Driver"
                    url = "jdbc:postgresql://localhost:5432/platform_db"
                }

                generator {
                    database {
                        name = "org.jooq.meta.postgres.PostgresDatabase"  // PostgreSQL!
                        inputSchema = "public"
                    }

                    target {
                        packageName = 'org.jooq.postgres.generated'
                        directory = 'src/generated/java'
                    }
                }
            }
        }
    }
}
```

---

## 3. MyBatis 설정 (모듈별 독립)

### 3.1 datasource/base의 MyBatis 설정

#### MybatisConfig.java
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
        @Qualifier(PLATFORM_DATASOURCE) final DataSource dataSource,
        final ApplicationContext applicationContext
    ) throws Exception {
        final SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);  // MySQL DataSource
        factory.setMapperLocations(
            applicationContext.getResources("classpath:mybatis-mapper/**/*.xml")
        );

        org.apache.ibatis.session.Configuration config =
            new org.apache.ibatis.session.Configuration();
        config.setMapUnderscoreToCamelCase(true);
        factory.setConfiguration(config);

        return factory.getObject();
    }
}
```

#### Mapper 구조
```
datasource/base/src/main/resources/mybatis-mapper/
├── user/
│   └── UserMapper.xml           # 사용자 조회
├── batch/                       # 배치 비즈니스에서 사용
│   ├── KapaDataMapper.xml       # datasource/base 테이블 쿼리
│   ├── LtisDataMapper.xml       # datasource/base 테이블 쿼리
│   └── ...
```

**분석**:
- ✅ datasource/base 모듈에서 MySQL 전용 Mapper 관리
- ✅ batch 매퍼는 datasource/base의 테이블을 쿼리하므로 여기에 위치하는 것이 올바름
- ✅ batch/platform 모듈이 datasource/base에 의존하여 이 매퍼들을 사용

---

### 3.2 새 datasource 모듈의 MyBatis 설정 예시

```java
// datasource/postgres/src/.../config/PostgresMybatisConfig.java

@Configuration
@MapperScan(
    basePackages = {"com.platform.datasource.postgres.mapper"},
    sqlSessionFactoryRef = "postgresSqlSessionFactory",
    annotationClass = Mapper.class
)
public class PostgresMybatisConfig {

    @Bean
    public SqlSessionFactory postgresSqlSessionFactory(
        @Qualifier("postgresDataSource") final DataSource postgresDataSource
    ) throws Exception {
        // PostgreSQL 전용 SqlSessionFactory
    }
}
```

---

## 4. 트랜잭션 관리 (모듈별 독립)

### 4.1 datasource/base의 커스텀 @PlatFormTransactional

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Transactional(PLATFORM_DATASOURCE_MANAGER)  // MySQL TransactionManager 명시
public @interface PlatFormTransactional {
    Propagation propagation() default Propagation.REQUIRED;
    Isolation isolation() default Isolation.DEFAULT;
    int timeout() default 600;
    boolean readOnly() default false;
}
```

### 4.2 사용 예시 (Write/Read 분리)

```java
// datasource/base/src/.../repository/receipt/ReceiptRepository.java
@Repository
@PlatFormTransactional  // MySQL 쓰기 트랜잭션
public class ReceiptRepository {
    private final DSLContext dslContext;  // MySQL DSLContext

    public void insert(Receipt receipt) {
        dslContext.insertInto(RECEIPT).set(...).execute();
    }
}

// datasource/base/src/.../repository/receipt/ReceiptReadRepository.java
@Repository
@PlatFormTransactional(readOnly = true)  // MySQL 읽기 트랜잭션
public class ReceiptReadRepository {
    private final DSLContext dslContext;  // MySQL DSLContext

    public Optional<Receipt> findById(Long id) {
        return dslContext.selectFrom(RECEIPT)
            .where(RECEIPT.ID.eq(id))
            .fetchOptionalInto(Receipt.class);
    }
}
```

**특징**:
- ✅ Repository 패턴으로 Write/Read 분리
- ✅ 각 datasource 모듈마다 별도 트랜잭션 어노테이션 정의 가능
- ✅ TransactionManager 명시적 지정

---

### 4.3 PostgreSQL 모듈의 트랜잭션 관리 예시

```java
// datasource/postgres/src/.../config/PostgresTransactional.java
@Transactional("postgresTransactionManager")  // PostgreSQL TransactionManager
public @interface PostgresTransactional {
    boolean readOnly() default false;
}

// datasource/postgres/src/.../config/PostgresDatabaseSource.java
@Bean("postgresTransactionManager")
public PlatformTransactionManager postgresTransactionManager(
    @Qualifier("postgresDataSource") DataSource postgresDataSource
) {
    return new DataSourceTransactionManager(postgresDataSource);
}
```

---

## 5. api/batch 모듈에서의 datasource 사용

### 5.1 api/platform의 의존성 설정

#### build.gradle
```gradle
dependencies {
    // datasource 모듈들을 선택적으로 의존
    implementation(project(":datasource-base"))      // MySQL 사용
    // implementation(project(":datasource-postgres"))  // PostgreSQL 사용 시 추가
    // implementation(project(":datasource-oracle"))    // Oracle 사용 시 추가

    implementation(project(":common-web"))
    // ... 기타 의존성
}
```

### 5.2 Controller에서 여러 datasource 사용

```java
@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
public class ReceiptController {

    // MySQL 리포지토리 (datasource/base)
    private final ReceiptRepository receiptRepository;
    private final ReceiptReadRepository receiptReadRepository;

    // PostgreSQL 리포지토리 (datasource/postgres) - 미래
    // private final PostgresReceiptRepository postgresReceiptRepository;

    @GetMapping("/{id}")
    public ResponseEntity<ReceiptDto> getReceipt(@PathVariable Long id) {
        // MySQL에서 조회
        Receipt receipt = receiptReadRepository.findById(id)
            .orElseThrow(() -> new NotFoundException());
        return ResponseEntity.ok(toDto(receipt));
    }

    @PostMapping
    public ResponseEntity<Void> createReceipt(@RequestBody CreateReceiptDto dto) {
        // MySQL에 저장
        receiptRepository.insert(toEntity(dto));
        return ResponseEntity.ok().build();
    }
}
```

---

## 6. 현재 멀티 DB 지원 현황

### 6.1 현재 구조

```
┌─────────────────────────────────────────────────────────┐
│                    API Server                            │
│  (api/platform:8080)                                    │
│                                                          │
│  의존성:                                                 │
│  - datasource-base (MySQL)                              │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Controller / Service                             │  │
│  │  ├─ ReceiptRepository (MySQL)                     │  │
│  │  └─ BoardRepository (MySQL)                       │  │
│  └──────────────┬──────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │  datasource/base       │
      │  (MySQL 전용 모듈)      │
      │  ├─ JooqConfig         │
      │  ├─ MybatisConfig      │
      │  ├─ Repository         │
      │  └─ TransactionManager │
      └──────────┬──────────────┘
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

### 6.2 멀티 DB 지원 매트릭스

| 기능 | 현재 상태 | 확장 방법 |
|------|---------|---------|
| **여러 DB 벤더 지원** | ✅ 가능 | datasource/{db-name} 모듈 추가 |
| **모듈별 독립 jOOQ** | ✅ 가능 | 각 모듈의 build.gradle 설정 |
| **모듈별 독립 Flyway** | ✅ 가능 | 각 모듈의 flyway/ 디렉토리 |
| **모듈별 독립 Repository** | ✅ 가능 | 각 모듈의 repository/ 패키지 |
| **모듈별 독립 TransactionManager** | ✅ 가능 | 각 모듈의 Config 클래스 |
| **읽기/쓰기 분리** | ⚠️ 부분 | 모듈 내 RoutingDataSource 추가 |
| **읽기 복제본 자동 라우팅** | ❌ 미구현 | 모듈별로 구현 가능 |
| **샤딩/파티셔닝** | ❌ 미구현 | 별도 샤딩 로직 필요 |
| **분산 트랜잭션** | ❌ 미구현 | JTA 도입 필요 |

---

## 7. 확장 시나리오별 구현 방법

### Scenario 1: PostgreSQL 지원 추가 (가장 일반적)

#### 필요한 작업

**1. 새 모듈 생성**
```bash
mkdir -p datasource/postgres
```

**2. build.gradle 작성**
```gradle
// datasource/postgres/build.gradle

plugins {
    id 'java-library'
    id 'nu.studer.jooq' version '9.0'
    id 'org.flywaydb.flyway' version '9.22.0'
}

dependencies {
    implementation(project(":common-base"))

    // PostgreSQL 드라이버
    implementation 'org.postgresql:postgresql:42.7.1'

    // jOOQ, MyBatis
    jooqGenerator 'org.postgresql:postgresql:42.7.1'
}

jooq {
    configurations {
        main {
            generationTool {
                jdbc {
                    driver = "org.postgresql.Driver"
                    url = "jdbc:postgresql://localhost:5432/platform_db"
                    user = "postgres"
                    password = "postgres"
                }

                generator {
                    database {
                        name = "org.jooq.meta.postgres.PostgresDatabase"
                        inputSchema = "public"
                    }

                    target {
                        packageName = 'org.jooq.postgres.generated'
                        directory = 'src/generated/java'
                    }
                }
            }
        }
    }
}

flyway {
    url = "jdbc:postgresql://localhost:5432/platform_db"
    user = "postgres"
    password = "postgres"
    locations = ["filesystem:${project.projectDir}/flyway"]
}
```

**3. PostgreSQL Config 작성**
```java
// datasource/postgres/src/.../config/PostgresDatabaseSource.java

@Configuration
@EnableAutoConfiguration(exclude = {
    DataSourceAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class
})
public class PostgresDatabaseSource {

    @Bean("postgresDataSource")
    @ConfigurationProperties("postgres.datasource")
    public DataSource postgresDataSource() {
        return DataSourceBuilder.create()
            .type(HikariDataSource.class)
            .build();
    }

    @Bean("postgresTransactionManager")
    public PlatformTransactionManager postgresTransactionManager(
        @Qualifier("postgresDataSource") DataSource postgresDataSource
    ) {
        return new DataSourceTransactionManager(postgresDataSource);
    }
}
```

**4. PostgreSQL JooqConfig 작성**
```java
// datasource/postgres/src/.../config/PostgresJooqConfig.java

@Configuration
@Import(PostgresDatabaseSource.class)
public class PostgresJooqConfig {

    @Bean("postgresDslContext")
    public DSLContext postgresDslContext(
        @Qualifier("postgresDataSource") DataSource postgresDataSource
    ) {
        DefaultConfiguration config = new DefaultConfiguration();
        config.setSQLDialect(SQLDialect.POSTGRES);  // PostgreSQL 방언
        config.setDataSource(postgresDataSource);
        return DSL.using(config);
    }
}
```

**5. PostgreSQL Repository 작성**
```java
// datasource/postgres/src/.../repository/user/UserRepository.java

@Repository
public class PostgresUserRepository {

    @Qualifier("postgresDslContext")
    private final DSLContext dslContext;  // PostgreSQL DSLContext

    public Optional<User> findById(Long id) {
        return dslContext.selectFrom(USERS)
            .where(USERS.ID.eq(id))
            .fetchOptionalInto(User.class);
    }
}
```

**6. api/platform에서 사용**
```gradle
// api/platform/build.gradle
dependencies {
    implementation(project(":datasource-base"))      // MySQL
    implementation(project(":datasource-postgres"))  // PostgreSQL 추가!
}
```

```java
// api/platform/src/.../controller/UserController.java
@RestController
@RequiredArgsConstructor
public class UserController {

    // MySQL 리포지토리
    private final ReceiptRepository receiptRepository;  // datasource/base

    // PostgreSQL 리포지토리
    private final PostgresUserRepository postgresUserRepository;  // datasource/postgres

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        // PostgreSQL에서 조회
        User user = postgresUserRepository.findById(id)
            .orElseThrow(() -> new NotFoundException());
        return ResponseEntity.ok(toDto(user));
    }
}
```

**영향도**:
- 기존 코드 수정: ❌ 없음 (완전히 독립)
- 새 모듈 생성: ✅ 필요
- 예상 시간: 1-2일

**구현 복잡도**: ⭐⭐ (낮음)

---

### Scenario 2: 읽기 복제본 추가 (모듈 내부)

datasource/base 모듈 내에서 Master/Replica 라우팅을 구현합니다.

#### 필요한 작업

**1. RoutingDataSource 구현**
```java
// datasource/base/src/.../config/routing/ReadWriteRoutingDataSource.java

public class ReadWriteRoutingDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        boolean isReadOnly = TransactionSynchronizationManager
            .isCurrentTransactionReadOnly();
        return isReadOnly ? "read-replica" : "master";
    }
}
```

**2. 설정 추가**
```yaml
# datasource/base/src/main/resources/application-datasource-base.yml
platform:
  domain:
    datasource:
      master:
        poolName: platform-master-cp
        jdbcUrl: "jdbc:mysql://db-master:3306/store"
        username: root
        password: root
        maximumPoolSize: 20

      replica:
        poolName: platform-replica-cp
        jdbcUrl: "jdbc:mysql://db-replica:3306/store"
        username: root
        password: root
        maximumPoolSize: 20
```

**3. PlatFormDatabaseSource 수정**
```java
@Bean(PLATFORM_DATASOURCE)
public DataSource platFormDataSource() {
    DataSource masterDataSource = createDataSource(masterProperties);
    DataSource replicaDataSource = createDataSource(replicaProperties);

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

**4. 기존 Repository 코드는 수정 불필요**
```java
// 자동으로 라우팅됨
@PlatFormTransactional(readOnly = true)  // → replica로 자동 라우팅
public class ReceiptReadRepository {
    // 코드 변경 없음!
}
```

**영향도**:
- Repository 코드: ❌ 수정 없음
- datasource/base 모듈만 수정: ✅
- 예상 시간: 2-3일
- 성능 개선: +20~40% 읽기 처리량

**구현 복잡도**: ⭐⭐ (낮음)

---

### Scenario 3: MongoDB 추가 (NoSQL)

datasource/mongodb 모듈을 생성합니다 (jOOQ 대신 Spring Data MongoDB 사용).

#### 디렉토리 구조
```
datasource/mongodb/
├── build.gradle
├── src/
│   ├── main/
│   │   ├── java/com/platform/datasource/mongodb/
│   │   │   ├── config/
│   │   │   │   ├── MongoDatabaseSource.java
│   │   │   │   └── MongoTransactional.java
│   │   │   └── repository/
│   │   │       ├── log/LogRepository.java
│   │   │       └── event/EventRepository.java
│   │   └── resources/
│   │       └── application-datasource-mongodb.yml
```

#### build.gradle
```gradle
dependencies {
    implementation(project(":common-base"))
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
}
```

#### MongoDB Config
```java
@Configuration
@EnableMongoRepositories(basePackages = "com.platform.datasource.mongodb.repository")
public class MongoDatabaseSource {

    @Bean("mongoTemplate")
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "platform_db");
    }
}
```

#### Repository
```java
public interface LogRepository extends MongoRepository<Log, String> {
    List<Log> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime from, LocalDateTime to);
}
```

**영향도**:
- 기존 MySQL 코드: ❌ 영향 없음
- 새 모듈 생성: ✅ 필요
- jOOQ 미사용: ✅ Spring Data MongoDB 사용
- 예상 시간: 1-2일

---

## 8. 확장 권고사항

### 8.1 우선순위별 로드맵

| 우선순위 | 작업 | 이유 | 예상 기간 |
|---------|------|------|---------|
| **1순위** | 읽기 복제본 (datasource/base 내) | 성능 개선 + 복잡도 낮음 | 2-3일 |
| **2순위** | datasource/postgres 모듈 추가 | 다중 벤더 지원 예시 | 1-2일 |
| **3순위** | datasource/mongodb 모듈 추가 | NoSQL 지원 | 1-2일 |
| **4순위** | 샤딩 (필요시) | 대규모 데이터 | 7-10일 |

### 8.2 개선 권고사항

#### 현재 구조 분석

**batch 매퍼 위치**: `datasource/base/src/main/resources/mybatis-mapper/batch/`

이 매퍼들은 올바른 위치에 있습니다:
- ✅ batch 비즈니스 로직에서 사용되지만
- ✅ 쿼리하는 테이블은 **datasource/base의 MySQL 테이블**
- ✅ batch/platform 모듈이 datasource/base에 의존하여 사용
- ✅ 따라서 datasource/base에 위치하는 것이 올바른 설계

**참고**: batch/platform의 별도 DataSource는 Spring Batch 메타데이터 또는 배치 전용 테이블에 사용됩니다

---

## 9. settings.gradle 및 모듈 등록

새 datasource 모듈 추가 시 settings.gradle에 등록:

```gradle
// settings.gradle
rootProject.name = 'platform-service'

include 'common:base'
include 'common:core'
include 'common:web'

include 'datasource:base'         // MySQL
include 'datasource:postgres'     // PostgreSQL (새로 추가)
include 'datasource:mongodb'      // MongoDB (새로 추가)

include 'api:platform'
include 'batch:platform'
```

---

## 10. 성능 고려사항

### 멀티 datasource 모듈 환경의 성능

| 시나리오 | 성능 영향 | 대응 방안 |
|---------|---------|---------|
| **읽기 복제본 (모듈 내)** | +20~40% 처리량 | ✅ 권장 |
| **여러 DB 조인** | -50~70% 성능 | 애플리케이션 레벨 조인 |
| **여러 TransactionManager** | -5~10% (미미) | ✅ 수용 가능 |
| **모듈별 커넥션 풀** | 메모리 증가 | 풀 사이즈 조정 |

---

## 11. 결론

### 현재 아키텍처 평가

✅ **매우 우수한 확장성**
- datasource 모듈 추가 방식으로 완전한 독립성 보장
- 각 모듈마다 독립적인 jOOQ, Flyway, Repository, TransactionManager
- 기존 코드 수정 없이 새 DB 추가 가능

✅ **명확한 모듈 경계**
- 각 datasource 모듈은 완전히 독립적
- api/batch 모듈에서 필요한 datasource만 선택적으로 의존

⚠️ **개선 필요 사항**
- 배치 매퍼를 datasource/base에서 batch 모듈로 이동
- 읽기 복제본 라우팅 구현 (datasource/base 내부)

### 권장 로드맵

**Phase 1 (1주 이내)**
- [ ] 배치 매퍼 분리
- [ ] 읽기 복제본 설계 문서 작성

**Phase 2 (1개월)**
- [ ] datasource/base에 읽기 복제본 라우팅 추가
- [ ] 성능 테스트 및 모니터링

**Phase 3 (3개월, 필요시)**
- [ ] datasource/postgres 모듈 추가
- [ ] datasource/mongodb 모듈 추가

**Phase 4 (6개월+, 필요시)**
- [ ] 샤딩 메커니즘 설계
- [ ] 분산 트랜잭션 (JTA)

### 핵심 성공 요인

1. **모듈 독립성 유지** - 각 datasource 모듈은 완전히 독립
2. **점진적 확장** - 필요한 모듈만 추가
3. **기존 코드 보호** - 새 모듈 추가 시 기존 코드 수정 불필요
4. **명확한 규칙** - 모든 datasource 모듈은 동일한 구조 유지

---

**문서 작성일**: 2025-11-16
**다음 검토 예정**: 2025-12-16
