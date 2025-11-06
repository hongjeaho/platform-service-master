package com.platform.datasource.base.repository.decree;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.platform.common.base.BaseSpringBootTest;
import com.platform.datasource.base.dto.decree.DecreeResult;
import com.platform.datasource.base.dto.decree.DecreeSearch;
import com.platform.datasource.base.repository.reference.DecreeSearchRepository;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class DecreeSearchRepositoryTest extends BaseSpringBootTest {

  @Autowired
  private DecreeSearchRepository decreeSearchRepository;

  @DisplayName("관련 법령 조회 검증 - 첫 번째 페이지")
  @Test
  public void findPageByOnePage() {
    DecreeSearch decreeSearch = DecreeSearch.builder().build();

    int total = decreeSearchRepository.findTotalSize(decreeSearch);
    List<DecreeResult> resultList = decreeSearchRepository.findPage(decreeSearch);

    assertEquals(0, total);
    assertEquals(0, resultList.size());

  }
}
