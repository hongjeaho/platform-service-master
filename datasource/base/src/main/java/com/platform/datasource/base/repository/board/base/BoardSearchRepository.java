package com.platform.datasource.base.repository.board.base;

import static com.platform.datasource.base.util.condition.JooqStringConditionUtil.likeIfNotBlank;

import com.platform.common.base.type.SearchConditionType;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.board.announcement.BoardAnnouncementSearchResult;
import com.platform.datasource.base.dto.board.base.BoardInfoSearch;
import com.platform.datasource.base.dto.board.base.DetailForUploadBoardAttachment;
import com.platform.datasource.base.dto.board.questionAnswer.BoardQuestionAnswerSearchResult;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JBoardAttachment;
import org.jooq.generated.tables.JBoardContent;
import org.jooq.generated.tables.JBoardQuestionAnswerReply;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.JUser;
import org.jooq.generated.tables.pojos.BoardContentEntity;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class BoardSearchRepository {

  private final DSLContext dslContext;
  private final JBoardContent BOARD_CONTENT = JBoardContent.BOARD_CONTENT;
  private final JBoardQuestionAnswerReply BOARD_QUESTION_ANSWER_REPLY = JBoardQuestionAnswerReply.BOARD_QUESTION_ANSWER_REPLY;
  private final JBoardAttachment BOARD_ATTACHMENT = JBoardAttachment.BOARD_ATTACHMENT;
  private final JFile FILE = JFile.FILE;
  private final JUser USER = JUser.USER;

  private final Map<Integer, Function<String, Condition>> searchConditionMap = Map.of(
      SearchConditionType.BOTH.getCode(),
      keyword -> likeIfNotBlank(BOARD_CONTENT.CONTENT, keyword).or(
          likeIfNotBlank(BOARD_CONTENT.TITLE, keyword))
      , SearchConditionType.TITLE.getCode(), keyword -> likeIfNotBlank(BOARD_CONTENT.TITLE, keyword)
      , SearchConditionType.CONTENT.getCode(),
      keyword -> likeIfNotBlank(BOARD_CONTENT.CONTENT, keyword));

  public Integer findBoardContentTotalCount(BoardInfoSearch boardInfoSearch) {
    return dslContext.selectCount()
        .from(BOARD_CONTENT)
        .join(USER)
        .on(BOARD_CONTENT.CREATED_BY.eq(USER.SEQ))
        .where(getBoardSearchCondition(boardInfoSearch))
        .fetchOne(0, Integer.class);
  }

  public List<BoardAnnouncementSearchResult> findBoardAnnouncementPage(
      BoardInfoSearch boardInfoSearch) {
    return dslContext.select(
            BOARD_CONTENT.SEQ
            , BOARD_CONTENT.TITLE
            , BOARD_CONTENT.CONTENT
            , BOARD_CONTENT.BOARD_CATEGORY_CODE
            , BOARD_CONTENT.VIEW_COUNT
            , USER.USER_NAME.as("writerId")
            , DSL.case_()//todo create_time, updated_time 둘 중에 하나만은 안되나?
                .when(BOARD_CONTENT.UPDATED_TIME.isNull(), BOARD_CONTENT.CREATED_TIME)
                .otherwise(BOARD_CONTENT.UPDATED_TIME).as("UPDATED_TIME"))
        .from(BOARD_CONTENT)
        .join(USER)
        .on(BOARD_CONTENT.CREATED_BY.eq(USER.SEQ))
        .where(getBoardSearchCondition(boardInfoSearch))
        .orderBy(BOARD_CONTENT.CREATED_TIME.desc())
        .offset(boardInfoSearch.getPage() * boardInfoSearch.getPageSize())
        .limit(boardInfoSearch.getPageSize())
        .fetchInto(BoardAnnouncementSearchResult.class);
  }

  public List<BoardQuestionAnswerSearchResult> findBoardQuestionAnswerPage(
      BoardInfoSearch boardInfoSearch) {
    return dslContext.select(
            BOARD_CONTENT.SEQ
            , BOARD_CONTENT.TITLE
            , BOARD_CONTENT.CONTENT
            , BOARD_CONTENT.BOARD_CATEGORY_CODE
            , DSL.case_().when(BOARD_QUESTION_ANSWER_REPLY.REPLY.isNull(), "N").otherwise("Y"
            ).as("reply")
            , BOARD_CONTENT.VIEW_COUNT
            , USER.USER_NAME.as("writerId")
            , DSL.case_()//todo create_time, updated_time 둘 중에 하나만은 안되나?
                .when(BOARD_CONTENT.UPDATED_TIME.isNull(), BOARD_CONTENT.CREATED_TIME)
                .otherwise(BOARD_CONTENT.UPDATED_TIME).as("UPDATED_TIME"))
        .from(BOARD_CONTENT)
        .join(USER)
        .on(BOARD_CONTENT.CREATED_BY.eq(USER.SEQ))
        .leftJoin(BOARD_QUESTION_ANSWER_REPLY)
        .on(BOARD_QUESTION_ANSWER_REPLY.BOARD_SEQ.eq(BOARD_CONTENT.SEQ))
        .where(getBoardSearchCondition(boardInfoSearch))
        .orderBy(BOARD_CONTENT.CREATED_TIME.desc())
        .offset(boardInfoSearch.getPage() * boardInfoSearch.getPageSize())
        .limit(boardInfoSearch.getPageSize())
        .fetchInto(BoardQuestionAnswerSearchResult.class);
  }

  public Condition getBoardSearchCondition(BoardInfoSearch boardInfoSearch) {
    return searchConditionMap.getOrDefault(boardInfoSearch.getSearchConditionType(),
            keyword -> DSL.noCondition()).apply(boardInfoSearch.getKeyword())
        .and(BOARD_CONTENT.BOARD_CATEGORY_CODE.eq(boardInfoSearch.getBoardCategoryCode()));
  }

  public BoardContentEntity findBoardCommonContentDetail(long boardSeq, String boardCategoryCode) {
    return dslContext.select(BOARD_CONTENT.SEQ
            , BOARD_CONTENT.TITLE
            , BOARD_CONTENT.CONTENT
            , BOARD_CONTENT.BOARD_CATEGORY_CODE
        ).from(BOARD_CONTENT)
        .where(BOARD_CONTENT.SEQ.eq(boardSeq)
            .and(BOARD_CONTENT.BOARD_CATEGORY_CODE.eq(boardCategoryCode)))
        .fetchOneInto(BoardContentEntity.class);
  }

  public DetailForUploadBoardAttachment findBoardAttachmentDetailByBoardSeq(long boardSeq) {
    return dslContext.select(
            BOARD_ATTACHMENT.SEQ,
            BOARD_ATTACHMENT.BOARD_SEQ,
            BOARD_ATTACHMENT.BOARD_ATTACHMENT_FILE_SEQ,
            BOARD_ATTACHMENT.BOARD_ATTACHMENT_TYPE_CODE,
            BOARD_ATTACHMENT.BOARD_ATTACHMENT_ORDER,
            FILE.ORIGINAL_FILE_NAME
        ).from(BOARD_ATTACHMENT)
        .leftJoin(FILE)
        .on(BOARD_ATTACHMENT.BOARD_ATTACHMENT_FILE_SEQ.eq(FILE.SEQ))
        .where(BOARD_ATTACHMENT.BOARD_SEQ.eq(boardSeq))
        .orderBy(BOARD_ATTACHMENT.BOARD_ATTACHMENT_TYPE_CODE,
            BOARD_ATTACHMENT.BOARD_ATTACHMENT_ORDER)
        .fetchOneInto(DetailForUploadBoardAttachment.class);
  }

}
