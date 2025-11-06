package com.platform.datasource.base.dto.conclusion;

import com.platform.datasource.base.dto.file.Attachment;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.ConclusionContentEntity;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Schema(name = "ConclusionContent", description = "재결관 검토 의견 정보.")
public class ConclusionContent extends ConclusionContentEntity {

  private String originalFileName;

  private Attachment attachment;

  public void attachFile(MultipartFile multipartFile) {
    if (multipartFile == null) {
      return;
    }

    if (this.attachment == null) {
      this.attachment = new Attachment();
    }
    this.attachment.setFile(multipartFile);
  }
}