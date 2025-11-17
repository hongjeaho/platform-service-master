# Platform Service - Front/Platform 모듈 상세 분석

> **최종 업데이트**: 2025-11-17  
> **분석 대상**: React 19 + TypeScript + Vite 프론트엔드 모듈  
> **소스 코드 규모**: ~541 TSX/TS 파일

---

## 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [프로젝트 구조 및 설정](#프로젝트-구조-및-설정)
3. [기술 스택 상세](#기술-스택-상세)
4. [소스 코드 구조](#소스-코드-구조)
5. [API 통합 (Orval)](#api-통합-orval)
6. [디자인 시스템](#디자인-시스템)
7. [주요 기능 및 도메인](#주요-기능-및-도메인)
8. [상태 관리 패턴](#상태-관리-패턴)
9. [인증 및 권한 관리](#인증-및-권한-관리)
10. [라우팅 구조](#라우팅-구조)
11. [빌드 및 배포](#빌드-및-배포)
12. [개발 워크플로우](#개발-워크플로우)
13. [성능 최적화 전략](#성능-최적화-전략)
14. [문제점 및 개선 권고사항](#문제점-및-개선-권고사항)

---

## 프로젝트 개요

### 목적 및 역할
Spring Boot 백엔드 API를 위한 React SPA (Single Page Application) 프론트엔드로, 법무/행정 플랫폼의 사용자 인터페이스를 제공합니다.

### 주요 기능 영역
- **접수(Receipt)**: 평가 신청 접수 및 관리
- **심의(Deliberation)**: 접수된 신청에 대한 심의 처리
- **결의(Conclusion)**: 최종 결론 및 승인
- **게시판(Board)**: 공지사항 및 통신
- **참고자료(References)**: 법령, 판례, 지가 정보
- **관리(Admin)**: 사용자 및 시스템 관리
- **지도(Land/Map)**: 지리 정보 표시

### 아키텍처 특징
- **모듈화**: 도메인별로 구성된 컴포넌트 및 라우터
- **타입 안전성**: TypeScript + 자동 생성된 API 타입
- **자동 코드 생성**: Orval을 통한 OpenAPI → TypeScript 변환
- **반응형 설계**: TailwindCSS 기반 모바일 친화적 UI
- **성능 최적화**: 청크 분할, 지연 로딩, 메모리 캐싱

---

## 프로젝트 구조 및 설정

### 디렉토리 구조

```
front/platform/
├── config/                          # Orval API 생성 설정
│   ├── orval.config.ts             # 메인 Orval 설정
│   └── base.orval.config.ts        # 공유 Orval 설정
│
├── src/
│   ├── api/                         # 자동 생성: React Query 훅 및 API 클라이언트
│   ├── model/                       # 자동 생성: TypeScript 타입 정의
│   ├── components/                  # 재사용 가능한 UI 컴포넌트 (도메인별)
│   ├── views/                       # 페이지 레벨 컴포넌트
│   ├── router/                      # React Router 라우팅 설정 (도메인별)
│   ├── layout/                      # 레이아웃 컴포넌트 (Header, Footer, Layouts)
│   ├── store/                       # Jotai 상태 관리 (도메인별 atoms)
│   ├── hooks/                       # 커스텀 React 훅
│   ├── util/                        # 유틸리티 함수 (HTTP, 계산, 포맷팅)
│   ├── types/                       # 커스텀 TypeScript 타입
│   ├── constants/                   # 전역 상수
│   │   ├── design/                 # 디자인 시스템 토큰 (색상, 폰트, 간격)
│   │   ├── auth/                   # 인증 관련 상수
│   │   ├── receipt/                # 접수 관련 상수
│   │   ├── references/             # 참고자료 관련 상수
│   │   └── ...
│   ├── message/                     # 전역 메시지 UI (Alert, Confirm)
│   ├── assets/                      # 정적 리소스 (이미지, 아이콘)
│   ├── mock/                        # 모의 데이터 및 MSW 설정
│   ├── index.css                    # 글로벌 스타일 및 CSS 변수
│   └── main.tsx                     # 애플리케이션 진입점
│
├── package.json                     # 의존성 및 스크립트
├── vite.config.ts                   # Vite 빌드 설정
├── tailwind.config.ts               # TailwindCSS 구성
├── tsconfig.json                    # TypeScript 기본 설정
├── tsconfig.app.json                # 애플리케이션 TypeScript 설정
├── tsconfig.node.json               # Vite 노드 TypeScript 설정
├── eslint.config.js                 # ESLint 린팅 규칙
├── .prettierrc.cjs                  # Prettier 포맷팅 설정
├── .env.development                 # 개발 환경 변수
├── .env.production                  # 프로덕션 환경 변수
└── index.html                       # HTML 진입점
```

### 주요 설정 파일 분석

#### `package.json` - 의존성 및 스크립트

**핵심 스크립트**:
```json
{
  "start": "vite",                    // 개발 서버 (port 3000)
  "build": "yarn orval-fix && yarn prettier-fix && yarn eslint-fix && tsc -b && vite build",
  "build:dev": "... && vite build --mode development",  // 소스맵 포함
  "orval-fix": "yarn orval && yarn eslint-fix",  // API 생성 + 린팅
  "eslint-fix": "eslint --fix src/**/*.{ts,tsx}",
  "prettier-fix": "prettier --write ."
}
```

**의존성 구성**:

| 카테고리 | 라이브러리 | 버전 | 용도 |
|---------|----------|------|------|
| **핵심** | React | 19.1.0 | UI 라이브러리 |
| | TypeScript | 5.8.3 | 타입 안전성 |
| | Vite | 7.0.4 | 빌드 도구 |
| **스타일** | TailwindCSS | 4.1.11 | 유틸리티 CSS |
| | @tailwindcss/vite | 4.1.11 | Vite 통합 |
| **상태 관리** | React Query | 5.83.0 | 서버 상태 |
| | Jotai | 2.12.5 | 클라이언트 상태 |
| **라우팅** | React Router | 6 | SPA 라우팅 |
| **폼 처리** | React Hook Form | 7.60.0 | 폼 상태 관리 |
| **HTTP** | Axios | 1.11.0 | API 요청 |
| **날짜** | date-fns | 4.1.0 | 날짜 포맷팅 |
| **테이블** | @tanstack/react-table | 8.21.3 | 테이블 렌더링 |
| **지도** | react-kakao-maps-sdk | 1.2.0 | 카카오 지도 |
| **UI 아이콘** | lucide-react | 0.525.0 | 아이콘 라이브러리 |
| **폰트** | @fontsource/* | 5.2.x | 웹폰트 |
| **코드 생성** | Orval | 7.11.2 | OpenAPI → TypeScript |
| **개발 도구** | ESLint, Prettier | 최신 | 코드 품질 |
| | TypeScript-ESLint | 8.38.0 | TS 린팅 |
| | simple-import-sort | 12.1.1 | Import 정렬 |

#### `vite.config.ts` - 빌드 설정

**개발 서버 설정**:
```typescript
server: {
  port: 3000,           // 개발 서버 포트
  host: true,           // 외부 접근 허용
  open: true,           // 자동 브라우저 열기
}
```

**빌드 최적화**:
```typescript
build: {
  sourcemap: isDev,     // 개발만 소스맵 생성
  minify: !isDev,       // 프로덕션만 압축
  rollupOptions: {
    output: {
      manualChunks: {
        'react': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'state': ['@tanstack/react-query', 'jotai', 'axios'],
        'form': ['react-hook-form'],
        'date-fns': ['date-fns'],
        'kakao-maps': ['react-kakao-maps-sdk'],
        'icons': ['lucide-react'],
        'vendor': ['기타 node_modules']
      }
    }
  }
}
```

**번들 분석**:
- `rollup-plugin-visualizer` 통합: 빌드 시각화
- 청크 분할 전략: 라이브러리별 독립 번들
- 성능 효과: 캐시 효율성 향상, 초기 로드 시간 단축

#### `tailwind.config.ts` - 디자인 토큰 매핑

```typescript
theme: {
  extend: {
    colors: {        // COLORS 상수 매핑
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      table: COLORS.table,
      semantic: COLORS.semantic,
      neutral: COLORS.neutral,
      background: COLORS.background,
    },
    spacing: {       // SPACING 상수 매핑
      xs: SPACING.xs, sm: SPACING.sm, md: SPACING.md, ...
    },
    fontFamily: {    // TYPOGRAPHY 상수 매핑
      body: TYPOGRAPHY.fontFamily.body.split(','),
      heading: TYPOGRAPHY.fontFamily.heading.split(','),
      mono: TYPOGRAPHY.fontFamily.mono.split(','),
    },
    fontSize: {      // TYPOGRAPHY 상수 매핑
      xs: TYPOGRAPHY.fontSize.xs, sm: TYPOGRAPHY.fontSize.sm, ...
    },
    fontWeight: { ... },
    lineHeight: { ... },
    letterSpacing: { ... },
  }
}
```

**특징**:
- 모든 토큰을 `src/constants/design/`에서 임포트
- TailwindCSS와 CSS 변수로 이중 관리
- 향후 디자인 변경 시 단일 파일 수정으로 전체 반영

#### `tsconfig.app.json` - TypeScript 설정

```json
{
  "compilerOptions": {
    "target": "ES2022",              // 최신 JavaScript 대상
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",              // React 17+ JSX 변환
    "moduleResolution": "bundler",
    
    // 엄격한 타입 체크
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    
    // 번들러 모드
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
  },
  "include": ["src", "config"],
  "extends": "./tsconfig.paths.json"  // 경로 별칭
}
```

#### `eslint.config.js` - 린팅 규칙

**주요 설정**:
- **무시 대상**: `dist/`, `node_modules/`, `src/api/`, `src/model/` (자동 생성)
- **Parser**: TypeScript ESLint
- **플러그인**: 
  - `eslint-plugin-react` - React 규칙
  - `eslint-plugin-react-hooks` - Hook 의존성 검사
  - `eslint-plugin-simple-import-sort` - Import 자동 정렬
  - `@tanstack/eslint-plugin-query` - React Query 규칙
- **규칙 커스터마이징**:
  ```javascript
  rules: {
    'react/react-in-jsx-scope': 'off',  // React 17+ JSX
    'react/prop-types': 'off',          // TS Props 사용
    '@typescript-eslint/no-explicit-any': 'off',  // 유연성
    'react-hooks/exhaustive-deps': 'off',  // 유연성
  }
  ```

#### `.prettierrc.cjs` - 코드 포맷팅

```javascript
{
  singleQuote: true,         // 싱글 따옴표
  semi: false,               // 세미콜론 제거
  useTabs: false,            // 스페이스 사용
  tabWidth: 2,               // 2칸 들여쓰기
  trailingComma: 'all',      // 후행 쉼표
  printWidth: 100,           // 100자 제한
  arrowParens: 'avoid',      // 화살표 함수 괄호 생략
  jsxBracketSameLine: false, // JSX 마지막 `>` 다음 줄
}
```

#### 환경 변수

**`.env.development`**:
```
VITE_API_BASE_URL=http://localhost:8080
```

**`.env.production`**:
```
VITE_API_BASE_URL=
```
(프로덕션 환경에서 빌드 시 설정)

---

## 기술 스택 상세

### 프레임워크 및 핵심 라이브러리

#### React 19.1.0
- **특징**: 
  - 함수형 컴포넌트 중심
  - Hooks 기반 상태 관리
  - Automatic JSX Transform (React import 불필요)
  - Server Components 지원 (향후)
- **사용 패턴**:
  ```typescript
  export function Component({ prop }: Props) {
    const [state, setState] = useState()
    return <div>{state}</div>
  }
  ```

#### TypeScript 5.8.3
- **컴파일 옵션**: 엄격한 모드 (`strict: true`)
- **타입 안전성**: 
  - Props 자동 검증
  - API 응답 타입 보장
  - 리팩토링 안전성
- **자동 생성**: Orval로부터 전수 API 타입 생성

### 빌드 도구

#### Vite 7.0.4
- **장점**:
  - 초고속 개발 서버 (ES 모듈 네이티브 지원)
  - 플러그인 기반 확장성
  - HMR (Hot Module Replacement) 지원
  - 최적화된 번들링
- **플러그인**:
  - `@vitejs/plugin-react`: React JSX 변환
  - `vite-tsconfig-paths`: 경로 별칭 해석
  - `@tailwindcss/vite`: TailwindCSS JIT 모드
  - `rollup-plugin-visualizer`: 번들 크기 분석

#### esbuild
- **역할**: Vite 내부 JavaScript 트랜스파일러
- **타겟**: `ES2020` (최신 브라우저 지원)

### 스타일링

#### TailwindCSS 4.1.11
- **접근**: 유틸리티 우선 CSS 프레임워크
- **장점**:
  - 빠른 개발 속도
  - 일관된 디자인 시스템
  - 작은 번들 크기 (JIT 컴파일)
- **통합**:
  ```typescript
  // tailwind.config.ts에서 디자인 토큰 매핑
  colors: COLORS,      // src/constants/design/colors
  spacing: SPACING,    // src/constants/design/spacing
  fontSize: TYPOGRAPHY.fontSize,
  fontFamily: TYPOGRAPHY.fontFamily,
  ```
- **CSS 변수**: `src/index.css`에서 `:root` 변수 정의
  ```css
  --primary-main: #274ba9;
  --font-body: 'Noto Sans KR', ...;
  --spacing-md: 12px;
  ```

#### 웹폰트
- **Noto Sans KR** (400, 500, 700): 본문 및 UI
- **Nanum Gothic** (700, 800): 제목 및 강조
- **Roboto** (400, 500, 700): 숫자 표시
- **로드 방식**: @fontsource (NPM 패키지)

### 상태 관리

#### React Query (@tanstack/react-query) 5.83.0
- **역할**: 서버 상태 관리
- **장점**:
  - 자동 캐싱 및 동기화
  - 백그라운드 리페칭
  - 에러 처리 및 재시도
  - 로딩 상태 자동 관리
- **생성 방식**: Orval에서 자동 생성
  ```typescript
  // 자동 생성된 훅
  const { data, isLoading, error } = useGetReceipts()
  const mutation = useCreateReceipt()
  ```
- **쿼리 옵션**: `src/api/custom.query.options.ts`에서 커스터마이징

#### Jotai 2.12.5
- **역할**: 클라이언트 상태 관리
- **원자 기반**: 작은 단위의 상태로 시작
- **사용 사례**:
  ```typescript
  // src/store/user/index.ts
  export const userState = atomWithStorage('user', null)
  export const isLoginSelector = atom(get => ...)
  
  // 컴포넌트에서 사용
  const [user, setUser] = useAtom(userState)
  const isLogin = useAtomValue(isLoginSelector)
  ```
- **저장소 동기화**: `atomWithStorage`로 localStorage 자동 동기화

### HTTP 및 API

#### Axios 1.11.0
- **설정**: `src/util/http.ts`에서 커스텀 인스턴스
- **인터셉터**:
  ```typescript
  // 요청 인터셉터: JWT 토큰 추가
  config.headers.Authorization = `Bearer ${token}`
  
  // 응답 인터셉터: 토큰 갱신
  if (headers.authorization) {
    localStorage.setItem('authorization', token)
  }
  
  // 에러 인터셉터: 토큰 만료 처리
  if (headers['x-token-expired'] === 'true') {
    // 로그인 페이지로 이동
  }
  ```
- **파일 다운로드**: `content-disposition` 헤더 처리
  ```typescript
  // 백엔드에서 파일 응답 시 자동 다운로드
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  ```

### API 코드 생성

#### Orval 7.11.2
- **목적**: OpenAPI → TypeScript/React Query 자동 생성
- **설정 파일**:
  - `config/orval.config.ts`: 메인 설정
  - `config/base.orval.config.ts`: 공유 설정
- **생성 위치**:
  - 훅: `src/api/{태그별}/`
  - 타입: `src/model/`
- **생성 방식**:
  ```typescript
  // tags-split: OpenAPI 태그별로 분리
  export const commonOutputConfig = {
    mode: 'tags-split',
    target: '../src/api',
    schemas: '../src/model',
    client: 'react-query',
    httpClient: 'axios',
    
    override: {
      mutator: { path: '../src/util/http.ts', name: 'request' },
      formData: { path: '../src/util/requestFormData.ts' },
      query: { useQuery: true, useMutation: true }
    }
  }
  ```
- **커스텀 FormData**: `src/util/requestFormData.ts`
  ```typescript
  // 파일 업로드 처리
  if (value instanceof File) {
    formData.append(key, value)
  } else if (Array.isArray(value)) {
    // 배열은 JSON 직렬화
    const jsonBlob = new Blob([JSON.stringify(value)], { type: 'application/json' })
    formData.append(key, jsonBlob)
  }
  ```

### 라우팅

#### React Router 6
- **구조**: 중첩 라우팅 (Nested Routes)
- **레이아웃**:
  - `AuthenticationLayout`: 권한 검증 필요
  - `BaseLayout`: 헤더/푸터 포함
  - `FullScreenLayout`: 전체 화면 (로그인 페이지)
- **라우트 수**: 19개 도메인 모듈

### 폼 처리

#### React Hook Form 7.60.0
- **장점**:
  - 적은 리렌더링
  - 최소한의 종속성
  - TypeScript 지원
- **사용 패턴**:
  ```typescript
  const { register, handleSubmit, formState: { errors } } = useForm()
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('email', { required: true })} />
  </form>
  ```

### 테이블 및 데이터 그리드

#### @tanstack/react-table 8.21.3
- **역할**: 헤드리스 테이블 라이브러리
- **기능**: 정렬, 필터링, 페이지네이션
- **UI 통합**: `src/components/common/dataGrid/PlatformDataGridV2.tsx`

#### 숫자 포맷팅
- **react-number-format 5.4.4**: 숫자 입력 포맷팅

### 지도

#### react-kakao-maps-sdk 1.2.0
- **API 키**: `index.html`의 script 태그에서 로드
- **라이브러리**: `clusterer` 포함

### 날짜

#### date-fns 4.1.0
- **국제화**: 한국어 로케일 지원
- **유틸**: 날짜 포맷팅, 계산, 비교

### 아이콘

#### lucide-react 0.525.0
- **특징**: 간단한 아이콘 라이브러리
- **사용**: Tree-shaking 지원으로 번들 최적화

---

## 소스 코드 구조

### 디렉토리 상세 분석

#### 1. `src/api/` - 자동 생성 API 클라이언트

**구조**:
```
api/
├── admin/
├── board/
├── conclusion/
├── deliberation/
├── land/
├── receipt/
├── references/
└── ... (OpenAPI 태그별로 자동 생성)
```

**특징**:
- **자동 생성**: `yarn orval` 실행 시 생성
- **React Query 통합**: 각 엔드포인트가 React Query 훅으로 생성
- **GitIgnore**: `.gitignore`에서 제외 (생성된 코드는 커밋하지 않음)
- **타입 안전**: TypeScript 정의 포함

**생성 예시**:
```typescript
// 자동 생성
export const useGetReceipts = (
  options?: SecondParameter<typeof axios>,
  queryOptions?: UseQueryOptions<...>
) => {
  // React Query 훅 구현
}

export const useCreateReceipt = (
  options?: SecondParameter<typeof axios>,
  mutationOptions?: UseMutationOptions<...>
) => {
  // React Query 뮤테이션 구현
}
```

#### 2. `src/model/` - 자동 생성 타입 정의

**구조**: 백엔드 OpenAPI 스펙을 TypeScript 인터페이스로 변환

```typescript
// 자동 생성 예시
export interface Receipt {
  id: number
  name: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export interface CreateReceiptRequest {
  name: string
  // 필수 필드
}
```

**역할**:
- API 요청/응답 타입 보장
- IDE 자동완성
- 런타임 에러 사전 방지

#### 3. `src/components/` - 재사용 가능한 컴포넌트

**구조**: 도메인별 + 공통 컴포넌트

```
components/
├── common/                  # 공유 컴포넌트
│   ├── button/             # BasicButton, SearchButton, CancelButton, ...
│   ├── input/              # 입력 필드 컴포넌트
│   ├── dataGrid/           # PlatformDataGridV2 (테이블)
│   ├── ui/                 # Modal, Dialog, Dropdown, ...
│   ├── loading/            # LoadingBoundary, Spinner
│   ├── ContainerTitle.tsx  # 컨테이너 제목
│   ├── MainTitle.tsx       # 메인 제목
│   └── ...
│
├── account/                 # 계정 관련 컴포넌트
├── admin/                   # 관리 컴포넌트
├── board/                   # 게시판 컴포넌트
├── conclusion/              # 결의 컴포넌트
├── deliberation/            # 심의 컴포넌트
├── land/                    # 지도/토지 컴포넌트
├── opinion/                 # 의견 컴포넌트
├── receipt/                 # 접수 컴포넌트
│   ├── ReceiptSearchFilter.tsx
│   ├── ReceiptWrite.tsx
│   ├── ReceiptView.tsx
│   ├── form/               # 접수 폼 컴포넌트
│   ├── receiptAttachment/  # 첨부 파일
│   ├── receiptCaseInfo/    # 사건 정보
│   ├── receiptNoticeResult/# 통지 결과
│   ├── receiptPreviousAppraisal/  # 이전 감정
│   ├── receiptTemplateOpinion/    # 템플릿 의견
│   └── receiptTotalQuantityReport/ # 총량 보고
└── references/              # 참고자료 컴포넌트
    ├── decree/             # 법령
    ├── precedent/          # 판례
    └── map/                # 지도
```

**컴포넌트 패턴**:

```typescript
// 컴포넌트 예시
interface BasicButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}

export function BasicButton({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: BasicButtonProps) {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]}`
  return <button className={buttonClasses} {...props}>{children}</button>
}
```

**스타일링 방식**:
- CSS Modules: `Component.module.css` (격리된 스타일)
- TailwindCSS: 유틸리티 클래스 조합
- 인라인 스타일: 동적 색상 처리 시 (상수에서 가져옴)

#### 4. `src/views/` - 페이지 레벨 컴포넌트

**구조**: 라우팅 경로와 일치

```
views/
├── Home.tsx                     # 홈 페이지
├── ErrorPage.tsx               # 에러 페이지
├── login/                       # 로그인
│   └── LoginApplication.tsx
├── account/                     # 계정
│   └── MyPageModal.tsx
├── receipt/                     # 접수
│   ├── application/             # 접수 신청
│   └── view/                    # 접수 조회
├── conclusion/                  # 결의
│   ├── notice/
│   └── review/
├── deliberation/                # 심의
├── board/                       # 게시판
├── references/                  # 참고자료
│   ├── decree/
│   ├── precedent/
│   └── map/
├── land/                        # 토지 정보
└── admin/                       # 관리
    ├── userManagement/
    ├── districtCharge/
    └── ...
```

**뷰 컴포넌트 구조**:
```typescript
// 페이지 컴포넌트 예시
export function ReceiptView() {
  // API 훅 사용
  const { data: receipts, isLoading } = useGetReceipts()
  const { mutate: deleteReceipt } = useDeleteReceipt()

  // 로컬 상태
  const [filters, setFilters] = useState()

  // 렌더링
  return (
    <div>
      <ReceiptSearchFilter onFilter={setFilters} />
      {isLoading ? <Spinner /> : <ReceiptTable data={receipts} />}
    </div>
  )
}
```

#### 5. `src/router/` - 라우팅 설정

**구조**: 도메인별 라우터 모듈

```
router/
├── index.tsx                    # 메인 라우터 설정
├── receipt/                     # 접수 라우팅
│   ├── index.tsx               # 라우트 정의
│   ├── application/
│   └── view/
├── conclusion/                  # 결의 라우팅
├── deliberation/                # 심의 라우팅
├── board/                       # 게시판 라우팅
├── admin/                       # 관리 라우팅
│   ├── userManagement/
│   ├── districtCharge/
│   └── ...
├── land/                        # 토지 라우팅
└── references/                  # 참고자료 라우팅
    ├── decree/
    ├── precedent/
    ├── conclusionOpinion/
    └── map/
```

**라우트 정의 예시**:
```typescript
// src/router/receipt/index.tsx
const receiptRoutes: RouteObject[] = [
  {
    path: 'receipt',
    children: [
      {
        path: 'application',
        element: <ReceiptApplication />
      },
      {
        path: 'view',
        element: <ReceiptView />
      }
    ]
  }
]

export default receiptRoutes
```

**메인 라우터**:
```typescript
// src/router/index.tsx
const router: RouteObject[] = [
  {
    path: '/',
    element: <AuthenticationLayout />,  // 권한 필요
    children: [...receipt, ...conclusion, ...deliberation, ...references, ...board, ...admin],
  },
  {
    path: '/',
    element: <BaseLayout />,            // 헤더/푸터 포함
    children: [...land, { path: '', element: <Home /> }],
  },
  {
    path: '/',
    element: <FullScreenLayout />,      // 전체 화면
    children: [{ path: 'login', element: <LoginApplication /> }],
  },
]
```

#### 6. `src/layout/` - 레이아웃 컴포넌트

**종류**:

1. **BaseLayout** - 메인 애플리케이션
   - 헤더 (상단 네비게이션)
   - 메인 콘텐츠 영역
   - 푸터
   - 전역 메시지 UI (Alert, Confirm)
   - Axios 인터셉터 초기화

2. **AuthenticationLayout** - 권한 보호
   - 라우트 가드 (useRouteGuard)
   - 로딩 경계선
   - 자동 권한 검증

3. **FullScreenLayout** - 전체 화면
   - 로그인 페이지용
   - 헤더/푸터 없음

4. **NoFooterLayout** - 헤더만
   - 푸터 없음

**하위 컴포넌트**:
```
layout/
├── header/
│   ├── Header.tsx           # 상단 네비게이션
│   └── ...
├── footer/
│   ├── Footer.tsx           # 하단 푸터
│   └── ...
└── ScrollToTop.tsx          # 페이지 변경 시 스크롤 상단
```

#### 7. `src/store/` - 상태 관리 (Jotai)

**구조**: 도메인별 + 기능별

```
store/
├── user/
│   └── index.ts            # 사용자 상태
│       - userState: 사용자 정보
│       - authStatusAtom: 인증 상태
│       - isLoginSelector: 로그인 여부
├── message/
│   └── index.ts            # 전역 메시지
│       - alertMessageState
│       - confirmMessageState
├── dialog/
│   └── index.ts            # 모달 상태
├── map/
│   ├── selectedCases.ts     # 선택된 사건
│   └── standardLand.ts      # 기준 토지
├── opinionTemplateTab/
│   └── index.ts            # 의견 템플릿 탭
└── ... (도메인별)
```

**Atoms 예시**:
```typescript
// localStorage와 동기화
export const userState = atomWithStorage<AuthUser | null>('user', null)

// 파생 atom
export const authStatusAtom = atom<AuthStatus>(get => ({
  isAuthenticated: get(userState) !== null,
  user: get(userState),
}))

// Write-only atom (액션)
export const setUserState = atom(null, (_, set, newUser) => {
  set(userState, newUser)
})
```

#### 8. `src/hooks/` - 커스텀 React 훅

**목록**:

```typescript
// useAuth.ts
export const useAuth = () => {
  // 하이드레이션 안전한 인증 상태
  // 로그인/로그아웃 기능
}

// useRouteGuard.ts
export const useRouteGuard = (options) => {
  // 라우트 권한 검증
  // 자동 리다이렉션
}

// usePermission.ts
export const usePermission = () => {
  // 역할 기반 권한 확인
}

// useGetJudgSeq.ts
export const useGetJudgSeq = () => {
  // 심의 시퀀스 조회 (특정 도메인)
}
```

#### 9. `src/util/` - 유틸리티 함수

**파일들**:

```typescript
// http.ts (427줄)
export const useAxiosInstance = () => {
  // Axios 인터셉터 설정
  // JWT 토큰 관리
  // 파일 다운로드 처리
  // 토큰 만료 처리
}
export const request = (options) => Promise<T>
export type ErrorType<Error> = AxiosError<Error>

// requestFormData.ts
export const customFormDataFn = (body) => FormData
// 파일, Blob, 배열, 객체를 FormData로 변환

// caseCalculateUtils.ts
// 사건 관련 계산 함수

// numberUtils.ts
// 숫자 포맷팅 함수

// env.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
```

#### 10. `src/types/` - 커스텀 타입

**파일**: `options.ts` (매우 작음)

대부분의 타입은:
- 자동 생성 (`src/model/`)
- 컴포넌트별 Props 인터페이스 (각 컴포넌트에 정의)

#### 11. `src/constants/` - 전역 상수

**구조**:
```
constants/
├── design/
│   ├── colors.ts           # 색상 토큰
│   ├── typography.ts       # 폰트 토큰
│   ├── spacing.ts          # 간격 토큰
│   └── index.ts            # 재내보내기
├── auth/
│   └── auth.ts             # 인증 관련 상수
├── receipt/
│   └── ...                 # 접수 도메인 상수
├── conclusion/
│   └── ...                 # 결의 도메인 상수
├── committeeMember/
│   └── ...                 # 위원회 멤버 상수
├── map/
│   └── ...                 # 지도 관련 상수
├── references/
│   └── ...                 # 참고자료 관련 상수
├── reptInfo/
│   └── ...                 # 위험정보 관련 상수
└── index.ts                # 전체 재내보내기
```

**설계 토큰 (Design Tokens)**:

```typescript
// src/constants/design/colors.ts
export const COLORS = {
  primary: { main: '#274ba9', dark: '#005dab', light: '#0663b2', ... },
  secondary: { main: '#e7e8ea', dark: '#9f9f9f', light: '#f3f4f6', ... },
  table: {
    headerBg: '#e7e8ea',
    headerText: '#0663b2',
    borderPrimary: '#005dab',
    cellBg: '#ffffff',
    cellBgEven: '#f9fafb',
    cellBgHover: '#eff6ff',
    cellBgSelected: '#dbeafe',
    cellBgClicked: '#bfdbfe',
    cellText: '#374151',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  neutral: { 50: '#f9fafb', 100: '#f3f4f6', ..., 900: '#111827' },
  background: { primary: '#ffffff', secondary: '#f9fafb', ... },
  gradient: { ... },
}

// src/constants/design/typography.ts
export const TYPOGRAPHY = {
  fontFamily: {
    body: "'Noto Sans KR', -apple-system, ...",
    heading: "'Nanum Gothic', -apple-system, ...",
    mono: "'Roboto', 'Noto Sans KR', monospace",
  },
  fontSize: {
    xs: '0.75rem',  // 12px
    sm: '0.875rem', // 14px
    base: '1rem',   // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem',  // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700', ... },
  lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75', loose: '2' },
  letterSpacing: { tight: '-0.025em', normal: '0', wide: '0.025em', wider: '0.05em' },
  table: {
    header: { fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.25', ... },
    cell: { fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.5', ... },
  },
}

// src/constants/design/spacing.ts
export const SPACING = {
  xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '48px', '4xl': '64px',
  table: {
    cellPadding: '8px 12px',
    headerPadding: '8px 12px',
    cellPaddingCompact: '4px 8px',
    rowGap: '0px',
  },
  container: {
    paddingTop: '30px',
    marginBottom: '4px',
  },
}
```

#### 12. `src/message/` - 전역 메시지 UI

**구성**:
```
message/
├── AlertMessage.tsx        # Alert 다이얼로그
├── ConfirmMessage.tsx      # Confirm 다이얼로그
└── ... (기타 메시지 컴포넌트)
```

**Jotai 통합**:
```typescript
// 사용 예시
import { useShowAlertMessage } from '@/store/message'

function Component() {
  const showAlert = useShowAlertMessage()
  
  const handleClick = () => {
    showAlert('작업을 완료했습니다!')
  }
}
```

#### 13. `src/assets/` - 정적 리소스

이미지, 아이콘, 기타 정적 파일 저장

#### 14. `src/mock/` - 모의 데이터

MSW (Mock Service Worker) 설정 및 모의 API 응답

#### 15. `src/index.css` - 글로벌 스타일

**내용**:
- Tailwind 임포트: `@import 'tailwindcss'`
- CSS 변수 정의: `:root { --color-primary: ...; }`
- 웹폰트 로드: `@fontsource` 임포트
- 기본 스타일: `body { font-family: ... }`

#### 16. `src/main.tsx` - 애플리케이션 진입점

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'jotai'
import { RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <Provider>                          {/* Jotai */}
    <QueryClientProvider client={queryClient}>  {/* React Query */}
      <RouterProvider router={router} />         {/* React Router */}
    </QueryClientProvider>
  </Provider>,
)
```

---

## API 통합 (Orval)

### Orval 워크플로우

```
┌─────────────────────┐
│  Spring Boot API    │  (백엔드)
│ (Port 8080)         │
└──────────┬──────────┘
           │
           ├─ OpenAPI Spec 노출
           │  GET /api/public/api-docs/json
           │
           ▼
┌─────────────────────────────────────┐
│  yarn orval 실행                    │
│ (config/orval.config.ts)            │
└──────────┬──────────────────────────┘
           │
           ├─ 타입 생성: src/model/**/*.ts
           │  - 요청/응답 인터페이스
           │  - Enum 타입
           │
           ├─ 훅 생성: src/api/**/*.ts
           │  - useGet*, useCreate*, useUpdate*, useDelete*
           │  - React Query 통합
           │
           └─ ESLint 실행 (자동 포맷팅)
```

### 설정 분석

#### `config/orval.config.ts` - 메인 설정

```typescript
export default defineConfig({
  store: {
    output: {
      ...commonOutputConfig,
      // 개발 환경에서만 mock 활성화
      mock: process.env.NODE_ENV === 'development' && process.env.VITE_ENABLE_MOCK === 'true',
    },
    hooks: commonHooks,
    input: {
      // 환경별 API URL
      target: isDev 
        ? 'http://localhost:8080/api/public/api-docs/json'
        : process.env.VITE_API_BASE_URL || 'http://localhost:8080/api/public/api-docs/json',
      validation: false,  // OpenAPI Validation 비활성화 (성능)
      logLevel: isDev ? 'info' : undefined,  // 개발환경에서만 로그
    },
  },
})
```

#### `config/base.orval.config.ts` - 공유 설정

```typescript
export const commonOutputConfig: OutputOptions = {
  mode: 'tags-split',           // OpenAPI 태그별로 분리
  target: '../src/api',         // 훅 생성 위치
  schemas: '../src/model',      // 타입 생성 위치
  client: 'react-query',        // React Query 훅 생성
  httpClient: 'axios',          // Axios 클라이언트
  clean: true,                  // 기존 생성 파일 삭제 후 재생성
  prettier: true,               // Prettier 포맷팅
  mock: false,
  allParamsOptional: true,      // 모든 파라미터 선택적
  urlEncodeParameters: true,    // URL 인코딩
  biome: false,                 // Prettier 사용 중
  
  // 커스터마이징
  override: {
    mutator: {
      path: '../src/util/http.ts',
      name: 'request',
    },
    formData: {
      path: '../src/util/requestFormData.ts',
      name: 'customFormDataFn',
    },
    query: {
      useQuery: true,
      useMutation: true,
      queryOptions: {
        path: './custom.query.options.ts',
        name: 'customQueryOptionsFn',
      },
    },
  },
}
```

### 생성된 코드 예시

#### React Query 훅

```typescript
// 자동 생성: src/api/receipt/receipt.ts

export const useGetReceipts = (
  params?: GetReceiptsParams,
  options?: SecondParameter<typeof axios>,
  queryOptions?: UseQueryOptions<AxiosResponse<ReceiptList>, ...>
) => {
  return useQuery<AxiosResponse<ReceiptList>, AxiosError<ErrorResponse>>({
    queryKey: ['GET', 'receipts', params],
    queryFn: ({ signal }) =>
      request<ReceiptList>({
        url: '/receipts',
        method: 'GET',
        params,
        signal,
        ...options,
      }),
    ...queryOptions,
  })
}

export const useCreateReceipt = (
  options?: SecondParameter<typeof axios>,
  mutationOptions?: UseMutationOptions<AxiosResponse<Receipt>, AxiosError<ErrorResponse>, CreateReceiptRequest>
) => {
  return useMutation<AxiosResponse<Receipt>, AxiosError<ErrorResponse>, CreateReceiptRequest>({
    mutationFn: (data) =>
      request<Receipt>({
        url: '/receipts',
        method: 'POST',
        data,
        ...options,
      }),
    ...mutationOptions,
  })
}
```

#### 타입 정의

```typescript
// 자동 생성: src/model/receipt.ts

export interface Receipt {
  id: number
  name: string
  status: ReceiptStatus
  createdAt: string
  updatedAt: string
}

export enum ReceiptStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface CreateReceiptRequest {
  name: string
  description?: string
}

export interface ReceiptList {
  items: Receipt[]
  total: number
}
```

### 사용 패턴

#### 데이터 조회

```typescript
import { useGetReceipts } from '@/api/receipt/receipt'

function ReceiptList() {
  const { data, isLoading, error } = useGetReceipts()

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <table>
      {data?.data.items.map(receipt => (
        <tr key={receipt.id}>{receipt.name}</tr>
      ))}
    </table>
  )
}
```

#### 데이터 생성/수정/삭제

```typescript
import { useCreateReceipt, useUpdateReceipt, useDeleteReceipt } from '@/api/receipt/receipt'
import { useQueryClient } from '@tanstack/react-query'

function ReceiptForm() {
  const queryClient = useQueryClient()

  const { mutate: createReceipt, isPending } = useCreateReceipt(undefined, {
    onSuccess: () => {
      // 캐시 무효화 (다시 조회)
      queryClient.invalidateQueries({ queryKey: ['GET', 'receipts'] })
    },
  })

  const handleSubmit = (data: CreateReceiptRequest) => {
    createReceipt(data)
  }

  return <form onSubmit={handleSubmit}>{/* 폼 */}</form>
}
```

---

## 디자인 시스템

### 구성 요소

#### 1. 색상 (Colors)

**정부/공공 색상 기반**:

| 그룹 | 키 | 값 | 용도 |
|------|----|----|------|
| **Primary** | main | #274ba9 | 메인 UI |
| | dark | #005dab | 강조 |
| | light | #0663b2 | 호버 상태 |
| | lighter | #e7f3ff | 배경 |
| **Secondary** | main | #e7e8ea | 구분선 |
| | dark | #9f9f9f | 비활성 텍스트 |
| | light | #f3f4f6 | 배경 |
| **Semantic** | success | #10b981 | 성공 |
| | warning | #f59e0b | 경고 |
| | error | #ef4444 | 에러 |
| | info | #3b82f6 | 정보 |
| **Neutral** | 50-900 | Gray scale | 텍스트, 배경 |
| **Table** | 전용 색상 | 테이블 셀, 헤더, 테두리 | 데이터 그리드 |

**사용 방식**:
```typescript
// JavaScript에서
import { COLORS } from '@/constants/design'
const bgColor = COLORS.primary.main  // #274ba9

// TailwindCSS에서
<div className="bg-primary text-primary-dark">...</div>

// CSS 변수에서
<div style={{ color: 'var(--primary-main)' }}>...</div>
```

#### 2. 타이포그래피 (Typography)

**폰트 선택 전략**:

| 용도 | 폰트 | 폴백 |
|------|------|------|
| 본문/UI | Noto Sans KR (400, 500, 700) | 시스템 폰트 |
| 제목/강조 | Nanum Gothic (700, 800) | 시스템 폰트 |
| 숫자 | Roboto (400, 500, 700) | 한글 폰트 대체 |

**크기 체계**:
```typescript
fontSize: {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
}
```

**폰트 무게**:
```typescript
fontWeight: {
  normal: '400',      // 정상 텍스트
  medium: '500',      // 약간 굵음
  semibold: '600',    // 굵음
  bold: '700',        // 매우 굵음
  extrabold: '800',   // 극도로 굵음
}
```

**행간 및 자간**:
```typescript
lineHeight: {
  tight: '1.25',     // 좁음
  normal: '1.5',     // 표준
  relaxed: '1.75',   // 넓음
  loose: '2',        // 매우 넓음
}

letterSpacing: {
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
}
```

#### 3. 간격 (Spacing)

```typescript
spacing: {
  xs: '4px',      // 아주 작은 요소 간격
  sm: '8px',      // 작은 간격
  md: '12px',     // 표준 간격
  lg: '16px',     // 큰 간격
  xl: '24px',     // 매우 큰 간격
  '2xl': '32px',  // 섹션 간격
  '3xl': '48px',  // 큰 섹션 간격
  '4xl': '64px',  // 페이지 간격
}

// 테이블 전용
table: {
  cellPadding: '8px 12px',
  headerPadding: '8px 12px',
  cellPaddingCompact: '4px 8px',
}

// 컨테이너 전용
container: {
  paddingTop: '30px',
  marginBottom: '4px',
}
```

### Tailwind 통합

#### 테마 확장

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: COLORS.primary,        // primary-main, primary-dark 등 사용 가능
      secondary: COLORS.secondary,
      table: COLORS.table,
      // ...
    },
    spacing: {
      xs: SPACING.xs,
      sm: SPACING.sm,
      // ...
    },
    fontFamily: {
      body: TYPOGRAPHY.fontFamily.body.split(','),
      heading: TYPOGRAPHY.fontFamily.heading.split(','),
      mono: TYPOGRAPHY.fontFamily.mono.split(','),
    },
    // 나머지 모두 매핑...
  },
}
```

#### 사용 예시

```typescript
// Tailwind 클래스 사용
<div className="bg-primary text-white font-heading text-2xl p-md rounded-lg shadow-md">
  제목
</div>

// 동적 스타일
<div style={{ 
  color: COLORS.semantic.error,
  padding: SPACING.lg,
  fontFamily: TYPOGRAPHY.fontFamily.body 
}}>
  에러 메시지
</div>

// 테이블 셀 스타일
<td className="px-3 py-2" style={{ 
  borderColor: COLORS.table.borderPrimary,
  backgroundColor: COLORS.table.cellBg 
}}>
  데이터
</td>
```

### CSS 변수 (index.css)

```css
:root {
  /* Primary 색상 */
  --primary-main: #274ba9;
  --primary-dark: #005dab;
  --primary-light: #0663b2;
  --primary-lighter: #e7f3ff;

  /* 폰트 */
  --font-body: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: 'Nanum Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Roboto', 'Noto Sans KR', monospace;

  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  /* ... */
}

body {
  font-family: var(--font-body);
}
```

### 설계 원칙

1. **원본 소스**: 모든 토큰은 `src/constants/design/` 에서 정의
2. **중앙화**: 향후 디자인 변경 시 단일 파일만 수정
3. **이중 관리**: TailwindCSS + CSS 변수로 유연성 제공
4. **일관성**: 모든 색상, 폰트, 간격이 정의된 토큰만 사용
5. **문서화**: 각 상수 파일에 사용 예시 포함

---

## 주요 기능 및 도메인

### 1. 접수 (Receipt) 도메인

**경로**: `/receipt`

**주요 기능**:
- 신규 접수 신청 (CREATE)
- 접수 현황 조회 (LIST/READ)
- 접수 수정 (UPDATE)
- 접수 삭제 (DELETE)

**서브 기능**:
- 첨부 파일 관리 (receiptAttachment)
- 사건 정보 입력 (receiptCaseInfo)
- 통지 결과 기록 (receiptNoticeResult)
- 이전 감정 정보 (receiptPreviousAppraisal)
- 템플릿 의견 (receiptTemplateOpinion)
- 총량 보고서 (receiptTotalQuantityReport)

**컴포넌트**:
```
components/receipt/
├── ReceiptSearchFilter.tsx          # 검색 필터
├── ReceiptWrite.tsx                 # 접수 작성
├── ReceiptView.tsx                  # 접수 조회
├── ReceiptPreview.tsx               # 미리보기
├── form/                            # 폼 컴포넌트
├── receiptAttachment/               # 첨부 파일
├── receiptCaseInfo/                 # 사건 정보
├── receiptNoticeResult/             # 통지 결과
├── receiptPreviousAppraisal/        # 이전 감정
├── receiptTemplateOpinion/          # 의견 템플릿
└── receiptTotalQuantityReport/      # 총량 보고
```

### 2. 심의 (Deliberation) 도메인

**경로**: `/deliberation`

**주요 기능**:
- 심의 신청 (CREATE)
- 심의 현황 조회 (LIST)
- 심의 진행 (UPDATE)
- 심의 결과 입력

**컴포넌트**:
```
components/deliberation/
└── ... (심의 관련 컴포넌트)
```

### 3. 결의 (Conclusion) 도메인

**경로**: `/conclusion`

**주요 기능**:
- 결론 공고 (notice)
- 검토 신청 (review)
- 검토 진행
- 검토 완료

**서브 라우트**:
- `/conclusion/notice/application` - 공고 신청
- `/conclusion/notice/view` - 공고 조회
- `/conclusion/review/application` - 검토 신청
- `/conclusion/review/progress` - 검토 진행
- `/conclusion/review/complete` - 검토 완료

### 4. 게시판 (Board) 도메인

**경로**: `/board`

**기능**:
- 공지사항 조회
- 공지사항 작성 (관리자)
- 댓글 기능

### 5. 참고자료 (References) 도메인

**경로**: `/references`

**세부 도메인**:

1. **법령 (Decree)** - `/references/decree`
   - 법령 목록 조회
   - 법령 상세 조회
   - 검색 및 필터링

2. **판례 (Precedent)** - `/references/precedent`
   - 판례 목록 조회
   - 판례 상세 조회

3. **의견 (Conclusion Opinion)** - `/references/conclusion-opinion`
   - 결론 의견 템플릿
   - 의견 검색

4. **지도 (Map)** - `/references/map`
   - 지리 정보 표시
   - 카카오 지도 통합
   - 선택 사건 표시

### 6. 관리 (Admin) 도메인

**경로**: `/admin`

**주요 기능**:
- 사용자 관리 (userManagement)
- 지역 담당자 관리 (districtCharge)
- 위원회 멤버 관리
- 시스템 설정

### 7. 토지/지가 (Land) 도메인

**경로**: `/land`

**기능**:
- 지가 정보 조회
- 표준지 정보
- 지리 정보

---

## 상태 관리 패턴

### Jotai 아키텍처

#### 사용자 상태 (User)

```typescript
// src/store/user/index.ts

// 1. 기본 상태: localStorage와 동기화
export const userState = atomWithStorage<AuthUser | null>('user', getInitialUserData())

// 2. 파생 상태: 인증 상태 계산
export const authStatusAtom = atom<AuthStatus>(get => {
  const user = get(userState)
  const isHydrated = get(isHydratedAtom)
  return {
    isLoading: !isHydrated,
    isAuthenticated: user !== null,
    user,
    isHydrated,
  }
})

// 3. 액션: 사용자 정보 설정
export const setUserState = atom(null, (_, set, newUser: AuthUser | null) => {
  set(userState, newUser)
})

// 4. 액션: 부분 업데이트
export const updateUserState = atom(null, (get, set, updates: Partial<AuthUser>) => {
  const currentUser = get(userState)
  if (currentUser) {
    set(userState, { ...currentUser, ...updates })
  }
})

// 5. 로그인 여부: 파생 상태
export const isLoginSelector = atom<boolean>(get => {
  const { isAuthenticated, isHydrated } = get(authStatusAtom)
  return isHydrated && isAuthenticated
})
```

**하이드레이션 처리**:
```typescript
// useAuth.ts에서 자동 처리
useEffect(() => {
  if (!authStatus.isHydrated) {
    setHydrated(true)  // 클라이언트 렌더링 완료 표시
  }
}, [authStatus.isHydrated, setHydrated])
```

#### 메시지 상태 (Message)

```typescript
// src/store/message/index.ts

export interface MessageProps {
  message?: string | null
  onCallBack?: () => void
}

// Alert 상태
export const alertMessageState = atom<MessageProps>({ message: null })

// Confirm 상태
export const confirmMessageState = atom<MessageProps>({ message: null })

// Alert 훅
export const useShowAlertMessage = () => {
  const setAlertMessage = useSetAtom(alertMessageState)
  return (newMessage: string) => {
    setAlertMessage({ message: newMessage })
  }
}

// Alert with Callback 훅
export const useShowAlertMessageCallBack = () => {
  const setAlertMessage = useSetAtom(alertMessageState)
  return (newMessage: string, callBack: () => void) => {
    setAlertMessage({ message: newMessage, onCallBack: callBack })
  }
}

// Confirm 훅
export const useShowConfirmMessage = () => {
  const setConfirmMessage = useSetAtom(confirmMessageState)
  return (newMessage: string, callBack: () => void) => {
    setConfirmMessage({ message: newMessage, onCallBack: callBack })
  }
}
```

**컴포넌트 사용**:
```typescript
import { useShowAlertMessage } from '@/store/message'

function MyComponent() {
  const showAlert = useShowAlertMessage()

  const handleClick = () => {
    showAlert('저장 완료!')
  }

  return <button onClick={handleClick}>저장</button>
}
```

#### 기타 상태

1. **Dialog**: 모달 상태 관리
2. **Map**: 선택된 사건, 기준 토지
3. **OpinionTemplateTab**: 의견 템플릿 탭 활성화 상태

### 상태 관리 패턴 정리

| 상태 유형 | 라이브러리 | 용도 | 위치 |
|----------|----------|------|------|
| 서버 상태 | React Query | API 응답 캐싱 | 자동 생성 (src/api/) |
| 클라이언트 상태 | Jotai | 전역 UI 상태 | src/store/ |
| 로컬 상태 | React State | 컴포넌트 스코프 | 컴포넌트 파일 |
| 폼 상태 | React Hook Form | 폼 입력 관리 | 폼 컴포넌트 |

---

## 인증 및 권한 관리

### 인증 흐름

```
┌─────────────────┐
│  로그인 페이지   │
│ LoginApplication│
└────────┬────────┘
         │
         ▼
   ┌──────────────┐
   │ API 요청     │
   │ /auth/login  │
   └──────┬───────┘
          │
          ▼
    ┌─────────────┐
    │ JWT 토큰    │  ← 응답 헤더: Authorization
    │ 수신        │
    └──────┬──────┘
           │
           ▼
    ┌────────────────────┐
    │ localStorage에      │
    │ 토큰 저장          │
    │ setUser(userData)  │
    └──────┬─────────────┘
           │
           ▼
    ┌──────────────────┐
    │ 홈 페이지로 이동  │
    └──────────────────┘
```

### JWT 토큰 관리

**토큰 저장**:
```typescript
// useAxiosInstance에서 응답 헤더에서 토큰 추출
if (headers[AUTHORIZATION] !== undefined) {
  localStorage.setItem(AUTHORIZATION, headers[AUTHORIZATION])
}
```

**토큰 자동 추가**:
```typescript
// 요청 인터셉터
const token = localStorage.getItem(AUTHORIZATION)
if (token !== undefined) {
  config.headers.Authorization = `Bearer ${token}`
}
```

**토큰 만료 처리**:
```typescript
// 응답 인터셉터
if (headers['x-token-expired'] === 'true') {
  localStorage.removeItem(AUTHORIZATION)
  localStorage.removeItem('user')
  
  // Alert 표시 후 로그인 페이지로 이동
  setAlertMessage({
    message: '로그인이 필요합니다.',
    onCallBack: () => {
      window.location.href = '/'
    },
  })
}
```

### 사용자 권한

**역할 기반 접근 제어 (RBAC)**:

```typescript
// src/store/user/index.ts
export interface AuthUser {
  id: number
  username: string
  roles: BasicAuthority[]  // 역할 배열
  // ...
}

export interface BasicAuthority {
  id: number
  authority: string  // 'ROLE_ADMIN', 'ROLE_USER' 등
}
```

**권한 확인 훅**:
```typescript
// src/hooks/usePermission.ts
export const usePermission = () => {
  const { user } = useAtom(hydratedUserDataAtom)
  
  const hasRole = (role: string) => {
    return user?.roles?.some(r => r.authority === role) ?? false
  }
  
  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => hasRole(role))
  }
  
  return { hasRole, hasAnyRole }
}
```

**라우트 가드**:
```typescript
// src/hooks/useRouteGuard.ts
export const useRouteGuard = ({ requireAuth, requiredRoles }) => {
  const { user, isHydrated } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isHydrated) return
    
    // 인증 확인
    if (requireAuth && !user) {
      navigate('/login')
      return
    }
    
    // 역할 확인
    if (requiredRoles && user) {
      const hasRole = requiredRoles.some(role =>
        user.roles.some(r => r.authority === role)
      )
      if (!hasRole) {
        navigate('/error')
      }
    }
  }, [isHydrated, user, requiredRoles])
}
```

---

## 라우팅 구조

### 라우트 계층 구조

```
/ (Root)
├── AuthenticationLayout           {권한 필요}
│   ├── /receipt                   {접수}
│   │   ├── /application
│   │   └── /view
│   ├── /conclusion                {결의}
│   │   ├── /notice/application
│   │   ├── /notice/view
│   │   ├── /review/application
│   │   ├── /review/progress
│   │   └── /review/complete
│   ├── /deliberation              {심의}
│   ├── /references                {참고자료}
│   │   ├── /decree
│   │   ├── /precedent
│   │   ├── /conclusion-opinion
│   │   └── /map
│   ├── /board                     {게시판}
│   └── /admin                     {관리}
│       ├── /user-management
│       ├── /district-charge
│       └── ...
│
├── BaseLayout                     {헤더/푸터 포함}
│   ├── / (Home)
│   └── /land                      {토지/지가}
│
└── FullScreenLayout               {전체 화면}
    └── /login                     {로그인}
```

### 라우터 모듈 구조

각 도메인별로 독립적인 라우터 모듈:

```typescript
// src/router/receipt/index.tsx
const receiptRoutes: RouteObject[] = [
  {
    path: 'receipt',
    children: [
      {
        path: 'application',
        element: <ReceiptApplication />,
      },
      {
        path: 'view',
        element: <ReceiptView />,
      },
    ],
  },
]

export default receiptRoutes
```

메인 라우터에서 병합:

```typescript
// src/router/index.tsx
const router: RouteObject[] = [
  {
    path: '/',
    element: <AuthenticationLayout />,
    children: [
      ...receipt,        // receiptRoutes
      ...conclusion,     // conclusionRoutes
      ...deliberation,   // deliberationRoutes
      ...references,     // referencesRoutes
      ...board,          // boardRoutes
      ...admin,          // adminRoutes
    ],
  },
  // ...
]
```

### 동적 라우팅

React Router v7 Future Flags 활성화:

```typescript
const options = {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
}

export default createBrowserRouter(router, options)
```

---

## 빌드 및 배포

### 개발 서버

```bash
yarn start
# ↓
# Vite 개발 서버 시작
# http://localhost:3000 에서 실행
# Hot Module Replacement (HMR) 활성화
```

**특징**:
- 빠른 시작 시간
- 초고속 HMR
- 소스맵 포함 (디버깅)
- 자동 브라우저 열기

### 빌드 프로세스

```bash
yarn build
```

**실행 순서**:

1. **API 생성**
   ```bash
   yarn orval-fix
   # ↓ src/api/, src/model/ 생성
   ```

2. **코드 포맷팅**
   ```bash
   yarn prettier-fix
   # ↓ 모든 파일 자동 포맷팅
   ```

3. **린팅**
   ```bash
   yarn eslint-fix
   # ↓ 자동 에러 수정
   ```

4. **TypeScript 컴파일**
   ```bash
   tsc -b
   # ↓ 타입 체크 (emit 없음)
   ```

5. **번들링**
   ```bash
   vite build
   # ↓ dist/ 디렉토리 생성
   ```

### 빌드 출력

```
dist/
├── index.html              # HTML 진입점
├── assets/
│   ├── react-*.js          # React 청크
│   ├── react-dom-*.js      # React DOM 청크
│   ├── router-*.js         # React Router 청크
│   ├── state-*.js          # 상태 관리 청크
│   ├── form-*.js           # 폼 라이브러리 청크
│   ├── date-fns-*.js       # 날짜 라이브러리 청크
│   ├── vendor-*.js         # 기타 라이브러리
│   ├── index-*.js          # 애플리케이션 코드
│   ├── *.css               # 스타일시트
│   └── *.svg, *.png, ...   # 이미지 자산
└── manifest.json           # 번들 맵핑
```

### 환경별 빌드

**개발 빌드** (소스맵 포함, 압축 제외):
```bash
yarn build:dev
```

**프로덕션 빌드** (압축, 최소화):
```bash
yarn build
```

### 번들 분석

```bash
# vite build 시 자동으로 visualizer 실행
# 브라우저에서 dist/stats.html 열기
```

### 배포 전 검증

```bash
# 빌드 결과 미리보기
yarn preview
# ↓
# 로컬에서 프로덕션 빌드 테스트
# http://localhost:4173 에서 실행
```

---

## 개발 워크플로우

### 신규 기능 추가 워크플로우

#### 1단계: 백엔드 API 준비

```bash
# 백엔드에서 새 엔드포인트 구현
# 예: POST /api/v1/receipts/new-feature

# Swagger UI에서 확인
# http://localhost:8080/public/swagger-ui
```

#### 2단계: API 타입 생성

```bash
cd front/platform

# 백엔드 API URL을 타입으로 변환
yarn orval-fix

# ↓ 자동 생성:
# - src/api/receipt/newFeature.ts (React Query 훅)
# - src/model/newFeature.ts (타입 정의)
```

#### 3단계: 컴포넌트 개발

```typescript
// src/components/receipt/NewFeature/NewFeature.tsx

import { useCreateNewFeature } from '@/api/receipt/newFeature'
import { COLORS, SPACING } from '@/constants/design'

interface NewFeatureProps {
  onSuccess?: () => void
}

export function NewFeature({ onSuccess }: NewFeatureProps) {
  const { mutate: create, isPending } = useCreateNewFeature(undefined, {
    onSuccess: () => {
      showAlert('완료!')
      onSuccess?.()
    },
  })

  return (
    <div style={{ padding: SPACING.lg }}>
      <h2 style={{ color: COLORS.primary.main }}>새 기능</h2>
      {/* 컴포넌트 구현 */}
    </div>
  )
}
```

#### 4단계: 라우트 추가

```typescript
// src/router/receipt/index.tsx

const receiptRoutes: RouteObject[] = [
  {
    path: 'receipt',
    children: [
      // ... 기존 라우트
      {
        path: 'new-feature',
        element: <NewFeatureView />,
      },
    ],
  },
]
```

#### 5단계: 코드 품질 확인

```bash
# 1. 타입 검사
yarn tsc

# 2. 린트 확인
yarn eslint src/

# 3. 포맷팅 자동 수정
yarn eslint-fix
yarn prettier-fix

# 4. 전체 빌드 테스트
yarn build:dev
```

#### 6단계: 로컬 테스트

```bash
# 개발 서버 시작
yarn start

# 브라우저에서 확인
# http://localhost:3000
```

### 버그 수정 워크플로우

1. **문제 재현**
   ```bash
   yarn start
   # 브라우저 개발자도구 열기 (F12)
   # Console 탭에서 에러 메시지 확인
   ```

2. **원인 파악**
   - 백엔드 API 응답 확인 (Network 탭)
   - 타입 정의 확인
   - 상태 관리 로직 검토

3. **수정 구현**
   - 해당 파일 수정
   - HMR로 자동 반영 (변경 사항 저장 시)

4. **테스트**
   ```bash
   # 브라우저에서 실시간 확인
   ```

5. **커밋**
   ```bash
   git add .
   git commit -m "fix: 버그 설명"
   ```

### 스타일 변경 워크플로우

#### 색상 변경 예시

```typescript
// 1. 상수 수정
// src/constants/design/colors.ts
export const COLORS = {
  primary: {
    main: '#000000',  // 변경됨
    // ...
  },
}

// 2. 자동 반영
// tailwind.config.ts에서 COLORS 매핑하므로 Tailwind 클래스도 자동 변경
// src/index.css의 CSS 변수도 자동 변경 (별도 수정 필요)

// 3. 모든 UI가 자동으로 새 색상 적용됨
```

#### 폰트 변경 예시

```typescript
// src/constants/design/typography.ts
export const TYPOGRAPHY = {
  fontFamily: {
    body: "'New Font', ...",  // 변경됨
    // ...
  },
}

// ↓ 모든 body 폰트가 자동으로 변경됨
```

---

## 성능 최적화 전략

### 번들 최적화

#### 청크 분할 (Manual Chunks)

```typescript
// vite.config.ts
manualChunks(id) {
  // 주요 라이브러리별로 분리
  if (id.includes('node_modules')) {
    if (id.includes('/react/')) return 'react'
    if (id.includes('/react-dom/')) return 'react-dom'
    if (id.includes('/react-router-dom/')) return 'react-router-dom'
    if (id.includes('@tanstack/react-query') ||
        id.includes('jotai') ||
        id.includes('axios')) return 'state'
    if (id.includes('date-fns')) return 'date-fns'
    if (id.includes('react-hook-form')) return 'form'
    if (id.includes('react-kakao-maps-sdk')) return 'kakao-maps'
    if (id.includes('lucide-react')) return 'icons'
    return 'vendor'
  }
}
```

**효과**:
- React 라이브러리가 변경되어도 다른 청크는 캐시됨
- 사용자 경험 향상 (업데이트 시 다운로드 최소화)

#### 트리 쉐이킹

**특징**:
- 사용하지 않는 코드 제거
- ESM (ES Modules) 사용

**미적용**:
```typescript
// ❌ 나쁜 예: 라이브러리 전체 임포트
import * as lucide from 'lucide-react'
```

**적용**:
```typescript
// ✅ 좋은 예: 필요한 아이콘만 임포트
import { ChevronDown } from 'lucide-react'
```

### 런타임 성능

#### React Query 캐싱

```typescript
// 자동 캐싱 및 재검증
const { data } = useGetReceipts()

// 같은 쿼리 재사용 시 캐시된 데이터 반환
const { data: same } = useGetReceipts()

// 백그라운드에서 자동 리페칭
// (staleTime: 0, gcTime: 5분 기본값)
```

#### 메모이제이션

```typescript
import { memo } from 'react'

// 프롭 변경되지 않으면 재렌더링 방지
const MemoizedComponent = memo(function Component({ id }) {
  return <div>{id}</div>
})
```

### 개발 서버 성능

#### Vite HMR

```typescript
// vite.config.ts
server: {
  middlewareMode: false,  // 독립 서버 모드
  hmr: {
    protocol: 'ws',
    host: 'localhost',
    port: 24678,
  },
}
```

**효과**:
- 변경 사항 즉시 반영
- 상태 보존 (HMR)
- 빠른 피드백 루프

### 이미지 최적화

**Vite 자동 처리**:
```typescript
// 이미지 최적화 자동 수행
import logo from '@/assets/logo.svg'
// ↓
// 개발: 원본 이미지
// 프로덕션: 최적화된 이미지 (WebP 등)
```

---

## 문제점 및 개선 권고사항

### 현재 상태 분석

#### 강점 ✅

1. **자동 코드 생성**
   - Orval로 OpenAPI → TypeScript 자동 변환
   - API 타입 안전성 보장
   - 개발 속도 향상

2. **명확한 구조**
   - 도메인별 모듈화
   - 계층화된 디렉토리 구조
   - 일관된 명명 규칙

3. **최신 기술 스택**
   - React 19 (최신)
   - TypeScript 5.8 (엄격한 타입)
   - Vite 7 (고성능 빌드)

4. **포괄적인 디자인 시스템**
   - 중앙화된 토큰 관리
   - TailwindCSS + CSS 변수 이중 관리
   - 일관된 색상, 폰트, 간격

5. **체계적인 상태 관리**
   - React Query (서버 상태)
   - Jotai (클라이언트 상태)
   - 명확한 책임 분리

#### 문제점 및 개선 기회 ⚠️

### 1. 생성된 파일 관리

**문제**:
- `src/api/`, `src/model/` 은 자동 생성이지만 폴더 구조 커짐
- 생성 시간이 느려질 수 있음 (많은 엔드포인트)

**권고사항**:
```typescript
// Orval 설정에서 생성 조건 추가
// - 선택적 API 생성 (필요한 태그만)
// - 캐싱 메커니즘
// - 증분 생성 지원

// config/orval.config.ts
export default defineConfig({
  store: {
    input: {
      target: getApiUrl(),
      // 생성된 파일 캐시 활성화 (미래 기능)
      cache: true,
      // 특정 태그만 생성
      filterTags: ['receipt', 'conclusion'],  // 필요 시
    },
  },
})
```

### 2. 타입 중복

**문제**:
- 자동 생성 타입 (`src/model/`) + 커스텀 타입 (`src/types/`)
- 타입 정의 위치 불명확

**권고사항**:
```typescript
// 명확한 타입 조직화
// src/types/
//   ├── custom.ts          // 커스텀 타입 (모델에서 파생)
//   ├── domain/
//   │   ├── receipt.ts     // 도메인별 추가 타입
//   │   └── ...
//   └── index.ts

// 예시:
// import type { Receipt } from '@/model/receipt'  // 자동 생성
// import type { ReceiptFilter } from '@/types/domain/receipt'  // 커스텀
```

### 3. 에러 처리 표준화

**현재 상태**:
- 기본 Axios 에러 처리만 구현
- API별 에러 처리 미흡

**권고사항**:
```typescript
// 에러 처리 레이어 추가
// src/util/errors.ts
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public details?: any,
  ) {
    super(message)
  }
}

// src/util/http.ts에 에러 맵핑 추가
const onError = useCallback((error: AxiosError) => {
  if (error.response?.status === 400) {
    throw new ApiError('잘못된 요청', 400, 'BAD_REQUEST')
  } else if (error.response?.status === 403) {
    throw new ApiError('권한 없음', 403, 'FORBIDDEN')
  }
  // ...
}, [])

// 컴포넌트에서 사용
try {
  await createReceipt(data)
} catch (error) {
  if (error instanceof ApiError) {
    showAlert(error.message)
  }
}
```

### 4. 로딩 및 스켈레톤 UI

**현재 상태**:
- LoadingBoundary + Spinner 기본 제공
- 스켈레톤 UI 미구현

**권고사항**:
```typescript
// 스켈레톤 UI 컴포넌트 추가
// src/components/common/skeleton/

// 테이블 스켈레톤
<SkeletonTable rows={5} columns={4} />

// 사용 예시
function ReceiptList() {
  const { data, isLoading } = useGetReceipts()
  
  if (isLoading) return <SkeletonTable rows={5} />
  return <ReceiptTable data={data} />
}
```

### 5. 테스트 커버리지

**현재 상태**:
- 테스트 설정 미흡 (설정 파일만 존재)
- 테스트 작성 가이드 부족

**권고사항**:
```typescript
// Vitest 또는 Jest 설정 추가
// vitest.config.ts

// 테스트 작성 예시
// src/components/common/button/BasicButton.test.tsx
import { render, screen } from '@testing-library/react'
import { BasicButton } from './BasicButton'

describe('BasicButton', () => {
  it('should render button with text', () => {
    render(<BasicButton>Click me</BasicButton>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})

// React Query 모킹
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetReceipts } from '@/api/receipt/receipt'

test('should display receipts', async () => {
  const mockQueryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  
  // MSW 또는 vitest.mock() 사용
})
```

### 6. 접근성 (A11y)

**현재 상태**:
- 기본 HTML 시맨틱 구조
- ARIA 레이블 부족

**권고사항**:
```typescript
// ARIA 레이블 추가
<button aria-label="메뉴 열기">
  <MenuIcon />
</button>

<table role="grid" aria-label="접수 목록">
  <thead>
    <tr role="row">
      <th role="columnheader">이름</th>
    </tr>
  </thead>
</table>

// 색상 대비율 확인
// WCAG AA 기준 (4.5:1 텍스트, 3:1 그래픽)
// Lighthouse Accessibility 스코어 확인
```

### 7. 국제화 (i18n)

**현재 상태**:
- 한국어로 고정
- 다국어 지원 미흡

**권고사항**:
```typescript
// i18next 설정
// src/i18n/config.ts
import i18n from 'i18next'
import ko from './locales/ko.json'
import en from './locales/en.json'

i18n.init({
  resources: { ko, en },
  lng: 'ko',
  fallbackLng: 'en',
})

// 사용 예시
import { useTranslation } from 'i18next'

function Component() {
  const { t } = useTranslation()
  return <h1>{t('receipt.title')}</h1>
}
```

### 8. 환경 변수 검증

**현재 상태**:
- 환경 변수 자유로운 사용
- 누락 시 런타임 에러

**권고사항**:
```typescript
// 환경 변수 검증 추가
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_ENABLE_MOCK: z.enum(['true', 'false']).optional(),
})

export const env = envSchema.parse(import.meta.env)

// 빌드 타입 안전성
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_ENABLE_MOCK?: string
  }
}
```

### 9. 성능 모니터링

**현재 상태**:
- 개발 도구에만 의존
- 프로덕션 성능 추적 없음

**권고사항**:
```typescript
// Web Vitals 추적
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)  // Cumulative Layout Shift
getFID(console.log)  // First Input Delay
getFCP(console.log)  // First Contentful Paint
getLCP(console.log)  // Largest Contentful Paint
getTTFB(console.log) // Time to First Byte

// Sentry 또는 LogRocket 통합
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
})
```

### 10. 폼 검증 강화

**현재 상태**:
- React Hook Form + HTML5 검증
- 커스텀 검증 규칙 부족

**권고사항**:
```typescript
// Zod 스키마 통합
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createReceiptSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  amount: z.number().min(0, '금액은 0 이상이어야 합니다'),
})

type CreateReceiptInput = z.infer<typeof createReceiptSchema>

function ReceiptForm() {
  const { control } = useForm<CreateReceiptInput>({
    resolver: zodResolver(createReceiptSchema),
  })
  
  return <form control={control}>...</form>
}
```

---

## 요약

### 프로젝트 특징

| 항목 | 상세 |
|------|------|
| **규모** | ~541 TSX/TS 파일, 19개 라우터 모듈 |
| **아키텍처** | 도메인 주도 설계 + 계층화 구조 |
| **상태 관리** | React Query (서버) + Jotai (클라이언트) |
| **스타일링** | TailwindCSS + 중앙화된 디자인 토큰 |
| **API 통합** | Orval로 OpenAPI 자동 생성 |
| **빌드** | Vite 7 + 최적화된 청크 분할 |
| **개발 경험** | HMR, 타입 안전성, 자동 포맷팅 |

### 주요 개선 기회

1. **테스트 인프라** 구축 (Vitest/Jest)
2. **에러 처리** 표준화 및 중앙화
3. **스켈레톤 UI** 구현
4. **i18n** 지원 (국제화)
5. **성능 모니터링** 추가 (Sentry/LogRocket)
6. **접근성** 강화 (ARIA, 색상 대비)
7. **폼 검증** 강화 (Zod + Hook Form)
8. **문서화** 상세화 (스토리북, 컴포넌트 가이드)

---

**문서 완료**

