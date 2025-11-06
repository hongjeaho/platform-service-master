package com.platform.datasource.base.mapper.batch.kakaoApi;

import org.apache.ibatis.annotations.Mapper;
import org.jooq.generated.tables.pojos.KapaOfficialPriceEntity;
import org.jooq.generated.tables.pojos.KapaStandardPriceEntity;

import java.util.List;

@Mapper
public interface KakaoMapper {

    List<KapaOfficialPriceEntity> getOfficialGeoPointsNeedUpdate();

    List<KapaStandardPriceEntity> getStandardGeoPointsNeedUpdate();

    void updateOfficialGeoPoint(KapaOfficialPriceEntity kapaOfficialPriceEntity);

    void updateStandardGeoPoint(KapaStandardPriceEntity kapaStandardPriceEntity);
}
