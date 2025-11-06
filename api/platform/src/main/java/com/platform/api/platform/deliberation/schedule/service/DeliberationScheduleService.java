package com.platform.api.platform.deliberation.schedule.service;

import com.platform.api.platform.deliberation.schedule.dto.DeliberationSchedule;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import com.platform.datasource.base.repository.deliberation.schedule.DeliberationScheduleRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@PlatFormTransactional
public class DeliberationScheduleService {

  private final DeliberationScheduleRepository deliberationScheduleRepository;

  /**
   * 재결 일정 정보를 삽입하거나 업데이트합니다.
   *
   * @param deliberationSchedule 재결 일정 정보 객체로, 등록 혹은 수정에 필요한 데이터를 포함합니다.
   *                             - judgSeqList: 재결일련번호 리스트
   *                             - scheduleDate: 심의 날짜
   *                             - scheduleGroup: 심의 그룹
   */
  public void insertOrUpdateDeliberationSchedule(DeliberationSchedule deliberationSchedule) {

    var dateSeq = deliberationSchedule.getDeliberationDateSeq();
    var groupSeq = deliberationSchedule.getDeliberationGroupSeq();
    var deliberationStatusSeq = deliberationScheduleRepository.insertOrUpdateDeliberationStatus(dateSeq, groupSeq);

    deliberationScheduleRepository.insertOrUpdateDeliberationTarget(deliberationStatusSeq, deliberationSchedule.getJudgSeqList());
  }

  /**
   * 재결 일정을 삭제하는 메서드.
   * 주어진 재결일련번호 리스트를 기반으로 심의 대상을 제거합니다.
   *
   * @param judgSeqList 삭제하고자 하는 재결일련번호의 리스트
   */
  public void deleteDeliberationSchedule(List<Long> judgSeqList) {
    deliberationScheduleRepository.deleteDeliberationTarget(judgSeqList);
  }
}
