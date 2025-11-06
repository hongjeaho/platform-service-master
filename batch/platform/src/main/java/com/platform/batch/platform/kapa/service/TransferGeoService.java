package com.platform.batch.platform.kapa.service;

import com.platform.batch.platform.kapa.dto.KakaoApiResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.mapper.batch.kakaoApi.KakaoMapper;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.KapaOfficialPriceEntity;
import org.jooq.generated.tables.pojos.KapaStandardPriceEntity;
import org.springframework.stereotype.Service;

@Service
@PlatFormTransactional
@Slf4j
public class TransferGeoService {

  private final KakaoMapper kakaoMapper;

  public TransferGeoService(KakaoMapper kakaoMapper) {
    this.kakaoMapper = kakaoMapper;
  }

  /**
   * 좌표 변환이 필요한 공시지가 데이터를 조회하는 메소드
   *
   * @return 좌표 변환이 필요한 KapaOfficialPriceEntity 객체의 리스트
   */
  public List<KapaOfficialPriceEntity> getOfficialGeoPointsNeedUpdate() {
    return kakaoMapper.getOfficialGeoPointsNeedUpdate();
  }

  /**
   * 카카오 API 응답을 처리하고 공시지가 좌표를 저장하는 메소드
   *
   * @param responseData            카카오 API 응답 데이터 (JSON 형식)
   * @param kapaOfficialPriceEntity 좌표를 저장할 KapaOfficialPriceEntity 객체
   */
  public void processOfficialSaveCoordinates(String responseData, KapaOfficialPriceEntity kapaOfficialPriceEntity) {
    KakaoApiResponse kakaoApiResponse = KakaoApiResponse.ofResponse(responseData);

    if (kakaoApiResponse.getDocuments() != null && !kakaoApiResponse.getDocuments().isEmpty()) {
      KakaoApiResponse.TransCoordResult transCoordResult = kakaoApiResponse.getDocuments().get(0);

      if (transCoordResult.getX() != null && transCoordResult.getY() != null) {
        kapaOfficialPriceEntity.setWgs84X(transCoordResult.getX());
        kapaOfficialPriceEntity.setWgs84Y(transCoordResult.getY());

        kakaoMapper.updateOfficialGeoPoint(kapaOfficialPriceEntity);
      }
    }
  }

  /**
   * 좌표 변환이 필요한 표준지 공시지가 데이터를 조회하는 메소드
   *
   * @return 좌표 변환이 필요한 KapaStandardPriceEntity 객체의 리스트
   */
  public List<KapaStandardPriceEntity> getStandardGeoPointsNeedUpdate() {
    return kakaoMapper.getStandardGeoPointsNeedUpdate();
  }

  /**
   * 카카오 API 응답을 처리하고 표준지 공시지가 좌표를 저장하는 메소드
   *
   * @param responseData            카카오 API 응답 데이터 (JSON 형식)
   * @param kapaStandardPriceEntity 좌표를 저장할 KapaStandardPriceEntity 객체
   */
  public void processStandardAndSaveCoordinates(String responseData, KapaStandardPriceEntity kapaStandardPriceEntity) {
    KakaoApiResponse kakaoApiResponse = KakaoApiResponse.ofResponse(responseData);

    if (kakaoApiResponse.getDocuments() != null && !kakaoApiResponse.getDocuments().isEmpty()) {
      KakaoApiResponse.TransCoordResult transCoordResult = kakaoApiResponse.getDocuments().get(0);

      if (transCoordResult.getX() != null && transCoordResult.getY() != null) {
        kapaStandardPriceEntity.setWgs84X(transCoordResult.getX());
        kapaStandardPriceEntity.setWgs84Y(transCoordResult.getY());
        kakaoMapper.updateStandardGeoPoint(kapaStandardPriceEntity);
      }
    }
  }
}
