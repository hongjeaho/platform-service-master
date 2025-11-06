package com.platform.datasource.base.mapper.batch.ltisApi;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.jooq.generated.tables.pojos.LtisOwnrInfoEntity;
import org.jooq.generated.tables.pojos.LtisRecmInfoEntity;
import org.jooq.generated.tables.pojos.LtisReptInfoEntity;
import org.jooq.generated.tables.pojos.LtisReptOwnrInfoEntity;

import java.util.List;

@Mapper
public interface LtisDataMapper {

    void mergeIntoLtisStatus();

    void mergeIntoLtisInfo();

    void mergeIntoLtisCharge();

    void deleteLtisTmpData();

    List<Long> getReptJudgSeq();

    List<Long> getOwnrJudgSeq();

    List<Long> getReptOwnrJudgSeq();

    List<Long> getRecmJudgSeq();

    void deleteReptInfo(@Param("judgSeqList") List<Long> judgSeqList);

    void deleteOwnrInfo(@Param("judgSeqList") List<Long> judgSeqList);

    void deleteReptOwnrInfo(@Param("judgSeqList") List<Long> judgSeqList);

    void deleteRecmInfo(@Param("judgSeqList") List<Long> judgSeqList);

    void insertReptInfo(@Param("ltisReptInfoEntities") List<LtisReptInfoEntity> ltisReptInfoEntities);

    void insertOwnrInfo(@Param("ltisOwnrInfoEntities") List<LtisOwnrInfoEntity> ltisOwnrInfoEntities);

    void insertReptOwnrInfo(@Param("ltisReptOwnrInfoEntities") List<LtisReptOwnrInfoEntity> ltisReptOwnrInfoEntities);

    void insertRecmInfo(@Param("ltisRecmInfoEntities") List<LtisRecmInfoEntity> ltisRecmInfoEntities);

    void insertPnu();
}
