package com.platform.batch.platform.kapa.service;

import com.platform.datasource.base.mapper.batch.kapaApi.KapaDataMapper;
import com.platform.datasource.base.mapper.batch.kapaApi.KapaTmpMapper;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.KapaOfficialPriceEntity;
import org.jooq.generated.tables.pojos.KapaStandardPriceEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
public class KapaDataService {

  private final KapaTmpMapper kapaTmpMapper;
  private final KapaDataMapper kapaDataMapper;

  public KapaDataService(KapaTmpMapper kapaTmpMapper, KapaDataMapper kapaDataMapper) {
    this.kapaTmpMapper = kapaTmpMapper;
    this.kapaDataMapper = kapaDataMapper;
  }

  /**
   * 공시지가 임시 데이터 처리
   */
  public void processOfficialPriceTmp() {
    kapaTmpMapper.deleteOfficialPriceTemp();
    kapaTmpMapper.insertOfficialPriceTemp();
  }

  /**
   * 표준지 공시지가 임시 데이터 처리
   */
  public void processStandardPriceTmp() {
    kapaTmpMapper.deleteStandardPriceTemp();
    kapaTmpMapper.insertStandardPriceTemp();
  }

  /**
   * 공시지가 요청 이력에 빈 데이터 삽입(반복 호출 방지)
   */
  public void insertEmptyRequest() {
    kapaTmpMapper.insertEmptyOfficialRequest();
  }

  /**
   * 공시지가 데이터 일괄 저장
   */
  public void saveOfficialPriceData(List<KapaOfficialPriceEntity> entities) {
    entities.forEach(kapaDataMapper::insertOfficialPrice);
  }

  /**
   * 표준지 공시지가 데이터 일괄 저장
   */
  public void saveStandardPriceData(List<KapaStandardPriceEntity> entities) {
    entities.forEach(kapaDataMapper::insertStandardPrice);
  }
}
