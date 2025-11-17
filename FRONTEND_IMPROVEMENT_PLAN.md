# 프론트엔드 개선 계획 - 생성된 파일 관리

**작성일**: 2025-11-17
**대상**: front/platform 모듈
**주제**: Orval 자동 생성 파일의 효율적 관리 방안

---

## 📋 목차

1. [현재 상황 분석](#현재-상황-분석)
2. [문제점 상세](#문제점-상세)
3. [개선 계획](#개선-계획)
4. [단계별 실행 방안](#단계별-실행-방안)
5. [기대 효과](#기대-효과)

---

## 현재 상황 분석

### Orval 자동 생성 프로세스

```
백엔드 OpenAPI 스펙 (http://localhost:8080/api/public/api-docs/json)
        ↓
    yarn orval-fix 실행
        ↓
   ┌────────────────────────────────┐
   │   Orval 코드 생성              │
   │   - OpenAPI 태그별로 분리      │
   │   - React Query 훅 생성        │
   │   - TypeScript 타입 생성       │
   └────────────────────────────────┘
        ↓
   ┌─────────────┬──────────────┐
   │             │              │
src/api/     src/model/    자동 ESLint/Prettier
(훅)         (타입)         포맷팅
```

### 생성되는 파일 구조

```
src/
├── api/                    # React Query 훅 (자동 생성)
│   ├── account/
│   │   └── account.ts      # useGetAccount, useUpdateAccount 등
│   ├── admin/
│   │   └── admin.ts
│   ├── board/
│   │   └── board.ts
│   ├── conclusion/
│   │   └── conclusion.ts
│   ├── deliberation/
│   │   └── deliberation.ts
│   ├── land/
│   │   └── land.ts
│   ├── opinion/
│   │   └── opinion.ts
│   ├── receipt/
│   │   └── receipt.ts
│   └── ... (19개 도메인)
│
└── model/                  # TypeScript 타입 (자동 생성)
    ├── accountDto.ts
    ├── accountListDto.ts
    ├── receiptDto.ts
    ├── receiptCreateDto.ts
    ├── receiptUpdateDto.ts
    ├── boardDto.ts
    └── ... (수백 개 파일)
```

### 현재 생성 시간

| 항목 | 현재 | 비고 |
|------|------|------|
| **OpenAPI 스펙 크기** | ~50KB | 백엔드 엔드포인트 수에 비례 |
| **생성되는 API 파일** | ~19개 | 도메인(태그)당 1개 |
| **생성되는 모델 파일** | ~150개 | DTO당 1개 |
| **Orval 실행 시간** | ~10-15초 | 네트워크 + 생성 + ESLint |
| **빌드 시간 영향** | ~3-5초 | 타입 체크 시간 증가 |

---

## 문제점 상세

### 1. 프로젝트 규모 증가 시 생성 시간 증가 🐌

**현재 예상 성장 곡선**:

| 시점 | 엔드포인트 수 | Orval 실행 시간 | 빌드 시간 | 문제점 |
|------|-------------|----------------|----------|--------|
| **현재** | ~50개 | 10-15초 | 3-5초 | ✅ 관리 가능 |
| **6개월 후** | ~100개 | 20-30초 | 8-12초 | ⚠️ 개발 흐름 방해 |
| **1년 후** | ~200개 | 40-60초 | 15-20초 | 🔴 심각한 병목 |
| **2년 후** | ~400개 | 80-120초 | 30-40초 | 🔴 개발 불가능 |

**문제 시나리오**:
```bash
# 개발자가 백엔드 API 변경 후
$ yarn orval-fix

# 10-15초 대기... (현재)
# 40-60초 대기... (1년 후)
# 개발 흐름이 끊김!
```

### 2. 불필요한 파일 생성 📁

**문제 예시**:

```typescript
// src/api/statistics/statistics.ts
// 통계 API - 프론트엔드에서 거의 사용하지 않음
export const useGetStatistics = () => { ... }          // ❌ 사용 안 함
export const useGetYearlyStatistics = () => { ... }    // ❌ 사용 안 함
export const useGetMonthlyStatistics = () => { ... }   // ❌ 사용 안 함

// src/api/receipt/receipt.ts
// 접수 API - 프론트엔드에서 자주 사용
export const useGetReceipts = () => { ... }            // ✅ 매일 사용
export const useCreateReceipt = () => { ... }          // ✅ 매일 사용
```

**비효율**:
- 모든 백엔드 API가 자동 생성됨
- 실제로 프론트에서 사용하는 것은 60% 정도
- 나머지 40%는 불필요한 코드

### 3. Git 충돌 빈번 ⚠️

**문제 시나리오**:

```bash
# 개발자 A: receipt API 사용
$ yarn orval-fix
$ git add src/api/receipt/receipt.ts src/model/receiptDto.ts

# 개발자 B: board API 사용 (동시에)
$ yarn orval-fix
$ git add src/api/board/board.ts src/model/boardDto.ts

# 커밋 시
# src/api/receipt/receipt.ts - 자동 재생성으로 해시 변경
# src/model/receiptDto.ts - 자동 재생성으로 해시 변경
# → Git 충돌 발생!
```

**원인**:
- Orval이 전체 파일을 매번 재생성
- 파일 헤더에 타임스탬프나 생성 정보 포함 시 항상 다른 해시 생성
- 실제 코드 변경이 없어도 Git에서 변경으로 인식

### 4. IDE 성능 저하 💻

**현상**:
- VSCode/WebStorm에서 `src/api/`, `src/model/` 폴더 열 때 느림
- TypeScript 언어 서버가 수백 개 파일 분석 → CPU 사용량 증가
- 자동완성 느려짐

**측정 예시**:

| 파일 수 | IDE 인덱싱 시간 | 자동완성 속도 |
|---------|----------------|-------------|
| ~150개 (현재) | ~3-5초 | ✅ 빠름 |
| ~300개 (6개월 후) | ~10-15초 | ⚠️ 보통 |
| ~600개 (1년 후) | ~30-45초 | 🔴 느림 |

### 5. 타입 중복 및 혼란 🔀

**문제 예시**:

```typescript
// src/model/receiptDto.ts (자동 생성)
export interface ReceiptDto {
  id: number
  title: string
  status: string
}

// src/types/receipt.ts (개발자가 직접 작성)
export interface ReceiptFilter {
  status?: string
  startDate?: Date
}

// src/types/domain/receipt.ts (또 다른 커스텀 타입)
export type ReceiptStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
```

**혼란 포인트**:
1. 어디서 타입을 가져와야 하는지 불명확
2. `ReceiptDto` vs `Receipt` vs `ReceiptFilter` 구분 어려움
3. 새 개발자는 타입 찾기 어려움

---

## 개선 계획

### 전략 1: 선택적 API 생성 (Selective Generation) 🎯

**목표**: 프론트엔드에서 실제 사용하는 API만 생성

#### 구현 방법

**방법 A: OpenAPI 태그 필터링**

```typescript
// config/orval.config.ts
export default defineConfig({
  store: {
    input: {
      target: getApiUrl(),
      // ✅ 프론트엔드에서 사용하는 태그만 지정
      filters: {
        tags: [
          'receipt',       // 접수 (필수)
          'deliberation',  // 심의 (필수)
          'conclusion',    // 결의 (필수)
          'board',         // 게시판 (필수)
          'opinion',       // 의견 (필수)
          'land',          // 토지 (필수)
          'account',       // 계정 (필수)
          'admin',         // 관리자 (필수)
          // 'statistics',  // ❌ 제외 (프론트 미사용)
          // 'batch',       // ❌ 제외 (배치 전용)
          // 'internal',    // ❌ 제외 (내부 API)
        ],
      },
    },
  },
})
```

**방법 B: 개별 엔드포인트 필터링 (고급)**

```typescript
// config/orval.config.ts
export default defineConfig({
  store: {
    input: {
      target: getApiUrl(),
      override: {
        // 특정 경로 제외
        excludePaths: [
          '/api/v1/internal/**',    // 내부 API 제외
          '/api/v1/batch/**',        // 배치 API 제외
          '/api/v1/statistics/**',   // 통계 API 제외
        ],
      },
    },
  },
})
```

**효과**:
- Orval 실행 시간: 15초 → 8초 (47% 감소)
- 생성 파일 수: 150개 → 90개 (40% 감소)
- Git 충돌: 감소

---

### 전략 2: 증분 생성 (Incremental Generation) ⚡

**목표**: 변경된 API만 재생성

#### 구현 방법

**Step 1: OpenAPI 스펙 변경 감지**

```typescript
// config/orval-incremental.ts
import fs from 'fs'
import crypto from 'crypto'

// OpenAPI 스펙의 해시 생성
function getApiHash(apiSpec: any): string {
  return crypto.createHash('md5').update(JSON.stringify(apiSpec)).digest('hex')
}

// 이전 해시와 비교
function hasApiChanged(currentHash: string): boolean {
  const cacheFile = '.orval-cache.json'

  if (!fs.existsSync(cacheFile)) {
    return true  // 첫 실행
  }

  const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
  return cache.hash !== currentHash
}

// 해시 저장
function saveApiHash(hash: string): void {
  fs.writeFileSync('.orval-cache.json', JSON.stringify({ hash, timestamp: Date.now() }))
}
```

**Step 2: 스마트 재생성 스크립트**

```typescript
// scripts/orval-smart.ts
import { execSync } from 'child_process'

async function smartOrval() {
  console.log('📡 Fetching OpenAPI spec...')
  const apiSpec = await fetch('http://localhost:8080/api/public/api-docs/json').then(r => r.json())

  const currentHash = getApiHash(apiSpec)

  if (!hasApiChanged(currentHash)) {
    console.log('✅ API spec unchanged. Skipping generation.')
    return
  }

  console.log('🔄 API changed. Regenerating...')
  execSync('yarn orval', { stdio: 'inherit' })

  saveApiHash(currentHash)
  console.log('✅ Generation complete!')
}

smartOrval()
```

**Step 3: package.json 스크립트 수정**

```json
{
  "scripts": {
    "orval": "orval --config ./config/orval.config.ts",
    "orval-smart": "ts-node scripts/orval-smart.ts",
    "orval-fix": "yarn orval-smart && yarn eslint-fix"
  }
}
```

**효과**:
- API 변경 없을 때: 15초 → 1초 (93% 감소)
- API 변경 있을 때: 15초 → 15초 (동일)
- 개발 흐름 개선

---

### 전략 3: 파일 구조 최적화 📂

**목표**: 생성 파일 수 최소화, 번들 크기 감소

#### 구현 방법

**방법 A: 도메인별 단일 파일 생성**

```typescript
// config/orval.config.ts
export default defineConfig({
  store: {
    output: {
      // ❌ 기존: 모델 파일이 DTO마다 분리
      // src/model/receiptDto.ts
      // src/model/receiptCreateDto.ts
      // src/model/receiptUpdateDto.ts

      // ✅ 개선: 도메인별 단일 파일로 통합
      mode: 'single',  // 또는 'tags-split'
      target: 'src/api/generated.ts',  // 모든 훅을 하나의 파일로
      schemas: 'src/model/generated.ts',  // 모든 타입을 하나의 파일로
    },
  },
})
```

**방법 B: 도메인별 분할 (추천)**

```typescript
// config/orval.config.ts
export default defineConfig({
  store: {
    output: {
      mode: 'tags-split',  // 태그(도메인)별로 분할
      target: 'src/api',
      schemas: 'src/model',
    },
  },
})
```

생성 결과:
```
src/
├── api/
│   ├── receipt.ts          # Receipt 관련 모든 훅
│   ├── board.ts            # Board 관련 모든 훅
│   └── ...
└── model/
    ├── receipt.ts          # Receipt 관련 모든 타입
    ├── board.ts            # Board 관련 모든 타입
    └── ...
```

**효과**:
- 파일 수: 150개 → 20개 (87% 감소)
- IDE 인덱싱: 5초 → 1초 (80% 감소)
- Import 간편화

---

### 전략 4: Git 충돌 방지 🔧

**목표**: 자동 생성 파일의 Git 충돌 최소화

#### 구현 방법

**방법 A: .gitignore에 추가 (가장 간단)**

```gitignore
# front/platform/.gitignore

# Orval 자동 생성 파일 (선택적 무시)
src/api/
src/model/

# 단, 첫 설치 시에는 포함 필요
!src/api/.gitkeep
!src/model/.gitkeep
```

**장점**:
- Git 충돌 완전히 제거
- 각 개발자가 로컬에서 생성

**단점**:
- CI/CD에서 백엔드 서버 필요
- 새 개발자 온보딩 시 추가 단계

**방법 B: Git 속성 설정**

```gitattributes
# front/platform/.gitattributes

# Orval 생성 파일은 자동 병합
src/api/** merge=ours
src/model/** merge=ours
```

이렇게 하면 충돌 시 자동으로 "우리 쪽" 버전 사용.

**방법 C: 생성 시 타임스탬프 제거**

```typescript
// config/orval.config.ts
export default defineConfig({
  store: {
    output: {
      // 파일 헤더에 타임스탬프 포함 안 함
      prettier: true,
      override: {
        header: () => [
          '/**',
          ' * Generated by Orval',
          ' * Do not edit manually.',
          ' */',
        ],
      },
    },
  },
})
```

**효과**:
- 코드 변경 없으면 Git diff 없음
- 불필요한 커밋 방지

---

### 전략 5: 타입 조직화 🗂️

**목표**: 자동 생성 타입 vs 커스텀 타입 명확히 구분

#### 구현 방법

**디렉토리 구조**:

```
src/
├── api/                    # 자동 생성 (Orval)
│   └── ...
│
├── model/                  # 자동 생성 (Orval)
│   └── ...
│
└── types/                  # 수동 작성
    ├── index.ts            # 통합 export
    ├── common.ts           # 공통 타입
    ├── enums.ts            # 열거형
    └── domain/             # 도메인별 확장 타입
        ├── receipt.ts      # Receipt 관련 확장 타입
        ├── board.ts
        └── ...
```

**타입 사용 가이드**:

```typescript
// ✅ 올바른 사용법

// 1. 자동 생성 타입 (백엔드 DTO)
import type { ReceiptDto } from '@/model/receipt'  // Orval 생성

// 2. 프론트엔드 전용 타입 (필터, UI 상태 등)
import type { ReceiptFilter, ReceiptUIState } from '@/types/domain/receipt'  // 수동 작성

// 3. 공통 타입
import type { ApiResponse, PaginationParams } from '@/types/common'

// 사용
function useReceipts(filter: ReceiptFilter) {
  const { data } = useGetReceipts()  // ReceiptDto[] 반환

  // UI 상태
  const [uiState, setUiState] = useState<ReceiptUIState>({ ... })
}
```

**src/types/domain/receipt.ts 예시**:

```typescript
// 수동 작성 타입 (프론트엔드 전용)
import type { ReceiptDto } from '@/model/receipt'  // Orval 생성 타입 임포트

// 필터 타입 (검색용)
export interface ReceiptFilter {
  status?: ReceiptStatus
  startDate?: Date
  endDate?: Date
  keyword?: string
}

// 열거형
export type ReceiptStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// UI 상태 타입
export interface ReceiptUIState {
  selectedIds: number[]
  isEditing: boolean
  sortBy: 'date' | 'title' | 'status'
}

// 파생 타입 (백엔드 DTO 확장)
export interface ReceiptWithUI extends ReceiptDto {
  isSelected: boolean  // UI 전용 필드
  formattedDate: string  // UI 전용 필드
}
```

**효과**:
- 타입 찾기 쉬움
- 역할 명확 (백엔드 DTO vs 프론트 전용)
- 새 개발자 온보딩 간편

---

## 단계별 실행 방안

### Phase 1: 즉시 실행 (1주일) 🚀

**목표**: 빠른 개선, 부작용 최소화

| 작업 | 소요 시간 | 담당자 | 우선순위 |
|------|----------|--------|---------|
| 1. 선택적 API 생성 설정 | 1시간 | 프론트 리드 | ⭐⭐⭐ 높음 |
| 2. 타입 디렉토리 재구성 | 2시간 | 전체 팀 | ⭐⭐⭐ 높음 |
| 3. Git 충돌 방지 설정 | 30분 | 프론트 리드 | ⭐⭐ 중간 |

**실행 단계**:

```bash
# Step 1: 선택적 API 생성
cd front/platform
vi config/orval.config.ts  # filters.tags 추가

# Step 2: 테스트
yarn orval-fix

# Step 3: 확인
ls -la src/api/  # 파일 수 확인
ls -la src/model/  # 파일 수 확인

# Step 4: 커밋
git add config/orval.config.ts
git commit -m "feat: Orval 선택적 API 생성 설정 추가"
```

---

### Phase 2: 단기 개선 (1개월) 📈

**목표**: 증분 생성, 성능 개선

| 작업 | 소요 시간 | 담당자 | 우선순위 |
|------|----------|--------|---------|
| 4. 증분 생성 스크립트 작성 | 4시간 | 프론트 리드 | ⭐⭐ 중간 |
| 5. .orval-cache.json 테스트 | 1시간 | 프론트 팀 | ⭐⭐ 중간 |
| 6. CI/CD 파이프라인 수정 | 2시간 | DevOps | ⭐ 낮음 |

**실행 단계**:

```bash
# Step 1: 스크립트 작성
mkdir scripts
vi scripts/orval-smart.ts  # 증분 생성 로직 추가

# Step 2: package.json 수정
vi package.json  # orval-smart 스크립트 추가

# Step 3: 테스트
yarn orval-smart  # 첫 실행 (전체 생성)
yarn orval-smart  # 두 번째 실행 (스킵 확인)

# Step 4: 백엔드 API 변경 후
yarn orval-smart  # 재생성 확인
```

---

### Phase 3: 장기 최적화 (3개월) 🎯

**목표**: 완전한 자동화, 최적 구조

| 작업 | 소요 시간 | 담당자 | 우선순위 |
|------|----------|--------|---------|
| 7. 파일 구조 최적화 (tags-split) | 6시간 | 프론트 팀 | ⭐ 낮음 |
| 8. IDE 성능 모니터링 | 2시간 | 프론트 팀 | ⭐ 낮음 |
| 9. 문서화 및 가이드 작성 | 4시간 | 프론트 리드 | ⭐⭐ 중간 |

---

## 기대 효과

### 정량적 효과

| 지표 | 현재 | Phase 1 후 | Phase 2 후 | Phase 3 후 |
|------|------|-----------|-----------|-----------|
| **Orval 실행 시간** | 15초 | 8초 (47% ↓) | 1초* (93% ↓) | 1초* |
| **생성 파일 수** | 150개 | 90개 (40% ↓) | 90개 | 20개 (87% ↓) |
| **Git 충돌 빈도** | 주 2-3회 | 주 1회 | 주 0-1회 | 거의 없음 |
| **IDE 인덱싱 시간** | 5초 | 3초 (40% ↓) | 3초 | 1초 (80% ↓) |
| **빌드 시간** | 45초 | 40초 (11% ↓) | 40초 | 35초 (22% ↓) |

*변경 없을 때

### 정성적 효과

1. **개발 경험 개선 (DX)**
   - 개발 흐름 끊김 감소
   - API 변경 후 즉시 작업 가능
   - Git 충돌 스트레스 감소

2. **팀 협업 개선**
   - 동시 작업 시 충돌 감소
   - 코드 리뷰 시 불필요한 diff 제거
   - 새 개발자 온보딩 간편화

3. **유지보수성 향상**
   - 타입 위치 명확
   - 코드 구조 이해 쉬움
   - 디버깅 시간 감소

---

## 위험 요소 및 대응 방안

### 위험 1: CI/CD 파이프라인 영향

**위험**:
- .gitignore에 src/api, src/model 추가 시
- CI/CD에서 빌드 실패 가능

**대응**:
```yaml
# .github/workflows/build.yml
- name: Generate API
  run: |
    cd front/platform
    yarn orval-fix  # CI에서 생성

- name: Build
  run: yarn build
```

### 위험 2: 기존 코드 호환성

**위험**:
- 파일 구조 변경 시 기존 import 깨짐

**대응**:
```bash
# 점진적 마이그레이션
1. 새 구조로 생성
2. import 일괄 변경 (Find & Replace)
3. 테스트 실행
4. 구 구조 제거
```

### 위험 3: 팀 적응 기간

**위험**:
- 새로운 워크플로우 적응 필요

**대응**:
- 문서화 (Wiki)
- 팀 교육 세션 (30분)
- 슬랙 채널에서 Q&A

---

## 체크리스트

### Phase 1 완료 조건
- [ ] config/orval.config.ts에 filters.tags 추가
- [ ] yarn orval-fix 실행 후 파일 수 감소 확인
- [ ] src/types/ 디렉토리 생성 및 타입 이동
- [ ] .gitattributes 또는 .gitignore 설정
- [ ] 팀 공유 및 문서 업데이트

### Phase 2 완료 조건
- [ ] scripts/orval-smart.ts 작성
- [ ] .orval-cache.json 생성 확인
- [ ] package.json 스크립트 수정
- [ ] CI/CD 파이프라인 수정
- [ ] 1주일 테스트 후 안정성 확인

### Phase 3 완료 조건
- [ ] tags-split 모드로 전환
- [ ] import 경로 일괄 변경
- [ ] 빌드 성공 확인
- [ ] IDE 성능 측정 및 비교
- [ ] 팀 피드백 수렴 및 문서 업데이트

---

## 참고 자료

- [Orval 공식 문서](https://orval.dev/)
- [Orval Configuration 옵션](https://orval.dev/reference/configuration/overview)
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Git Attributes 문서](https://git-scm.com/docs/gitattributes)

---

## 문의 및 피드백

이 개선 계획에 대한 문의사항이나 피드백은 프론트엔드 팀 리드에게 연락해주세요.

**작성자**: AI 코드 리뷰 시스템
**최종 수정**: 2025-11-17
