package com.platform.common.core.service;


import static org.junit.jupiter.api.Assertions.assertEquals;

import com.platform.common.base.BaseSpringBootTest;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.FileEntity;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Slf4j
@SpringBootTest
public class PDFServiceTest extends BaseSpringBootTest {

  @Autowired
  private PDFService pdfService;


  @Test
  @DisplayName("PDF를 이미지로 변환하고 페이시 수를 리턴 한다.")
  public void pdfToJpgConvertReturnPagesNumberTest() throws Exception {
    var fileEntity = new FileEntity();
    fileEntity.setSeq(1L);
    fileEntity.setChangedFileName("25수용0025.pdf");
    fileEntity.setFilePath("C:\\filedownload\\2025\\25수용0025\\deliberationReport\\");

    var page = pdfService.pdfToJpgConvertReturnPageLength(fileEntity, 1L);

    assertEquals(7, page);
  }
}
