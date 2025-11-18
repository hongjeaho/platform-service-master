# CLAUDE.md - Platform Service

이 파일은 Claude Code와 다른 AI 어시스턴트가 이 저장소에서 효율적으로 작업할 수 있도록 종합적인 가이드를 제공합니다.

## 프로젝트 개요

**Platform Service**는 Spring Boot 기반의 다중 모듈 엔터프라이즈 플랫폼으로, 법무/행정 업무를 처리하는 시스템입니다. 백엔드 API 서버, 배치 처리 시스템, React 기반 프론트엔드로 구성되어 있습니다.

### 주요 기능 도메인
- 심의(Deliberation) 관리
- 결론서(Conclusion) 작성 및 관리
- 참고자료(References) 관리 (판례, 법령, 지도 등)
- 접수(Receipt) 처리
- 토지 정보 관리
- 시스템 관리 및 게시판

### 기술 스택

**백엔드**
- Java (Spring Boot 3.4.2)
- Gradle 멀티 모듈 프로젝트
- JOOQ 3.19.18 (타입 안전 SQL)
- MyBatis 3.0.4
- Spring Security + JWT 인증
- MySQL 8.0.31
- Flyway (DB 마이그레이션)
- Spring Batch (배치 처리)
- Spring WebFlux (비동기 처리)
- SpringDoc OpenAPI (API 문서화)

**프론트엔드**
- React 19 + TypeScript
- Vite (빌드 도구)
- TailwindCSS 4.x
- React Query (@tanstack/react-query)
- Jotai (클라이언트 상태 관리)
- React Router 6
- Orval (OpenAPI → TypeScript 코드 생성)

**인프라**
- Docker Compose (MySQL)
- Prometheus + Grafana (모니터링)
- Caffeine Cache
- Logback (JSON 로깅)

## 프로젝트 구조

```
platform-service-master/
├── api/                    # REST API 모듈
│   └── platform/          # 메인 API 애플리케이션
│       └── src/
│           └── main/
│               ├── java/com/platform/api/platform/
│               │   ├── {domain}/controller/    # REST 컨트롤러
│               │   ├── {domain}/service/       # 비즈니스 로직
│               │   └── {domain}/dto/           # API DTO
│               └── resources/
│                   ├── application.yml
│                   └── application-{profile}.yml
│
├── batch/                 # 배치 처리 모듈
│   └── platform/
│       └── src/
│           └── main/
│               └── java/com/platform/batch/platform/
│                   ├── {job}/job/              # 배치 잡 정의
│                   ├── {job}/service/          # 배치 서비스
│                   └── common/config/          # 배치 설정
│
├── common/                # 공통 모듈
│   ├── base/             # 기본 타입, DTO, 인증
│   │   ├── auth/         # 인증/권한 관련
│   │   ├── dto/          # 공통 DTO (AbstractDTO, AbstractPagingDTO)
│   │   ├── type/         # 공통 타입, Enum, 코드
│   │   └── jooq/         # JOOQ 커스텀 설정
│   ├── core/             # 핵심 서비스
│   │   ├── service/      # 파일, PDF 서비스
│   │   ├── config/       # 파일, 비동기 설정
│   │   └── util/         # PDF 유틸리티
│   └── web/              # 웹 공통 설정
│       ├── config/       # Security, AOP, Cache
│       └── util/         # JWT 토큰 유틸
│
├── datasource/            # 데이터 접근 계층
│   └── base/
│       ├── flyway/       # DB 마이그레이션 스크립트
│       │   └── V{YYYYMMDDHHMMSS}__{description}.sql
│       ├── src/
│       │   ├── main/
│       │   │   └── java/com/platform/datasource/base/
│       │   │       ├── repository/   # JOOQ/MyBatis 리포지토리
│       │   │       ├── dto/          # 데이터 DTO
│       │   │       └── config/       # 데이터소스 설정
│       │   └── generated/            # JOOQ 자동 생성 코드
│       └── build.gradle              # JOOQ, Flyway 설정
│
├── front/                 # 프론트엔드
│   └── platform/
│       ├── src/
│       │   ├── api/      # 자동 생성된 API 훅
│       │   ├── model/    # 자동 생성된 타입
│       │   ├── components/  # UI 컴포넌트
│       │   ├── views/    # 페이지 컴포넌트
│       │   ├── router/   # 라우팅 설정
│       │   ├── store/    # Jotai 상태
│       │   └── util/     # HTTP 클라이언트
│       ├── config/       # Orval 설정
│       └── package.json
│
├── docker/                # Docker 설정
│   ├── mysql/            # MySQL 초기화 스크립트
│   ├── prometheus/       # 모니터링 설정
│   └── grafana/
│
├── build.gradle           # 루트 빌드 설정
├── settings.gradle        # 멀티 모듈 설정
├── docker-compose.yml     # 로컬 개발 환경
└── README.md
```

