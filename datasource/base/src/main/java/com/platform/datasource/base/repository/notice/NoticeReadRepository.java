package com.platform.datasource.base.repository.notice;

import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.notice.NoticeAttachmentFile;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JFile;
import org.jooq.generated.tables.JLtisStatus;
import org.jooq.generated.tables.JNoticeAttachment;
import org.jooq.generated.tables.JNoticeInfo;
import org.jooq.generated.tables.JReceiptBusinessInfo;
import org.jooq.generated.tables.pojos.NoticeInfoEntity;
import org.springframework.stereotype.Repository;

/**
 * 데이터베이스에서 공지 관련 정보를 검색하기 위한 Repository 클래스. 이 클래스는 공지 데이터와 첨부 파일에 접근하기 위한 읽기 전용 작업을 제공합니다. 데이터베이스 작업에는 jOOQ를 사용하며 읽기 전용 트랜잭션으로 구성되어 있습니다.
 */
@Repository
@PlatFormTransactional(readOnly = true)
@RequiredArgsConstructor
public class NoticeReadRepository {

  private final DSLContext dslContext;
  private final JReceiptBusinessInfo RECEIPT_BUSINESS_INFO = JReceiptBusinessInfo.RECEIPT_BUSINESS_INFO;
  private final JNoticeInfo NOTICE_INFO = JNoticeInfo.NOTICE_INFO;
  private final JNoticeAttachment NOTICE_ATTACHMENT = JNoticeAttachment.NOTICE_ATTACHMENT;
  private final JFile FILE = JFile.FILE;
  private final JLtisStatus LTIS_STATUS = JLtisStatus.LTIS_STATUS;

  /**
   * 재결 일련번호를 기반으로 열람 공고를 검색합니다.
   *
   * @param judgSeq 재결 일련번호 식별자
   * @return 열람 공고 엔티티
   */
  public NoticeInfoEntity findNoticeInfo(long judgSeq) {
    return dslContext.select(NOTICE_INFO.DOCUMENT_NUMBER
            , NOTICE_INFO.DOCUMENT_TITLE
            , NOTICE_INFO.RECEIVER
            , NOTICE_INFO.REQUEST_START_DATE
            , NOTICE_INFO.REQUEST_END_DATE
            , NOTICE_INFO.NOTICE_START_DATE
            , NOTICE_INFO.NOTICE_END_DATE
            , NOTICE_INFO.NEWSLETTER_DATE
        )
        .from(RECEIPT_BUSINESS_INFO)
        .join(LTIS_STATUS)
        .on(RECEIPT_BUSINESS_INFO.JUDG_SEQ.eq(judgSeq))
        .and(RECEIPT_BUSINESS_INFO.JUDG_SEQ.eq(LTIS_STATUS.JUDG_SEQ))
        .join(NOTICE_INFO)
        .on(NOTICE_INFO.JUDG_SEQ.eq(RECEIPT_BUSINESS_INFO.JUDG_SEQ))
        .fetchOneInto(NoticeInfoEntity.class);
  }

  /**
   * 열람 공고 시퀀스와 관련된 공지 첨부 파일을 검색합니다. 이 메서드는 주요 첨부 파일과 하위 첨부 파일을 모두 가져와서 하위 첨부 파일이 상위 첨부 파일 아래에 그룹화되는 계층적 구조로 구성합니다.
   *
   * @param judgSeq 재결 일련번호
   * @return 관련 하위 첨부 파일이 포함된 공지 첨부 파일 목록
   */
  public List<NoticeAttachmentFile> findNoticeAttachmentFileByJudgSeq(long judgSeq) {
    return dslContext.select(
            NOTICE_ATTACHMENT.SEQ
            , NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_TYPE_CODE
            , NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_ORDER
            , NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_DESCRIPTION
            , NOTICE_ATTACHMENT.PARENT_NOTICE_ATTACHMENT_SEQ
            , FILE.FILE_PATH
            , NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_FILE_SEQ
            , FILE.ORIGINAL_FILE_NAME
            , FILE.CHANGED_FILE_NAME)
        .from(NOTICE_ATTACHMENT)
        .join(FILE)
        .on(NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_FILE_SEQ.eq(FILE.SEQ))
        .join(NOTICE_INFO)
        .on(NOTICE_ATTACHMENT.NOTICE_INFO_SEQ.eq(NOTICE_INFO.SEQ))
        .where(NOTICE_INFO.JUDG_SEQ.eq(judgSeq))
        .orderBy(NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_TYPE_CODE.asc(), NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_ORDER.asc())
        .fetchInto(NoticeAttachmentFile.class);
  }

}
