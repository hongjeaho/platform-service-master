package com.platform.datasource.base.dto.board.announcement;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jooq.generated.tables.pojos.BoardContentEntity;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Schema(name = "BoardResponse", description = "게시판 리스트 조회")
@EqualsAndHashCode(callSuper = false)
public class BoardAnnouncementSearchResult extends BoardContentEntity {

  @Schema(name = "writerId", description = "작성자")
  private String writerId;

}
