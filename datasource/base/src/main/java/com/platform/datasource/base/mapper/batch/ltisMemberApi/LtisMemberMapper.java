package com.platform.datasource.base.mapper.batch.ltisMemberApi;

import com.platform.datasource.base.dto.batch.UserEntireInfoDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LtisMemberMapper {

//  List<UserEntity> findImplementorInfoIntoUserTable(int _skiprows, int _pagesize);
//
//  List<UserEntity> findDecisionUserInfoIntoUserTable(int _skiprows, int _pagesize);

  int findRoleSeqForRegisteringImplementer();

  Long insertLtisChargeInfoIntoUser(UserEntireInfoDto userEntireInfoDto);

  void insertLtisChargeRoleIntoUserRole(UserEntireInfoDto userEntireInfoDto);

}
