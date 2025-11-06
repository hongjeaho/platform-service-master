package com.platform.api.platform.board.application.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.board.base.DetailForUploadBoardAttachment;
import com.platform.datasource.base.repository.board.base.BoardSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.BoardContentEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class BoardReadService {

  private final BoardSearchRepository boardSearchRepository;

  public BoardContentEntity getBoardCommonContentDetail(Long boardSeq, String boardCategoryCode) {
    return boardSearchRepository.findBoardCommonContentDetail(boardSeq, boardCategoryCode);
  }

  public DetailForUploadBoardAttachment getBoardAttachmentByBoardSeq(long boardSeq) {
    DetailForUploadBoardAttachment boardAttachmentEntity = boardSearchRepository.findBoardAttachmentDetailByBoardSeq(
        boardSeq);
    if (boardAttachmentEntity != null) {
      boardAttachmentEntity.attachmentSetting();
    }

    return boardAttachmentEntity;
  }

}
