package com.platform.common.core.service;

import com.platform.common.core.service.helper.FileHelper;
import com.platform.common.core.util.pdf.PdfTocExtractor;
import com.platform.common.core.util.pdf.TocEntry;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;
import javax.imageio.ImageIO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBufferedFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.jooq.generated.tables.pojos.FileEntity;
import org.springframework.stereotype.Service;

/**
 * PDF 파일을 JPG 이미지로 변환하는 서비스 클래스
 *
 * <p>이 클래스는 PDF 문서를 JPG 이미지 파일로 변환하는 기능을 제공합니다.
 * PDF의 각 페이지는 개별 JPG 파일로 변환되며, 지정된 디렉토리에 저장됩니다.
 * 변환된 이미지는 150 DPI 해상도로 생성됩니다.</p>
 *
 * <p>주요 기능:</p>
 * <ul>
 *   <li>PDF 파일을 JPG 이미지로 변환</li>
 *   <li>이미지 저장을 위한 디렉토리 관리</li>
 *   <li>변환된 페이지 수 반환</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class PDFService {

  public static final int DPI = 150;
  private final FileHelper fileHelper;

  /**
   * PDF 파일을 JPG 이미지로 변환한 후 변환된 페이지 수를 반환합니다.
   *
   * @param fileEntity 변환할 PDF 파일 정보
   * @param opinionTemplateSeq 의견 템플릿 일련번호 (opinionTemplateSeq는 템플릿 폴더 생성에 사용)
   * @return 변환된 JPG 이미지의 페이지 수
   * @throws Exception 변환 중 발생할 수 있는 예외
   */
  public int pdfToJpgConvertReturnPageLength(FileEntity fileEntity, Long opinionTemplateSeq) throws Exception {
    String dirPath = deleteFolderAndCreateFolder(fileEntity.getFilePath(), opinionTemplateSeq);
    return createJpgImage(fileEntity, dirPath);
  }

  /**
   * PDF 파일에서 목차를 추출합니다.
   *
   * @param fileEntity PDF 파일 정보
   */
  public List<TocEntry> getPDFExtractTableOfContents(FileEntity fileEntity){
    try {
      var pdfPath = Paths.get(fileEntity.getFilePath()).resolve(fileEntity.getChangedFileName());
      return PdfTocExtractor.extractTableOfContents(pdfPath.toString());
    } catch (IOException e) {
      log.error(e.getMessage());
      return new ArrayList<>();
    }
  }

  /**
   * PDF를 JPG이미지로 변환
   * @param fileEntity 파일 정보
   * @param dirPath 이미지 경로
   * @return 이미지 생성 수
   */
  private int createJpgImage(FileEntity fileEntity, String dirPath) {
    var filePath = Paths.get(fileEntity.getFilePath()).resolve(fileEntity.getChangedFileName());

    try (PDDocument document = Loader.loadPDF(new RandomAccessReadBufferedFile(filePath))) {
      PDFRenderer pdfRenderer = new PDFRenderer(document);
      int numberOfPages = document.getNumberOfPages();

      IntStream.range(0, numberOfPages)
        .forEach(page -> {
          try {
            convertSinglePage(pdfRenderer, page, numberOfPages, dirPath, fileEntity.getSeq());
          } catch (Exception e) {
            log.error("페이지 {}번 변환 실패: {}", page + 1, e.getMessage());
          }
        });

      return numberOfPages;
    } catch (Exception e) {
      log.error(e.getMessage());
      return 0;
    }
  }

  /**
   * PDF의 단일 페이지를 JPG 이미지 파일로 변환하여 저장합니다.
   *
   * @param pdfRenderer PDFRenderer 객체로, PDF 페이지를 렌더링하는 데 사용됩니다.
   * @param page        변환할 PDF 페이지 번호 (0부터 시작).
   * @param totalPages  PDF의 전체 페이지 수.
   * @param dirPath     변환된 이미지 파일이 저장될 디렉토리 경로.
   * @param fileSeq     이미지 파일명 생성에 사용될 파일 일련번호.
   */
  private void convertSinglePage(PDFRenderer pdfRenderer, int page, int totalPages, String dirPath, Long fileSeq) throws IOException {
    BufferedImage bufferedImage = null;
    try {
      bufferedImage = pdfRenderer.renderImageWithDPI(page, DPI);

      Path normalizedDirPath = Paths.get(dirPath).normalize().toAbsolutePath();
      String safeFileName = String.format("%d_%d_%d.jpg", fileSeq, (page + 1), totalPages);
      Path targetPath = normalizedDirPath.resolve(safeFileName);

      // 이미지를 파일에 직접 쓰기
      ImageIO.write(bufferedImage, "JPG", targetPath.toFile());

    }  catch (IOException e) {
      log.error("페이지 {} 변환 중 오류 발생: {}", (page + 1), e.getMessage());
    } catch (OutOfMemoryError oom) {
      log.error("페이지 {} 변환 중 메모리 부족 오류: {}", (page + 1), oom.getMessage());
      throw new IOException("메모리 부족으로 변환 실패", oom);
    } finally {
      // 명시적으로 이미지 메모리 해제
      if (bufferedImage != null) {
        bufferedImage.flush();
      }
    }
  }

  /**
   * 디엑토리 삭제 후  생성
   * @param fileFolder 파일 폴더
   * @param opinionTemplateSeq 템플릿 일련번호
   * @return 이미지 생셩 경로
   * @throws Exception exception
   */
  private  String deleteFolderAndCreateFolder(String fileFolder, Long opinionTemplateSeq) throws Exception {
    var dirPath =  Paths.get(fileFolder).resolve("image");

    if(opinionTemplateSeq != null) {
      dirPath = dirPath.resolve(opinionTemplateSeq.toString());
    }

    // 디렉 토리 삭재 후  생성
    fileHelper.deleteFolder(dirPath.toString());
    fileHelper.createDirectoryIfNotExists(dirPath.toString());
    return dirPath.toString();
  }
}
