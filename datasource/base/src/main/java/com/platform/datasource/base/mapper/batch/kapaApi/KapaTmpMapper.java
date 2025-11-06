package com.platform.datasource.base.mapper.batch.kapaApi;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface KapaTmpMapper {

    void deleteOfficialPriceTemp();

    void insertOfficialPriceTemp();

    void deleteStandardPriceTemp();

    void insertStandardPriceTemp();

    void insertEmptyOfficialRequest();
}
