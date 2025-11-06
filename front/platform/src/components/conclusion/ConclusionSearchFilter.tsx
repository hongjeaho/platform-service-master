// 1. React 및 외부 라이브러리
// 2. 내부 모듈 (경로 별칭 사용)
import ResetButton from '@components/common/button/ResetButton'
import SearchButton from '@components/common/button/SearchButton'
import InputCheckBox from '@components/common/input/checkBox/InputCheckBox'
import InputDatePickerRangeBox from '@components/common/input/datePickerBox/InputDatePickerRangeBox'
import InputTextBox from '@components/common/input/inputBox/InputTextBox'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

// 3. 타입 및 상수
import { CONCLUSION_PROGRESS_STATUS_OPTIONS } from '@/constants/conclusion/conclusionStatus'
import type { GetConclusionInfoListParams } from '@/model/getConclusionInfoListParams'

// 4. 스타일
import styles from './ConclusionSearchFilter.module.css'

interface ConclusionSearchFilterProps {
  onSubmit: SubmitHandler<GetConclusionInfoListParams>
}

const ConclusionSearchFilter: React.FC<ConclusionSearchFilterProps> = ({ onSubmit }) => {
  const { handleSubmit, register, control, reset } = useForm<GetConclusionInfoListParams>({
    defaultValues: {
      keyword: undefined,
      startRecepDt: undefined,
      endRecepDt: undefined,
      statusCodeList: [],
    },
  })

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
        <div className={styles.formCard}>
          <div className={styles.formContent}>
            {/* 검색 키워드 */}
            <div className={styles.fieldRow}>
              <label htmlFor="keyword" className={styles.label}>
                사건번호 또는 사업명
              </label>
              <InputTextBox
                id="keyword"
                placeholder="사건번호 혹은 사업명"
                type="text"
                register={register}
              />
            </div>
            {/* 접수일 */}
            <div className={styles.fieldRow}>
              <label className={styles.label}>접수일</label>
              <InputDatePickerRangeBox
                control={control}
                startId="recepStartDt"
                endId="recepEndDt"
              />
            </div>

            {/* 검토 진행현황 */}
            <div className={styles.fieldRow}>
              <label className={styles.label}>검토 진행현황</label>
              <div className={styles.checkboxContainer}>
                <InputCheckBox
                  id={'statusCodeList'}
                  control={control}
                  options={CONCLUSION_PROGRESS_STATUS_OPTIONS}
                />
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className={styles.buttonArea}>
              <SearchButton type="submit" />
              <ResetButton onClick={() => reset()} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ConclusionSearchFilter
