package com.platform.api.platform.board.announcement.service;

import com.platform.api.platform.board.announcement.dto.BoardAnnouncementSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.board.base.BoardInfoSearch;
import com.platform.datasource.base.repository.board.base.BoardSearchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
@Slf4j
public class BoardAnnouncementReadService {

  private final BoardSearchRepository boardSearchRepository;

  /**
   * 게시글 조회 목록을 조회한다.
   *
   * @param boardInfoSearch 검색조건
   * @return 게시글 결과
   */
  public BoardAnnouncementSearchResponse getBoardQuestionAnswerResultList(
      BoardInfoSearch boardInfoSearch) {
    return BoardAnnouncementSearchResponse.builder()
        .total(boardSearchRepository.findBoardContentTotalCount(boardInfoSearch))
        .resultList(boardSearchRepository.findBoardAnnouncementPage(boardInfoSearch))
        .build();
  }
}
