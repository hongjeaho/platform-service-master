package com.platform.datasource.base.repository.ltis;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.platform.common.base.BaseSpringBootTest;
import com.platform.datasource.base.dto.receipt.ReceiptResult;
import com.platform.datasource.base.dto.receipt.ReceiptSearch;
import com.platform.datasource.base.repository.receipt.ReceiptSearchRepository;
import org.assertj.core.groups.Tuple;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ReceiptSearchRepositoryTest extends BaseSpringBootTest {

  @Autowired
  private ReceiptSearchRepository ReceiptSearchRepository;

  @DisplayName("LTIS 검증 - 첫번째 페이지 ")
  @Test
  public void findPageByOnePage() {
    var search = ReceiptSearch.builder().build();

    var total = ReceiptSearchRepository.findTotalSize(search);
    var list = ReceiptSearchRepository.findPage(search);

    assertThat(14).isEqualTo(total);
    assertThat(10).isEqualTo(list.size());
  }

  @DisplayName("LTIS 검증 - 두번째 페이지")
  @Test
  public void findPageByTwoPage() {
    var search = ReceiptSearch.builder().build();
    search.setPage(1);
    var total = ReceiptSearchRepository.findTotalSize(search);
    var list = ReceiptSearchRepository.findPage(search);

    assertThat(14).isEqualTo(total);
    assertThat(4).isEqualTo(list.size());
  }

  @DisplayName("LTIS 검증 - 검색 조건")
  @Test
  public void findPageByCondition() {
    var search = ReceiptSearch.builder().keyword("24XX003").build();

    var total = ReceiptSearchRepository.findTotalSize(search);
    var list = ReceiptSearchRepository.findPage(search);

    assertEquals(1, total);
    assertEquals(1, list.size());
    assertThat(list).extracting(ReceiptResult::getCaseNo, ReceiptResult::getCaseTitle)
        .containsExactly(Tuple.tuple("24XX003", "사건 3"));
  }
}
