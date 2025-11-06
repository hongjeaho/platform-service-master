package com.platform.batch.platform.ltismember.service;

import com.platform.datasource.base.dto.batch.UserEntireInfoDto;
import com.platform.datasource.base.mapper.batch.ltisMemberApi.LtisMemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class LtisMemberDataService {

  private final LtisMemberMapper ltisMemberMapper;

  public boolean saveUserEntireInfoData(UserEntireInfoDto userEntireInfoDto) {

    try {

      ltisMemberMapper.insertLtisChargeInfoIntoUser(userEntireInfoDto);
      log.info("userSeq: {}", userEntireInfoDto.getUserSeq());
      Long userSeq = userEntireInfoDto.getUserSeq();
      if (userSeq != null) {
        userEntireInfoDto.setUserSeq(userSeq);
        ltisMemberMapper.insertLtisChargeRoleIntoUserRole(userEntireInfoDto);
      } else {
        log.error("user 저장 실패, userName: {}", userEntireInfoDto.getUserId());
        return false;
      }

    } catch (DataIntegrityViolationException duplicateEx) {
      log.warn("중복 키 에러 발생 - 건너뜀: userId={}, error={}",
          userEntireInfoDto.getUserId(), duplicateEx.getMessage());
      return false;
    } catch (Exception e) {
      log.error("사용자 저장 중 일반 오류: userId={}, error={}",
          userEntireInfoDto.getUserId(), e.getMessage(), e);
      return false;
    }
    return true;
  }

}
