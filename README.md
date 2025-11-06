# API 초기화

## Docker install

### Mysql

```
docker-compose up -d
```

### MySQL 접속 정보

* host : localhost
* port : 3306
* username : root
* password : root
* database : store

## Data Migration (flyway)

최소 실행시 전체 데이터베이스 초기화 및 jooq 스키마 생성 필요

```
./gradlew flywayClean generateJooq
```

이후 부터 generateJooq 실행 하여 DB 스키마만 및 jooq 최신화.

```
./gradlew generateJooq
```

# front 초기화

## install

`./front/ltis`로 이동하여 아래 명령어 실행

```
yarn install
```

## api 및 model 생성

api 서버를 실행 하고 아래 명령어 실행

```
yarn orval-fix
```

## 실행

```
yarn start
```