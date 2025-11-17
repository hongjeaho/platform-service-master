# 멀티 데이터베이스 확장 유연성 - 핵심 요약

## 현재 상태 (2025-11-16)

### 아키텍처 철학

**각 데이터베이스 = 독립적인 datasource 모듈**

```
datasource/
├── base/          # MySQL 전용 모듈 (현재 유일)
│   ├── flyway/    # MySQL 마이그레이션
│   ├── jOOQ       # MySQL 코드 생성
│   ├── repository/# MySQL 리포지토리
│   ├── mapper/    # MySQL 매퍼
│   └── config/    # MySQL TransactionManager
│
├── postgres/      # PostgreSQL 추가 시 (미래)
│   ├── flyway/    # PostgreSQL 마이그레이션
│   ├── jOOQ       # PostgreSQL 코드 생성
│   ├── repository/# PostgreSQL 리포지토리
│   ├── mapper/    # PostgreSQL 매퍼
│   └── config/    # PostgreSQL TransactionManager
│
└── mongodb/       # MongoDB 추가 시 (미래)
    └── ...        # 동일한 독립 구조
```

### 현재 평가

```
✅ 매우 우수 - 모듈화된 설계
├─ datasource/base: MySQL 전용 독립 모듈
├─ 각 모듈마다 독립적인 jOOQ, Flyway, Repository, TransactionManager
├─ api/batch 모듈에서 필요한 datasource만 선택적으로 의존
└─ 기존 코드 수정 없이 새 DB 추가 가능
```

---

## 주요 파일 위치

### datasource/base 모듈 (MySQL)

```
datasource/base/
├── build.gradle                                      # jOOQ, Flyway 플러그인
├── flyway/V*.sql                                     # MySQL 마이그레이션 (32개)
├── src/main/
│   ├── java/.../config/
│   │   ├── database/PlatFormDatabaseSource.java      # MySQL DataSource
│   │   ├── database/PlatFormTransactional.java       # MySQL 트랜잭션 어노테이션
│   │   ├── JooqConfig.java                          # MySQL jOOQ 설정
│   │   └── MybatisConfig.java                       # MySQL MyBatis 설정
│   ├── java/.../repository/                         # MySQL 리포지토리
│   │   ├── receipt/ReceiptRepository.java
│   │   ├── receipt/ReceiptReadRepository.java
│   │   └── ... (15개 도메인)
│   └── resources/
│       ├── application-datasource-base.yml          # MySQL 설정
│       └── mybatis-mapper/**/*.xml                  # MyBatis XML
└── src/generated/                                    # jOOQ 생성 코드 (.gitignore)
```

### api/platform 모듈에서의 사용

```gradle
// api/platform/build.gradle
dependencies {
    implementation(project(":datasource-base"))      // MySQL 사용
    // implementation(project(":datasource-postgres"))  // PostgreSQL 추가 시
    // implementation(project(":datasource-mongodb"))   // MongoDB 추가 시
}
```

```java
// api/platform/src/.../controller/ReceiptController.java
@RestController
@RequiredArgsConstructor
public class ReceiptController {
    // MySQL 리포지토리 (datasource/base)
    private final ReceiptRepository receiptRepository;

    // PostgreSQL 리포지토리 (datasource/postgres) - 미래
    // private final PostgresReceiptRepository postgresReceiptRepository;
}
```

---

## 멀티 DB 지원 현황

| 기능 | 상태 | 확장 방법 |
|------|------|---------|
| **여러 DB 벤더** | ✅ 가능 | datasource/{db-name} 모듈 추가 |
| **모듈별 독립 jOOQ** | ✅ 가능 | 각 모듈의 build.gradle 설정 |
| **모듈별 독립 Flyway** | ✅ 가능 | 각 모듈의 flyway/ 디렉토리 |
| **모듈별 독립 Repository** | ✅ 가능 | 각 모듈의 repository/ 패키지 |
| **모듈별 독립 TransactionManager** | ✅ 가능 | 각 모듈의 Config 클래스 |
| **읽기 복제본** | ❌ 미구현 | 모듈 내 RoutingDataSource 추가 |
| **샤딩** | ❌ 미구현 | 별도 샤딩 로직 필요 |

---

## 확장 시나리오

### Scenario 1: PostgreSQL 모듈 추가 ⭐⭐ (낮음)

**작업 내용**:
1. `datasource/postgres` 디렉토리 생성
2. PostgreSQL 전용 build.gradle 작성 (jOOQ, Flyway)
3. PostgreSQL Config 클래스 작성
4. PostgreSQL Repository 작성
5. settings.gradle에 모듈 등록
6. api/platform에서 의존성 추가

**기존 코드 수정**: ❌ 없음 (완전히 독립)
**예상 시간**: 1-2일
**복잡도**: ⭐⭐ (낮음)

```gradle
// settings.gradle에 추가
include 'datasource:postgres'

// api/platform/build.gradle에 추가
implementation(project(":datasource-postgres"))
```

---

### Scenario 2: 읽기 복제본 추가 (모듈 내부) ⭐⭐ (낮음)

**작업 내용**:
1. datasource/base 내에 ReadWriteRoutingDataSource 구현
2. application-datasource-base.yml에 master/replica 설정 추가
3. PlatFormDatabaseSource 수정

**기존 Repository 코드 수정**: ❌ 없음 (자동 라우팅)
**예상 시간**: 2-3일
**성능 개선**: +20~40% 읽기 처리량
**복잡도**: ⭐⭐ (낮음)