## 개발 환경 설정

### 1. 데이터베이스 초기화

```bash
# MySQL Docker 컨테이너 시작
docker-compose up -d

# 데이터베이스 정보
# - Host: localhost:3306
# - Database: store
# - Username: root
# - Password: root
```

### 2. Flyway 마이그레이션 및 JOOQ 생성

```bash
# 최초 실행 시: 데이터베이스 초기화 + JOOQ 생성
./gradlew flywayClean generateJooq

# 이후 실행: JOOQ 스키마만 최신화
./gradlew generateJooq

# Flyway 마이그레이션 후 JOOQ 생성
./gradlew generateJooqWithFlyway
```

### 3. 백엔드 API 실행

```bash
# API 서버 실행 (포트 8080)
./gradlew :api-platform:bootRun

# 또는 IDE에서 PlatformApiApplication.java 실행
```

### 4. 프론트엔드 실행

```bash
cd front/platform

# 의존성 설치
yarn install

# OpenAPI에서 API 타입 생성 (백엔드 서버 실행 필요)
yarn orval-fix

# 개발 서버 시작 (포트 3000)
yarn start
```

### 5. 배치 실행

```bash
# 배치 애플리케이션 실행
./gradlew :batch-platform:bootRun

# 또는 IDE에서 SpringPlatformBatchApplication.java 실행
```

## 모듈 구조 및 의존성

### 모듈 의존성 그래프

```
api-platform
  └─> common-web
      └─> common-core
          └─> common-base

batch-platform
  └─> common-web
      └─> (위와 동일)

datasource-base
  └─> common-base
```

### 모듈별 역할

**common-base**
- 기본 타입, Enum, 코드 정의 (SearchConditionType, BoardTypeCode 등)
- 공통 DTO 추상 클래스 (AbstractDTO, AbstractPagingDTO)
- 인증/권한 관련 클래스 (AuthUser, BasicAuthority)
- JOOQ 커스텀 설정 (CustomGeneratorStrategy)
- testFixtures: 공통 테스트 유틸리티

**common-core**
- 파일 업로드/다운로드 서비스
- PDF 처리 서비스 (PdfTocExtractor)
- 파일 설정 (FileProperties)
- 비동기 처리 설정 (AsyncConfig)

**common-web**
- Spring Security 설정
- JWT 토큰 유틸리티
- AOP 설정
- Cache 설정 (Caffeine)
- Actuator + Prometheus 메트릭

**datasource-base**
- JOOQ 및 MyBatis 리포지토리
- Flyway 마이그레이션 스크립트
- 데이터 DTO (Search, Response)
- 데이터베이스 설정 및 트랜잭션

**api-platform**
- REST API 컨트롤러
- 비즈니스 로직 서비스
- API DTO (Request, Response)
- OpenAPI/Swagger 문서화

**batch-platform**
- Spring Batch 잡 정의
- 배치 서비스 로직
- WebClient 설정 (외부 API 연동)
- 배치 리스너 및 유틸리티

## 코딩 컨벤션 및 패턴

### 패키지 구조

```
com.platform.{module}.{submodule}.{domain}.{layer}

예시:
- com.platform.api.platform.references.map.controller
- com.platform.api.platform.references.map.service
- com.platform.api.platform.references.map.dto
- com.platform.datasource.base.repository.reference
```

### 계층 분리 패턴

**1. Controller → Service → Repository**

