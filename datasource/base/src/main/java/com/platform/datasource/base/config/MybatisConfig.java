package com.platform.datasource.base.config;

import com.platform.datasource.base.config.database.PlatFormDatabaseSource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.boot.autoconfigure.SpringBootVFS;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import javax.sql.DataSource;
import java.util.Objects;

import static com.platform.datasource.base.config.database.PlatFormDatabaseSource.PLATFORM_DATASOURCE;


@Configuration
@Import(PlatFormDatabaseSource.class)
@MapperScan(
        basePackages = {"com.platform.datasource.base.mapper"},
        sqlSessionFactoryRef = "platformDomainSqlSessionFactory",
        annotationClass = Mapper.class
)
public class MybatisConfig {
    @Bean
    public SqlSessionFactory platformDomainSqlSessionFactory(
            @Qualifier(PLATFORM_DATASOURCE) final DataSource storeDomainDataSource,
            final ApplicationContext applicationContext
    ) throws Exception {
        final SqlSessionFactoryBean factory = new SqlSessionFactoryBean();

        factory.setDataSource(storeDomainDataSource);
        factory.setVfs(SpringBootVFS.class);
        factory.setTypeAliasesPackage(
                "org.jooq.generated.tables.pojos.**,com.platform.datasource.base.dto.**");
        factory.setConfigLocation(applicationContext.getResource("classpath:mybatis-config.xml"));
        factory.setMapperLocations(
                applicationContext.getResources("classpath:mybatis-mapper/**/*.xml")
        );

        Objects.requireNonNull(factory.getObject())
                .getConfiguration()
                .setMapUnderscoreToCamelCase(true);

        return factory.getObject();
    }
}