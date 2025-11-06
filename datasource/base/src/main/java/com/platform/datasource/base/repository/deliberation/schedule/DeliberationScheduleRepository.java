package com.platform.datasource.base.repository.deliberation.schedule;

import com.platform.common.base.context.UserAccountHolder;
import com.platform.datasource.base.config.database.PlatFormTransactional;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.generated.tables.JDeliberationStatus;
import org.jooq.generated.tables.JDeliberationTarget;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

@Repository
@PlatFormTransactional
@RequiredArgsConstructor
public class DeliberationScheduleRepository {

  private final DSLContext dslContext;
  private final JDeliberationStatus DELIBERATION_STATUS = JDeliberationStatus.DELIBERATION_STATUS;
  private final JDeliberationTarget DELIBERATION_TARGET = JDeliberationTarget.DELIBERATION_TARGET;

  /**
   * 심의 상태 삽입 또는 업데이트 메서드.
   * 심의 날짜 일련번호와 심의 그룹 일련번호를 기반으로 심의 상태 데이터를 삽입하거나 기존 데이터를 유지합니다.
   *
   * @param deliberationDateSeq 심의 날짜 일련번호
   * @param deliberationGroupSeq 심의 그룹 일련번호
   * @return 삽입되거나 업데이트된 심의 마스터 일련번호 (SEQ)
   */
  public Long insertOrUpdateDeliberationStatus(Long deliberationDateSeq, Long deliberationGroupSeq) {
    return dslContext.insertInto(DELIBERATION_STATUS,
            DELIBERATION_STATUS.SCHEDULE_DATE_SEQ,
            DELIBERATION_STATUS.SCHEDULE_GROUP_SEQ,
            DELIBERATION_STATUS.CREATED_BY,
            DELIBERATION_STATUS.CREATED_TIME
        ).values(
            deliberationDateSeq,
            deliberationGroupSeq,
            UserAccountHolder.getSeqNo(),
            LocalDateTime.now()
        ).onDuplicateKeyIgnore()
        .returningResult(DELIBERATION_STATUS.SEQ)
        .fetchOneInto(Long.class);
  }

  /**
   * 심의 대상 삽입 또는 업데이트 메서드.
   * 심의 마스터 일련번호와 대상 재결 일련번호 목록을 기반으로 심의 대상 재결 일련번호를 삽입하거나 기존 데이터를 유지합니다.
   *
   * @param deliberationStatusSeq 심의 마스터 일련번호
   * @param targetSeqList 대상 재결 일련번호 목록
   */
  public void insertOrUpdateDeliberationTarget(Long deliberationStatusSeq, List<Long> targetSeqList) {
    var rows = targetSeqList.stream()
        .map(seq -> DSL.row(deliberationStatusSeq, seq, UserAccountHolder.getSeqNo(), LocalDateTime.now()))
            .toList();
    
    dslContext.insertInto(DELIBERATION_TARGET,
        DELIBERATION_TARGET.DELIBERATION_STATUS_SEQ,
        DELIBERATION_TARGET.JUDG_SEQ,
        DELIBERATION_TARGET.CREATED_BY,
        DELIBERATION_TARGET.CREATED_TIME
        ).valuesOfRows(rows)
        .onDuplicateKeyIgnore()
        .execute();
  }

  /**
   * 심의 대상을 삭제하는 메서드.
   * 주어진 대상 재결 일련번호 목록을 기반으로 심의 대상을 제거합니다.
   *
   * @param targetSeqList 대상 재결 일련번호 목록
   */
  public void deleteDeliberationTarget(List<Long> targetSeqList) {
    dslContext.deleteFrom(DELIBERATION_TARGET)
        .where(DELIBERATION_TARGET.JUDG_SEQ.in(targetSeqList))
        .execute();
  }
}