```java
// Controller: HTTP 요청 처리, API 문서화
@Tag(name = "References Map API", description = "지도 정보 조회 API")
@RestController
@RequestMapping("/api/references/map")
@RequiredArgsConstructor
public class ReferencesMapReadController {
    private final ReferencesMapReadService service;

    @Operation(summary = "지도 리스트", description = "지도 목록을 조회한다.")
    @GetMapping
    ResponseEntity<Response> getList(@ParameterObject Search search) {
        return ResponseEntity.ok(service.getList(search));
    }
}

// Service: 비즈니스 로직
@Service
@RequiredArgsConstructor
public class ReferencesMapReadService {
    private final MapSearchRepository repository;

    public Response getList(Search search) {
        return Response.builder()
            .totalCount(repository.findTotalSize(search))
            .list(repository.findCases(search))
            .build();
    }
}

// Repository: 데이터 접근 (JOOQ)
@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class MapSearchRepository {
    private final DSLContext dslContext;

    public List<Case> findCases(Search search) {
        return dslContext.select(/*...*/)
            .from(TABLE)
            .where(getCondition(search))
            .fetchInto(Case.class);
    }
}
```

**2. Read/Write 분리**

읽기 전용과 쓰기 작업을 명확히 분리:
- `{Domain}ReadController` + `{Domain}ReadService`: 조회 전용
- `{Domain}Controller` + `{Domain}Service`: CUD 작업

### 네이밍 컨벤션

**클래스**
- Controller: `{Domain}Controller` 또는 `{Domain}ReadController`
- Service: `{Domain}Service` 또는 `{Domain}ReadService`
- Repository: `{Domain}Repository`
- DTO: `{Domain}Request`, `{Domain}Response`, `{Domain}Search`
- Enum/Type: `{Name}Code`, `{Name}Type`

**메서드**
- 조회: `find{Entity}`, `get{Entity}List`
- 생성: `create{Entity}`, `save{Entity}`
- 수정: `update{Entity}`, `modify{Entity}`
- 삭제: `delete{Entity}`, `remove{Entity}`
- 검증: `validate{Entity}`, `check{Entity}`

### Lombok 사용

```java
@Getter
@Builder
@RequiredArgsConstructor  // final 필드 DI
public class SomeClass {
    private final Dependency dependency;
    private final String field;
}
```

### JOOQ 사용 패턴

```java
@Repository
@PlatFormTransactional  // 커스텀 트랜잭션 어노테이션
@RequiredArgsConstructor
public class SomeRepository {
    private final DSLContext dslContext;
    private final JSomeTable SOME_TABLE = JSomeTable.SOME_TABLE;

    public List<DTO> findList(Search search) {
        return dslContext
            .select(SOME_TABLE.FIELD1, SOME_TABLE.FIELD2)
            .from(SOME_TABLE)
            .where(getCondition(search))
            .offset(search.getPage() * search.getPageSize())
            .limit(search.getPageSize())
            .fetchInto(DTO.class);
    }

    private Condition getCondition(Search search) {
        return likeIfNotBlank(SOME_TABLE.FIELD, search.getKeyword())
            .and(inIfNotEmpty(SOME_TABLE.STATUS, search.getStatuses()));
    }
}
```

**JOOQ 조건 유틸리티**
- `likeIfNotBlank(field, value)`: 값이 있을 때만 LIKE 조건
- `inIfNotEmpty(field, list)`: 리스트가 비어있지 않을 때만 IN 조건
- `datasource/base/util/condition/` 참고

### DTO 패턴

**AbstractDTO 상속**
```java
@Getter
@Setter
public class SomeDTO extends AbstractDTO {
    private String field1;
    private Integer field2;
}
```

**페이징 DTO**
```java
@Getter
@Setter
public class SomeSearch extends AbstractPagingDTO {
    private String keyword;
    private List<String> statuses;
}
```

### 테스트 작성

```java
@SpringBootTest
class SomeServiceTest extends BaseSpringBootTest {

    @Autowired
    private SomeService service;

    @Test
    void testSomeMethod() {
        // given
        var input = createTestData();

        // when
        var result = service.someMethod(input);

        // then
        assertThat(result).isNotNull();
    }
}
```

## 데이터베이스 관리

### Flyway 마이그레이션

**파일명 규칙**
```
V{YYYYMMDDHHMMSS}__{description}.sql

예시:
V20250610103000__system_deliberation_table.sql
V20250610104999__insert_code_CC001.sql
```

**마이그레이션 작성 팁**
- 테이블 생성/수정 후 반드시 `generateJooq` 실행
- 롤백이 불가능하므로 신중하게 작성
- 데이터 마이그레이션은 별도 스크립트로 분리

### JOOQ 코드 생성

**설정 위치**: `datasource/base/build.gradle`

