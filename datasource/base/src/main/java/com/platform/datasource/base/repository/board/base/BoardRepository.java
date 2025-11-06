package com.platform.datasource.base.repository.board.base;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.board.base.DetailForUploadBoardAttachment;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JBoardAttachment;
import org.jooq.generated.tables.JBoardContent;
import org.jooq.generated.tables.pojos.BoardContentEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class BoardRepository {

  private final DSLContext dslContext;
  private final JBoardContent BOARD_CONTENT = JBoardContent.BOARD_CONTENT;
  private final JBoardAttachment BOARD_ATTACHMENT = JBoardAttachment.BOARD_ATTACHMENT;

  public void updateBoardViewCount(long boardSeq) {
    dslContext.update(BOARD_CONTENT)
        .set(BOARD_CONTENT.VIEW_COUNT, BOARD_CONTENT.VIEW_COUNT.plus(1))
        .where(
            BOARD_CONTENT.SEQ.eq(boardSeq))
        .execute();
  }

  public void deleteBoardContent(long boardSeq) {
    dslContext.deleteFrom(BOARD_CONTENT)
        .where(BOARD_CONTENT.SEQ.eq(boardSeq)).execute();
  }

  public Long insertBoardContent(BoardContentEntity boardContentEntity) {
    return dslContext.insertInto(BOARD_CONTENT,
            BOARD_CONTENT.TITLE,
            BOARD_CONTENT.CONTENT,
            BOARD_CONTENT.BOARD_CATEGORY_CODE,
            BOARD_CONTENT.CREATED_BY,
            BOARD_CONTENT.CREATED_TIME
        ).values(
            boardContentEntity.getTitle(),
            boardContentEntity.getContent(),
            boardContentEntity.getBoardCategoryCode(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).returningResult(BOARD_CONTENT.SEQ)
        .fetchOneInto(Long.class);
  }

  public Long updateBoardContent(BoardContentEntity boardContentEntity) {
    dslContext.update(BOARD_CONTENT)
        .set(BOARD_CONTENT.TITLE, boardContentEntity.getTitle())
        .set(BOARD_CONTENT.CONTENT, boardContentEntity.getContent())
        .set(BOARD_CONTENT.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(BOARD_CONTENT.UPDATED_TIME, LocalDateTime.now())
        .where(BOARD_CONTENT.SEQ.eq(boardContentEntity.getSeq()))
        .execute();
    return boardContentEntity.getSeq();
  }

  public void insertBoardAttachment(
      DetailForUploadBoardAttachment detailForUploadBoardAttachment) {

    dslContext.insertInto(BOARD_ATTACHMENT
            , BOARD_ATTACHMENT.BOARD_SEQ
            , BOARD_ATTACHMENT.BOARD_ATTACHMENT_TYPE_CODE
            , BOARD_ATTACHMENT.BOARD_ATTACHMENT_FILE_SEQ
            , BOARD_ATTACHMENT.BOARD_ATTACHMENT_ORDER
            , BOARD_ATTACHMENT.CREATED_BY
            , BOARD_ATTACHMENT.CREATED_TIME)
        .values(detailForUploadBoardAttachment.getBoardSeq()
            , detailForUploadBoardAttachment.getBoardAttachmentTypeCode()
            , detailForUploadBoardAttachment.getBoardAttachmentFileSeq()
            , detailForUploadBoardAttachment.getBoardAttachmentOrder()
            , UserAccountHolder.getSeqNo()
            , LocalDateTime.now()
        ).execute();


  }

  public void updateBoardAttachment(Long boardAttachmentSeq) {
    dslContext.update(BOARD_ATTACHMENT)
        .set(BOARD_ATTACHMENT.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(BOARD_ATTACHMENT.UPDATED_TIME, LocalDateTime.now())
        .where(BOARD_ATTACHMENT.SEQ.eq(boardAttachmentSeq))
        .execute();
  }

  public void deleteBoardAttachment(Long fileSeq) {
    dslContext.deleteFrom(BOARD_ATTACHMENT)
        .where(BOARD_ATTACHMENT.BOARD_ATTACHMENT_FILE_SEQ.eq(fileSeq)).execute();
  }

}
