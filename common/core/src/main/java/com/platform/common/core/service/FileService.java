package com.platform.common.core.service;

import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.config.FileProperties;
import com.platform.common.core.service.helper.FileHelper;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.file.FileReadRepository;
import com.platform.datasource.base.repository.file.FileRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.FileEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class FileService {

  private final FileHelper fileHelper;
  private final FileProperties fileProperties;
  private final FileRepository fileRepository;
  private final FileReadRepository fileReadRepository;


  /**
   * 파일 일련 번호로 파일을 조회 한다.
   *
   * @param fileSeq 파일일련번호
   * @return 파일 정보
   */
  public FileEntity findFileBySeq(long fileSeq) {
    return fileReadRepository.findFileByFileSeq(fileSeq);
  }

  /**
   * 사건 번호가 있는 파일을 업로드 한다.
   *
   * @param caseNo       사건번호
   * @param fileTypeCode 파일 타입
   * @param file         파일
   * @return 파일일련번호
   */
  public Long upload(
      final String caseNo,
      final FileTypeCode fileTypeCode,
      final MultipartFile file) throws IOException {

    // 파일 검증
    if (file == null) {
      return null;
    }

    var filePath = fileHelper.generatePath(caseNo, fileTypeCode);
    return processFileUpload(filePath, file);
  }

  /**
   * 사건 번호가 없는 파일을 업로드 한다.
   *
   * @param fileTypeCode 파일타입
   * @param file         파일
   * @return 파일일련번호
   */
  public Long upload(
      final FileTypeCode fileTypeCode,
      final MultipartFile file) throws IOException {

    var filePath = fileHelper.generatePath(fileTypeCode);
    return processFileUpload(filePath, file);
  }

  /**
   * 업로드한 파일을 변경 한다.
   *
   * @param fileSeq 파일 일련번호
   * @param file    파일
   */
  public void change(final long fileSeq,
      final MultipartFile file) {

    var fileResult = fileReadRepository.findFileByFileSeq(fileSeq);

    try {
      Path deleteFilePath = Paths.get(fileResult.getFilePath(), fileResult.getChangedFileName());
      Files.delete(deleteFilePath);
    } catch (IOException e) {
      log.error(e.getMessage());
    }

    try {
      FileEntity fileEntity = saveFileAndCreateEntity(fileResult.getFilePath(), file);
      fileEntity.setSeq(fileResult.getSeq());
      fileRepository.updateFileName(fileEntity);
    } catch (IOException e) {
      log.error(e.getMessage());
    }
  }

  /**
   * 재결일련번호가 있는 파일을 삭제 한다.
   *
   * @param fileSeq 파일일련번호
   */
  public void delete(final long fileSeq) {
    var file = fileReadRepository.findFileByFileSeq(fileSeq);

    if (file == null) {
      return;
    }

    try {
      fileRepository.deleteBySeq(fileSeq);
      Path filePath = Paths.get(file.getFilePath(), file.getChangedFileName());
      Files.delete(filePath);
    } catch (IOException e) {
      log.error(e.getMessage());
    }
  }

  /**
   * 실제 파일을 업로드 한다.
   *
   * @param filePath 파일패스
   * @param file     파일
   * @return 파일일련번호
   */
  public Long processFileUpload(final String filePath, final MultipartFile file) throws IOException {
    String basePath = fileProperties.getUploadPath();
    // 경로 끝에 슬래시가 없으면 추가
    if (!basePath.endsWith("/") && !basePath.endsWith("\\")) {
      basePath += "/";
    }
    FileEntity fileEntity = saveFileAndCreateEntity(basePath + filePath, file);
    return fileRepository.insertFileWithReturnSeq(fileEntity);

  }

  /**
   * 주어진 파일 경로에 파일을 저장하고, 해당 파일의 정보를 담은 엔티티를 생성하여 반환합니다.
   *
   * @param filePath 파일을 저장할 경로
   * @param file 업로드할 파일
   * @return 저장된 파일 정보를 담고 있는 FileEntity 객체
   * @throws IOException 파일 저장 중 오류가 발생한 경우
   */
  private FileEntity saveFileAndCreateEntity(final String filePath, final MultipartFile file) throws IOException {
    Path directoryPath = Paths.get(filePath);

    if (!Files.exists(directoryPath)) {
      Files.createDirectories(directoryPath);
    }

    String changedFileName = fileHelper.generateFileName(file.getOriginalFilename());
    file.transferTo(directoryPath.resolve(changedFileName).toFile());

    FileEntity fileEntity = new FileEntity();
    fileEntity.setFilePath(directoryPath.toString());
    fileEntity.setOriginalFileName(file.getOriginalFilename());
    fileEntity.setChangedFileName(changedFileName);

    return fileEntity;
  }
}