```gradle
jooq {
    configurations {
        main {
            generationTool {
                database {
                    name = "org.jooq.meta.mysql.MySQLDatabase"
                    inputSchema = "store"
                    excludes = "flyway_schema_history | batch_job_.* | batch_step_.*"
                }
                generate {
                    daos = true
                    records = true
                    pojos = true
                    fluentSetters = true
                    javaTimeTypes = true
                }
                strategy.name = "com.platform.common.base.jooq.CustomGeneratorStrategy"
            }
        }
    }
}
```

**생성된 코드**
- 위치: `datasource/base/src/generated/`
- 패키지: `org.jooq.generated.tables.*`
- Git 무시됨 (`.gitignore`에 포함)

## API 개발 가이드

### OpenAPI/Swagger 사용

**API 문서 접근**
- URL: `http://localhost:8080/swagger-ui.html`
- OpenAPI Spec: `http://localhost:8080/v3/api-docs`

**어노테이션 사용**
```java
@Tag(name = "Domain API", description = "도메인 설명")
@RestController
@RequestMapping("/api/domain")
public class DomainController {

    @Operation(summary = "목록 조회", description = "도메인 목록을 조회한다.")
    @GetMapping
    ResponseEntity<Response> getList(
        @ParameterObject Search search
    ) {
        return ResponseEntity.ok(service.getList(search));
    }

    @Operation(summary = "생성", description = "도메인을 생성한다.")
    @PostMapping
    ResponseEntity<Void> create(
        @RequestBody @Valid Request request
    ) {
        service.create(request);
        return ResponseEntity.ok().build();
    }
}
```

### 프론트엔드 API 연동

**Orval 코드 생성**
```bash
# 백엔드 서버 실행 후
cd front/platform
yarn orval-fix  # API 생성 + 린팅
```

**생성된 훅 사용**
```typescript
import { useGetReferencesMapList } from '@/api/references-map-api';

function MapComponent() {
  const { data, isLoading } = useGetReferencesMapList({
    keyword: '검색어',
    page: 0,
    pageSize: 20
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.list.map(item => ...)}</div>;
}
```

### 인증 및 권한

**JWT 토큰 설정**
- 만료 시간: 24시간 (86400000ms)
- 갱신 전 시간: 5일 (432000000ms)
- 헤더: `Authorization: Bearer {token}`

**Spring Security 설정**
- `common-web` 모듈에 정의
- JWT 기반 인증
- 역할 기반 권한 관리 (BasicAuthority)

## 프론트엔드 개발 가이드

자세한 내용은 `front/platform/CLAUDE.md` 참고

**핵심 요약**
- React 19 + TypeScript + Vite
- TailwindCSS 4.x (디자인 시스템 기반)
- React Query (서버 상태) + Jotai (클라이언트 상태)
- Orval로 API 자동 생성
- 경로 별칭: `@/*` → `src/*`

## 배치 개발 가이드

### Spring Batch 구조

```java
@Configuration
@RequiredArgsConstructor
public class SomeBatch {

    @Bean
    public Job someJob(JobRepository jobRepository, Step step) {
        return new JobBuilder("someJob", jobRepository)
            .listener(listener)
            .start(step)
            .build();
    }

    @Bean
    public Step someStep(JobRepository jobRepository,
                         PlatformTransactionManager transactionManager) {
        return new StepBuilder("someStep", jobRepository)
            .tasklet((contribution, chunkContext) -> {
                // 배치 로직
                service.process();
                return RepeatStatus.FINISHED;
            }, transactionManager)
            .build();
    }
}
```

### 외부 API 연동

**WebClient 설정**
```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient kakaoWebClient(KakaoApiProperties properties) {
        return WebClient.builder()
            .baseUrl(properties.getBaseUrl())
            .defaultHeader(HttpHeaders.AUTHORIZATION,
                "KakaoAK " + properties.getApiKey())
            .build();
    }
}
```

## 환경 설정

### 프로파일 구조

**application.yml**
```yaml
spring:
  profiles:
    active: local
    group:
      local: base, core, datasource-base, web-base
      dev: base, core, datasource-base, web-base, datasource-base-dev
```

**프로파일별 설정**
- `local`: 로컬 개발 (기본)
- `dev`: 개발 서버
- 각 모듈별 프로파일: `{module}-{profile}.yml`

### 환경 변수

**데이터베이스**
- `DB_URL`: JDBC URL (기본: `jdbc:mysql://localhost:3306/store`)
- `DB_USER`: 사용자명 (기본: `root`)
- `DB_PWD`: 비밀번호 (기본: `root`)

