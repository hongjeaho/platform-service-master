package com.platform.api.platform.board.application.service.helper;

import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.service.FileService;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.board.base.DetailForUploadBoardAttachment;
import com.platform.datasource.base.repository.board.base.BoardRepository;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
@PlatFormTransactional
public class BoardAttachmentHelper {

  private final FileService fileService;
  private final BoardRepository boardRepository;

  public void uploadFileAndInsertBoardAttachment(
      DetailForUploadBoardAttachment detailForUploadBoardAttachment) {

    MultipartFile file = detailForUploadBoardAttachment.getAttachment().getFile();

    if (file == null) {
      return;
    }

    try {
      Long fileSeq = fileService.upload(
          String.valueOf(detailForUploadBoardAttachment.getBoardSeq()),
          FileTypeCode.BOARD_FILE_UPLOAD, file);
      detailForUploadBoardAttachment.setResultSeqOfUploadFile(fileSeq);

      boardRepository.insertBoardAttachment(detailForUploadBoardAttachment);


    } catch (IOException e) {
      throw new RuntimeException(e);
    }

  }

  public void changeFileAndUpdateBoardAttachment(
      DetailForUploadBoardAttachment detailForUploadBoardAttachment) {

    MultipartFile file = detailForUploadBoardAttachment.getAttachment().getFile();
    fileService.change(detailForUploadBoardAttachment.getBoardAttachmentFileSeq(), file);

    boardRepository.updateBoardAttachment(detailForUploadBoardAttachment.getSeq());

  }

}
