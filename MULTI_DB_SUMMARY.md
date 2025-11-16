# 멀티 데이터베이스 확장 유연성 - 핵심 요약

## 현재 상태 (2025-11-16)

### 데이터소스 설정 구조
```
✅ 잘 설계됨
├─ PlatFormDatabaseSource: API용 DataSource 관리
├─ BatchConfig: 배치 전용 DataSource 관리
├─ 독립적인 TransactionManager
└─ 자동 설정 제외로 수동 구성 가능
```

**설정 파일 위치**:
- 플랫폼: `/datasource/base/src/main/resources/application-datasource-base*.yml`
  - `platform.domain.datasource.*` (HikariCP 연결 풀)
- 배치: `/batch/platform/src/main/resources/application*.yml`
  - `batch.domain.datasource.*` (별도 DB)

**현황**: 이미 API와 배치가 다른 DB 사용 중

---

## jOOQ 설정

### 코드 생성
```gradle
// datasource/base/build.gradle
jooq {
    database {
        name = "org.jooq.meta.mysql.MySQLDatabase"  // ❌ MySQL 전용
        inputSchema = "store"
    }
}
```

**제약사항**:
- ❌ MySQL 방언만 지원
- ❌ 단일 스키마만 생성
- ✅ 환경변수로 DB_URL 변경 가능 (빌드 시)

**생성 위치**: `datasource/base/src/generated/` (자동 생성, .gitignore)

---

## MyBatis 설정

### SqlSessionFactory
```java
@MapperScan(basePackages = {"com.platform.datasource.base.mapper"})
public class MybatisConfig {
    @Bean
    public SqlSessionFactory platformDomainSqlSessionFactory(...) 
```

**특징**:
- ✅ 다중 SqlSessionFactory 추가 가능
- ✅ 7개 Mapper 파일 (주로 배치 작업)
- ⚠️ 현재는 단일 팩토리만 사용

**위치**: `/datasource/base/src/main/resources/mybatis-mapper/`

---

## 트랜잭션 관리

### 커스텀 어노테이션
```java
@PlatFormTransactional                  // 읽기/쓰기
@PlatFormTransactional(readOnly=true)   // 읽기 전용
```

**특징**:
- ✅ Repository 분리 (ReceiptRepository vs ReceiptReadRepository)
- ✅ 명시적 TransactionManager 지정
- ⚠️ 읽기도 동일 DataSource 사용 (복제본 미지원)

---

## 멀티 DB 지원 현황

| 기능 | 상태 | 난이도 |
|------|------|-------|
| **여러 DataSource** | ✅ 가능 | ⭐ 쉬움 |
| **읽기 복제본** | ❌ 미구현 | ⭐⭐ 쉬움 |
| **다중 DB 벤더** | ❌ MySQL만 | ⭐⭐⭐ 중간 |
| **샤딩** | ❌ 없음 | ⭐⭐⭐⭐ 어려움 |
| **분산 트랜잭션** | ❌ 없음 | ⭐⭐⭐ 중간 |

---

## 주요 파일 위치

### DataSource 설정
```
datasource/base/
├── src/main/resources/
│   ├── application-datasource-base.yml          # 플랫폼 설정
│   └── application-datasource-base-dev.yml      # 개발 환경
└── src/main/java/.../config/
    ├── database/PlatFormDatabaseSource.java      # 플랫폼 DataSource
    ├── database/PlatFormTransactional.java       # 커스텀 어노테이션
    ├── JooqConfig.java                          # jOOQ 설정
    └── MybatisConfig.java                       # MyBatis 설정

batch/platform/
├── src/main/resources/
│   └── application.yml                          # 배치 설정
└── src/main/java/.../config/
    └── BatchConfig.java                         # 배치 DataSource
```

### 저장소 (Repository)
```
datasource/base/src/main/java/.../repository/
├── receipt/
│   ├── ReceiptRepository.java          # 쓰기 (INSERT/UPDATE/DELETE)
│   └── ReceiptReadRepository.java      # 읽기 (SELECT)
├── board/
├── conclusion/
└── ... (15개 도메인)

mapper/
├── user/UserMapper.java
└── batch/
    ├── KapaDataMapper.java
    ├── LtisDataMapper.java
    └── ...
```

---

## 확장 가능성 분석

### 1단계: 읽기 복제본 추가 ⭐⭐ (가장 쉬움)

**필요한 작업**:
1. `ReadWriteRoutingDataSource.java` 구현 (50줄)
2. 설정 파일에 master/replica 추가 (50줄)
3. `PlatFormDatabaseSource` 수정 (30줄)

**기존 코드 수정**: ❌ 거의 없음
**예상 시간**: 2-3일