**프론트엔드**
- `.env.development`: 개발 환경 설정
- `.env.production`: 운영 환경 설정

## Git 워크플로우

### 브랜치 전략

- `main`: 운영 브랜치
- `develop`: 개발 브랜치
- `feature/{feature-name}`: 기능 개발
- `fix/{bug-name}`: 버그 수정

### 커밋 메시지 규칙

**형식**: `타입: 한글 설명`

**타입**
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `docs`: 문서 수정
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 스크립트 수정 등

**예시**
```
feat: 지도 검색 API 추가
fix: 파일 업로드 시 Content-Type 에러 수정
refactor: JOOQ 쿼리 조건 유틸리티 분리
docs: README에 배치 실행 가이드 추가
```

## 트러블슈팅

### 자주 발생하는 문제

**1. JOOQ 생성 실패**
```bash
# MySQL 컨테이너 확인
docker-compose ps

# Flyway 마이그레이션 확인
./gradlew flywayInfo

# 강제 재생성
./gradlew flywayClean generateJooq
```

**2. API 코드 생성 실패 (Orval)**
```bash
# 백엔드 서버 실행 확인
curl http://localhost:8080/v3/api-docs

# 캐시 삭제 후 재생성
cd front/platform
rm -rf src/api src/model
yarn orval-fix
```

**3. 포트 충돌**
```bash
# MySQL 포트 확인
lsof -i :3306

# API 서버 포트 확인
lsof -i :8080

# 프론트엔드 포트 확인
lsof -i :3000
```

**4. 빌드 실패**
```bash
# Gradle 캐시 삭제
./gradlew clean

# 전체 재빌드
./gradlew build

# 특정 모듈만 빌드
./gradlew :api-platform:build
```

## AI 어시스턴트를 위한 중요 사항

### 코드 수정 시 주의사항

1. **데이터베이스 변경**
   - Flyway 마이그레이션 스크립트 작성
   - 파일명 규칙 준수
   - 마이그레이션 후 반드시 `generateJooq` 실행

2. **API 변경**
   - Controller에 OpenAPI 어노테이션 추가
   - 변경 후 프론트엔드에서 `yarn orval-fix` 실행 필요

3. **모듈 의존성**
   - common-base → common-core → common-web 순서 준수
   - 순환 참조 방지

4. **테스트**
   - 서비스 로직 변경 시 테스트 작성
   - `BaseSpringBootTest` 상속

### 검색 및 탐색 팁

**Controller 찾기**
```bash
find ./api -name "*Controller.java" | grep {domain}
```

**Repository 찾기**
```bash
find ./datasource -name "*Repository.java" | grep {domain}
```

**Flyway 마이그레이션**
```bash
ls -lt ./datasource/base/flyway/ | head -10
```

**설정 파일**
```bash
find . -name "application*.yml"
```

### 한국어 개발 문화

- **커밋 메시지**: 한국어 사용
- **문서 및 주석**: 한국어 권장 (기술 용어는 영어 유지)
- **도메인 용어**: 한국어 사용 (심의, 결론서, 재결 등)
- **변수/메서드명**: 영어 사용 (camelCase)

### 코드 리뷰 체크리스트

- [ ] 패키지 구조가 기존 패턴을 따르는가?
- [ ] Lombok 어노테이션을 적절히 사용했는가?
- [ ] Controller에 OpenAPI 문서화가 되어 있는가?
- [ ] JOOQ 조건 빌더를 사용했는가?
- [ ] 페이징 처리가 필요한 경우 구현되었는가?
- [ ] 트랜잭션 처리가 적절한가?
- [ ] 테스트 코드가 작성되었는가?
- [ ] 커밋 메시지가 규칙을 따르는가?

## 참고 자료

- Spring Boot 공식 문서: https://spring.io/projects/spring-boot
- JOOQ 문서: https://www.jooq.org/doc/latest/manual/
- Flyway 문서: https://flywaydb.org/documentation/
- React Query 문서: https://tanstack.com/query/latest
- Orval 문서: https://orval.dev/

## 프로젝트 정보

- **Group**: com.platform
- **Version**: 1.0.0
- **Java Version**: 17+
- **Spring Boot**: 3.4.2
- **Node Version**: 18+
- **Yarn Version**: 1.22+

---

이 문서는 프로젝트와 함께 지속적으로 업데이트됩니다. 질문이나 개선 사항이 있다면 팀에 문의하세요.