```yaml
# datasource/base/src/main/resources/application-datasource-base.yml
platform.domain.datasource:
  master:
    jdbcUrl: jdbc:mysql://db-master:3306/store
  replica:
    jdbcUrl: jdbc:mysql://db-replica:3306/store
```

---

### Scenario 3: MongoDB 모듈 추가 ⭐⭐ (낮음)

**작업 내용**:
1. `datasource/mongodb` 디렉토리 생성
2. Spring Data MongoDB 설정
3. MongoDB Repository 작성 (jOOQ 미사용)

**기존 MySQL 코드 영향**: ❌ 없음
**예상 시간**: 1-2일
**복잡도**: ⭐⭐ (낮음)

```java
// datasource/mongodb/src/.../repository/LogRepository.java
public interface LogRepository extends MongoRepository<Log, String> {
    List<Log> findByUserIdAndCreatedAtBetween(...);
}
```

---

## 즉시 개선 사항 (1주 이내)

### 1. 배치 매퍼 분리

**현재 문제**:
```
datasource/base/src/main/resources/mybatis-mapper/
└── batch/             ← 배치용인데 datasource/base에 혼재
    ├── KapaDataMapper.xml
    └── LtisDataMapper.xml
```

**개선 방안**:
```
datasource/base에서 batch 매퍼 제거
→ batch/platform/src/main/resources/mybatis-mapper/로 이동
```

**효과**: 모듈 경계 명확화, 배치 DB 사용 명시적

---

## 성능 예상치

| 시나리오 | 읽기 성능 | 쓰기 성능 | 복잡도 |
|---------|----------|----------|--------|
| 현재 (datasource/base만) | 기준 | 기준 | - |
| + 읽기 복제본 (모듈 내) | +20~40% | -0% | ⭐⭐ 낮음 |
| + PostgreSQL 모듈 | 유사 | 유사 | ⭐⭐ 낮음 |
| + MongoDB 모듈 | 유사 | 유사 | ⭐⭐ 낮음 |
| + 샤딩 (3개) | +150~200% | +150~200% | ⭐⭐⭐⭐ 높음 |

---

## 권장 로드맵

### Phase 1 (1주 이내) - 즉시

**Priority 1**: 배치 매퍼 분리
- [ ] datasource/base의 batch 매퍼 → batch/platform으로 이동
- 소요 시간: 1일
- 효과: 모듈 독립성 향상

**Priority 2**: 읽기 복제본 설계
- [ ] RoutingDataSource 설계 문서 작성
- [ ] 성능 테스트 계획 수립

---

### Phase 2 (1개월) - 단기

**Priority 3**: 읽기 복제본 구현 (datasource/base 내부)
- [ ] ReadWriteRoutingDataSource 구현
- [ ] master/replica 설정 추가
- [ ] 성능 테스트
- 소요 시간: 2-3일
- 효과: 읽기 처리량 +20~40%

---

### Phase 3 (3개월) - 중기 (필요시)

**Priority 4**: PostgreSQL 모듈 추가
- [ ] datasource/postgres 모듈 생성
- [ ] PostgreSQL jOOQ, Flyway 설정
- [ ] PostgreSQL Repository 작성
- 소요 시간: 1-2일
- 효과: 다중 벤더 지원 예시

**Priority 5**: MongoDB 모듈 추가
- [ ] datasource/mongodb 모듈 생성
- [ ] Spring Data MongoDB 설정
- 소요 시간: 1-2일
- 효과: NoSQL 지원

---

### Phase 4 (6개월+) - 장기 (필요시)

**Priority 6**: 샤딩 메커니즘
- [ ] ShardingDataSource 설계 및 구현
- 소요 시간: 7-10일
- 효과: 대규모 데이터 분산

**Priority 7**: 분산 트랜잭션 (JTA)
- [ ] Narayana JTA 도입
- 소요 시간: 3-5일
- 주의: 성능 오버헤드 20-30%

---

## 핵심 결론

### ✅ 현재 아키텍처의 강점

1. **완벽한 모듈 독립성**
   - 각 datasource 모듈은 완전히 독립적
   - 새 DB 추가 시 기존 코드 수정 불필요

2. **확장성 우수**
   - datasource/{db-name} 패턴으로 무제한 확장 가능
   - 각 모듈마다 독립적인 jOOQ, Flyway, Repository, TransactionManager

3. **선택적 의존성**
   - api/batch 모듈에서 필요한 datasource만 선택
   - 사용하지 않는 DB 의존성 없음

### ⚠️ 개선 필요 사항

1. **배치 매퍼 분리** (1일)
   - datasource/base의 batch 매퍼 → batch/platform으로 이동

2. **읽기 복제본 구현** (2-3일)
   - datasource/base 내 RoutingDataSource 추가
   - 성능 개선 +20~40%

### 🎯 추천 우선순위

**1순위**: 배치 매퍼 분리 (즉시, 1일)
**2순위**: 읽기 복제본 추가 (단기, 2-3일)
**3순위**: PostgreSQL 모듈 (필요시, 1-2일)

---

## 참고

상세 분석은 `MULTI_DB_ANALYSIS.md` 참고 (1,000줄)

- Section 1: datasource/base 모듈 상세 구조
- Section 7: 확장 시나리오별 구현 코드 예제
- Section 8: 우선순위별 권고사항
- Section 10: 성능 고려사항
