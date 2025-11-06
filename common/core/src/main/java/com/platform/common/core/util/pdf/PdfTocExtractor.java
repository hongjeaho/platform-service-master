package com.platform.common.core.util.pdf;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBufferedFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageFitDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.destination.PDPageXYZDestination;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem;
import org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineNode;

/**
 * PDF 파일로부터 목차(Table of Contents)를 추출하는 기능을 제공하는 클래스.
 * PDF 형식의 문서에서 Document Outline을 이용하여 목차를 계층적으로 추출한다.
 * Apache PDFBox 라이브러리를 사용하여 PDF 문서의 구조를 분석한다.
 */
@Slf4j
public class PdfTocExtractor {

  /**
   * PDF 파일 경로를 받아 해당 PDF의 목차를 추출한다.
   * 
   * @param pdfPath PDF 파일의 경로
   * @return 추출된 목차 항목 리스트
   * @throws IOException PDF 파일을 읽는 과정에서 오류가 발생한 경우
   */
  public static List<TocEntry> extractTableOfContents(String pdfPath) throws IOException {
    List<TocEntry> itemList = new ArrayList<>();

    try (PDDocument document = Loader.loadPDF(new RandomAccessReadBufferedFile(pdfPath))) {
      // 문서의 목차(Outline) 정보 가져오기
      PDDocumentOutline outline = document.getDocumentCatalog().getDocumentOutline();

      // 목차가 존재하는 경우에만 처리
      if (outline != null) {
        extractOutlineItems(outline, itemList, 0);
      }
    }

    return itemList;
  }

  /**
   * PDF 문서의 목차 노드에서 모든 항목을 재귀적으로 추출한다.
   * 
   * @param outline 처리할 목차 노드
   * @param itemList 추출된 목차 항목을 저장할 리스트
   * @param level 현재 목차 항목의 계층 레벨
   */
  private static void extractOutlineItems(PDOutlineNode outline, List<TocEntry> itemList, int level) {
    PDOutlineItem current = outline.getFirstChild();

    // 모든 형제 노드(sibling)를 순회
    while (current != null) {
      String title = current.getTitle();

      // 목적지 정보(페이지 번호) 추출
      PdfPageDestination destInfo = getDestinationInfo(current);

      // 목차 항목 생성 및 리스트에 추가
      TocEntry tocItem = new TocEntry(title, level, destInfo.getPageNumber());
      itemList.add(tocItem);

      // 하위 항목이 있는 경우 재귀적으로 처리
      if (current.hasChildren()) {
        extractOutlineItems(current, tocItem.getChildren(), level + 1);
      }

      // 다음 형제 노드로 이동
      current = current.getNextSibling();
    }
  }

  /**
   * 목차 항목(PDOutlineItem)에서 페이지 번호 정보를 추출한다.
   * 다양한 유형의 PDF 목적지(destination) 객체를 처리한다.
   * 
   * @param outlineItem 페이지 정보를 추출할 목차 항목
   * @return 추출된 페이지 정보를 담은 PdfPageDestination 객체
   */
  private static PdfPageDestination getDestinationInfo(PDOutlineItem outlineItem) {
    try {
      // 목차 항목의 목적지(destination) 정보 가져오기
      PDDestination destination = outlineItem.getDestination();

      // 목적지 정보가 없는 경우 -1 페이지 반환
      if (destination == null) {
        return PdfPageDestination.ofPage(-1);
      }

      // 목적지 유형에 따라 페이지 번호 추출
      // PDFBox는 0부터 페이지 번호를 시작하므로 1을 더해 실제 페이지 번호로 변환
      if (destination instanceof PDPageXYZDestination xyzDest) {
        // XYZ 유형 목적지 (특정 위치와 줌 레벨을 지정)
        int pageNumber = xyzDest.retrievePageNumber() + 1;
        return PdfPageDestination.ofPage(pageNumber);

      } else if (destination instanceof PDPageFitDestination fitDest) {
        // Fit 유형 목적지 (페이지를 화면에 맞춤)
        int pageNumber = fitDest.retrievePageNumber() + 1;
        return PdfPageDestination.ofPage(pageNumber);

      } else if (destination instanceof PDPageDestination pageDest) {
        // 일반 페이지 목적지
        int pageNumber = pageDest.retrievePageNumber() + 1;
        return PdfPageDestination.ofPage(pageNumber);

      } else {
        // 지원되지 않는 목적지 유형
        return PdfPageDestination.ofPage(-1);
      }

    } catch (Exception e) {
      // 예외 발생 시 오류 메시지 출력 후 -1 페이지 반환
      System.err.println("목적지 정보를 가져올 수 없습니다: " + e.getMessage());
      return PdfPageDestination.ofPage(-1);
    }
  }
}