```yaml
platform.domain.datasource:
  master:
    jdbcUrl: jdbc:mysql://master-db:3306/store
  replica:
    jdbcUrl: jdbc:mysql://read-replica:3306/store
```

**효과**: 읽기 처리량 20~40% 향상

---

### 2단계: PostgreSQL 지원 추가 ⭐⭐⭐ (중간)

**필요한 작업**:
1. 새로운 모듈 생성: `datasource/postgres`
2. PostgreSQL jOOQ 설정
3. `PostgresDatabaseSource` 구현
4. 새로운 Repository (이미 있는 구조와 동일)

**기존 코드 수정**: ❌ 없음
**예상 시간**: 5-7일

```java
// 완전히 별도의 DataSource + DSLContext
@Bean("postgresDslContext")
public DSLContext postgresDslContext(...) {
    // SQLDialect.POSTGRES 사용
}
```

**주의**: 각 DB별로 jOOQ 코드 재생성 필요

---

### 3단계: 샤딩 구현 ⭐⭐⭐⭐ (어려움)

**필요한 작업**:
1. `ShardingDataSource` 구현
2. `ShardingContext` (ThreadLocal 기반)
3. `@Sharded` 어노테이션
4. AOP 인터셉터

**기존 코드 수정**: ⚠️ 메서드에 `@Sharded` 추가
**예상 시간**: 7-10일

```java
@Sharded(paramIndex = 0)  // userId 기반 샤딩
public ReceiptDto getReceipt(int userId, long receiptId) {
    return receiptRepository.findById(receiptId);
}
```

**주의**: 크로스 샤드 조인 불가능, 글로벌 트랜잭션 복잡

---

## 즉시 개선 사항 (1주 이내)

### 1. 배치 매퍼 분리
현재 배치 관련 MyBatis Mapper가 platform datasource에 혼재

```
datasource/base/src/main/resources/mybatis-mapper/
├── batch/             # ← batch 모듈로 이동
│   ├── KapaDataMapper.xml
│   ├── LtisDataMapper.xml
│   └── ...
└── user/             # ← 플랫폼 것만 남기기
```

**효과**: 배치 전용 DataSource 명시적 사용

### 2. ReadRepository 라우팅 준비
이미 `readOnly=true` 어노테이션이 있으므로, 향후 RoutingDataSource 추가 시 자동으로 동작

```java
@PlatFormTransactional(readOnly = true)  // ← 이미 준비됨
public class ReceiptReadRepository { ... }
```

---

## 성능 예상치

| 확장 시나리오 | 읽기 성능 | 쓰기 성능 | 복잡도 |
|-------------|----------|----------|--------|
| 현재 (단일 DB) | 기준 | 기준 | - |
| + 읽기 복제본 | +20~40% | -0% | 낮음 |
| + PostgreSQL | 유사 | 유사 | 중간 |
| + 샤딩 (3개) | +150~200% | +150~200% | 높음 |
| + JTA | -20~30% | -20~30% | 중간 |

---

## 권장 로드맵

### Phase 1 (즉시 ~ 1주)
- [ ] 배치 매퍼 분리
- [ ] ReadRepository 라우팅 설계

### Phase 2 (1~3개월)  
- [ ] 읽기 복제본 구현 (RoutingDataSource)
- [ ] jOOQ 버전 업그레이드 → 다중 스키마 지원

### Phase 3 (3~6개월)
- [ ] PostgreSQL 지원 추가
- [ ] 샤딩 설계/구현 (필요 시)

### Phase 4 (6~12개월)
- [ ] 이벤트 소싱 도입 (분산 환경 최적화)
- [ ] JTA 분산 트랜잭션 (필수 시만)

---

## 핵심 결론

✅ **현재 구조는 멀티 DB 확장에 충분히 준비됨 (70%)**
- DataSource 분리: 이미 구현됨
- TransactionManager 분리: 이미 구현됨  
- Repository 패턴: 이미 잘 정립됨

⚠️ **부분적으로 구현된 부분**
- 읽기 복제본 어노테이션은 있지만, 라우팅 로직 없음
- 배치와 플랫폼 DB가 분리되어 있지만 매퍼는 혼재

❌ **구현 필요**
- 읽기 복제본 자동 라우팅
- 다중 DB 벤더 지원
- 샤딩 (대규모 데이터 시)

**선순위 1**: 읽기 복제본 추가 (2-3일, 20~40% 성능 향상)
**선순위 2**: 배치 매퍼 분리 (1-2일, 구조 정리)

---

## 참고

상세 분석은 `MULTI_DB_ANALYSIS.md` 참고 (900줄)

- Section 6: 확장 시나리오별 구현 방법 및 코드 예제
- Section 9: 읽기 복제본 단계별 구현 가이드
- Section 10: 성능 고려사항
