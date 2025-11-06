package com.platform.batch.platform.ltis.service;

import com.platform.datasource.base.mapper.batch.ltisApi.LtisDataMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class LtisDataService {

  private final LtisDataMapper ltisDataMapper;

  @Autowired
  public LtisDataService(LtisDataMapper ltisDataMapper
  ) {
    this.ltisDataMapper = ltisDataMapper;
  }
  
  public void mergeIntoLtisInfo() {
    ltisDataMapper.mergeIntoLtisInfo();
  }

  public void mergeIntoLtisCharge() {
    ltisDataMapper.mergeIntoLtisCharge();
  }

  public void mergeIntoLtisStatus() {
    ltisDataMapper.mergeIntoLtisStatus();
  }

  public void mergeIntoLtisPnu() {
    ltisDataMapper.insertPnu();
  }

  public void deleteLtisTmpData() {
    ltisDataMapper.deleteLtisTmpData();
  }
}
