package com.platform.datasource.base.dto.notice;

import com.platform.datasource.base.dto.file.Attachment;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.NoticeAttachmentEntity;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(name = "NoticeAttachmentFile", description = "열람공고 결과등록에 필요한 파일을 조회한다.")
public class NoticeAttachmentFile extends NoticeAttachmentEntity {

  @Schema(name = "originalFileName", description = "열람공고 첨부 제목")
  private String originalFileName;
  @Schema(name = "changedFileName", description = "열람공고 첨부 제목")
  private String changedFileName;


  @Schema(name = "attachment", description = "첨부파일")
  private Attachment attachment;

  public void attachFile(MultipartFile multipartFile) {
    if(multipartFile == null) return;

    if (this.attachment == null) {
      this.attachment = new Attachment();
    }
    this.attachment.setFile(multipartFile);
  }

  public void attachmentSetting() {
    this.attachment = new Attachment();
    this.attachment.setFileSeq(getNoticeAttachmentFileSeq());
    this.attachment.setOriginalFileName(getOriginalFileName());
  }
}
