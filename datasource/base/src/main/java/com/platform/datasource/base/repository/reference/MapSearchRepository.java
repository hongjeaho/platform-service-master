package com.platform.datasource.base.repository.reference;

import static com.platform.datasource.base.util.condition.JooqListConditionUtil.inIfNotEmpty;
import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;
import static org.jooq.impl.DSL.coalesce;
import static org.jooq.impl.DSL.max;
import static org.jooq.impl.DSL.sum;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.reference.map.ReferencesMapSearch;
import com.platform.datasource.base.dto.reference.map.ReferencesMapSearchCase;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JKapaOfficialPrice;
import org.jooq.generated.tables.JKapaStandardPrice;
import org.jooq.generated.tables.JLtisInfo;
import org.jooq.generated.tables.JLtisPnu;
import org.jooq.generated.tables.JLtisReptInfo;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class MapSearchRepository {

	private final DSLContext dslContext;
	private final JLtisInfo LTIS_INFO = JLtisInfo.LTIS_INFO;
	private final JLtisPnu LTIS_PNU = JLtisPnu.LTIS_PNU;
	private final JKapaOfficialPrice KAPA_OFFICIAL_PRICE = JKapaOfficialPrice.KAPA_OFFICIAL_PRICE;
	private final JKapaStandardPrice KAPA_STANDARD_PRICE = JKapaStandardPrice.KAPA_STANDARD_PRICE;
	private final JLtisReptInfo LTIS_REPT_INFO = JLtisReptInfo.LTIS_REPT_INFO;

	/**
	 * 지도 검색용 사건 정보 Count
	 *
	 * @param search 검색 조건
	 * @return Total Count
	 */
	public Integer findTotalSize(ReferencesMapSearch search) {
		return dslContext.selectCount()
			.from(DSL.select(LTIS_INFO.JUDG_SEQ)
				.from(LTIS_INFO)
				.innerJoin(LTIS_PNU)
				.on(LTIS_INFO.JUDG_SEQ.eq(LTIS_PNU.JUDG_SEQ))
				.leftJoin(KAPA_OFFICIAL_PRICE)
				.on(LTIS_PNU.PNU.eq(KAPA_OFFICIAL_PRICE.PNU))
				.leftJoin(KAPA_STANDARD_PRICE)
				.on(KAPA_OFFICIAL_PRICE.STANDARD_SEQ_NO.eq(KAPA_STANDARD_PRICE.SEQ_NO))
				.leftJoin(LTIS_REPT_INFO)
				.on(LTIS_INFO.JUDG_SEQ.eq(LTIS_REPT_INFO.JUDG_SEQ)
					.and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.eq("L")))
				.where(getCondition(search))
				.groupBy(
					LTIS_INFO.JUDG_SEQ
				)
			)
			.fetchOne(0, Integer.class);
	}


	/**
	 * 지도 검색용 사건 정보를 조회한다.
	 *
	 * @param search 검색 조건
	 * @return 지도 검색 사건 정보 목록
	 */
	public List<ReferencesMapSearchCase> findMapSearchCases(ReferencesMapSearch search) {
		return dslContext
			.select(
				LTIS_INFO.CASE_NO,
				LTIS_INFO.CASE_TITLE,
				LTIS_INFO.ADDRESS,
				LTIS_INFO.BIZ_OPRT_PRICE.as("price"),
				coalesce(sum(LTIS_REPT_INFO.AREA_AMOT), BigDecimal.ZERO).as("area"),
				DSL.groupConcatDistinct(KAPA_OFFICIAL_PRICE.GIMOK_STR).separator(",").as("landCategory"),
				DSL.groupConcatDistinct(KAPA_OFFICIAL_PRICE.YOUNGDO_STR).separator(",").as("usageStatus"),
				DSL.groupConcatDistinct(KAPA_OFFICIAL_PRICE.GIYUK_STR).separator(",").as("zoneType"),
				max(KAPA_OFFICIAL_PRICE.WGS84_X).as("lng"),
				max(KAPA_OFFICIAL_PRICE.WGS84_Y).as("lat"),
				max(KAPA_STANDARD_PRICE.WGS84_X).as("standardLng"),
				max(KAPA_STANDARD_PRICE.WGS84_Y).as("standardLat"),
				max(KAPA_STANDARD_PRICE.JIBUN).as("standardAddress"),
				max(KAPA_STANDARD_PRICE.GAKUKC).as("standardPrice"),
				max(KAPA_STANDARD_PRICE.AREA).as("standardArea")
			)
			.from(LTIS_INFO)
			.innerJoin(LTIS_PNU)
			.on(LTIS_INFO.JUDG_SEQ.eq(LTIS_PNU.JUDG_SEQ))
			.leftJoin(KAPA_OFFICIAL_PRICE)
			.on(LTIS_PNU.PNU.eq(KAPA_OFFICIAL_PRICE.PNU))
			.leftJoin(KAPA_STANDARD_PRICE)
			.on(KAPA_OFFICIAL_PRICE.STANDARD_SEQ_NO.eq(KAPA_STANDARD_PRICE.SEQ_NO))
			.leftJoin(LTIS_REPT_INFO)
			.on(LTIS_INFO.JUDG_SEQ.eq(LTIS_REPT_INFO.JUDG_SEQ)
				.and(LTIS_REPT_INFO.LAND_OBST_KIND_CD.eq("L")))
			.where(getCondition(search))
			.groupBy(
				LTIS_INFO.JUDG_SEQ,
				LTIS_INFO.CASE_NO,
				LTIS_INFO.CASE_TITLE,
				LTIS_INFO.ADDRESS,
				LTIS_INFO.BIZ_OPRT_PRICE
			)
			.offset(search.getPage() * search.getPageSize())
			.limit(search.getPageSize())
			.fetchInto(ReferencesMapSearchCase.class);
	}

	/**
	 * 지도 검색 조건을 생성한다.
	 *
	 * @param search 검색 조건
	 * @return JOOQ Condition
	 */
	private Condition getCondition(ReferencesMapSearch search) {
		return likeIfNotBlank(LTIS_INFO.CASE_NO, search.getKeyword())
			.or(likeIfNotBlank(LTIS_INFO.CASE_TITLE, search.getKeyword())
				.or(likeIfNotBlank(LTIS_INFO.ADDRESS, search.getKeyword())))
			.and(inIfNotEmpty(KAPA_OFFICIAL_PRICE.GIMOK_STR, search.getLandCategory()))
			.and(inIfNotEmpty(KAPA_OFFICIAL_PRICE.YOUNGDO_STR, search.getUsageStatus()))
			.and(inIfNotEmpty(KAPA_OFFICIAL_PRICE.GIYUK_STR, search.getZoneType()));
	}
}