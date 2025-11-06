# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 코드 작업을 할 때 필요한 가이드를 제공합니다.

## 프로젝트 개요

Spring API 플랫폼을 위한 React + TypeScript 프론트엔드 애플리케이션입니다. 빌드 도구로 Vite를 사용하고, 스타일링은 TailwindCSS, 상태 관리는 React Query + Jotai를 사용합니다. 결론서, 심의, 기타 행정 기능을 다루는 법무/행정 플랫폼으로 보입니다.

## 필수 개발 명령어

```bash
# 의존성 설치
yarn install

# OpenAPI 스펙에서 API 타입 및 모델 생성 (백엔드 서버 실행 필요)
yarn orval-fix

# 개발 서버 시작 (포트 3000에서 실행)
yarn start

# 개발용 빌드
yarn build:dev

# 운영용 빌드
yarn build

# ESLint 문제 수정
yarn eslint-fix

# Prettier로 코드 포맷팅
yarn prettier-fix

# 운영 빌드 미리보기
yarn preview
```

## API 생성 워크플로우

이 프로젝트는 Orval을 사용하여 OpenAPI 스펙에서 TypeScript 타입과 React Query 훅을 생성합니다:

1. **백엔드 의존성**: Spring API 백엔드 서버가 `http://localhost:8080`에서 실행되어야 함
2. **생성 명령어**: `yarn orval-fix`는 API 생성과 린팅을 결합
3. **생성된 파일들**:
   - API 훅: `src/api/` (OpenAPI 태그별로 구성)
   - 타입 정의: `src/model/`
4. **설정 파일**: `config/orval.config.ts`와 `config/base.orval.config.ts`

## 코드 아키텍처

### 디렉토리 구조

```
src
├── api/         # 자동 생성된 API 훅 (React Query)
├── components/  # 도메인별로 구성된 재사용 가능한 UI 컴포넌트
├── views/       # 페이지 레벨 컴포넌트
├── router/      # React Router 설정 (중첩 라우팅 구조)
├── layout/      # 레이아웃 컴포넌트 (BaseLayout, NoMenuLayout)
├── store/       # Jotai 상태 관리
├── util/        # HTTP 클라이언트를 포함한 유틸리티 함수
├── type/        # 커스텀 TypeScript 타입 정의
└── model/       # 자동 생성된 API 타입
```

### 주요 기술 스택

- **React 19** with TypeScript
- **Vite** 빌드 도구
- **TailwindCSS 4.x** 스타일링
- **React Query (@tanstack/react-query)** 서버 상태 관리
- **Jotai** 클라이언트 상태 관리
- **React Router 6** 라우팅
- **React Hook Form** 폼 처리
- **Axios** HTTP 요청

### 경로 별칭

- `@/*` → `src/*`
- `@components/*` → `src/components/*`

### 상태 관리 패턴

- 서버 상태: 커스텀 쿼리 옵션을 사용한 React Query
- 클라이언트 상태: Jotai atoms
- HTTP 클라이언트: `src/util/http.ts`의 커스텀 axios 인스턴스

### 라우팅 구조

애플리케이션은 두 가지 주요 레이아웃을 가진 중첩 라우팅 구조를 사용합니다:

- `BaseLayout` - 네비게이션이 있는 메인 애플리케이션 레이아웃
- `NoMenuLayout` - 로그인/인증 페이지용 단순 레이아웃

주요 라우트 섹션: admin, board, conclusion, deliberation, land, map, receipt, references

## 개발 가이드라인

### 컴포넌트 개발

React 컴포넌트 생성 시:

1. `src/components/`에서 기존 컴포넌트를 먼저 확인
2. 적절한 prop 타입과 함께 TypeScript 사용
3. 기존 컴포넌트 패턴과 파일 구성 방식을 따름
4. 스타일링은 TailwindCSS 사용
5. 독립적인 구성 요소로 재사용 가능한 컴포넌트 생성 고려
6. 디자인 시스템을 사용 할 것

- 색상 팔레트: CSS 변수 기반, 정부/공공 블루 계열 (design/colors.ts)
- 타이포그래피: Noto Sans KR(본문/UI), Nanum Gothic(제목/강조), Roboto(숫자) (design/typography.ts)
- 간격/여백: spacing.ts 기반 통일 (design/spacing.ts)
- Tailwind theme 확장: 디자인 토큰 매핑, 커스텀 색상/폰트/크기 정의
- 재사용성: 디자인 상수 재사용, 향후 수정 시 src/constants/design만 변경

### 코드 스타일

- 커밋 메시지와 문서는 한국어 사용 권장
- 커밋 메시지는 Conventional Commits 형식 사용
- import와 파일 구성은 기존 패턴을 따름
- ESLint와 Prettier 설정이 이미 구성됨

### API 통합

- API 호출을 수동으로 작성하지 말고 `yarn orval-fix`로 생성
- API 변경 시 백엔드 서버를 먼저 업데이트해야 함
- 생성된 API 훅은 React Query 패턴을 따름

### 빌드 프로세스

빌드 프로세스에는 다음이 포함됩니다:

- TypeScript 컴파일
- 청크 분할 최적화를 통한 Vite 번들링
- 개발 빌드에는 소스맵 포함
- 운영 빌드는 압축됨

## 중요 사항

- **API 서버 의존성**: API 생성을 위해 백엔드 Spring 서버가 실행되어야 함
- **수동 API 호출 금지**: 항상 Orval에서 생성된 API 훅을 사용
- **한국어 개발**: 커밋과 문서는 한국어 사용 권장
- **독립적인 컴포넌트**: 독립적이고 재사용 가능한 구성 요소로 컴포넌트 설계
- **경로 해석**: 깔끔한 import를 위해 TypeScript 경로 별칭 사용

## 검토 시 체크:

- 모든 색상, 폰트, 간격/여백이 새 디자인 시스템을 사용하고 있는가?
- Tailwind theme에 디자인 토큰이 제대로 매핑되어 있는가?
- 하드코딩된 값 없이 재사용 가능한 디자인 상수로 구현되었는가?

## 한국 개발팀을 위한 추가 가이드

### 커밋 메시지 작성 규칙

- **형식**: `타입: 한글 설명`
- **예시**:
  - `feat: 게시판 파일 업로드 기능 추가`
  - `fix: 파일 업로드 시 Content-Type 에러 수정`
  - `refactor: API 생성 설정 최적화`

### 코드 리뷰 가이드라인

- 컴포넌트는 도메인별로 구성하되, 재사용성을 고려
- API 변경 시 `yarn orval-fix` 실행 후 생성된 코드 확인
- 한국어 주석 권장 (기술 용어는 영어 유지)
- 커서 룰 규칙 준수
  - .cursor/rules/01-common.mdc
  - .cursor/rules//02-wireframe.mdc
  - .cursor/rules/04-func.mdc

### 팀 협업 규칙

- 새로운 라이브러리 설치 전 팀 내 논의
- 파일 업로드 등 multipart/form-data 사용 시 `customFormDataFn` 활용
- 환경별 설정은 `.env` 파일로 관리
