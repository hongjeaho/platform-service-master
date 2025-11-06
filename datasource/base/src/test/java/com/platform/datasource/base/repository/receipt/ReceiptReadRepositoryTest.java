package com.platform.datasource.base.repository.receipt;


import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.platform.common.base.BaseSpringBootTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
public class ReceiptReadRepositoryTest extends BaseSpringBootTest {

  @Autowired
  private ReceiptReadRepository receiptReadRepository;

  @DisplayName("judgSeq를 이용해서 첨부파일 조회")
  @Test
  public void testFindById() {
    var fileList = receiptReadRepository.findReceiptAttachmentByJudgSeq(6053788);

    System.out.println(fileList.size());
    assertThat(fileList.size()).isEqualTo(30);
  }
}