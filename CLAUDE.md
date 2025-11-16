# CLAUDE.md - AI Assistant Guide for Platform Service

> **Purpose**: This document provides AI assistants with comprehensive information about this codebase to enable effective collaboration on development tasks.

**Last Updated**: 2025-11-16

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Module Structure](#architecture--module-structure)
3. [Technology Stack](#technology-stack)
4. [Development Environment Setup](#development-environment-setup)
5. [Key Development Workflows](#key-development-workflows)
6. [Coding Conventions & Standards](#coding-conventions--standards)
7. [Common Tasks Reference](#common-tasks-reference)
8. [File Locations Quick Reference](#file-locations-quick-reference)
9. [Important Notes for AI Assistants](#important-notes-for-ai-assistants)

---

## Project Overview

This is a **multi-module Spring Boot platform** for legal/administrative workflows including:
- Land valuation and appraisals (receipt processing)
- Legal deliberations and conclusions
- Opinion management
- Reference materials (decrees, precedents, boards)
- KAPA (Korea Appraisal Board) data integration
- Administrative workflows and reporting

**Project Type**: Full-stack monorepo with Spring Boot backend, React frontend, and batch processing

**Primary Language**: Java (backend), TypeScript (frontend)

**Database**: MySQL 8.0.31

---

## Architecture & Module Structure

### Module Dependency Graph

```
api/platform ──┐
               ├─→ common-web ──→ common-core ──┐
batch/platform ┘                                ├─→ common-base
                                                │
                         datasource-base ───────┘
```

### Module Descriptions

#### Infrastructure Modules (Shared Libraries)

**`common/base`** - Foundation layer
- Package: `com.platform.common.base`
- Purpose: Core utilities, authentication, DTOs, jOOQ configuration
- Key components:
  - Custom jOOQ types (JSON, UUID handling)
  - Base DTOs and pagination
  - JWT token utilities
  - Security configuration
  - OpenAPI documentation setup

**`common/core`** - Business logic layer
- Package: `com.platform.common.core`
- Depends on: `common-base`, `datasource-base`
- Purpose: Shared business services
- Key components:
  - PDF generation service (iText)
  - File upload/download services
  - Business logic shared across applications

**`common/web`** - Web layer components
- Package: `com.platform.common.web`
- Depends on: `common-core`
- Purpose: REST API conventions, Spring MVC/WebFlux configuration
- Key components:
  - API response masking (AOP)
  - Auditing support
  - Caching configuration
  - Global exception handling
  - Security filters
  - Actuator configuration

#### Data Layer

**`datasource/base`** - Database access layer
- Package: `com.platform.datasource.base`
- Depends on: `common-base`
- Purpose: All database interactions
- Key components:
  - jOOQ code generation (`src/generated/`)
  - Flyway migrations (`flyway/V*.sql`)
  - MyBatis mappers (`src/main/resources/mybatis-mapper/`)
  - Repository implementations
  - Database configuration

#### Application Modules (Executable)

**`api/platform`** - REST API Server
- Package: `com.platform.api.platform`
- Port: 8080 (default)
- Depends on: `common-web` (transitively includes all)
- Purpose: Main web application serving REST API and frontend
- Key components:
  - Controllers organized by domain (receipt, board, deliberation, etc.)
  - OpenAPI documentation at `/api/public/api-docs/json`
  - Swagger UI at `/public/swagger-ui`
  - Actuator endpoints at `/public/platform/actuator`

**`batch/platform`** - Spring Batch Jobs
- Package: `com.platform.batch.platform`
- Depends on: `common-core`, `datasource-base`
- Purpose: Background processing and data integration
- Key jobs:
  - KAPA data synchronization
  - Land price data processing
  - Geographic data transformations

#### Frontend

**`front/platform`** - React SPA
- Framework: React 19 + TypeScript
- Build: Vite 7
- Port: 3000 (dev server)
- Purpose: User interface for the platform
- Architecture:
  - Auto-generated API client (Orval from OpenAPI)
  - Component-driven design
  - Domain-organized structure

---

## Technology Stack

### Backend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Spring Boot | 3.4.2 | Core framework |
| Language | Java | 17+ | Primary language |
| Build Tool | Gradle | 8.10 | Build automation |
| Database Query | jOOQ | 3.19.18 | Type-safe SQL |
| Secondary ORM | MyBatis | 3.0.4 | Complex queries |
| Database | MySQL | 8.0.31 | Data persistence |
| Migrations | Flyway | 9.22.0 | Schema versioning |
| Security | Spring Security + JWT | - | Authentication/Authorization |
| API Docs | SpringDoc OpenAPI | - | Swagger/OpenAPI generation |
| PDF | iText | - | PDF generation |
| Monitoring | Actuator + Prometheus | - | Metrics and health |
| Batch | Spring Batch | - | Background jobs |
| Reactive | Spring WebFlux | - | Async operations |
| Caching | Caffeine | - | In-memory cache |

### Frontend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 19.1.0 | UI library |
| Language | TypeScript | 5.8.3 | Type safety |
| Build Tool | Vite | 7.0.4 | Dev server & bundler |
| Styling | TailwindCSS | 4.1.11 | Utility-first CSS |
| Server State | TanStack React Query | 5.83.0 | Data fetching/caching |
| Client State | Jotai | 2.12.5 | Atomic state management |
| Routing | React Router | 6 | SPA routing |
| Forms | React Hook Form | 7.60.0 | Form handling |
| HTTP Client | Axios | 1.11.0 | API requests |
| API Codegen | Orval | 7.11.2 | OpenAPI → TypeScript |
| Maps | React Kakao Maps SDK | - | Map integration |
| Icons | Lucide React | - | Icon library |

---

## Development Environment Setup

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18+ (for frontend)
- **Yarn**: Package manager
- **Docker**: For MySQL (optional, can use local MySQL)

### Initial Setup Steps

#### 1. Database Setup

**Option A: Docker (Recommended)**
```bash
# Start MySQL container
docker-compose up -d

# Verify MySQL is running
docker ps | grep mysql
```

**MySQL Connection Info:**
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `root`
- Database: `store`

#### 2. Backend Setup

**First time only** (clean DB and generate jOOQ):
```bash
./gradlew flywayClean generateJooq
```

**After schema changes** (regenerate jOOQ only):
```bash
./gradlew generateJooq
```

**Build all modules:**
```bash
./gradlew build
```

**Run API server:**
```bash
./gradlew :api-platform:bootRun
```
Or run `PlatformApiApplication.java` from your IDE.

API will be available at: `http://localhost:8080`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd front/platform

# Install dependencies
yarn install

# Generate API client (requires running backend)
yarn orval-fix

# Start dev server
yarn start
```

Frontend will be available at: `http://localhost:3000`

### Verification

1. **Backend**: Visit `http://localhost:8080/public/swagger-ui` - Should see Swagger UI
2. **Frontend**: Visit `http://localhost:3000` - Should see login page
3. **Health Check**: `http://localhost:8080/public/platform/actuator/health`

---

## Key Development Workflows

### Workflow 1: Adding a New Database Table

**Required when**: Creating new domain entities

**Steps**:

1. **Create Flyway Migration**
   ```sql
   -- Location: datasource/base/flyway/V{timestamp}__{description}.sql
   -- Naming: V20251116120000__add_new_table.sql

   CREATE TABLE new_table (
       id BIGINT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. **Regenerate jOOQ Classes**
   ```bash
   ./gradlew generateJooq
   ```
   This generates:
   - `NewTable.java` - Table reference
   - `NewTableRecord.java` - Record class
   - `NewTablePojo.java` - POJO class
   - `NewTableDao.java` - DAO class

3. **Create Repository** (if needed)
   ```java
   // Location: datasource/base/src/main/java/com/platform/datasource/base/repository/
   @Repository
   public class NewTableRepository {
       private final DSLContext dsl;

       // Implement data access methods using jOOQ
   }
   ```

4. **Verify**
   - Check `datasource/base/src/generated/` for new classes
   - Run tests if available
   - Restart backend application

### Workflow 2: Adding a New REST API Endpoint

**Required when**: Creating new API functionality

**Steps**:

1. **Create/Update Controller**
   ```java
   // Location: api/platform/src/main/java/com/platform/api/platform/controller/
   @RestController
   @RequestMapping("/api/v1/new-endpoint")
   @Tag(name = "New Endpoint", description = "New endpoint API")
   public class NewEndpointController {

       @GetMapping
       @Operation(summary = "Get items", description = "Retrieve list of items")
       public ResponseEntity<List<ItemDto>> getItems() {
           // Implementation
       }
   }
   ```

2. **Add Service Layer** (if needed)
   ```java
   // Location: common/core/src/main/java/com/platform/common/core/service/
   @Service
   public class NewService {
       // Business logic
   }
   ```

3. **Test Backend**
   - Restart API server
   - Visit Swagger UI: `http://localhost:8080/public/swagger-ui`
   - Verify new endpoint appears
   - Test endpoint manually

4. **Regenerate Frontend API Client**
   ```bash
   cd front/platform
   yarn orval-fix
   ```
   This generates:
   - React Query hooks in `src/api/new-endpoint/`
   - TypeScript types in `src/model/`

5. **Use in Frontend**
   ```typescript
   // In a React component
   import { useGetItems } from '@/api/new-endpoint/new-endpoint';

   function MyComponent() {
     const { data, isLoading } = useGetItems();
     // Use data
   }
   ```

### Workflow 3: Making Frontend Changes

**Required when**: Updating UI or adding features

**Steps**:

1. **Identify Component Location**
   - Domain-specific: `src/components/{domain}/` (e.g., `receipt`, `board`)
   - Shared UI: `src/components/common/`
   - Pages: `src/views/`

2. **Use Design System Constants**
   ```typescript
   import { COLORS } from '@/constants/design/colors';
   import { FONT_FAMILY } from '@/constants/design/typography';

   // Use in Tailwind classes or inline styles
   ```

3. **Integrate API Calls**
   ```typescript
   // Auto-generated hooks from Orval
   import { useGetReceipts } from '@/api/receipt/receipt';

   function ReceiptList() {
     const { data, isLoading, error } = useGetReceipts();

     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;

     return <div>{/* Render data */}</div>;
   }
   ```

4. **State Management**
   - **Server state**: Use React Query (auto-generated hooks)
   - **Client state**: Use Jotai atoms in `src/store/`

   ```typescript
   // src/store/user.ts
   import { atom } from 'jotai';

   export const userAtom = atom({ id: null, name: '' });

   // In component
   import { useAtom } from 'jotai';
   const [user, setUser] = useAtom(userAtom);
   ```

5. **Code Quality**
   ```bash
   # Before committing
   yarn eslint-fix
   yarn prettier-fix
   ```

### Workflow 4: Running Batch Jobs

**Required when**: Executing background processing

**Steps**:

1. **Locate Job Configuration**
   ```
   batch/platform/src/main/java/com/platform/batch/platform/job/
   ```

2. **Run Batch Application**
   ```bash
   ./gradlew :batch-platform:bootRun
   ```
   Or run from IDE with specific job parameters.

3. **Monitor Execution**
   - Check logs for job status
   - Verify database changes
   - Check Spring Batch metadata tables

### Workflow 5: Updating Dependencies

**Backend (Gradle)**:
```bash
# Update version in build.gradle
./gradlew build --refresh-dependencies

# Regenerate jOOQ if datasource version changed
./gradlew generateJooq
```

**Frontend (Yarn)**:
```bash
cd front/platform
yarn upgrade <package-name>
# or for interactive upgrade
yarn upgrade-interactive
```

---

## Coding Conventions & Standards

### Backend (Java)

#### Package Naming
```
com.platform.{module-type}.{module-name}.{layer}

Examples:
- com.platform.api.platform.controller
- com.platform.common.core.service
- com.platform.datasource.base.repository
```

#### Controller Conventions
```java
@RestController
@RequestMapping("/api/v1/{domain}")
@Tag(name = "Domain", description = "Domain API") // OpenAPI
@RequiredArgsConstructor // Lombok constructor injection
public class DomainController {

    private final DomainService service;

    // Read operations can use separate ReadController
    @GetMapping("/{id}")
    @Operation(summary = "Get item by ID")
    public ResponseEntity<ItemDto> getById(@PathVariable Long id) {
        // Implementation
    }
}
```

#### Service Layer
```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // Default read-only
public class DomainService {

    private final DomainRepository repository;

    @Transactional // Override for write operations
    public void create(CreateDto dto) {
        // Implementation
    }
}
```

#### Repository Layer (jOOQ)
```java
@Repository
@RequiredArgsConstructor
public class DomainRepository {

    private final DSLContext dsl;

    public List<DomainPojo> findAll() {
        return dsl.selectFrom(DOMAIN_TABLE)
                  .fetchInto(DomainPojo.class);
    }

    public Optional<DomainPojo> findById(Long id) {
        return dsl.selectFrom(DOMAIN_TABLE)
                  .where(DOMAIN_TABLE.ID.eq(id))
                  .fetchOptionalInto(DomainPojo.class);
    }
}
```

#### DTOs
- Use records for immutable DTOs (Java 17+)
- Validation annotations from `jakarta.validation.constraints.*`
- OpenAPI annotations for documentation

```java
public record CreateRequestDto(
    @NotBlank @Schema(description = "Name", example = "Example")
    String name,

    @Min(0) @Schema(description = "Amount", example = "1000")
    Integer amount
) {}
```

### Frontend (TypeScript/React)

#### Component Organization
```typescript
// Functional components with hooks
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // Hooks at top
  const { data } = useGetData();
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {
    // Implementation
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// Props interface
interface MyComponentProps {
  prop1: string;
  prop2?: number; // Optional
}
```

#### File Naming
- Components: `PascalCase.tsx` (e.g., `ReceiptList.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Constants: `SCREAMING_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

#### Import Order
```typescript
// 1. React/External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. API/Models
import { useGetReceipts } from '@/api/receipt/receipt';
import type { Receipt } from '@/model';

// 3. Components
import { Button } from '@/components/common/Button';

// 4. Hooks/Utils
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/util/date';

// 5. Constants/Types
import { COLORS } from '@/constants/design/colors';
import type { CustomType } from '@/types';

// 6. Styles (if any)
import './styles.css';
```

#### Styling Conventions
- **Prefer TailwindCSS** utility classes
- Use **design system constants** for colors/fonts
- Responsive design: Mobile-first approach

```typescript
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold" style={{ color: COLORS.primary }}>
    Title
  </h1>
</div>
```

### Database Conventions

#### Migration File Naming
```
V{timestamp}__{description}.sql

Examples:
V20251116120000__add_receipt_table.sql
V20251116130000__add_index_to_user_email.sql
```

#### SQL Standards
- Use `utf8mb4` charset
- InnoDB engine for transactions
- Explicit naming for indexes and foreign keys
- Use `BIGINT` for IDs (AUTO_INCREMENT)
- Use `DATETIME` for timestamps (default `CURRENT_TIMESTAMP`)
- NOT NULL with DEFAULT where appropriate

```sql
CREATE TABLE example (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Configuration Conventions

- **Never commit credentials**: Use placeholders in versioned config
- **Environment-specific**: Use Spring profiles (`application-{profile}.yml`)
- **Hierarchical**: Base config in module, overrides in application
- **Frontend env**: `.env.{environment}` files

---

## Common Tasks Reference

### Task: Add Authentication to New Endpoint

```java
// In controller
@PreAuthorize("hasRole('ADMIN')") // Requires ADMIN role
@PostMapping
public ResponseEntity<Void> adminOnlyEndpoint() {
    // Implementation
}

// Get current user
@GetMapping("/me")
public ResponseEntity<UserDto> getCurrentUser(
    @AuthenticationPrincipal UserDetails userDetails
) {
    // userDetails contains current user
}
```

### Task: Add Custom Validation

```java
// Create custom validator
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CustomValidator.class)
public @interface CustomValidation {
    String message() default "Invalid value";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Validator implementation
public class CustomValidator implements ConstraintValidator<CustomValidation, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // Validation logic
        return value != null && value.matches("pattern");
    }
}
```

### Task: Add Caching

```java
// In service method
@Cacheable(value = "domainCache", key = "#id")
public DomainDto getById(Long id) {
    // Expensive operation
    return repository.findById(id);
}

@CacheEvict(value = "domainCache", key = "#id")
public void update(Long id, UpdateDto dto) {
    // Update operation
}
```

### Task: File Upload Handling

**Backend:**
```java
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<FileDto> uploadFile(
    @RequestParam("file") MultipartFile file
) {
    // Use FileService from common-core
    return ResponseEntity.ok(fileService.upload(file));
}
```

**Frontend:**
```typescript
// Auto-generated by Orval with custom form data handler
import { useUploadFile } from '@/api/file/file';

function FileUploader() {
  const upload = useUploadFile();

  const handleUpload = (file: File) => {
    upload.mutate({ file });
  };

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}
```

### Task: Add New Route (Frontend)

```typescript
// In src/router/index.tsx
import { NewView } from '@/views/NewView';

// Add to routes configuration
{
  path: '/new-path',
  element: <NewView />,
}
```

### Task: Generate PDF Report

```java
// Use PDFService from common-core
@Service
@RequiredArgsConstructor
public class ReportService {

    private final PDFService pdfService;

    public byte[] generateReport(ReportData data) {
        // PDF generation logic using iText
        return pdfService.generate(data);
    }
}
```

### Task: Add MyBatis Mapper (Complex Query)

**Mapper Interface:**
```java
// Location: datasource/base/src/main/java/com/platform/datasource/base/mapper/
@Mapper
public interface CustomMapper {
    List<ResultDto> complexQuery(@Param("param1") String param1);
}
```

**Mapper XML:**
```xml
<!-- Location: datasource/base/src/main/resources/mybatis-mapper/CustomMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.platform.datasource.base.mapper.CustomMapper">

    <select id="complexQuery" resultType="ResultDto">
        SELECT
            a.id,
            a.name,
            COUNT(b.id) as count
        FROM table_a a
        LEFT JOIN table_b b ON a.id = b.a_id
        WHERE a.status = #{param1}
        GROUP BY a.id, a.name
    </select>

</mapper>
```

---

## File Locations Quick Reference

### Backend

| Purpose | Location |
|---------|----------|
| API Controllers | `api/platform/src/main/java/com/platform/api/platform/controller/` |
| Batch Jobs | `batch/platform/src/main/java/com/platform/batch/platform/job/` |
| Business Services | `common/core/src/main/java/com/platform/common/core/service/` |
| Repositories | `datasource/base/src/main/java/com/platform/datasource/base/repository/` |
| Database Migrations | `datasource/base/flyway/` |
| Generated jOOQ | `datasource/base/src/generated/` |
| MyBatis Mappers | `datasource/base/src/main/resources/mybatis-mapper/` |
| API Config | `api/platform/src/main/resources/application.yml` |
| Security Config | `common/base/src/main/java/com/platform/common/base/config/` |
| JWT Utils | `common/web/src/main/java/com/platform/common/web/security/` |
| Tests | `*/src/test/java/` (in each module) |

### Frontend

| Purpose | Location |
|---------|----------|
| Auto-generated API Hooks | `front/platform/src/api/` |
| Auto-generated Models | `front/platform/src/model/` |
| Domain Components | `front/platform/src/components/{domain}/` |
| Shared Components | `front/platform/src/components/common/` |
| Page Views | `front/platform/src/views/` |
| Router Config | `front/platform/src/router/` |
| Layouts | `front/platform/src/layout/` |
| State (Jotai) | `front/platform/src/store/` |
| Custom Hooks | `front/platform/src/hooks/` |
| Utilities | `front/platform/src/util/` |
| Design System | `front/platform/src/constants/design/` |
| Type Definitions | `front/platform/src/types/` |
| Orval Config | `front/platform/orval.config.ts` |

### Configuration

| Purpose | Location |
|---------|----------|
| Gradle Build | `build.gradle` (root and modules) |
| Gradle Settings | `settings.gradle` |
| Docker Compose | `docker-compose.yml` |
| Flyway Config | `datasource/base/build.gradle` (flyway block) |
| jOOQ Config | `datasource/base/build.gradle` (jooq block) |
| Frontend Package | `front/platform/package.json` |
| TypeScript Config | `front/platform/tsconfig.json` |
| Vite Config | `front/platform/vite.config.ts` |
| Tailwind Config | `front/platform/tailwind.config.ts` |
| ESLint Config | `front/platform/eslint.config.js` |
| Prettier Config | `front/platform/.prettierrc` |

---

## Important Notes for AI Assistants

### Critical Patterns to Follow

1. **ALWAYS regenerate jOOQ after database changes**
   ```bash
   ./gradlew generateJooq
   ```
   Missing this step will cause compilation errors.

2. **ALWAYS regenerate frontend API client after backend API changes**
   ```bash
   cd front/platform && yarn orval-fix
   ```
   This requires the backend server to be running.

3. **Use jOOQ for standard CRUD, MyBatis for complex queries**
   - jOOQ: Type-safe, refactoring-friendly, good for most queries
   - MyBatis: Dynamic SQL, complex joins, reporting queries

4. **Never commit generated code**
   - jOOQ classes in `datasource/base/src/generated/` - gitignored
   - Frontend API in `front/platform/src/api/` and `src/model/` - gitignored

5. **Profile-based configuration**
   - Local development: Use `local` profile (default)
   - Configuration hierarchy: module config → application config → profile config

6. **OpenAPI-first API development**
   - Document APIs with `@Operation`, `@Schema`, `@Tag` annotations
   - Frontend types are automatically generated from OpenAPI spec
   - Keep API contracts stable (versioning: `/api/v1/...`)

### Common Pitfalls to Avoid

1. **Database Connection Issues**
   - Ensure MySQL is running: `docker ps | grep mysql`
   - Check credentials in `application-datasource-base-dev.yml`
   - Verify database exists: `mysql -u root -proot -e "SHOW DATABASES;"`

2. **jOOQ Generation Failures**
   - Ensure Flyway migrations are applied first
   - Check MySQL connection settings in `build.gradle`
   - Verify generator strategy class exists

3. **Frontend Build Errors**
   - Clear Vite cache: `rm -rf front/platform/.vite`
   - Regenerate API client if type errors occur
   - Check for ESLint/TypeScript errors: `yarn lint`

4. **Circular Dependencies**
   - Common modules should not depend on api/batch modules
   - Datasource should only depend on common-base
   - Follow dependency graph strictly

5. **File Upload Size Limits**
   - Backend max: 3GB (configured in `application-web-base.yml`)
   - Ensure frontend doesn't exceed this limit
   - Consider chunked uploads for large files

### Performance Considerations

1. **Database Queries**
   - Use pagination for list endpoints
   - Add appropriate indexes (in Flyway migrations)
   - Monitor query performance with Actuator metrics

2. **Caching Strategy**
   - Use `@Cacheable` for frequently accessed, rarely changed data
   - Consider cache eviction strategy (`@CacheEvict`)
   - Monitor cache hit rates

3. **Frontend Performance**
   - React Query caches API responses automatically
   - Use code splitting for large views
   - Optimize images and assets
   - Check bundle size: `yarn build` and analyze output

### Security Best Practices

1. **Authentication & Authorization**
   - JWT tokens expire after 24 hours
   - Renewal period: 5 days before expiration
   - Use `@PreAuthorize` for method-level security

2. **Input Validation**
   - Always validate DTOs with Jakarta Validation
   - Sanitize user input to prevent XSS
   - Use parameterized queries (jOOQ/MyBatis handles this)

3. **Sensitive Data**
   - Never log passwords or tokens
   - Use masking for sensitive API responses (configured in common-web)
   - Keep credentials in environment-specific configs (not committed)

### Testing Guidelines

1. **Backend Testing**
   - Repository tests: Test with actual database (or H2)
   - Service tests: Mock repositories, test business logic
   - Controller tests: Use MockMvc/WebTestClient

2. **Frontend Testing**
   - Component tests: React Testing Library
   - API mocking: MSW (Mock Service Worker) recommended
   - E2E tests: Consider Playwright/Cypress for critical flows

### Multi-Module Build Optimization

```bash
# Build specific module only
./gradlew :api-platform:build

# Skip tests for faster builds
./gradlew build -x test

# Continuous build (watches for changes)
./gradlew -t :api-platform:classes

# Dependency report
./gradlew dependencies

# Clean all builds
./gradlew clean
```

### Debugging Tips

1. **Backend Debugging**
   - Enable debug logging: Set `logging.level.com.platform=DEBUG` in config
   - Use Spring Boot DevTools for hot reload
   - Actuator endpoints provide runtime info

2. **Frontend Debugging**
   - React DevTools browser extension
   - React Query DevTools (included in dev mode)
   - Vite's fast HMR preserves state during development
   - Check Network tab for API call details

3. **Database Debugging**
   - jOOQ logs SQL queries when DEBUG level enabled
   - Use MySQL Workbench or CLI to inspect data
   - Check Flyway history: `SELECT * FROM flyway_schema_history;`

### IDE Recommendations

**Backend (IntelliJ IDEA preferred):**
- Install Lombok plugin
- Enable annotation processing
- Use Gradle wrapper (don't use IDE's bundled Gradle)
- Configure code style: Google Java Style Guide

**Frontend (VS Code preferred):**
- Extensions: ESLint, Prettier, Tailwind CSS IntelliSense
- Configure auto-format on save
- Use TypeScript language server

### API Documentation Access

- **Swagger UI**: `http://localhost:8080/public/swagger-ui`
- **OpenAPI JSON**: `http://localhost:8080/api/public/api-docs/json`
- **Actuator**: `http://localhost:8080/public/platform/actuator`

### Monitoring & Observability

- **Health Check**: `/public/platform/actuator/health`
- **Prometheus Metrics**: `/public/platform/actuator/prometheus`
- **Grafana**: `http://localhost:3001` (if configured via docker-compose)

---

## Workflow Checklist for AI Assistants

### Before Making Changes

- [ ] Understand which module(s) are affected
- [ ] Check if database changes are needed (Flyway migration)
- [ ] Verify Spring profile/environment
- [ ] Review existing patterns in similar code

### After Backend Changes

- [ ] Run `./gradlew generateJooq` if database changed
- [ ] Rebuild affected modules: `./gradlew build`
- [ ] Verify OpenAPI docs updated (Swagger UI)
- [ ] Test endpoints manually or with tests
- [ ] Run `yarn orval-fix` in frontend if API contract changed

### After Frontend Changes

- [ ] Run `yarn eslint-fix` and `yarn prettier-fix`
- [ ] Verify TypeScript compilation: `yarn tsc`
- [ ] Test in browser (UI, functionality, responsive)
- [ ] Check console for errors/warnings

### Before Committing

- [ ] Code follows conventions documented here
- [ ] No sensitive data in code/config
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if public API changed)
- [ ] Build succeeds: `./gradlew build && cd front/platform && yarn build`

---

## Additional Resources

### Korean Language Notes

This project appears to be for Korean users/administrators:
- Database content may be in Korean (utf8mb4 supports Korean characters)
- Comments in code may be in Korean
- UI labels and messages should be in Korean

### Business Domain Context

Understanding the domain helps make better decisions:
- **Receipt (접수)**: Initial submission/registration of appraisal requests
- **Deliberation (심의)**: Review and deliberation process
- **Conclusion (결의)**: Final decision/approval
- **KAPA Integration**: Korea Appraisal Board data synchronization
- **Land Prices (지가)**: Land valuation data management
- **Decrees/Precedents (법령/판례)**: Legal reference materials

### Support & Documentation

- **README.md**: Setup instructions (Korean)
- **Swagger UI**: Interactive API documentation
- **This file (CLAUDE.md)**: Comprehensive AI assistant guide

---

## Changelog

| Date | Changes |
|------|---------|
| 2025-11-16 | Initial creation - comprehensive analysis of platform-service repository |

---

**End of CLAUDE.md**

*This document should be updated whenever significant architectural changes occur.*
