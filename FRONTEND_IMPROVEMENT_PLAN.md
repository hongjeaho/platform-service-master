# 프론트엔드 개선 계획 - 생성된 파일 관리

**작성일**: 2025-11-17 (수정됨)
**대상**: front/platform 모듈
**주제**: Orval 자동 생성 타입 파일의 도메인별 폴더 구조화

---

## 📋 목차

1. [현재 상황 분석](#현재-상황-분석)
2. [개선 계획](#개선-계획)
3. [구현 방법](#구현-방법)
4. [실행 계획](#실행-계획)
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
   │   - mode: 'tags-split'         │
   │   - React Query 훅 생성        │
   │   - TypeScript 타입 생성       │
   └────────────────────────────────┘
        ↓
   ┌─────────────┬──────────────┐
   │             │              │
src/api/     src/model/    자동 ESLint/Prettier
(훅)         (타입)         포맷팅
```

### 현재 파일 구조

**API 훅** (✅ 이미 도메인별로 구조화됨):
```
src/api/
├── account/
│   └── account.ts          # Account 관련 모든 훅
├── board/
│   └── board.ts            # Board 관련 모든 훅
├── receipt/
│   └── receipt.ts          # Receipt 관련 모든 훅
└── ... (19개 도메인)
```

**타입** (❌ 평면 구조 - 개선 필요):
```
src/model/
├── accountDto.ts
├── accountListDto.ts
├── accountCreateDto.ts
├── accountUpdateDto.ts
├── receiptDto.ts
├── receiptListDto.ts
├── receiptCreateDto.ts
├── receiptUpdateDto.ts
├── boardDto.ts
├── boardListDto.ts
├── ...
└── (150개 파일이 한 폴더에)
```

### Git 관리 현황

✅ **이미 설정 완료**:
- 루트 `.gitignore`에 `front/platform/src/api` 및 `front/platform/src/model` 설정됨
- 생성 파일은 Git에 커밋되지 않음
- 각 개발자가 로컬에서 `yarn orval-fix` 실행 필요

### 현재 Orval 설정

**config/base.orval.config.ts**:
```typescript
export const commonOutputConfig: OutputOptions = {
  mode: 'tags-split',          // ✅ API 훅은 태그(도메인)별로 분할
  target: '../src/api',         // ✅ src/api/receipt/, src/api/board/ 등
  schemas: '../src/model',      // ❌ src/model/*.ts (평면 구조)
  client: 'react-query',
  // ...
}
```

**현재 동작**:
- ✅ API 훅: 도메인별 폴더로 생성 (`src/api/receipt/receipt.ts`)
- ❌ 타입: 평면 구조로 생성 (`src/model/receiptDto.ts`, `src/model/boardDto.ts`, ...)

---

## 개선 계획

### 핵심 문제

**src/model 타입 파일이 평면 구조**

```
❌ 현재
src/model/
├── accountDto.ts
├── accountListDto.ts
├── accountCreateDto.ts
├── receiptDto.ts
├── receiptListDto.ts
├── boardDto.ts
└── ... (150개)
```

**문제점**:
1. 도메인 경계가 시각적으로 불명확
2. 파일 탐색 시 도메인 구분 어려움
3. 알파벳 순서로만 정렬되어 관련 타입 찾기 불편
4. 코드 리뷰 시 어떤 도메인이 변경되었는지 파악 어려움

### 목표

**도메인별 폴더 구조로 재구성**

```
✅ 목표
src/model/
├── account/
│   ├── accountDto.ts
│   ├── accountListDto.ts
│   ├── accountCreateDto.ts
│   └── accountUpdateDto.ts
├── receipt/
│   ├── receiptDto.ts
│   ├── receiptListDto.ts
│   ├── receiptCreateDto.ts
│   └── receiptUpdateDto.ts
├── board/
│   ├── boardDto.ts
│   └── boardListDto.ts
├── deliberation/
│   └── ...
├── conclusion/
│   └── ...
└── ... (도메인별 폴더)
```

**기대 효과**:
- ✅ 도메인별로 명확히 그룹화
- ✅ 파일 탐색 용이
- ✅ 관련 타입을 한 곳에서 관리
- ✅ 코드 리뷰 시 변경 사항 파악 쉬움
- ✅ API 훅 구조(`src/api/`)와 일관성

---

## 구현 방법

Orval은 `mode: 'tags-split'`으로 API 훅만 도메인별 분할하고, schemas(타입)는 기본적으로 평면 구조로 생성합니다.

### 해결 방안: 후처리 스크립트

Orval 생성 후 타입 파일을 도메인별 폴더로 자동 재구성하는 스크립트를 작성합니다.

#### Step 1: 후처리 스크립트 작성

**scripts/organize-models.ts**:

```typescript
import fs from 'fs'
import path from 'path'

const MODEL_DIR = path.join(__dirname, '../src/model')
const TEMP_DIR = path.join(MODEL_DIR, '_temp')

interface FileMapping {
  fileName: string
  domain: string
}

/**
 * 파일명에서 도메인 추출
 * 예: receiptDto.ts -> receipt
 *     boardListDto.ts -> board
 *     accountCreateRequestDto.ts -> account
 */
function extractDomain(fileName: string): string {
  // .ts 확장자 제거
  const baseName = fileName.replace(/\.ts$/, '')

  // camelCase를 분석하여 첫 번째 단어 추출
  // accountDto -> account
  // receiptListDto -> receipt
  const match = baseName.match(/^([a-z]+)/)

  if (!match) {
    console.warn(`⚠️  Could not extract domain from: ${fileName}`)
    return 'common'  // fallback
  }

  return match[1]
}

/**
 * 모든 타입 파일 분석
 */
function analyzeFiles(): FileMapping[] {
  const files = fs.readdirSync(MODEL_DIR)
    .filter(f => f.endsWith('.ts') && !f.startsWith('index'))

  return files.map(fileName => ({
    fileName,
    domain: extractDomain(fileName),
  }))
}

/**
 * 도메인별 폴더 생성 및 파일 이동
 */
function organizeFiles(mappings: FileMapping[]): void {
  // 1. 임시 폴더에 복사 (기존 파일 보존)
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR)
  }

  mappings.forEach(({ fileName }) => {
    const srcPath = path.join(MODEL_DIR, fileName)
    const tempPath = path.join(TEMP_DIR, fileName)
    fs.copyFileSync(srcPath, tempPath)
  })

  // 2. 기존 파일 삭제 (폴더는 유지)
  mappings.forEach(({ fileName }) => {
    const filePath = path.join(MODEL_DIR, fileName)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })

  // 3. 도메인별 폴더 생성
  const domains = [...new Set(mappings.map(m => m.domain))]
  domains.forEach(domain => {
    const domainDir = path.join(MODEL_DIR, domain)
    if (!fs.existsSync(domainDir)) {
      fs.mkdirSync(domainDir, { recursive: true })
    }
  })

  // 4. 임시 폴더에서 도메인 폴더로 이동
  mappings.forEach(({ fileName, domain }) => {
    const tempPath = path.join(TEMP_DIR, fileName)
    const destPath = path.join(MODEL_DIR, domain, fileName)
    fs.renameSync(tempPath, destPath)
  })

  // 5. 임시 폴더 삭제
  fs.rmdirSync(TEMP_DIR)
}

/**
 * 도메인별 index.ts 생성 (re-export)
 */
function generateIndexFiles(mappings: FileMapping[]): void {
  const domainGroups = mappings.reduce((acc, { fileName, domain }) => {
    if (!acc[domain]) acc[domain] = []
    acc[domain].push(fileName)
    return acc
  }, {} as Record<string, string[]>)

  Object.entries(domainGroups).forEach(([domain, files]) => {
    const indexPath = path.join(MODEL_DIR, domain, 'index.ts')
    const exports = files
      .map(fileName => {
        const baseName = fileName.replace(/\.ts$/, '')
        return `export * from './${baseName}'`
      })
      .join('\n')

    fs.writeFileSync(indexPath, exports + '\n')
  })
}

/**
 * 루트 index.ts 생성 (전체 re-export)
 */
function generateRootIndex(mappings: FileMapping[]): void {
  const domains = [...new Set(mappings.map(m => m.domain))]
  const exports = domains
    .map(domain => `export * from './${domain}'`)
    .join('\n')

  const indexPath = path.join(MODEL_DIR, 'index.ts')
  fs.writeFileSync(indexPath, exports + '\n')
}

/**
 * 메인 실행
 */
function main(): void {
  console.log('📁 Organizing model files by domain...\n')

  const mappings = analyzeFiles()

  console.log(`📊 Found ${mappings.length} files`)
  console.log(`📦 Domains: ${[...new Set(mappings.map(m => m.domain))].join(', ')}\n`)

  organizeFiles(mappings)
  generateIndexFiles(mappings)
  generateRootIndex(mappings)

  console.log('✅ Successfully organized model files!')
  console.log(`   ${MODEL_DIR}`)
}

main()
```

#### Step 2: package.json 스크립트 수정

```json
{
  "scripts": {
    "orval": "orval --config ./config/orval.config.ts",
    "organize-models": "ts-node scripts/organize-models.ts",
    "orval-fix": "yarn orval && yarn organize-models && yarn eslint-fix"
  }
}
```

**실행 흐름**:
```bash
yarn orval-fix
  ↓
1. yarn orval          # Orval로 API 훅 + 타입 생성 (평면 구조)
  ↓
2. yarn organize-models  # 타입을 도메인별 폴더로 재구성
  ↓
3. yarn eslint-fix     # ESLint + Prettier 적용
```

#### Step 3: Import 경로 업데이트

기존 코드의 import 경로를 수정해야 합니다.

**Before**:
```typescript
import { ReceiptDto } from '@/model/receiptDto'
import { BoardDto } from '@/model/boardDto'
```

**After**:
```typescript
import { ReceiptDto } from '@/model/receipt/receiptDto'
import { BoardDto } from '@/model/board/boardDto'

// 또는 도메인별 index.ts 사용
import { ReceiptDto } from '@/model/receipt'
import { BoardDto } from '@/model/board'

// 또는 루트 index.ts 사용 (간편하지만 트리쉐이킹 불리)
import { ReceiptDto, BoardDto } from '@/model'
```

**일괄 변경 스크립트** (선택적):

```bash
# 1. 프로젝트 전체에서 model import 찾기
find src -name "*.ts" -o -name "*.tsx" | xargs grep "from '@/model/"

# 2. 수동 또는 스크립트로 일괄 변경
# 예: sed, perl, 또는 VSCode의 Find & Replace with Regex
```

---

## 실행 계획

### Phase 1: 스크립트 작성 및 테스트 (1-2일)

| 작업 | 소요 시간 | 담당자 | 우선순위 |
|------|----------|--------|---------|
| 1. organize-models.ts 작성 | 2시간 | 프론트 리드 | ⭐⭐⭐ 높음 |
| 2. 로컬 테스트 | 1시간 | 프론트 리드 | ⭐⭐⭐ 높음 |
| 3. package.json 스크립트 수정 | 30분 | 프론트 리드 | ⭐⭐ 중간 |

**실행 단계**:

```bash
# Step 1: 스크립트 작성
mkdir -p front/platform/scripts
vi front/platform/scripts/organize-models.ts

# Step 2: 로컬 테스트
cd front/platform
yarn orval-fix  # 스크립트가 자동 실행됨

# Step 3: 결과 확인
ls -la src/model/
# 예상 출력:
# drwxr-xr-x  account/
# drwxr-xr-x  board/
# drwxr-xr-x  receipt/
# -rw-r--r--  index.ts

ls -la src/model/receipt/
# 예상 출력:
# -rw-r--r--  receiptDto.ts
# -rw-r--r--  receiptListDto.ts
# -rw-r--r--  receiptCreateDto.ts
# -rw-r--r--  index.ts

# Step 4: 빌드 확인
yarn build
```

---

### Phase 2: Import 경로 업데이트 (1-2일)

| 작업 | 소요 시간 | 담당자 | 우선순위 |
|------|----------|--------|---------|
| 4. Import 경로 분석 | 1시간 | 프론트 팀 | ⭐⭐ 중간 |
| 5. Import 경로 일괄 변경 | 3-4시간 | 프론트 팀 | ⭐⭐⭐ 높음 |
| 6. 빌드 및 테스트 | 2시간 | 전체 팀 | ⭐⭐⭐ 높음 |

**실행 단계**:

```bash
# Step 1: 기존 import 패턴 분석
grep -r "from '@/model/" src/ | wc -l
# 예상: 200-300개 import 문

# Step 2: VSCode Find & Replace (Regex 사용)
# Find:    from '@/model/(\w+)Dto'
# Replace: from '@/model/$1/$1Dto'

# Step 3: TypeScript 컴파일 확인
yarn tsc --noEmit

# Step 4: 전체 빌드
yarn build

# Step 5: 개발 서버 실행 및 수동 테스트
yarn start
```

---

### Phase 3: 팀 공유 및 문서화 (1일)

| 작업 | 소요 시간 | 담당자 | 우선순위 |
|------|----------|--------|---------|
| 7. 팀 공유 및 교육 | 30분 | 프론트 리드 | ⭐⭐ 중간 |
| 8. CLAUDE.md 업데이트 | 30분 | 프론트 리드 | ⭐ 낮음 |

**공유 내용**:
- 새로운 import 패턴
- yarn orval-fix 실행 시 자동으로 폴더 구조화됨
- 도메인별 index.ts 사용 권장

---

## 추가 개선 사항 (선택적)

### 개선 1: 증분 생성 (선택적)

현재 Orval 생성 시간(10-15초)이 문제되지 않는다면 **당장 필요 없음**.

하지만 향후 API가 대폭 증가하면 고려할 수 있는 방법:

**scripts/orval-smart.ts**:

```typescript
import crypto from 'crypto'
import fs from 'fs'
import { execSync } from 'child_process'

// API 스펙 해시 계산
async function getApiHash(): Promise<string> {
  const response = await fetch('http://localhost:8080/api/public/api-docs/json')
  const spec = await response.json()
  return crypto.createHash('md5').update(JSON.stringify(spec)).digest('hex')
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
  fs.writeFileSync('.orval-cache.json', JSON.stringify({
    hash,
    timestamp: Date.now()
  }))
}

async function main() {
  console.log('📡 Checking API changes...')

  const currentHash = await getApiHash()

  if (!hasApiChanged(currentHash)) {
    console.log('✅ API unchanged. Skipping generation.')
    return
  }

  console.log('🔄 API changed. Regenerating...')
  execSync('yarn orval && yarn organize-models', { stdio: 'inherit' })

  saveApiHash(currentHash)
  console.log('✅ Generation complete!')
}

main()
```

**package.json**:
```json
{
  "scripts": {
    "orval-smart": "ts-node scripts/orval-smart.ts",
    "orval-fix": "yarn orval-smart && yarn eslint-fix"
  }
}
```

**효과**:
- API 변경 없을 때: 15초 → 1초 (93% 감소)
- API 변경 있을 때: 15초 → 15초 (동일)

---

### 개선 2: 커스텀 타입 분리

자동 생성 타입과 개발자가 작성한 커스텀 타입을 명확히 분리합니다.

**디렉토리 구조**:

```
src/
├── model/                  # 자동 생성 (Orval, .gitignore)
│   ├── receipt/
│   ├── board/
│   └── index.ts
│
├── types/                  # 커스텀 타입 (Git 커밋)
│   ├── common.ts
│   ├── ui.ts
│   └── business.ts
```

**명명 규칙**:

```typescript
// ✅ 자동 생성: src/model/receipt/receiptDto.ts
export interface ReceiptDto { ... }

// ✅ 커스텀: src/types/receipt.ts
export interface ReceiptFormValues { ... }
export interface ReceiptTableRow { ... }
export type ReceiptStatus = 'pending' | 'approved' | 'rejected'
```

**장점**:
- 자동 생성 vs 수동 작성 명확히 구분
- .gitignore로 자동 생성 파일 제외
- 타입 충돌 방지

---

## 기대 효과

### 정량적 효과

| 지표 | 현재 | 개선 후 | 효과 |
|------|------|---------|------|
| **src/model 구조** | 평면 (150개 파일) | 도메인별 폴더 (19개 폴더) | ✅ 가독성 향상 |
| **파일 탐색 시간** | ~10초 | ~3초 | 70% 단축 |
| **코드 리뷰 시간** | ~5분 | ~2분 | 60% 단축 |
| **Import 명확성** | ⚠️ 보통 | ✅ 높음 | 도메인 경계 명확 |

### 정성적 효과

1. **개발자 경험 향상**
   - 타입 파일을 쉽게 찾을 수 있음
   - 도메인별로 그룹화되어 관련 타입 파악 용이
   - API 훅 구조와 일관성

2. **코드 리뷰 개선**
   - PR에서 어떤 도메인이 변경되었는지 명확
   - 폴더 단위로 변경 사항 확인 가능

3. **유지보수성 향상**
   - 타입 위치 예측 가능
   - 도메인 경계 명확
   - 새로운 팀원의 온보딩 용이

---

## 위험 요소 및 대응 방안

### 위험 1: 기존 코드 호환성

**위험**:
- 기존 import 경로가 깨짐
- 200-300개 import 문 수정 필요

**대응**:
1. Phase 2에서 체계적으로 일괄 변경
2. TypeScript 컴파일러로 누락 확인
3. 단계적 마이그레이션 (도메인별로 하나씩)

### 위험 2: CI/CD 파이프라인 영향

**현재 상황**:
- ✅ .gitignore에 이미 src/api, src/model 설정됨
- ⚠️ CI/CD에서 API 생성 필요

**대응**:
```yaml
# .github/workflows/build.yml (예시)
- name: Generate API
  run: |
    cd front/platform
    yarn orval-fix  # organize-models 포함

- name: Build
  run: yarn build
```

### 위험 3: 도메인 추출 로직 오류

**위험**:
- 파일명에서 도메인 추출 실패
- 일부 파일이 잘못된 폴더에 배치

**대응**:
1. 도메인 추출 로직에 로깅 추가
2. 수동 검증 단계 포함
3. 예외 케이스는 `common/` 폴더로 fallback

---

## 체크리스트

### Phase 1 완료 조건
- [ ] scripts/organize-models.ts 작성 완료
- [ ] 로컬에서 yarn orval-fix 실행 성공
- [ ] src/model/이 도메인별 폴더로 구조화 확인
- [ ] 각 도메인 폴더에 index.ts 생성 확인
- [ ] 빌드 성공 (yarn build)

### Phase 2 완료 조건
- [ ] 기존 import 경로 분석 완료
- [ ] import 경로 일괄 변경 완료
- [ ] TypeScript 컴파일 오류 없음 (yarn tsc --noEmit)
- [ ] 빌드 성공 (yarn build)
- [ ] 개발 서버 실행 및 수동 테스트 완료

### Phase 3 완료 조건
- [ ] 팀 공유 및 교육 완료
- [ ] CLAUDE.md 업데이트
- [ ] 새로운 개발자 온보딩 가이드 작성

---

## 참고 자료

- [Orval 공식 문서](https://orval.dev/)
- [Orval Configuration 옵션](https://orval.dev/reference/configuration/overview)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2025-11-17 | 초안 작성 |
| 2025-11-17 | 사용자 피드백 반영: 빌드 시간 문제 없음, 모든 API 100% 사용, 도메인별 폴더 구조화에 집중 |

---

**End of Document**
