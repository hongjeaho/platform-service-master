package com.platform.datasource.base.dto.reference.map;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "ReferencesMapSearchCase", description = "지도 검색 사건 정보")
public class ReferencesMapSearchCase {

  @Schema(name = "caseNo", description = "사건번호", example = "24수용0001")
  private String caseNo;

  @Schema(name = "caseTitle", description = "사건명", example = "토지수용사건")
  private String caseTitle;

  @Schema(name = "address", description = "주소", example = "서울시 강남구 테헤란로 123")
  private String address;

  @Schema(name = "area", description = "면적 (㎡)", example = "1000.5")
  private Double area;

  @Schema(name = "price", description = "가격 (원)", example = "1000000000")
  private Long price;

  @Schema(name = "landCategory", description = "지목 목록 (쉼표 구분)", example = "대,전")
  private String landCategory;

  @Schema(name = "usageStatus", description = "이용상황 목록 (쉼표 구분)", example = "주거용,상업용")
  private String usageStatus;

  @Schema(name = "zoneType", description = "용도지역 목록 (쉼표 구분)", example = "제1종일반주거지역")
  private String zoneType;

  @Schema(name = "lng", description = "경도", example = "126.9780")
  private String lng;

  @Schema(name = "lat", description = "위도", example = "37.5665")
  private String lat;

  @Schema(name = "standardLng", description = "표준지 경도", example = "126.9780")
  private String standardLng;

  @Schema(name = "standardLat", description = "표준지 위도", example = "37.5665")
  private String standardLat;

  @Schema(name = "standardAddress", description = "표준지 주소", example = "서울시 강남구 표준지")
  private String standardAddress;

  @Schema(name = "standardPrice", description = "표준지 공시지가 (원/㎡)", example = "500000")
  private String standardPrice;

  @Schema(name = "standardArea", description = "표준지 면적 (㎡)", example = "100.0")
  private String standardArea;

  // 하위 호환성을 위한 getter 메소드
  @Schema(hidden = true)
  public ReferencesMapCoordinates getCoordinates() {
    if (lng == null || lat == null) {
      return null;
    }
    return ReferencesMapCoordinates.builder()
        .lng(Double.parseDouble(lng))
        .lat(Double.parseDouble(lat))
        .build();
  }

  @Schema(hidden = true)
  public ReferencesStandardLand getStandardLand() {
    if (standardLng == null && standardLat == null && standardAddress == null
        && standardPrice == null && standardArea == null) {
      return null;
    }
    return ReferencesStandardLand.builder()
        .coordinates(standardLng != null && standardLat != null
            ? ReferencesMapCoordinates.builder()
                .lng(Double.parseDouble(standardLng))
                .lat(Double.parseDouble(standardLat))
                .build()
            : null)
        .address(standardAddress)
        .price(standardPrice != null ? Long.parseLong(standardPrice) : null)
        .area(standardArea != null ? Double.parseDouble(standardArea) : null)
        .build();
  }

  @Schema(hidden = true)
  public List<String> getLandCategoryList() {
    return parseCommaString(landCategory);
  }

  @Schema(hidden = true)
  public List<String> getUsageStatusList() {
    return parseCommaString(usageStatus);
  }

  @Schema(hidden = true)
  public List<String> getZoneTypeList() {
    return parseCommaString(zoneType);
  }

  private List<String> parseCommaString(String value) {
    if (value == null || value.isEmpty()) {
      return null;
    }
    return Arrays.stream(value.split(","))
        .map(String::trim)
        .distinct()
        .collect(Collectors.toList());
  }
}
