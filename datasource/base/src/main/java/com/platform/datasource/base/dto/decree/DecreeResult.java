package com.platform.datasource.base.dto.decree;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(name = "DecreeResult", description = "법령 전체 내용 조회 결과")
public class DecreeResult {

  @Schema(name = "decreeSeq", description = "법령 일련번호")
  private final long decreeSeq;

  @Schema(name = "decreeDetailSeq", description = "각 조문 상세 데이터의 일련번호")
  private final long decreeDetailSeq;

  @Schema(name = "decreeName", description = "법령명")
  private String decreeName;

  @Schema(name = "articleNo", description = "해당 조문")
  private String articleNo;

  @Schema(name = "decreeCategoryCode", description = "법령 본문")
  private String decreeCategoryCode;

  @Schema(name = "refCount", description = "참조 횟수")
  private Long refCount;

  @Schema(name = "viewCount", description = "조회수")
  private Long viewCount;

}
