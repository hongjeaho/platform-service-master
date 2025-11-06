package com.platform.datasource.base.repository.notice;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JNoticeAttachment;
import org.jooq.generated.tables.JNoticeInfo;
import org.jooq.generated.tables.pojos.NoticeAttachmentEntity;
import org.jooq.generated.tables.pojos.NoticeInfoEntity;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class NoticeRepository {

  private final DSLContext dslContext;

  private final JNoticeInfo NOTICE_INFO = JNoticeInfo.NOTICE_INFO;
  private final JNoticeAttachment NOTICE_ATTACHMENT = JNoticeAttachment.NOTICE_ATTACHMENT;

  /**
   * 열람공고 결과 등록 정보 저장
   *
   * @param judgSeq          재결일련번호
   * @param noticeInfoEntity 열람공고 결과 등록 정보
   */
  public Long insertOrUpdateNoticeResult(long judgSeq, NoticeInfoEntity noticeInfoEntity) {
    var seqList =  dslContext.insertInto(NOTICE_INFO,
            NOTICE_INFO.JUDG_SEQ,
            NOTICE_INFO.NOTICE_START_DATE,
            NOTICE_INFO.NOTICE_END_DATE,
            NOTICE_INFO.NEWSLETTER_DATE,
            NOTICE_INFO.CREATED_BY,
            NOTICE_INFO.CREATED_TIME
        )
        .values(
            judgSeq,
            noticeInfoEntity.getNoticeStartDate(),
            noticeInfoEntity.getNoticeEndDate(),
            noticeInfoEntity.getNewsletterDate(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).onDuplicateKeyUpdate()
        .set(NOTICE_INFO.NOTICE_START_DATE, noticeInfoEntity.getNoticeStartDate())
        .set(NOTICE_INFO.NOTICE_END_DATE, noticeInfoEntity.getNoticeEndDate())
        .set(NOTICE_INFO.NEWSLETTER_DATE, noticeInfoEntity.getNewsletterDate())
        .set(NOTICE_INFO.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(NOTICE_INFO.UPDATED_TIME, LocalDateTime.now())
        .returningResult(NOTICE_INFO.SEQ)
      .fetchInto(Long.class);

    return seqList.stream().findFirst().orElse(1L);
  }

  /**
   * 열람공고 첨부 파일을 저장한다.
   *
   * @param noticeInfoSeq          재결일련번호
   * @param noticeAttachmentEntity 열람공고 첨부 파일 정보
   */
  public void insertNoticeAttachment(long noticeInfoSeq, NoticeAttachmentEntity noticeAttachmentEntity) {
    dslContext.insertInto(NOTICE_ATTACHMENT,
            NOTICE_ATTACHMENT.NOTICE_INFO_SEQ,
            NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_TYPE_CODE,
            NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_ORDER,
            NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_FILE_SEQ,
            NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_DESCRIPTION,
            NOTICE_ATTACHMENT.PARENT_NOTICE_ATTACHMENT_SEQ,
            NOTICE_ATTACHMENT.CREATED_BY,
            NOTICE_ATTACHMENT.CREATED_TIME)
        .values(
            noticeInfoSeq,
            noticeAttachmentEntity.getNoticeAttachmentTypeCode(),
            noticeAttachmentEntity.getNoticeAttachmentOrder(),
            noticeAttachmentEntity.getNoticeAttachmentFileSeq(),
            noticeAttachmentEntity.getNoticeAttachmentDescription(),
            noticeAttachmentEntity.getParentNoticeAttachmentSeq(),
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).execute();
  }

  /**
   * 열람공고 첨부 파일 정보를 수정 한다.
   *
   * @param noticeAttachmentEntity 열람공고 첨부 파일 정보
   */
  public void updateNoticeFileDescription(NoticeAttachmentEntity noticeAttachmentEntity) {
    dslContext.update(NOTICE_ATTACHMENT)
        .set(NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_DESCRIPTION, noticeAttachmentEntity.getNoticeAttachmentDescription())
        .set(NOTICE_ATTACHMENT.UPDATED_BY, UserAccountHolder.getSeqNo())
        .set(NOTICE_ATTACHMENT.UPDATED_TIME, LocalDateTime.now())
        .where(NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_FILE_SEQ.eq(noticeAttachmentEntity.getNoticeAttachmentFileSeq()))
        .execute();
  }

  /**
   * 열람공고 첨부 파일일련번호로 삭제 한다.
   *
   * @param fileSeq 파일 일련번호
   */
  public void deleteNoticeFileByFileSeq(long fileSeq) {
    dslContext.deleteFrom(NOTICE_ATTACHMENT).where(NOTICE_ATTACHMENT.NOTICE_ATTACHMENT_FILE_SEQ.eq(fileSeq)).execute();
  }


}
