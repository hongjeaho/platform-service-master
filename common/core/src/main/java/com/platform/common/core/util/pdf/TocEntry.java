package com.platform.common.core.util.pdf;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.jooq.generated.tables.pojos.ConclusionBookmarkEntity;

/**
 * PDF 문서의 목차(Table of Contents) 항목을 나타내는 클래스.
 * 계층적 구조를 가지며, 각 항목은 제목, 레벨(깊이), 페이지 번호 및 하위 항목 목록을 포함한다.
 */
@Setter
@Getter
public class TocEntry {

  /**
   * 목차 항목의 제목
   */
  private String title;

  /**
   * 목차 항목의 계층 레벨 (0부터 시작, 숫자가 클수록 하위 레벨)
   */
  private int level;

  /**
   * 목차 항목이 가리키는 페이지 번호
   */
  private int pageNumber;

  /**
   * 현재 목차 항목의 하위 항목 목록
   */
  private List<TocEntry> children;

  /**
   * 목차 항목을 생성하는 생성자.
   * 
   * @param title 목차 항목의 제목
   * @param level 목차 항목의 계층 레벨
   * @param pageNumber 목차 항목이 가리키는 페이지 번호
   */
  protected TocEntry(String title, int level, int pageNumber) {
    this.title = title;
    this.level = level;
    this.pageNumber = pageNumber;
    this.children = new ArrayList<>();
  }

  public  ConclusionBookmarkEntity ofConclusionBookmarkEntity() {
    return new ConclusionBookmarkEntity()
        .setBookmarkName(title)
        .setBookmarkNumber(pageNumber)
        .setDepth(level);
  }
}
