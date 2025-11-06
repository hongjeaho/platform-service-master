package com.platform.api.platform.references.map.service;

import com.platform.api.platform.references.map.dto.ReferencesMapResponse;
import com.platform.datasource.base.dto.reference.map.ReferencesMapSearch;
import com.platform.datasource.base.repository.reference.MapSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReferencesMapReadService {

  private final MapSearchRepository mapSearchRepository;

  public ReferencesMapResponse getReferencesMapList(ReferencesMapSearch referencesMapSearch) {
    return ReferencesMapResponse.builder()
        .totalCount(mapSearchRepository.findTotalSize(referencesMapSearch))
        .list(mapSearchRepository.findMapSearchCases(referencesMapSearch))
        .build();
  }
}
