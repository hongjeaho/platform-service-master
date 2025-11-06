package com.platform.datasource.base.dto.board.base;

import com.platform.datasource.base.dto.file.Attachment;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.BoardAttachmentEntity;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(name = "DetailForUploadBoardAttachment", description = "사건 접수 첨부파일 등록")
@EqualsAndHashCode(callSuper = false)
public class DetailForUploadBoardAttachment extends BoardAttachmentEntity {

  @Schema(name = "originalFileName", description = "파일 원본이름")
  private String originalFileName;

  @Schema(name = "attachment", description = "첨부파일")
  private Attachment attachment = new Attachment();

  public void attachFile(MultipartFile multipartFile) {
    if (multipartFile == null) {
      return;
    }
    if (attachment == null) {
      this.attachment = new Attachment();
    }
    this.attachment.setFile(multipartFile);
  }

  public void setResultSeqOfUploadFile(Long seq) {

    this.attachment.setFileSeq(seq);
    this.setBoardAttachmentFileSeq(seq);

  }

  public void attachmentSetting() {
    this.attachment = new Attachment();
    this.attachment.setFileSeq(getBoardAttachmentFileSeq());
    this.attachment.setOriginalFileName(getOriginalFileName());
  }


}
