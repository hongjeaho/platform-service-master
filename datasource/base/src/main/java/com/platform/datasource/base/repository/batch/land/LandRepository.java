/*
package com.platform.datasource.base.repository.batch.land;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JLandPrice;
import org.jooq.generated.tables.JLandPriceTmp;
import org.jooq.generated.tables.JLtisDetailApi;
import org.jooq.generated.tables.JPnu;
import org.jooq.generated.tables.pojos.LandPriceTmpEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

import static org.jooq.impl.DSL.*;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class LandRepository {

    private final DSLContext dslContext;
    private final JLtisDetailApi LTIS_DETAIL_API = JLtisDetailApi.LTIS_DETAIL_API;
    private final JLandPrice LAND_PRICE = JLandPrice.LAND_PRICE;
    private final JLandPriceTmp LAND_PRICE_TMP = JLandPriceTmp.LAND_PRICE_TMP;
    private final JPnu PNU = JPnu.PNU;

     //* 공시지가 임시 데이터를 모두 삭제한다.


    public void deleteAllLandPriceTmp() {
        dslContext.deleteFrom(LAND_PRICE_TMP).where(LAND_PRICE_TMP.PNU.isNotNull()).execute();
    }


     //공시지가 API 호출을 위한 데이터를 생성 한다.


    public void insertLandPriceTmp() {
        dslContext.insertInto(LAND_PRICE_TMP)
                .select(select(
                                LTIS_DETAIL_API.JUDG_SEQ
                                , year(ifnull(LTIS_DETAIL_API.RECM_REQ_PRC_DT, LTIS_DETAIL_API.CREATED_TIME)).as("year")
                                , PNU.PNU_
                        )
                                .from(PNU)
                                .leftJoin(LTIS_DETAIL_API).on(PNU.JUDG_SEQ.eq(LTIS_DETAIL_API.JUDG_SEQ))
                                .where(notExists(
                                        selectOne().from(LAND_PRICE).where(LAND_PRICE.JUDG_SEQ.eq(LTIS_DETAIL_API.JUDG_SEQ))
                                ))
                ).execute();
    }

    public List<LandPriceTmpEntity> findPageLandPriceTmp(int page, int pageSize) {
        return dslContext.selectFrom(LAND_PRICE_TMP)
                .offset(page * pageSize)
                .limit(pageSize)
                .fetchInto(LandPriceTmpEntity.class);
    }
}
*/
