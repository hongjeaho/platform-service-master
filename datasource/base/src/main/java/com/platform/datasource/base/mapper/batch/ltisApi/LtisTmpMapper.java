package com.platform.datasource.base.mapper.batch.ltisApi;

import org.apache.ibatis.annotations.Mapper;

import org.apache.ibatis.annotations.Param;
import org.jooq.generated.tables.pojos.LtisTmpEntity;

import java.util.List;

@Mapper
public interface LtisTmpMapper {

    void insertLtisListToTmp(@Param("ltisListApiItems") List<LtisTmpEntity> ltisListApiItems);

    List<Long> getLtisListTmpJudgSeq();

    void updateLtisDetailToTmp(LtisTmpEntity entityList);
}
