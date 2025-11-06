package com.platform.datasource.base.dto.board.announcement;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.BoardContentEntity;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Schema(name = "BoardAnnouncementDetailResult", description = "공지사항 상세정보")
public class BoardAnnouncementDetailResult {

  @Schema(name = "boardContentEntity", description = "공지사항 상세 내용")
  private BoardContentEntity boardContentEntity;
}
