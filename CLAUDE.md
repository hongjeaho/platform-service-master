# CLAUDE.md - Platform Service Development Guide for AI Assistants

> **Last Updated**: 2025-11-17
> **Project**: Spring API Platform - Legal/Administrative Platform
> **Language**: Korean codebase with English configuration
> **Primary Language**: Java (Backend) + TypeScript/React (Frontend)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Module Structure](#architecture--module-structure)
3. [Technology Stack](#technology-stack)
4. [Development Workflows](#development-workflows)
5. [Code Conventions & Patterns](#code-conventions--patterns)
6. [Common Development Tasks](#common-development-tasks)
7. [Testing Guidelines](#testing-guidelines)
8. [Configuration Management](#configuration-management)
9. [Database Management](#database-management)
10. [API Development](#api-development)
11. [Frontend Development](#frontend-development)
12. [Security & Authentication](#security--authentication)
13. [Important File Locations](#important-file-locations)
14. [Troubleshooting & Gotchas](#troubleshooting--gotchas)

---

## Project Overview

### Purpose
This is an enterprise-grade platform for managing land compensation cases, legal deliberations, and administrative functions for a Korean government/public institution.

### Key Features
- **Case Management**: Receipt, deliberation, and conclusion of land compensation cases
- **Legal Tools**: Opinion templates, precedent references, decree management
- **External Integration**: LTIS (Land Tribunal Information System) batch data synchronization
- **Document Processing**: PDF handling with TOC extraction
- **Geographic Data**: Kakao Maps integration for land/district information
- **User Management**: Role-based access control with JWT authentication
- **Bulletin Boards**: Q&A, applications, notices

### Project Scale
- **Backend**: 351 Java files, 13 test classes, 38 controllers
- **Frontend**: 254 TSX files, 98 TS files
- **Database**: 31 Flyway migrations, MySQL 8.0
- **Modules**: 7 Gradle modules (3 common, 1 datasource, 2 applications)

---

## Architecture & Module Structure

### Multi-Module Architecture

```
platform-service-master/
├── api/platform/              # REST API Server (Port 8080)
├── batch/platform/            # Spring Batch Jobs (Port 9091)
├── common/
│   ├── base/                  # Core utilities, DTOs, auth models
│   ├── core/                  # Business services (File, PDF)
│   └── web/                   # Web layer (Security, Exception, Swagger)
├── datasource/base/           # Database access (jOOQ, MyBatis, Flyway)
├── front/platform/            # React Frontend (Port 3000)
└── docker/                    # MySQL & Prometheus containers
```

### Module Dependencies

```
api-platform
  └── common-web
        └── common-core
              └── common-base

batch-platform
  └── datasource-base
        └── common-base

datasource-base
  └── common-base
```

### Layer Architecture (Backend)

```
Controller Layer (API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
jOOQ/MyBatis (Type-safe SQL)
    ↓
MySQL Database
```

---

## Technology Stack

### Backend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Language** | Java | 17+ | Primary backend language |
| **Framework** | Spring Boot | 3.4.2 | Application framework |
| **Build Tool** | Gradle | 8.10 | Build automation |
| **Database** | MySQL | 8.0.31 | Primary database |
| **Database Access** | jOOQ | 3.19.18 | Type-safe SQL queries |
| **Database Access** | MyBatis | 3.0.4 | Complex queries & procedures |
| **Migration** | Flyway | 9.22.0 | Database versioning |
| **Batch** | Spring Batch | 3.x | Scheduled data integration |
| **Security** | Spring Security | 6.x | Authentication & authorization |
| **Authentication** | JWT | Auth0 3.16.0 | Token-based auth |
| **PDF Processing** | Apache PDFBox | 3.0.5 | PDF manipulation |
| **Connection Pool** | HikariCP | Latest | Database connections |
| **API Docs** | SpringDoc OpenAPI | 2.8.9 | API documentation |
| **Reactive** | Project Reactor | 3.7.7 | Async processing |
| **Testing** | JUnit 5 | Latest | Unit testing |
| **Code Generation** | Lombok | Latest | Boilerplate reduction |

### Frontend

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19 | UI library |
| **Language** | TypeScript | 5.8.3 | Type safety |
| **Build Tool** | Vite | 7.0.4 | Fast dev server & bundler |
| **Styling** | TailwindCSS | 4.1.11 | Utility-first CSS |
| **State (Server)** | React Query | @tanstack/react-query | Server state management |
| **State (Client)** | Jotai | Latest | Client state atoms |
| **Routing** | React Router | 6.x | Client-side routing |
| **Forms** | React Hook Form | 7.60.0 | Form handling |
| **HTTP Client** | Axios | 1.11.0 | API requests |
| **API Codegen** | Orval | 7.11.2 | OpenAPI → TypeScript |
| **Maps** | Kakao Maps SDK | Latest | Geographic data |
| **Date** | date-fns | Latest | Date manipulation |
| **Package Manager** | Yarn | Latest | Dependency management |

### DevOps

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Containerization** | Docker Compose | MySQL & Prometheus |
| **Monitoring** | Prometheus | Metrics collection |
| **Logging** | Logback + JSON | Structured logging |
| **API Testing** | Swagger UI | Interactive API testing |

---

## Development Workflows

### Initial Setup (First Time)

#### Backend Setup

```bash
# 1. Start Docker services
docker-compose up -d

# Verify MySQL is running
docker ps | grep platform-mysql

# 2. Initialize database (DESTRUCTIVE - cleans all data)
./gradlew flywayClean generateJooq

# This will:
# - Drop all tables in the 'store' database
# - Run all Flyway migrations
# - Generate jOOQ classes from the schema

# 3. Verify Gradle modules
./gradlew projects

# 4. Build all modules
./gradlew build

# 5. Run API server
./gradlew :api-platform:bootRun
# API: http://localhost:8080
# Swagger: http://localhost:8080/public/swagger-ui
# OpenAPI: http://localhost:8080/api/public/api-docs/json

# 6. Run Batch server (separate terminal)
./gradlew :batch-platform:bootRun
# Batch: http://localhost:9091
```

#### Frontend Setup

```bash
cd front/platform

# 1. Install dependencies
yarn install

# 2. Ensure backend is running on port 8080
# 3. Generate API code from OpenAPI spec
yarn orval-fix

# This will:
# - Fetch OpenAPI spec from http://localhost:8080/api/public/api-docs/json
# - Generate TypeScript types in src/model/
# - Generate React Query hooks in src/api/
# - Run ESLint auto-fix

# 4. Start dev server
yarn start
# Frontend: http://localhost:3000

# 5. (Optional) Build for production
yarn build
```

### Daily Development Workflow

#### Backend

```bash
# After pulling new code
./gradlew generateJooq  # Regenerate jOOQ if schema changed

# Running tests
./gradlew test                    # All tests
./gradlew :datasource-base:test   # Module-specific tests

# Running applications
./gradlew :api-platform:bootRun       # API server
./gradlew :batch-platform:bootRun     # Batch server

# Clean build (if issues occur)
./gradlew clean build
```

#### Frontend

```bash
cd front/platform

# After API changes
yarn orval-fix        # Regenerate API code

# Development
yarn start            # Dev server with hot reload

# Code quality
yarn eslint-fix       # Fix linting issues
yarn prettier-fix     # Format code

# Building
yarn build            # Production build
yarn build:dev        # Development build
yarn preview          # Preview production build
```

### Database Workflows

```bash
# Apply new migrations
./gradlew flywayMigrate

# Check migration status
./gradlew flywayInfo

# Clean database (DESTRUCTIVE)
./gradlew flywayClean

# Regenerate jOOQ classes after schema changes
./gradlew generateJooq

# Complete workflow: migrate + generate
./gradlew flywayMigrate generateJooq
```

---

## Code Conventions & Patterns

### Backend Conventions

#### Naming Conventions

```java
// Controllers: {Domain}Controller, {Domain}ReadController, {Domain}WriteController
@RestController
@RequestMapping("/api/admin/user")
public class UserController { }

// Services: {Domain}Service, {Domain}ReadService, {Domain}WriteService
@Service
public class UserService { }

// Repositories: {Domain}Repository
@Repository
public class UserRepository { }

// DTOs: {Purpose}Request, {Purpose}Response, {Entity}DTO
public class UserCreateRequest { }
public class UserResponse { }
public class UserDTO extends AbstractDTO { }

// Entities (jOOQ POJOs): {Table}Entity
public class UserEntity { }  // Generated from 'user' table

// jOOQ Tables: J{Table}
JUser.USER                    // Generated table reference
```

#### Package Structure

```
com.platform.{module}.{submodule}/
├── controller/          # REST endpoints
│   ├── read/           # Read-only controllers
│   └── write/          # Write controllers
├── service/            # Business logic
│   ├── read/           # Read services
│   └── write/          # Write services
├── repository/         # Data access
├── dto/                # Request/Response objects
│   ├── request/
│   └── response/
├── type/               # Enums, constants
└── config/             # Configuration classes
```

#### Code Patterns

**Read/Write Separation**:
```java
// Separate read and write operations
@RestController
@RequestMapping("/api/conclusion")
public class ConclusionReadController {
    @GetMapping
    public ApiResponse<List<ConclusionResponse>> list() { }
}

@RestController
@RequestMapping("/api/conclusion")
public class ConclusionWriteController {
    @PostMapping
    public ApiResponse<ConclusionResponse> create(@RequestBody ConclusionCreateRequest request) { }
}
```

**Service Layer Pattern**:
```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @PlatFormTransactional(readOnly = true)
    public UserDTO findById(Long id) {
        // Use jOOQ for type-safe queries
        return userRepository.findById(id);
    }

    @PlatFormTransactional
    public UserDTO create(UserCreateRequest request) {
        // Business logic
        // Use repository for data access
        return userRepository.save(user);
    }
}
```

**Repository Pattern (jOOQ)**:
```java
@Repository
@RequiredArgsConstructor
public class UserRepository {
    private final DSLContext dsl;

    public UserEntity findById(Long id) {
        return dsl.selectFrom(JUser.USER)
            .where(JUser.USER.ID.eq(id))
            .fetchOneInto(UserEntity.class);
    }

    public UserEntity save(UserEntity user) {
        return dsl.insertInto(JUser.USER)
            .set(dsl.newRecord(JUser.USER, user))
            .returning()
            .fetchOne()
            .into(UserEntity.class);
    }
}
```

**API Response Wrapper**:
```java
// All API responses should use ApiResponse wrapper
@GetMapping("/users/{id}")
public ApiResponse<UserResponse> getUser(@PathVariable Long id) {
    return ApiResponse.success(userService.findById(id));
}

// Error responses handled by GlobalExceptionHandler
// Returns ErrorResponse with code, message, path, timestamp
```

**DTO Validation**:
```java
public class UserCreateRequest {
    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String password;
}
```

**Security Context Access**:
```java
// Get current authenticated user
AuthUser currentUser = UserAccountHolder.get();
Long userId = currentUser.getId();
String username = currentUser.getUsername();
```

### Frontend Conventions

#### File Structure

```
src/
├── api/                    # Generated API hooks (gitignored)
│   └── {tag}/             # Split by OpenAPI tags
├── model/                  # Generated TypeScript types (gitignored)
├── components/             # Reusable components by domain
│   ├── admin/
│   ├── board/
│   ├── common/            # Shared components
│   └── ...
├── views/                  # Page components
│   ├── admin/
│   ├── board/
│   └── ...
├── layout/                 # Layout components
│   ├── BaseLayout.tsx     # Main app layout
│   └── NoMenuLayout.tsx   # Auth pages layout
├── router/                 # Route definitions
├── store/                  # Jotai atoms
├── util/                   # Utilities
│   ├── http.ts            # Axios instance
│   └── requestFormData.ts # Form data handler
└── constants/              # Constants
    └── design/            # Design system tokens
```

#### Component Naming

```typescript
// Page components: {Domain}{Action}Page.tsx
export default function UserListPage() { }

// Feature components: {Domain}{Feature}.tsx
export default function UserTable() { }

// Common components: {Purpose}.tsx
export default function Button() { }
```

#### API Integration Pattern

```typescript
// Use generated hooks from Orval
import { useGetUsers, useCreateUser } from '@/api/user/user';

function UserListPage() {
    // Query hook
    const { data, isLoading, error } = useGetUsers({
        page: 0,
        size: 20
    });

    // Mutation hook
    const createUser = useCreateUser();

    const handleCreate = async (request: UserCreateRequest) => {
        try {
            await createUser.mutateAsync({ data: request });
            // Success handling
        } catch (error) {
            // Error handling
        }
    };
}
```

#### State Management Pattern

```typescript
// Server state: Use React Query (generated hooks)
import { useGetUser } from '@/api/user/user';

// Client state: Use Jotai atoms
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Define atom
export const userAtom = atomWithStorage<AuthUser | null>('user', null);

// Use in component
function Header() {
    const [user, setUser] = useAtom(userAtom);
}
```

#### Routing Pattern

```typescript
// Define routes with nested structure
const routes = [
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                path: 'admin/user',
                element: <UserListPage />
            },
            {
                path: 'admin/user/:id',
                element: <UserDetailPage />
            }
        ]
    },
    {
        path: '/login',
        element: <NoMenuLayout />,
        children: [
            {
                path: '',
                element: <LoginPage />
            }
        ]
    }
];
```

#### Styling Conventions

```typescript
// Use Tailwind utility classes
function Button({ children }: { children: React.ReactNode }) {
    return (
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
            {children}
        </button>
    );
}

// Use design system tokens from constants/design/
import { colors } from '@/constants/design/colors';
import { spacing } from '@/constants/design/spacing';

// Custom styles only when necessary
const customStyle = {
    backgroundColor: colors.primary[500],
    padding: spacing.md
};
```

---

## Common Development Tasks

### Adding a New API Endpoint

#### Backend

1. **Create Request/Response DTOs**:
```java
// File: api/platform/src/main/java/com/platform/api/platform/dto/example/request/ExampleCreateRequest.java
package com.platform.api.platform.dto.example.request;

@Getter
@Setter
public class ExampleCreateRequest {
    @NotBlank
    private String name;
    private String description;
}

// File: api/platform/src/main/java/com/platform/api/platform/dto/example/response/ExampleResponse.java
package com.platform.api.platform.dto.example.response;

@Getter
@Setter
public class ExampleResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
```

2. **Create Repository**:
```java
// File: datasource/base/src/main/java/com/platform/datasource/base/repository/example/ExampleRepository.java
package com.platform.datasource.base.repository.example;

@Repository
@RequiredArgsConstructor
public class ExampleRepository {
    private final DSLContext dsl;

    public ExampleEntity findById(Long id) {
        return dsl.selectFrom(JExample.EXAMPLE)
            .where(JExample.EXAMPLE.ID.eq(id))
            .fetchOneInto(ExampleEntity.class);
    }

    public List<ExampleEntity> findAll() {
        return dsl.selectFrom(JExample.EXAMPLE)
            .orderBy(JExample.EXAMPLE.CREATED_AT.desc())
            .fetchInto(ExampleEntity.class);
    }
}
```

3. **Create Service**:
```java
// File: api/platform/src/main/java/com/platform/api/platform/service/example/ExampleService.java
package com.platform.api.platform.service.example;

@Service
@RequiredArgsConstructor
public class ExampleService {
    private final ExampleRepository exampleRepository;

    @PlatFormTransactional(readOnly = true)
    public List<ExampleResponse> findAll() {
        return exampleRepository.findAll().stream()
            .map(this::toResponse)
            .toList();
    }

    @PlatFormTransactional
    public ExampleResponse create(ExampleCreateRequest request) {
        // Business logic
        ExampleEntity entity = exampleRepository.save(newEntity);
        return toResponse(entity);
    }

    private ExampleResponse toResponse(ExampleEntity entity) {
        // Mapping logic
    }
}
```

4. **Create Controller**:
```java
// File: api/platform/src/main/java/com/platform/api/platform/controller/example/ExampleController.java
package com.platform.api.platform.controller.example;

@RestController
@RequestMapping("/api/example")
@RequiredArgsConstructor
@Tag(name = "Example", description = "Example API")
public class ExampleController {
    private final ExampleService exampleService;

    @GetMapping
    @Operation(summary = "목록 조회")
    public ApiResponse<List<ExampleResponse>> list() {
        return ApiResponse.success(exampleService.findAll());
    }

    @PostMapping
    @Operation(summary = "생성")
    public ApiResponse<ExampleResponse> create(@RequestBody @Valid ExampleCreateRequest request) {
        return ApiResponse.success(exampleService.create(request));
    }
}
```

5. **Test in Swagger**:
   - Start API server: `./gradlew :api-platform:bootRun`
   - Open: http://localhost:8080/public/swagger-ui
   - Find your endpoint under "Example" tag
   - Test the endpoint

#### Frontend

1. **Regenerate API code**:
```bash
cd front/platform
yarn orval-fix  # Fetches OpenAPI spec and generates hooks
```

2. **Use generated hooks**:
```typescript
// File: src/views/example/ExampleListPage.tsx
import { useGetExample, useCreateExample } from '@/api/example/example';
import type { ExampleCreateRequest } from '@/model';

export default function ExampleListPage() {
    const { data, isLoading } = useGetExample();
    const createMutation = useCreateExample();

    const handleCreate = async (request: ExampleCreateRequest) => {
        await createMutation.mutateAsync({ data: request });
    };

    return (
        <div>
            {data?.data.map(item => (
                <div key={item.id}>{item.name}</div>
            ))}
        </div>
    );
}
```

### Adding a New Database Table

1. **Create Flyway Migration**:
```sql
-- File: datasource/base/flyway/V{YYYYMMDDHHMMSS}__example_table.sql
-- Example: V20251117120000__example_table.sql

CREATE TABLE example (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Example table';
```

2. **Apply Migration and Generate jOOQ**:
```bash
# Option 1: Clean and regenerate (for dev only)
./gradlew flywayClean generateJooq

# Option 2: Migrate and generate (safer)
./gradlew flywayMigrate generateJooq
```

3. **Verify Generated Code**:
```java
// Generated files (gitignored):
// - datasource/base/src/generated/com/platform/tables/JExample.java
// - datasource/base/src/generated/com/platform/tables/pojos/ExampleEntity.java

// Usage in repository:
import static com.platform.tables.JExample.EXAMPLE;

public ExampleEntity findById(Long id) {
    return dsl.selectFrom(EXAMPLE)
        .where(EXAMPLE.ID.eq(id))
        .fetchOneInto(ExampleEntity.class);
}
```

### Adding a New Batch Job

1. **Create Job Configuration**:
```java
// File: batch/platform/src/main/java/com/platform/batch/platform/example/job/ExampleBatch.java
package com.platform.batch.platform.example.job;

@Configuration
@RequiredArgsConstructor
public class ExampleBatch {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    @Bean
    public Job exampleJob() {
        return new JobBuilder("exampleJob", jobRepository)
            .start(extractStep())
            .next(processStep())
            .build();
    }

    @Bean
    public Step extractStep() {
        return new StepBuilder("extractStep", jobRepository)
            .<InputData, ProcessedData>chunk(100, transactionManager)
            .reader(itemReader())
            .processor(itemProcessor())
            .writer(itemWriter())
            .build();
    }

    // Implement reader, processor, writer
}
```

2. **Run Batch Job**:
```bash
./gradlew :batch-platform:bootRun

# Job will be triggered based on scheduler configuration
# Check logs for job execution status
```

### Adding a New React Component

1. **Create Component**:
```typescript
// File: src/components/example/ExampleCard.tsx
import { ExampleResponse } from '@/model';

interface ExampleCardProps {
    example: ExampleResponse;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function ExampleCard({ example, onEdit, onDelete }: ExampleCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-neutral-900">{example.name}</h3>
            <p className="text-neutral-600 mt-2">{example.description}</p>
            <div className="mt-4 flex gap-2">
                {onEdit && (
                    <button
                        onClick={() => onEdit(example.id)}
                        className="bg-primary-500 text-white px-4 py-2 rounded"
                    >
                        편집
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(example.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        삭제
                    </button>
                )}
            </div>
        </div>
    );
}
```

2. **Use in Page Component**:
```typescript
// File: src/views/example/ExampleListPage.tsx
import ExampleCard from '@/components/example/ExampleCard';
import { useGetExample } from '@/api/example/example';

export default function ExampleListPage() {
    const { data, isLoading } = useGetExample();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map(example => (
                <ExampleCard key={example.id} example={example} />
            ))}
        </div>
    );
}
```

---

## Testing Guidelines

### Backend Testing

#### Repository Tests

```java
// File: datasource/base/src/test/java/com/platform/datasource/base/repository/example/ExampleRepositoryTest.java
package com.platform.datasource.base.repository.example;

@SpringBootTest
public class ExampleRepositoryTest extends BaseSpringBootTest {

    @Autowired
    private ExampleRepository exampleRepository;

    @DisplayName("ID로 Example 조회")
    @Test
    public void testFindById() {
        // Given
        Long id = 1L;

        // When
        ExampleEntity result = exampleRepository.findById(id);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(id);
    }

    @DisplayName("Example 생성")
    @Test
    @Transactional
    public void testCreate() {
        // Given
        ExampleEntity entity = new ExampleEntity();
        entity.setName("Test");
        entity.setDescription("Test Description");

        // When
        ExampleEntity saved = exampleRepository.save(entity);

        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Test");
    }
}
```

#### Service Tests

```java
// File: api/platform/src/test/java/com/platform/api/platform/service/example/ExampleServiceTest.java
package com.platform.api.platform.service.example;

@SpringBootTest
public class ExampleServiceTest extends BaseSpringBootTest {

    @Autowired
    private ExampleService exampleService;

    @DisplayName("Example 목록 조회")
    @Test
    public void testFindAll() {
        // When
        List<ExampleResponse> results = exampleService.findAll();

        // Then
        assertThat(results).isNotEmpty();
    }
}
```

#### Running Tests

```bash
# All tests
./gradlew test

# Specific module
./gradlew :datasource-base:test
./gradlew :api-platform:test

# Specific test class
./gradlew :datasource-base:test --tests ExampleRepositoryTest

# With detailed output
./gradlew test --info

# Skip tests during build
./gradlew build -x test
```

### Frontend Testing

**Note**: The frontend currently lacks a test framework setup. Recommended additions:
- Vitest for unit testing
- React Testing Library for component testing
- Playwright or Cypress for E2E testing

**Manual Testing**:
1. Start backend: `./gradlew :api-platform:bootRun`
2. Start frontend: `cd front/platform && yarn start`
3. Navigate to http://localhost:3000
4. Test features in browser

---

## Configuration Management

### Profile System

The application uses Spring profiles for environment-specific configuration.

#### Available Profiles

- **local**: Local development (default)
- **dev**: Development server
- **base**: Common base configuration
- **web-base**: Web layer configuration
- **core**: Core services configuration
- **datasource-base**: Database configuration
- **datasource-base-dev**: Dev database configuration

#### Profile Groups (API Module)

```yaml
# File: api/platform/src/main/resources/application.yml
spring:
  profiles:
    group:
      local:
        - base
        - core
        - datasource-base
        - web-base
      dev:
        - base
        - core
        - datasource-base
        - web-base
        - datasource-base-dev
```

#### Configuration Files

| File | Purpose |
|------|---------|
| `application.yml` | Main application config |
| `application-local.yml` | Local environment overrides |
| `application-dev.yml` | Dev environment overrides |
| `application-base.yml` | Common base settings |
| `application-web-base.yml` | Web layer settings (common-web) |
| `application-core.yml` | Core services settings (common-core) |
| `application-datasource-base.yml` | Database settings (datasource-base) |

#### Key Configuration Properties

**API Module** (`api/platform/src/main/resources/application.yml`):
```yaml
server:
  port: 8080
  tomcat:
    max-connections: 200
    threads:
      max: 200
      min-spare: 10

platform:
  jwt:
    token-expiration: PT24H  # 24 hours
    renew-before: P5D         # 5 days
  file:
    upload-path-windows: C:\filedownload\
    upload-path-linux: /home/staff/filedownload/
```

**Batch Module** (`batch/platform/src/main/resources/application.yml`):
```yaml
server:
  port: 9091

platform:
  api:
    kakao:
      url: https://dapi.kakao.com
      key: ${KAKAO_API_KEY}
    kapa:
      url: https://kapa-api.example.com
    ltis:
      url: https://ltis-api.example.com
```

**Web Base** (`common/web/src/main/resources/application-web-base.yml`):
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 3000MB
      max-request-size: 3000MB

springdoc:
  swagger-ui:
    path: /public/swagger-ui
  api-docs:
    path: /api/public/api-docs

management:
  endpoints:
    web:
      base-path: /public/platform/actuator
```

**Datasource Base** (`datasource/base/src/main/resources/application-datasource-base.yml`):
```yaml
platform:
  domain:
    datasource:
      type: HikariCP
      jdbcUrl: jdbc:mysql://localhost:3306/store?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul
      username: root
      password: root
      maximumPoolSize: 15
      connectionTimeout: 30000
      maxLifetime: 1800000

mybatis:
  mapper-locations:
    - classpath:mybatis-mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true
```

### Environment Variables

Recommended environment variables for sensitive configuration:

```bash
# Database
export DB_URL=jdbc:mysql://localhost:3306/store
export DB_USERNAME=root
export DB_PASSWORD=root

# External APIs
export KAKAO_API_KEY=your_kakao_api_key
export KAPA_API_URL=https://kapa-api.example.com
export LTIS_API_URL=https://ltis-api.example.com

# JWT Secret (production)
export JWT_SECRET=your_secret_key_here
```

---

## Database Management

### Database Schema

**Primary Database**: `store` (main application data)
**Batch Database**: `batch` (Spring Batch metadata)
**Timezone**: Asia/Seoul
**Charset**: UTF8MB4
**Collation**: utf8mb4_unicode_ci

### Key Tables

#### System Tables
- `system_group_code` - System code groups
- `system_code` - System codes (lookup values)

#### User & Auth Tables
- `user` - User accounts
- `user_role` - Role definitions
- `user_role_mapping` - User-role assignments

#### Case Management Tables
- `receipt` - Case receipts
- `receipt_attachment` - Receipt attachments
- `receipt_appraisal` - Appraisal information
- `deliberation` - Deliberation records
- `conclusion` - Legal conclusions
- `conclusion_opinion` - Conclusion opinions

#### Reference Tables
- `opinion_template` - Opinion templates
- `opinion_case_comment` - Case comments
- `decree` - Legal decrees
- `precedent` - Legal precedents
- `land_price` - Land pricing data

#### External Integration Tables
- `ltis_*` - LTIS data tables
- `rept_*` - Report data tables

#### Support Tables
- `file` - File attachments
- `board` - Bulletin boards
- `notice` - Notices

### Migration Commands

```bash
# View migration status
./gradlew flywayInfo

# Apply pending migrations
./gradlew flywayMigrate

# Validate migrations
./gradlew flywayValidate

# Clean database (DESTRUCTIVE - dev only)
./gradlew flywayClean

# Repair metadata table
./gradlew flywayRepair

# Complete workflow
./gradlew flywayMigrate generateJooq
```

### Creating Migrations

**Naming Convention**: `V{YYYYMMDDHHmmss}__{description}.sql`

Example: `V20251117120000__add_example_table.sql`

**Migration Template**:
```sql
-- File: datasource/base/flyway/V{timestamp}__{description}.sql

-- Create table
CREATE TABLE example (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT '이름',
    description TEXT COMMENT '설명',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '상태',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    created_by BIGINT COMMENT '생성자 ID',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    updated_by BIGINT COMMENT '수정자 ID',

    -- Indexes
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),

    -- Foreign keys
    CONSTRAINT fk_example_created_by FOREIGN KEY (created_by) REFERENCES user(id),
    CONSTRAINT fk_example_updated_by FOREIGN KEY (updated_by) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Example table';

-- Insert initial data if needed
INSERT INTO example (name, description, status) VALUES
('Example 1', 'Description 1', 'ACTIVE'),
('Example 2', 'Description 2', 'ACTIVE');
```

**Best Practices**:
- Always include rollback instructions in comments
- Use transactions for data migrations
- Add indexes for foreign keys and frequently queried columns
- Include meaningful comments in Korean
- Never modify existing migrations (create new ones instead)
- Test migrations on a copy of production data

### jOOQ Code Generation

#### Custom Generator Strategy

**File**: `common/base/src/main/java/com/platform/common/base/jooq/CustomGeneratorStrategy.java`

**Naming Rules**:
- **Tables**: Prefix with 'J' (e.g., `user` → `JUser`)
- **POJOs**: Suffix with 'Entity' (e.g., `user` → `UserEntity`)
- **DAOs**: Suffix with 'Dao' (e.g., `user` → `UserDao`)

#### Generated Code Location

```
datasource/base/src/generated/
└── com/platform/
    ├── tables/              # Table classes (JUser, JExample)
    ├── tables/pojos/        # POJO entities (UserEntity, ExampleEntity)
    ├── tables/daos/         # DAO classes
    ├── tables/records/      # Record classes
    └── tables/interfaces/   # Interface classes
```

**Note**: Generated code is gitignored and must be regenerated after cloning.

#### jOOQ Configuration

**File**: `datasource/base/src/main/java/com/platform/datasource/base/config/JooqConfig.java`

**Features**:
- **WHERE Clause Enforcement**: Prevents DELETE/UPDATE without WHERE
- **Query Timeout**: 60 seconds
- **Batch Size**: 100 records
- **SQL Logging**: Formatted SQL with parameters
- **Exception Translation**: Spring DataAccessException

#### jOOQ Query Examples

**Simple Select**:
```java
import static com.platform.tables.JUser.USER;

public UserEntity findById(Long id) {
    return dsl.selectFrom(USER)
        .where(USER.ID.eq(id))
        .fetchOneInto(UserEntity.class);
}
```

**Join Query**:
```java
import static com.platform.tables.JUser.USER;
import static com.platform.tables.JUserRole.USER_ROLE;

public List<UserWithRoleDTO> findUsersWithRoles() {
    return dsl.select(USER.fields())
        .select(USER_ROLE.ROLE_NAME)
        .from(USER)
        .leftJoin(USER_ROLE).on(USER.ROLE_ID.eq(USER_ROLE.ID))
        .fetchInto(UserWithRoleDTO.class);
}
```

**Insert**:
```java
public UserEntity create(UserEntity user) {
    return dsl.insertInto(USER)
        .set(USER.USERNAME, user.getUsername())
        .set(USER.EMAIL, user.getEmail())
        .set(USER.PASSWORD, user.getPassword())
        .returning()
        .fetchOne()
        .into(UserEntity.class);
}
```

**Update**:
```java
public int update(Long id, UserUpdateRequest request) {
    return dsl.update(USER)
        .set(USER.USERNAME, request.getUsername())
        .set(USER.EMAIL, request.getEmail())
        .set(USER.UPDATED_AT, LocalDateTime.now())
        .where(USER.ID.eq(id))
        .execute();
}
```

**Delete**:
```java
public int delete(Long id) {
    return dsl.deleteFrom(USER)
        .where(USER.ID.eq(id))
        .execute();
}
```

**Complex Query**:
```java
public List<UserEntity> searchUsers(UserSearchRequest request) {
    SelectConditionStep<?> query = dsl.selectFrom(USER)
        .where(USER.STATUS.eq("ACTIVE"));

    if (request.getUsername() != null) {
        query = query.and(USER.USERNAME.like("%" + request.getUsername() + "%"));
    }

    if (request.getEmail() != null) {
        query = query.and(USER.EMAIL.eq(request.getEmail()));
    }

    return query.orderBy(USER.CREATED_AT.desc())
        .limit(request.getSize())
        .offset(request.getPage() * request.getSize())
        .fetchInto(UserEntity.class);
}
```

### MyBatis Usage

For complex queries that are difficult to express in jOOQ, use MyBatis.

**Mapper XML Location**: `datasource/base/src/main/resources/mybatis-mapper/`

**Example Mapper**:
```xml
<!-- File: datasource/base/src/main/resources/mybatis-mapper/example/ExampleMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.platform.datasource.base.mapper.example.ExampleMapper">

    <select id="findComplexData" resultType="com.platform.datasource.base.dto.ExampleDTO">
        SELECT
            e.id,
            e.name,
            COUNT(r.id) as related_count,
            AVG(r.score) as average_score
        FROM example e
        LEFT JOIN related r ON e.id = r.example_id
        WHERE e.status = #{status}
        GROUP BY e.id, e.name
        HAVING COUNT(r.id) > #{minCount}
        ORDER BY average_score DESC
    </select>

</mapper>
```

**Mapper Interface**:
```java
// File: datasource/base/src/main/java/com/platform/datasource/base/mapper/example/ExampleMapper.java
package com.platform.datasource.base.mapper.example;

@Mapper
public interface ExampleMapper {
    List<ExampleDTO> findComplexData(@Param("status") String status, @Param("minCount") int minCount);
}
```

---

## API Development

### REST API Guidelines

#### HTTP Methods

- **GET**: Retrieve resources (read-only, idempotent)
- **POST**: Create new resources
- **PUT**: Full update of existing resources
- **PATCH**: Partial update of existing resources
- **DELETE**: Delete resources

#### URL Structure

```
/api/{domain}/{resource}[/{id}][/{action}]

Examples:
GET    /api/admin/user              # List users
GET    /api/admin/user/{id}         # Get user by ID
POST   /api/admin/user              # Create user
PUT    /api/admin/user/{id}         # Update user
DELETE /api/admin/user/{id}         # Delete user
GET    /api/admin/user/{id}/roles   # Get user's roles
POST   /api/admin/user/{id}/roles   # Add role to user
```

#### Response Format

**Success Response**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Example",
        "createdAt": "2025-11-17T10:00:00"
    },
    "message": null
}
```

**List Response**:
```json
{
    "success": true,
    "data": [
        { "id": 1, "name": "Example 1" },
        { "id": 2, "name": "Example 2" }
    ],
    "message": null
}
```

**Error Response**:
```json
{
    "success": false,
    "code": "BAD_REQUEST",
    "message": "잘못된 요청입니다",
    "path": "/api/admin/user",
    "timestamp": "2025-11-17T10:00:00"
}
```

#### Status Codes

- **200 OK**: Successful GET, PUT, PATCH, DELETE
- **201 Created**: Successful POST (resource created)
- **204 No Content**: Successful DELETE with no response body
- **400 Bad Request**: Validation error, malformed request
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unexpected server error

### OpenAPI/Swagger Documentation

#### Annotations

```java
@RestController
@RequestMapping("/api/example")
@Tag(name = "Example", description = "Example API")
@RequiredArgsConstructor
public class ExampleController {

    private final ExampleService exampleService;

    @GetMapping
    @Operation(summary = "목록 조회", description = "Example 목록을 조회합니다")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ApiResponse<List<ExampleResponse>> list(
        @Parameter(description = "페이지 번호", example = "0") @RequestParam(defaultValue = "0") int page,
        @Parameter(description = "페이지 크기", example = "20") @RequestParam(defaultValue = "20") int size
    ) {
        return ApiResponse.success(exampleService.findAll(page, size));
    }

    @PostMapping
    @Operation(summary = "생성", description = "새로운 Example을 생성합니다")
    public ApiResponse<ExampleResponse> create(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "생성 요청 정보",
            required = true
        )
        @RequestBody @Valid ExampleCreateRequest request
    ) {
        return ApiResponse.success(exampleService.create(request));
    }
}
```

#### Accessing Swagger UI

1. Start API server: `./gradlew :api-platform:bootRun`
2. Open browser: http://localhost:8080/public/swagger-ui
3. **Auto JWT Token**: In `local` profile, a test JWT token is automatically added
4. **Manual Token**: Click "Authorize" and enter JWT token
5. Test endpoints interactively

#### OpenAPI Spec URL

Frontend's Orval fetches spec from:
```
http://localhost:8080/api/public/api-docs/json
```

### Security Annotations

```java
// Public endpoint (no auth required)
@GetMapping("/public/health")
public String health() {
    return "OK";
}

// Require authentication
@PreAuthorize("isAuthenticated()")
@GetMapping("/profile")
public ApiResponse<UserResponse> getProfile() {
    AuthUser user = UserAccountHolder.get();
    return ApiResponse.success(userService.findById(user.getId()));
}

// Require specific role
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ApiResponse<Void> delete(@PathVariable Long id) {
    exampleService.delete(id);
    return ApiResponse.success();
}

// Require any of multiple roles
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@PutMapping("/{id}")
public ApiResponse<ExampleResponse> update(
    @PathVariable Long id,
    @RequestBody ExampleUpdateRequest request
) {
    return ApiResponse.success(exampleService.update(id, request));
}
```

---

## Frontend Development

### Frontend Architecture

```
Components
    ↓
React Query (Server State)
    ↓
Orval-Generated API Hooks
    ↓
Axios HTTP Client
    ↓
Backend REST API

Local State: Jotai Atoms
```

### Development Server

```bash
cd front/platform

# Start dev server
yarn start
# Opens: http://localhost:3000
# Hot module replacement enabled

# Build for production
yarn build
# Output: dist/

# Preview production build
yarn build && yarn preview
```

### API Code Generation Workflow

```bash
# 1. Ensure backend is running
./gradlew :api-platform:bootRun

# 2. In another terminal, generate API code
cd front/platform
yarn orval-fix

# Generated files:
# - src/api/{tag}/*.ts       # React Query hooks
# - src/model/*.ts           # TypeScript types
```

**What Orval Generates**:
```typescript
// src/api/user/user.ts (example)

// Query hook
export const useGetUsers = <TData = AxiosResponse<ApiResponseListUserResponse>>(
    params?: GetUsersParams,
    options?: { query?: UseQueryOptions<TData> }
) => {
    return useQuery({
        queryKey: ['getUsers', params],
        queryFn: () => getUsers(params),
        ...options?.query
    });
};

// Mutation hook
export const useCreateUser = <TData = AxiosResponse<ApiResponseUserResponse>>(
    options?: { mutation?: UseMutationOptions<TData, Error, CreateUserBody> }
) => {
    return useMutation({
        mutationFn: (data: CreateUserBody) => createUser(data),
        ...options?.mutation
    });
};

// Raw API function
export const getUsers = (params?: GetUsersParams): Promise<AxiosResponse<ApiResponseListUserResponse>> => {
    return customInstance({ url: '/api/admin/user', method: 'GET', params });
};

export const createUser = (data: CreateUserBody): Promise<AxiosResponse<ApiResponseUserResponse>> => {
    return customInstance({ url: '/api/admin/user', method: 'POST', data });
};
```

### React Query Patterns

**Basic Query**:
```typescript
import { useGetUser } from '@/api/user/user';

function UserProfile({ userId }: { userId: number }) {
    const { data, isLoading, error, refetch } = useGetUser(userId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>{data?.data.data?.name}</h1>
            <button onClick={() => refetch()}>Refresh</button>
        </div>
    );
}
```

**Mutation with Optimistic Update**:
```typescript
import { useCreateUser, useGetUsers } from '@/api/user/user';
import { useQueryClient } from '@tanstack/react-query';

function UserForm() {
    const queryClient = useQueryClient();

    const createUser = useCreateUser({
        mutation: {
            onSuccess: () => {
                // Invalidate and refetch user list
                queryClient.invalidateQueries({ queryKey: ['getUsers'] });
            },
            onError: (error) => {
                console.error('Failed to create user:', error);
            }
        }
    });

    const handleSubmit = async (data: UserCreateRequest) => {
        try {
            await createUser.mutateAsync({ data });
            // Success handling
        } catch (error) {
            // Error handling
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? 'Creating...' : 'Create'}
            </button>
        </form>
    );
}
```

**Parallel Queries**:
```typescript
import { useGetUser, useGetUserRoles } from '@/api/user/user';

function UserDashboard({ userId }: { userId: number }) {
    const userQuery = useGetUser(userId);
    const rolesQuery = useGetUserRoles(userId);

    if (userQuery.isLoading || rolesQuery.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{userQuery.data?.data.data?.name}</h1>
            <ul>
                {rolesQuery.data?.data.data?.map(role => (
                    <li key={role.id}>{role.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

### Jotai State Management

**Define Atom**:
```typescript
// File: src/store/example.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// In-memory atom
export const counterAtom = atom(0);

// Persisted atom (localStorage)
export const userPreferencesAtom = atomWithStorage('userPreferences', {
    theme: 'light',
    language: 'ko'
});

// Derived atom
export const doubledCounterAtom = atom(
    (get) => get(counterAtom) * 2
);

// Write-only atom
export const incrementAtom = atom(
    null,
    (get, set) => set(counterAtom, get(counterAtom) + 1)
);
```

**Use in Component**:
```typescript
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { counterAtom, incrementAtom } from '@/store/example';

function Counter() {
    const [count, setCount] = useAtom(counterAtom);
    const increment = useSetAtom(incrementAtom);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}

// Read-only
function CountDisplay() {
    const count = useAtomValue(counterAtom);
    return <div>Count: {count}</div>;
}
```

### Routing Patterns

**Define Routes**:
```typescript
// File: src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '@/layout/BaseLayout';
import NoMenuLayout from '@/layout/NoMenuLayout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <BaseLayout />,
        children: [
            {
                path: 'admin',
                children: [
                    {
                        path: 'user',
                        element: <UserListPage />
                    },
                    {
                        path: 'user/:id',
                        element: <UserDetailPage />
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        element: <NoMenuLayout />,
        children: [
            {
                path: '',
                element: <LoginPage />
            }
        ]
    }
]);
```

**Navigation**:
```typescript
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

function UserDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    const handleEdit = () => {
        navigate(`/admin/user/${id}/edit`);
    };

    const handleBack = () => {
        navigate('/admin/user');
    };

    return (
        <div>
            <button onClick={handleBack}>Back</button>
            <button onClick={handleEdit}>Edit</button>
        </div>
    );
}
```

### Form Handling with React Hook Form

```bash
yarn add react-hook-form
```

```typescript
import { useForm } from 'react-hook-form';
import { useCreateUser } from '@/api/user/user';
import type { UserCreateRequest } from '@/model';

function UserCreateForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<UserCreateRequest>();
    const createUser = useCreateUser();

    const onSubmit = async (data: UserCreateRequest) => {
        try {
            await createUser.mutateAsync({ data });
            // Success: redirect or show message
        } catch (error) {
            // Error handling
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Name</label>
                <input
                    {...register('name', { required: '이름은 필수입니다' })}
                    className="border rounded px-3 py-2"
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div>
                <label>Email</label>
                <input
                    type="email"
                    {...register('email', {
                        required: '이메일은 필수입니다',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '올바른 이메일 형식이 아닙니다'
                        }
                    })}
                    className="border rounded px-3 py-2"
                />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={createUser.isPending}>
                {createUser.isPending ? 'Creating...' : 'Create'}
            </button>
        </form>
    );
}
```

### Design System Usage

```typescript
// Import design tokens
import { colors } from '@/constants/design/colors';
import { spacing } from '@/constants/design/spacing';
import { typography } from '@/constants/design/typography';

// Use in Tailwind classes
function Component() {
    return (
        <div className="bg-primary-500 text-white p-md rounded-lg">
            <h1 className="text-2xl font-bold mb-sm">Title</h1>
            <p className="text-base text-neutral-600">Content</p>
        </div>
    );
}

// Use in inline styles (when necessary)
const customStyle = {
    backgroundColor: colors.primary[500],
    padding: spacing.md,
    fontSize: typography.fontSize.lg
};
```

**Available Design Tokens**:
- **Colors**: primary, secondary, error, warning, success, info, neutral
- **Spacing**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- **Typography**: fontSize (xs to 4xl), fontFamily (sans, serif, mono), lineHeight

### Environment Variables

**Frontend does not use .env by default**. Configuration is in `vite.config.ts`.

If you need environment variables:
```typescript
// vite.config.ts
export default defineConfig({
    define: {
        'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080')
    }
});
```

```typescript
// Usage in code
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Security & Authentication

### Authentication Flow

1. **Login**: User submits credentials to `/api/auth/login`
2. **JWT Generation**: Backend generates JWT token (24-hour expiration)
3. **Token Storage**: Frontend stores token (localStorage/sessionStorage)
4. **Token Usage**: Frontend includes token in `Authorization` header
5. **Token Renewal**: Backend auto-renews if within 5 days of expiration
6. **Token Validation**: Backend validates token on each request

### JWT Configuration

**File**: `api/platform/src/main/resources/application.yml`

```yaml
platform:
  jwt:
    token-expiration: PT24H  # 24 hours
    renew-before: P5D         # Renew if expiring within 5 days
```

### Security Configuration

**File**: `api/platform/src/main/java/com/platform/api/platform/config/SecurityConfig.java`

**Key Features**:
- Stateless session management
- JWT-based authentication
- CORS configuration
- Public endpoints: `/public/**`, `/error`
- Custom authentication entry point
- Custom access denied handler

**Filter Chain**:
```
Platform Header Filter
    ↓
JWT Check Filter
    ↓
Spring Security Filter Chain
    ↓
Controller
```

### CORS Configuration

**Allowed Origins** (configurable):
- http://localhost:3000
- https://dev.platform.go.kr

**Allowed Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
**Allowed Headers**: Authorization, Content-Type, X-Requested-With
**Exposed Headers**: Authorization
**Credentials**: true
**Max Age**: 3600 seconds

### Getting Current User

**Backend**:
```java
// In controller or service
AuthUser currentUser = UserAccountHolder.get();
Long userId = currentUser.getId();
String username = currentUser.getUsername();
List<String> roles = currentUser.getRoles();
```

**Frontend**:
```typescript
// Store user in Jotai atom after login
import { userAtom } from '@/store/user';
import { useAtom } from 'jotai';

function useAuth() {
    const [user, setUser] = useAtom(userAtom);

    const login = async (credentials: LoginRequest) => {
        const response = await loginApi(credentials);
        const { token, user } = response.data.data;

        // Store token
        localStorage.setItem('token', token);

        // Store user
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return { user, login, logout };
}
```

### Role-Based Access Control

**Roles** (defined in `user_role` table):
- ADMIN - Full system access
- MANAGER - Management functions
- USER - Basic user access
- VIEWER - Read-only access

**Authorization Annotations**:
```java
// Require authentication
@PreAuthorize("isAuthenticated()")
@GetMapping("/profile")
public ApiResponse<UserResponse> getProfile() { }

// Require specific role
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public ApiResponse<Void> delete(@PathVariable Long id) { }

// Require any of multiple roles
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@PutMapping("/{id}")
public ApiResponse<ExampleResponse> update() { }

// Custom expression
@PreAuthorize("@securityService.canAccessResource(#id)")
@GetMapping("/{id}")
public ApiResponse<ResourceResponse> getResource(@PathVariable Long id) { }
```

### API Security Best Practices

1. **Always validate input**: Use `@Valid` and Jakarta Bean Validation
2. **Sanitize user input**: Prevent XSS and SQL injection
3. **Use prepared statements**: jOOQ and MyBatis handle this automatically
4. **Limit file uploads**: Max 3000MB (configured in `application-web-base.yml`)
5. **Log security events**: Authentication failures, authorization denials
6. **Use HTTPS in production**: Configure reverse proxy (nginx, Apache)
7. **Rotate JWT secret**: Use environment variable, rotate periodically
8. **Implement rate limiting**: Consider adding rate limiting for public endpoints

---

## Important File Locations

### Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| Root build | `/home/user/platform-service-master/build.gradle` | Gradle root configuration |
| Settings | `/home/user/platform-service-master/settings.gradle` | Module configuration |
| Docker Compose | `/home/user/platform-service-master/docker-compose.yml` | MySQL container setup |
| API config | `/home/user/platform-service-master/api/platform/src/main/resources/application.yml` | API server configuration |
| Batch config | `/home/user/platform-service-master/batch/platform/src/main/resources/application.yml` | Batch server configuration |
| Web base config | `/home/user/platform-service-master/common/web/src/main/resources/application-web-base.yml` | Web layer configuration |
| Datasource config | `/home/user/platform-service-master/datasource/base/src/main/resources/application-datasource-base.yml` | Database configuration |
| Frontend package | `/home/user/platform-service-master/front/platform/package.json` | NPM dependencies |
| Vite config | `/home/user/platform-service-master/front/platform/vite.config.ts` | Vite build configuration |
| Orval config | `/home/user/platform-service-master/front/platform/config/orval.config.ts` | API code generation |
| Tailwind config | `/home/user/platform-service-master/front/platform/tailwind.config.ts` | Tailwind CSS setup |

### Application Entry Points

| Component | Location | Port |
|-----------|----------|------|
| API Server | `/home/user/platform-service-master/api/platform/src/main/java/com/platform/api/platform/PlatformApiApplication.java` | 8080 |
| Batch Server | `/home/user/platform-service-master/batch/platform/src/main/java/com/platform/batch/platform/SpringPlatformBatchApplication.java` | 9091 |
| Frontend App | `/home/user/platform-service-master/front/platform/src/main.tsx` | 3000 |

### Key Configuration Classes

| Class | Location | Purpose |
|-------|----------|---------|
| Security Config | `/home/user/platform-service-master/api/platform/src/main/java/com/platform/api/platform/config/SecurityConfig.java` | Security & JWT setup |
| jOOQ Config | `/home/user/platform-service-master/datasource/base/src/main/java/com/platform/datasource/base/config/JooqConfig.java` | jOOQ DSL configuration |
| Swagger Config | `/home/user/platform-service-master/common/web/src/main/java/com/platform/common/web/config/SwaggerConfig.java` | OpenAPI documentation |
| Custom Generator | `/home/user/platform-service-master/common/base/src/main/java/com/platform/common/base/jooq/CustomGeneratorStrategy.java` | jOOQ naming strategy |

### Database Files

| Type | Location | Purpose |
|------|----------|---------|
| Migrations | `/home/user/platform-service-master/datasource/base/flyway/` | Flyway SQL migrations |
| MyBatis Mappers | `/home/user/platform-service-master/datasource/base/src/main/resources/mybatis-mapper/` | Complex SQL queries |
| jOOQ Generated | `/home/user/platform-service-master/datasource/base/src/generated/` | Auto-generated jOOQ code (gitignored) |

### Frontend Files

| Type | Location | Purpose |
|------|----------|---------|
| Entry Point | `/home/user/platform-service-master/front/platform/src/main.tsx` | React app entry |
| Router | `/home/user/platform-service-master/front/platform/src/router/` | Route definitions |
| Components | `/home/user/platform-service-master/front/platform/src/components/` | Reusable components |
| Views | `/home/user/platform-service-master/front/platform/src/views/` | Page components |
| API Hooks | `/home/user/platform-service-master/front/platform/src/api/` | Generated API hooks (gitignored) |
| Types | `/home/user/platform-service-master/front/platform/src/model/` | Generated TypeScript types (gitignored) |
| Store | `/home/user/platform-service-master/front/platform/src/store/` | Jotai atoms |
| Utils | `/home/user/platform-service-master/front/platform/src/util/` | Utilities (HTTP, helpers) |
| Design System | `/home/user/platform-service-master/front/platform/src/constants/design/` | Design tokens |

---

## Troubleshooting & Gotchas

### Common Issues

#### 1. jOOQ Classes Not Found

**Symptom**: Compilation errors for `JUser`, `UserEntity`, etc.

**Cause**: jOOQ generated code is gitignored and missing.

**Solution**:
```bash
./gradlew generateJooq
```

#### 2. Flyway Migration Failed

**Symptom**: Flyway migration fails with "out of order" error.

**Cause**: New migration has an earlier timestamp than already-applied migrations.

**Solution**:
```bash
# Option 1: Allow out-of-order (dev only)
# Already configured in build.gradle: outOfOrder = true

# Option 2: Repair metadata
./gradlew flywayRepair

# Option 3: Clean and re-migrate (DESTRUCTIVE)
./gradlew flywayClean flywayMigrate generateJooq
```

#### 3. Frontend API Hooks Not Generated

**Symptom**: Import errors for API hooks in `src/api/`.

**Cause**: API code not generated or backend not running.

**Solution**:
```bash
# 1. Ensure backend is running
./gradlew :api-platform:bootRun

# 2. In another terminal, generate API code
cd front/platform
yarn orval-fix
```

#### 4. MySQL Connection Refused

**Symptom**: `com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure`

**Cause**: MySQL container not running or wrong connection settings.

**Solution**:
```bash
# Check if MySQL is running
docker ps | grep platform-mysql

# If not running, start it
docker-compose up -d

# Check logs
docker logs platform-mysql

# Verify connection settings in application-datasource-base.yml
# jdbcUrl: jdbc:mysql://localhost:3306/store
# username: root
# password: root
```

#### 5. Port Already in Use

**Symptom**: `Port 8080 is already in use` or `Port 3000 is already in use`

**Cause**: Another process is using the port.

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080
# or
netstat -ano | grep 8080

# Kill the process
kill -9 <PID>

# Or change port in configuration
# API: Edit api/platform/src/main/resources/application.yml (server.port)
# Frontend: Edit front/platform/vite.config.ts (server.port)
```

#### 6. Gradle Build Fails with "Could not resolve dependencies"

**Symptom**: Gradle cannot download dependencies.

**Cause**: Network issues, proxy configuration, or repository unavailable.

**Solution**:
```bash
# Clear Gradle cache
./gradlew clean --refresh-dependencies

# Or delete cache manually
rm -rf ~/.gradle/caches/

# Re-run build
./gradlew build
```

#### 7. Frontend Build Fails with "JavaScript heap out of memory"

**Symptom**: `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`

**Cause**: Node.js default memory limit too low.

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or add to package.json scripts
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

#### 8. JWT Token Expired

**Symptom**: Frontend API calls return 401 Unauthorized.

**Cause**: JWT token expired (24-hour lifetime).

**Solution**:
- Re-authenticate (call login endpoint)
- Implement token refresh logic in frontend
- Backend auto-renews token if within 5 days of expiration

#### 9. CORS Error in Frontend

**Symptom**: `Access-Control-Allow-Origin` error in browser console.

**Cause**: Frontend origin not allowed in CORS configuration.

**Solution**:
- Verify `SecurityConfig.java` includes frontend origin (http://localhost:3000)
- Check browser URL matches allowed origin exactly (including port)
- Ensure backend is running and reachable

#### 10. Hot Reload Not Working in Frontend

**Symptom**: Changes to frontend code don't reflect in browser.

**Cause**: Vite HMR configuration or browser cache.

**Solution**:
```bash
# Restart dev server
yarn start

# Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

# Check Vite config for HMR settings
# vite.config.ts should have:
# server: { hmr: true }
```

### Best Practices to Avoid Issues

1. **Always regenerate jOOQ after schema changes**: `./gradlew generateJooq`
2. **Run Orval after backend changes**: `cd front/platform && yarn orval-fix`
3. **Keep Docker containers running**: `docker-compose up -d`
4. **Use consistent Java version**: Java 17+ (Spring Boot 3.x requirement)
5. **Check logs when things fail**: Look at console output, not just error messages
6. **Clean build when in doubt**: `./gradlew clean build`
7. **Verify environment**: Check JDK, Node.js, Yarn, Docker versions
8. **Read the README**: Both root and frontend READMEs have setup instructions

### Performance Optimization Tips

**Backend**:
- Use read-only transactions: `@PlatFormTransactional(readOnly = true)`
- Implement pagination for large datasets
- Add database indexes for frequently queried columns
- Use batch operations for bulk inserts/updates
- Enable query caching when appropriate
- Monitor slow queries with jOOQ logging

**Frontend**:
- Use React Query's caching effectively
- Implement virtual scrolling for long lists
- Lazy load routes with `React.lazy()`
- Optimize bundle size with code splitting (Vite handles this)
- Use `useMemo` and `useCallback` for expensive computations
- Minimize re-renders with proper component structure

### Security Checklist

- [ ] Input validation on all DTOs
- [ ] Parameterized queries (jOOQ/MyBatis handle this)
- [ ] Authorization checks on all sensitive endpoints
- [ ] HTTPS in production
- [ ] JWT secret as environment variable (not in code)
- [ ] Rate limiting for public endpoints
- [ ] File upload validation (type, size, content)
- [ ] SQL injection prevention (use jOOQ/MyBatis, not string concatenation)
- [ ] XSS prevention (escape user input in frontend)
- [ ] CSRF protection (stateless JWT-based auth is immune)

---

## Quick Reference Commands

### Backend

```bash
# Initial setup
docker-compose up -d
./gradlew flywayClean generateJooq
./gradlew :api-platform:bootRun

# Daily development
./gradlew generateJooq                    # After schema changes
./gradlew :api-platform:bootRun           # Run API server
./gradlew :batch-platform:bootRun         # Run batch server
./gradlew test                            # Run tests
./gradlew build                           # Build all modules

# Database
./gradlew flywayMigrate                   # Apply migrations
./gradlew flywayInfo                      # Check migration status
./gradlew flywayClean                     # Clean database (DESTRUCTIVE)
```

### Frontend

```bash
# Initial setup
cd front/platform
yarn install
yarn orval-fix
yarn start

# Daily development
yarn start                                # Dev server
yarn orval-fix                            # Regenerate API code
yarn build                                # Production build
yarn eslint-fix                           # Fix linting
yarn prettier-fix                         # Format code
```

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker logs platform-mysql
docker logs -f platform-mysql             # Follow logs

# Restart MySQL
docker-compose restart
```

---

## Additional Resources

### Documentation URLs

- **Swagger UI**: http://localhost:8080/public/swagger-ui
- **OpenAPI Spec**: http://localhost:8080/api/public/api-docs/json
- **Actuator**: http://localhost:8080/public/platform/actuator
- **Frontend**: http://localhost:3000

### Technology Documentation

- **Spring Boot**: https://docs.spring.io/spring-boot/docs/current/reference/html/
- **jOOQ**: https://www.jooq.org/doc/latest/manual/
- **Flyway**: https://flywaydb.org/documentation/
- **React**: https://react.dev/
- **React Query**: https://tanstack.com/query/latest/docs/framework/react/overview
- **Vite**: https://vite.dev/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Orval**: https://orval.dev/

### Internal Documentation

- **Frontend Guide**: `/home/user/platform-service-master/front/platform/CLAUDE.md`
- **README**: `/home/user/platform-service-master/README.md`

---

## Appendix: Module Dependency Graph

```
api-platform
  └── common-web
        ├── common-core
        │     └── common-base
        └── common-base

batch-platform
  ├── datasource-base
  │     └── common-base
  └── common-base

datasource-base
  └── common-base

common-web
  ├── common-core
  │     └── common-base
  └── common-base

common-core
  └── common-base

common-base
  (no dependencies)
```

---

## Version Information

- **Spring Boot**: 3.4.2
- **Gradle**: 8.10
- **Java**: 17+
- **MySQL**: 8.0.31
- **jOOQ**: 3.19.18
- **Flyway**: 9.22.0
- **React**: 19
- **TypeScript**: 5.8.3
- **Vite**: 7.0.4
- **TailwindCSS**: 4.1.11

---

**End of CLAUDE.md**

This guide should be updated as the project evolves. When making significant architectural changes, update this file accordingly.
