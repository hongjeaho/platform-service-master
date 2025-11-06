package com.platform.datasource.base.repository.board.questionAnswer;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JBoardContent;
import org.jooq.generated.tables.JBoardQuestionAnswerReply;
import org.jooq.generated.tables.pojos.BoardQuestionAnswerReplyEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class BoardQuestionAnswerRepository {

  private final DSLContext dslContext;
  private final JBoardContent BOARD_CONTENT = JBoardContent.BOARD_CONTENT;
  private final JBoardQuestionAnswerReply BOARD_QUESTION_ANSWER_REPLY = JBoardQuestionAnswerReply.BOARD_QUESTION_ANSWER_REPLY;

  public Long updateBoardQuestionAnswerReply(
      BoardQuestionAnswerReplyEntity boardQuestionAnswerReplyEntity) {
    return dslContext.update(BOARD_QUESTION_ANSWER_REPLY)
        .set(BOARD_QUESTION_ANSWER_REPLY.REPLY, boardQuestionAnswerReplyEntity.getReply())
        .set(BOARD_QUESTION_ANSWER_REPLY.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(BOARD_QUESTION_ANSWER_REPLY.UPDATED_TIME, LocalDateTime.now())
        .where(
            BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ.eq(boardQuestionAnswerReplyEntity.getBoardSeq())
        )
        .returningResult(BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ)
        .fetchOneInto(Long.class);
  }

  public Long insertBoardQuestionAnswerReply(
      BoardQuestionAnswerReplyEntity boardQuestionAnswerReplyEntity) {
    return dslContext.insertInto(BOARD_QUESTION_ANSWER_REPLY
            , BOARD_QUESTION_ANSWER_REPLY.REPLY
            , BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ
            , BOARD_QUESTION_ANSWER_REPLY.CREATED_BY
            , BOARD_QUESTION_ANSWER_REPLY.CREATED_TIME)
        .values(
            boardQuestionAnswerReplyEntity.getReply()
            , boardQuestionAnswerReplyEntity.getBoardSeq()
            , UserAccountHolder.getSeqNo()
            , LocalDateTime.now()
        ).returningResult(BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ)
        .fetchOneInto(Long.class);
  }

  public void deleteBoardQuestionAnswerReply(long boardSeq) {
    dslContext.deleteFrom(BOARD_QUESTION_ANSWER_REPLY)
        .where(BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ.eq(boardSeq)).execute();
  }

}
