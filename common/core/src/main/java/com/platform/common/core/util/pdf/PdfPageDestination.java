package com.platform.common.core.util.pdf;

import lombok.Getter;

/**
 * PDF 문서 내의 특정 페이지 위치를 나타내는 불변(immutable) 클래스.
 * 페이지 번호 정보를 캡슐화하여 제공한다.
 */
@Getter
class PdfPageDestination {
  /**
   * 대상 페이지 번호
   */
  private final int pageNumber;

  /**
   * 페이지 번호를 받아 객체를 초기화하는 private 생성자.
   * 객체 생성은 팩토리 메서드를 통해서만 가능하다.
   * 
   * @param pageNumber 대상 페이지 번호
   */
  private PdfPageDestination(int pageNumber) {
    this.pageNumber = pageNumber;
  }

  /**
   * 페이지 번호를 받아 PdfPageDestination 객체를 생성하는 팩토리 메서드.
   * 
   * @param pageNumber 대상 페이지 번호
   * @return 생성된 PdfPageDestination 객체
   */
  protected static PdfPageDestination ofPage(int pageNumber) {
    return new PdfPageDestination(pageNumber);
  }
}
