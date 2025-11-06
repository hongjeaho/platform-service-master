package com.platform.datasource.base.dto.file;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.FileEntity;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Attachment extends FileEntity {
  private MultipartFile file;
  private Long fileSeq;;
  public MultipartFile getFile() {
    return (file == null || "blob".equals(file.getOriginalFilename())) ? null : file;
  }
}