package com.platform.datasource.base.mapper.batch.kapaApi;

import com.platform.datasource.base.dto.batch.KapaPriceRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.jooq.generated.tables.pojos.KapaOfficialPriceEntity;
import org.jooq.generated.tables.pojos.KapaStandardPriceEntity;

import java.util.List;

@Mapper
public interface KapaDataMapper {

    List<KapaPriceRequest> selectOfficialPriceRequests(@Param("page") int page, @Param("pageSize") int pageSize);

    List<KapaPriceRequest> selectStandardPriceRequests(@Param("page") int page, @Param("pageSize") int pageSize);

    void insertOfficialPrice(KapaOfficialPriceEntity kapaOfficialPriceEntity);

    void insertStandardPrice(KapaStandardPriceEntity kapaStandardPriceEntity);
}
