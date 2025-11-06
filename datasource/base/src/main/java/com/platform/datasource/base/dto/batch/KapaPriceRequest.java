package com.platform.datasource.base.dto.batch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class KapaPriceRequest {

    // pnu 코드
    private String pnu;

    // 기준 년도
    private String year;

    // 시군구 코드
    private String reg;

    // 표준지 번호
    private int num;
}
