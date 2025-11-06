package com.platform.api.platform.board.application.service;

import com.platform.api.platform.board.application.service.helper.BoardAttachmentHelper;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.board.base.DetailForUploadBoardAttachment;
import com.platform.datasource.base.repository.board.base.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.BoardContentEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class BoardService {

  private final BoardRepository boardRepository;
  private final BoardAttachmentHelper boardAttachmentHelper;

  public void insertOrUpdateBoardContentAndFile(BoardContentEntity boardContentEntity,
      DetailForUploadBoardAttachment detailForUploadBoardAttachment) {

    Long boardSeq = insertOrUpdateBoardContent(boardContentEntity);

    if (detailForUploadBoardAttachment.getAttachment().getFile() != null) {
      detailForUploadBoardAttachment.setBoardSeq(boardSeq);
      insertOrUpdateBoardAttachment(detailForUploadBoardAttachment);
    }
  }

  public Long insertOrUpdateBoardContent(BoardContentEntity boardContentEntity) {

    if (boardContentEntity.getSeq() == null) {
      return boardRepository.insertBoardContent(boardContentEntity);
    }

    return boardRepository.updateBoardContent(boardContentEntity);

  }

  public void removeBoardContent(long boardSeq) {
    boardRepository.deleteBoardContent(boardSeq);
  }

  public void updateBoardViewCount(long boardSeq) {
    boardRepository.updateBoardViewCount(boardSeq);
  }

  public void insertOrUpdateBoardAttachment(
      DetailForUploadBoardAttachment detailForUploadBoardAttachment) {

    var seq = detailForUploadBoardAttachment.getAttachment().getSeq();
    var fileSeq = detailForUploadBoardAttachment.getBoardAttachmentFileSeq();

    boolean isThisInsertTarget = (seq == null || fileSeq == null);

    if (isThisInsertTarget) {
      boardAttachmentHelper.uploadFileAndInsertBoardAttachment(detailForUploadBoardAttachment);
    } else {
      boardAttachmentHelper.changeFileAndUpdateBoardAttachment(detailForUploadBoardAttachment);
    }

  }

}

