package com.platform.datasource.base.repository.reference;

import static org.assertj.core.api.Assertions.assertThat;

import com.platform.common.base.BaseSpringBootTest;
import com.platform.datasource.base.dto.reference.map.ReferencesMapSearch;
import com.platform.datasource.base.dto.reference.map.ReferencesMapSearchCase;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class MapSearchRepositoryTest extends BaseSpringBootTest {

  @Autowired
  private MapSearchRepository mapSearchRepository;

  @DisplayName("지도 검색용 사건 정보 조회를 확인한다.")
  @Test
  public void findMapSearchCases() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();
  }

  @DisplayName("지도 검색용 사건 정보 Count를 확인한다.")
  @Test
  public void findTotalSize() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();

    // when
    Integer totalSize = mapSearchRepository.findTotalSize(search);

    // then
    assertThat(totalSize).isNotNull();
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 좌표 정보 확인")
  @Test
  public void findMapSearchCasesWithCoordinates() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();

    // 결과가 있을 경우 좌표 정보 검증
    if (!resultList.isEmpty()) {
      ReferencesMapSearchCase firstCase = resultList.get(0);
      assertThat(firstCase.getCaseNo()).isNotNull();
      assertThat(firstCase.getCaseTitle()).isNotNull();

      // 좌표 정보가 있을 경우 검증
      if (firstCase.getCoordinates() != null) {
        assertThat(firstCase.getCoordinates().getLat()).isNotNull();
        assertThat(firstCase.getCoordinates().getLng()).isNotNull();
      }
    }
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 표준지 정보 확인")
  @Test
  public void findMapSearchCasesWithStandardLand() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();

    // 결과가 있을 경우 표준지 정보 검증
    if (!resultList.isEmpty()) {
      ReferencesMapSearchCase firstCase = resultList.get(0);

      // 표준지 정보가 있을 경우 검증
      if (firstCase.getStandardLand() != null) {
        assertThat(firstCase.getStandardLand().getAddress()).isNotNull();

        if (firstCase.getStandardLand().getCoordinates() != null) {
          assertThat(firstCase.getStandardLand().getCoordinates().getLat()).isNotNull();
          assertThat(firstCase.getStandardLand().getCoordinates().getLng()).isNotNull();
        }
      }
    }
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 지목/이용상황/용도지역 확인")
  @Test
  public void findMapSearchCasesWithCategories() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();

    // 결과가 있을 경우 카테고리 정보 검증
    if (!resultList.isEmpty()) {
      ReferencesMapSearchCase firstCase = resultList.get(0);

      // String 타입 필드가 null이 아니면 비어있지 않은지 확인
      if (firstCase.getLandCategory() != null) {
        assertThat(firstCase.getLandCategory()).isNotEmpty();
      }

      if (firstCase.getUsageStatus() != null) {
        assertThat(firstCase.getUsageStatus()).isNotEmpty();
      }

      if (firstCase.getZoneType() != null) {
        assertThat(firstCase.getZoneType()).isNotEmpty();
      }

      // 하위 호환성 메소드 테스트
      if (firstCase.getLandCategoryList() != null) {
        assertThat(firstCase.getLandCategoryList()).isNotEmpty();
      }
    }
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 키워드 검색")
  @Test
  public void findMapSearchCasesWithKeyword() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setKeyword("서울");
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 지목 검색")
  @Test
  public void findMapSearchCasesWithLandCategory() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setLandCategory(Arrays.asList("대", "전"));
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 이용상황 검색")
  @Test
  public void findMapSearchCasesWithUsageStatus() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setUsageStatus(Arrays.asList("주거용", "상업용"));
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 용도지역 검색")
  @Test
  public void findMapSearchCasesWithZoneType() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setZoneType(Arrays.asList("제1종일반주거지역", "상업지역"));
    search.setPage(0);
    search.setPageSize(10);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);

    // then
    assertThat(resultList).isNotNull();
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 복합 검색 조건")
  @Test
  public void findMapSearchCasesWithMultipleConditions() {
    // given
    ReferencesMapSearch search = new ReferencesMapSearch();
    search.setKeyword("서울");
    search.setLandCategory(Arrays.asList("대"));
    search.setUsageStatus(Arrays.asList("주거용"));
    search.setPage(0);
    search.setPageSize(5);

    // when
    List<ReferencesMapSearchCase> resultList = mapSearchRepository.findMapSearchCases(search);
    Integer totalSize = mapSearchRepository.findTotalSize(search);

    // then
    assertThat(resultList).isNotNull();
    assertThat(totalSize).isNotNull();
    assertThat(resultList.size()).isLessThanOrEqualTo(5);
  }

  @DisplayName("지도 검색용 사건 정보 조회 - 페이징 테스트")
  @Test
  public void findMapSearchCasesWithPaging() {
    // given
    ReferencesMapSearch search1 = new ReferencesMapSearch();
    search1.setPage(0);
    search1.setPageSize(5);

    ReferencesMapSearch search2 = new ReferencesMapSearch();
    search2.setPage(1);
    search2.setPageSize(5);

    // when
    List<ReferencesMapSearchCase> page1 = mapSearchRepository.findMapSearchCases(search1);
    List<ReferencesMapSearchCase> page2 = mapSearchRepository.findMapSearchCases(search2);

    // then
    assertThat(page1).isNotNull();
    assertThat(page2).isNotNull();
    assertThat(page1.size()).isLessThanOrEqualTo(5);
    assertThat(page2.size()).isLessThanOrEqualTo(5);
  }
}
