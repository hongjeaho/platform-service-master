package com.platform.api.platform.deliberation.schedule.service;

import com.platform.api.platform.deliberation.schedule.dto.DeliberationScheduleSearchResponse;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.dto.deliberation.schedule.DeliberationScheduleSearch;
import com.platform.datasource.base.repository.deliberation.schedule.DeliberationScheduleSearchReadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class DeliberationScheduleReadService {

  private final DeliberationScheduleSearchReadRepository deliberationScheduleSearchReadRepository;

  public DeliberationScheduleSearchResponse getDeliberationScheduleList(DeliberationScheduleSearch deliberationScheduleSearch) {
    return DeliberationScheduleSearchResponse.builder()
        .total(deliberationScheduleSearchReadRepository.findTotalSize(deliberationScheduleSearch))
        .resultList(deliberationScheduleSearchReadRepository.findPage(deliberationScheduleSearch))
        .build();
  }
}
