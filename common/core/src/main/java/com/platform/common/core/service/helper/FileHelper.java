package com.platform.common.core.service.helper;

import com.platform.common.base.type.FileTypeCode;
import jakarta.validation.ValidationException;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.StringSubstitutor;
import org.apache.logging.log4j.util.Strings;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class FileHelper {

  public String generatePath(final FileTypeCode fileTypeCode) {
    return generatePath(Strings.EMPTY, fileTypeCode);
  }

  public String generatePath(final String caseNo, final FileTypeCode fileTypeCode) {

    if (fileTypeCode.isCaseNo() && Strings.isEmpty(caseNo)) {
      throw new ValidationException("사건 번호가 없습니다.");
    }

    var path = fileTypeCode.getPath();
    return StringSubstitutor.replace(path,
        Map.of("caseNo", caseNo
            , "year", LocalDate.now().getYear()
            , "month", LocalDate.now().getMonthValue()
        ));
  }

  /**
   * 주어진 파일 이름에서 확장자를 추출하고 이를 랜덤하게 생성된 UUID에 접목해 새로운 파일 이름을 생성하는 메서드입니다.
   *
   * @param fileName 원본 파일 이름 (확장자가 포함된 파일 이름)
   * @return 새롭게 생성된 랜덤 파일 이름 (UUID + 확장자 형식)
   */
  public String generateFileName(String fileName) {
    return UUID.randomUUID().toString() + "." + getExtension(fileName);
  }

  /**
   * 주어진 파일 이름에서 확장자를 추출하는 메서드입니다.
   * 파일 이름에 확장자가 없거나 null이면 빈 문자열을 반환합니다.
   *
   * @param fileName 확장자를 추출할 파일 이름 (확장자가 포함된 파일 이름)
   * @return 추출된 확장자 (대문자로 변환된 문자열), 또는 확장자가 없을 경우 빈 문자열
   */
  public String getExtension(final String fileName) {
    return Optional.ofNullable(fileName)
        .filter(name -> name.contains("."))
        .map(name -> name.substring(fileName.lastIndexOf('.') + 1))
        .map(String::toUpperCase)
        .orElse(Strings.EMPTY);
  }

  /**
   * 지정된 경로의 폴더와 그 내용을 재귀적으로 삭제합니다.
   *
   * @param folderPath 삭제할 폴더 경로
   */
  public void deleteFolder(String folderPath) {
    if (folderPath == null || folderPath.isEmpty()) {
      log.warn("삭제할 폴더 경로가 비어 있습니다.");
      return;
    }

    Path directory = Paths.get(folderPath);
    if (!Files.exists(directory)) {
      log.debug("삭제할 폴더가 존재하지 않습니다: {}", folderPath);
      return;
    }

    try {
      Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
          try {
            Files.delete(file);
            log.debug("파일 삭제 성공: {}", file);
          } catch (Exception e) {
            log.error("파일 삭제 실패: {}", file, e);
          }
          return FileVisitResult.CONTINUE;
        }

        @Override
        public FileVisitResult postVisitDirectory(Path dir, IOException exc) {
          try {
            Files.delete(dir);
            log.debug("디렉토리 삭제 성공: {}", dir);
          } catch (Exception e) {
            log.error("디렉토리 삭제 실패: {}", dir, e);
          }
          return FileVisitResult.CONTINUE;
        }
      });
    } catch (IOException e) {
      log.error("폴더 삭제 중 오류 발생: {}", folderPath, e);
      throw new RuntimeException("폴더 삭제 중 오류가 발생했습니다: " + e.getMessage(), e);
    }
  }

  /**
   * 지정된 경로에 디렉토리가 존재하지 않으면 생성합니다.
   *
   * @param path 생성할 디렉토리 경로
   * @throws IOException 디렉토리 생성 중 오류가 발생한 경우
   */
  public void createDirectoryIfNotExists(String path) throws IOException {
    if (path == null || path.isEmpty()) {
      throw new IllegalArgumentException("디렉토리 경로가 비어 있습니다.");
    }

    Path dirPath = Paths.get(path);
    if (!Files.exists(dirPath)) {
      Files.createDirectories(dirPath);
      log.debug("디렉토리가 생성되었습니다: {}", dirPath);
    } else {
      log.debug("디렉토리가 이미 존재합니다: {}", dirPath);
    }
  }
}
