package com.platform.datasource.base.dto.opinioin;

import com.platform.datasource.base.dto.file.Attachment;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.OpinionCaseTemplateEntity;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = false)
@Schema(name = "opinionCaseTemplate", description = "의견 마스터 정보")
public class OpinionCaseTemplate extends OpinionCaseTemplateEntity {

  private String templateName;
  private boolean templateRequired;
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
    this.attachment.setFileSeq(getOpinionFileSeq());
    this.attachment.setOriginalFileName(getOriginalFileName());
  }

  // jooq에서 이생성자를 사용하여 데이터를 매핑 하고 있음
  @SuppressWarnings("unused")
  public OpinionCaseTemplate(OpinionCaseTemplate opinionCaseTemplate) {
    super(opinionCaseTemplate);
    this.templateName = opinionCaseTemplate.getTemplateName();
    this.templateRequired = opinionCaseTemplate.isTemplateRequired();
    this.originalFileName = opinionCaseTemplate.getOriginalFileName();
    this.attachmentSetting();
  }

  public static @NotNull OpinionCaseTemplate ofNoTemplateInfo(long judgSeq) {
    var opinionTemplate = new OpinionCaseTemplate();
    opinionTemplate.setJudgSeq(judgSeq);
    opinionTemplate.setOpinionTemplateSeq(9999L);
    return opinionTemplate;
  }
}
