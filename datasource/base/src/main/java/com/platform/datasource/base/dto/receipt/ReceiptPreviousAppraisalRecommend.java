package com.platform.datasource.base.dto.receipt;

import com.platform.datasource.base.dto.file.Attachment;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.ReceiptPreviousAppraisalRecommendEntity;
import org.springframework.web.multipart.MultipartFile;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(name = "ReceiptPreviousAppraisalRecommend", description = "협의 감졍평가 추천 정보")
@EqualsAndHashCode(callSuper = false)
public class ReceiptPreviousAppraisalRecommend extends ReceiptPreviousAppraisalRecommendEntity {

  @Schema(name = "originalFileName", description = "파일 원본이름")
  private String originalFileName;

  @Schema(name = "attachment", description = "첨부파일")
  private Attachment attachment = new Attachment();

  public void attachFile(MultipartFile multipartFile) {
    if(multipartFile == null) return;

    if (this.attachment == null) {
      this.attachment = new Attachment();
    }
    this.attachment.setFile(multipartFile);
  }

  public void attachmentSetting() {
    this.attachment = new Attachment();
    this.attachment.setFileSeq(getRecommendFileSeq());
    this.attachment.setOriginalFileName(getOriginalFileName());
  }
}
