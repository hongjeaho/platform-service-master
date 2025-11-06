package com.platform.api.platform.notice.result.service.helper;


import com.platform.common.base.type.FileTypeCode;
import com.platform.common.core.service.FileService;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.notice.NoticeAttachmentFile;
import com.platform.datasource.base.repository.notice.NoticeReadRepository;
import com.platform.datasource.base.repository.notice.NoticeRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@PlatFormTransactional
@Slf4j
public class NoticeResultFileUploadHelper {

  private final FileService fileService;
  private final NoticeRepository noticeRepository;
  private final NoticeReadRepository noticeReadRepository;

  /**
   * 열람공고 첨부 파일을 등록한다.
   *
   * @param noticeInfoSeq        열람공고 일련번호
   * @param caseNo               사건번호
   * @param noticeAttachmentFile 첨부 파일 정보
   */
  public void insertOrUpdateNoticeResultFile(long noticeInfoSeq, String caseNo, NoticeAttachmentFile noticeAttachmentFile) {
    var file = noticeAttachmentFile.getAttachment().getFile();

    if (noticeAttachmentFile.getNoticeAttachmentFileSeq() != null && file == null) { //file description만 update
      noticeRepository.updateNoticeFileDescription(noticeAttachmentFile);
    } else if (noticeAttachmentFile.getNoticeAttachmentFileSeq() != null && file != null) { // 파일, description만 변경
      fileService.change(noticeAttachmentFile.getNoticeAttachmentFileSeq(), file);
      noticeRepository.updateNoticeFileDescription(noticeAttachmentFile);
    } else {
      uploadAndInsertNoticeFile(noticeInfoSeq, caseNo, noticeAttachmentFile);
    }
  }

  /**
   * 공고 결과 파일 목록에서 필요없는 파일을 제거한다.
   *
   * @param judgSeq            재결 일련번호
   * @param noticeAttachmentFileList 공고 첨부 파일 목록
   */
  public void removeNoticeResultFileList(long judgSeq,
      List<NoticeAttachmentFile> noticeAttachmentFileList) {

    Set<Long> currentFileSeqSet =
        noticeAttachmentFileList
            .stream()
            .map(NoticeAttachmentFile::getNoticeAttachmentFileSeq)
            .collect(Collectors.toSet());

    Set<Long> needToRemoveFileSeqSet =
        noticeReadRepository.findNoticeAttachmentFileByJudgSeq(judgSeq)
            .stream()
            .map(NoticeAttachmentFile::getNoticeAttachmentFileSeq)
            .filter(seq -> !currentFileSeqSet.contains(seq))
            .collect(Collectors.toSet());

    if (!needToRemoveFileSeqSet.isEmpty()) {
      for (var noticeAttachmentFileSeq : needToRemoveFileSeqSet) {
        noticeRepository.deleteNoticeFileByFileSeq(noticeAttachmentFileSeq);
        fileService.delete(noticeAttachmentFileSeq);
      }
    }
  }


  /**
   * 공고 첨부 파일을 업로드하고 데이터베이스에 등록한다.
   *
   * @param noticeInfoSeq        열람공고일련번호
   * @param caseNo               사건번호
   * @param noticeAttachmentFile 공고 첨부 파일 정보
   */
  private void uploadAndInsertNoticeFile(long noticeInfoSeq, String caseNo,
      NoticeAttachmentFile noticeAttachmentFile) {
    try {
      var file = noticeAttachmentFile.getAttachment().getFile();
      if (file == null) {
        return;
      }

      Long fileSeq = fileService.upload(caseNo, FileTypeCode.NOTICE_FILE_UPLOAD, file);
      noticeAttachmentFile.setNoticeAttachmentFileSeq(fileSeq);
      noticeRepository.insertNoticeAttachment(noticeInfoSeq, noticeAttachmentFile);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

}
