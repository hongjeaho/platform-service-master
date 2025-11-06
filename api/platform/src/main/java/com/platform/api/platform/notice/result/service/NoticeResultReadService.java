package com.platform.api.platform.notice.result.service;

import com.platform.api.platform.notice.result.dto.NoticeResultResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.notice.NoticeAttachmentFile;
import com.platform.datasource.base.repository.notice.NoticeReadRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 열람공고 조회 애플리케이션 서비스
 * <p>
 * 열람공고 조회 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@PlatFormTransactional(readOnly = true)
public class NoticeResultReadService {

  private final NoticeReadRepository noticeReadRepository;

  /**
   * 열람공고 정보를 조회합니다.
   *
   * @param judgSeq 재결 일련번호
   * @return 열람공고 정보 (열람공고 상세 정보 및 파일 목록 포함)
   */
  public NoticeResultResponse getNoticeResponse(Long judgSeq) {
    List<NoticeAttachmentFile> noticeAttachmentFile = noticeReadRepository.findNoticeAttachmentFileByJudgSeq(judgSeq);
    noticeAttachmentFile.forEach(NoticeAttachmentFile::attachmentSetting);

    return NoticeResultResponse.builder()
        .noticeDetail(noticeReadRepository.findNoticeInfo(judgSeq))
        .noticeAttachmentFileList(noticeAttachmentFile)
        .build();
  }
}
