package com.platform.api.platform.board.announcement.dto;

import com.platform.datasource.base.dto.board.announcement.BoardAnnouncementSearchResult;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Schema(name = "BoardAnnouncementSearchResponse", description = "공지사항 결과 조회")
public class BoardAnnouncementSearchResponse {

  @Schema(name = "total", description = "전체 count")
  private int total;

  @Schema(name = "resultList", description = "조회 결과")
  private List<BoardAnnouncementSearchResult> resultList;

}
