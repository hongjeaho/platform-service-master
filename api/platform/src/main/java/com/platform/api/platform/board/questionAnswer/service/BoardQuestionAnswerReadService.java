package com.platform.api.platform.board.questionAnswer.service;

import com.platform.api.platform.board.questionAnswer.dto.BoardQuestionAnswerSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.board.base.BoardInfoSearch;
import com.platform.datasource.base.repository.board.base.BoardSearchRepository;
import com.platform.datasource.base.repository.board.questionAnswer.BoardQuestionAnswerReadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jooq.generated.tables.pojos.BoardQuestionAnswerReplyEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
@Slf4j
public class BoardQuestionAnswerReadService {

  private final BoardSearchRepository boardSearchRepository;
  private final BoardQuestionAnswerReadRepository boardQuestionAnswerReadRepository;

  /**
   * 묻고 답하기 게시글 목록을 조회한다.
   *
   * @param boardInfoSearch 검색조건
   * @return 게시글 결과
   */
  public BoardQuestionAnswerSearchResponse getBoardQuestionAnswerInfoList(
      BoardInfoSearch boardInfoSearch) {
    return BoardQuestionAnswerSearchResponse.builder()
        .total(boardSearchRepository.findBoardContentTotalCount(boardInfoSearch))
        .resultList(boardSearchRepository.findBoardQuestionAnswerPage(boardInfoSearch))
        .build();
  }

  /**
   * 사용자가 선택한 묻고 답하기 중 답글을 조회한다.
   *
   * @param boardSeq 검색조건
   * @return 게시글 결과
   */
  public BoardQuestionAnswerReplyEntity getBoardReplyFromQuestionAnswer(long boardSeq) {
    return boardQuestionAnswerReadRepository.findBoardReplyFromQuestionAnswer(boardSeq);
  }

}
