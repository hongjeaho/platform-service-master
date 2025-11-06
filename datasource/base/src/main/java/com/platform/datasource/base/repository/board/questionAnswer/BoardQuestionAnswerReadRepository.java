package com.platform.datasource.base.repository.board.questionAnswer;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JBoardContent;
import org.jooq.generated.tables.JBoardQuestionAnswerReply;
import org.jooq.generated.tables.pojos.BoardQuestionAnswerReplyEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class BoardQuestionAnswerReadRepository {

  private final DSLContext dslContext;
  private final JBoardContent BOARD_CONTENT = JBoardContent.BOARD_CONTENT;
  private final JBoardQuestionAnswerReply BOARD_QUESTION_ANSWER_REPLY = JBoardQuestionAnswerReply.BOARD_QUESTION_ANSWER_REPLY;

  public BoardQuestionAnswerReplyEntity findBoardReplyFromQuestionAnswer(long boardSeq) {
    return dslContext.select(
            BOARD_QUESTION_ANSWER_REPLY.CREATED_BY
            , BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ
            , BOARD_QUESTION_ANSWER_REPLY.REPLY
        ).from(BOARD_CONTENT)
        .leftJoin(BOARD_QUESTION_ANSWER_REPLY)
        .on(BOARD_CONTENT.SEQ.eq(BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ))
        .where(BOARD_CONTENT.SEQ.eq(boardSeq))
        .fetchOneInto(BoardQuestionAnswerReplyEntity.class);
  }

}
