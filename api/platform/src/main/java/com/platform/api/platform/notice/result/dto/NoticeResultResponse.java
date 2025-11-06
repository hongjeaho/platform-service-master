package com.platform.api.platform.notice.result.dto;

import com.platform.datasource.base.dto.notice.NoticeAttachmentFile;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.NoticeInfoEntity;

@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
@Builder
@Schema(name = "NoticeResultResponse", description = "열람공고  정보")
public class NoticeResultResponse {

  @Schema(name = "noticeDetail", description = "열람공고  작성 데이터 ")
  private NoticeInfoEntity noticeDetail;
  @Schema(name = "noticeAttachmentFileList", description = "열람공고  첨부파일")
  private List<NoticeAttachmentFile> noticeAttachmentFileList;
}
