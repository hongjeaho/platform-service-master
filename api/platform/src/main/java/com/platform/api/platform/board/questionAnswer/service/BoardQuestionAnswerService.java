package com.platform.api.platform.board.questionAnswer.service;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.board.questionAnswer.BoardQuestionAnswerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.BoardQuestionAnswerReplyEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class BoardQuestionAnswerService {

  private final BoardQuestionAnswerRepository boardQuestionAnswerRepository;


  public void insertOrUpdateQuestionAnswerReply(
      BoardQuestionAnswerReplyEntity boardQuestionAnswerReplyEntity) {

    if (boardQuestionAnswerReplyEntity.getCreatedBy() == null) {
      boardQuestionAnswerRepository.insertBoardQuestionAnswerReply(
          boardQuestionAnswerReplyEntity);
    }

    boardQuestionAnswerRepository.updateBoardQuestionAnswerReply(
        boardQuestionAnswerReplyEntity);

  }

  public void removeBoardQuestionAnswerReply(long boardSeq) {
    boardQuestionAnswerRepository.deleteBoardQuestionAnswerReply(boardSeq);
  }

}
