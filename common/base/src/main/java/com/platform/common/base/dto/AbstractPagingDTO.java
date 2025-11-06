package com.platform.common.base.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AbstractPagingDTO implements Serializable {

  @Schema(description = "현재 페이지", example = "0")
  private int page = 0;
  @Schema(description = "노출 페이지", example = "100")
  private int pageSize = 100;
}
