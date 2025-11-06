package com.platform.datasource.base.repository.ltis;

import static org.assertj.core.api.Assertions.assertThat;

import com.platform.common.base.BaseSpringBootTest;
import com.platform.datasource.base.dto.receipt.ReceiptSearch;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class LTISReptInfoReadRepositoryTest extends BaseSpringBootTest {

  @Autowired
  private LTISReptInfoReadRepository ltisReptInfoReadRepository;

  @DisplayName("소유자별 보상액 조회를 확인 한다. ")
  @Test
  public void findPageByOnePage() {
    var receiptSearch =  new ReceiptSearch();
    var list = ltisReptInfoReadRepository.findCompensationAmountByOwnerInfo(6053788, receiptSearch);
    assertThat(list.size()).isNotZero();
  }
}
