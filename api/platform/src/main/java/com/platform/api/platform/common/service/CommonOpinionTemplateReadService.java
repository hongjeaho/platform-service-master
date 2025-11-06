package com.platform.api.platform.common.service;

import com.platform.api.platform.config.cache.CacheNames;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.opinion.OpinionTemplateReadRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.generated.tables.pojos.OpinionTemplateEntity;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional(readOnly = true)
public class CommonOpinionTemplateReadService {

  private final OpinionTemplateReadRepository opinionTemplateReadRepository;


  /**
   * 의견작성 템플릿 리스트를 조회 한다.
   *
   * @return 의견작성 템플릿 리스트
   */
  @Cacheable(cacheNames = CacheNames.OPINION_TEMPLATE_CACHE_NAME)
  public List<OpinionTemplateEntity> getOpinionTemplateEntityList() {
    return opinionTemplateReadRepository.findCaseTemplateList();
  }

}
