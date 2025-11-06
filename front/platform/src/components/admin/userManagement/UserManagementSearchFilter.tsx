import ResetButton from '@components/common/button/ResetButton.tsx'
import SearchButton from '@components/common/button/SearchButton.tsx'
import InputSelectBox from '@components/common/input/selectBox/InputSelectBox.tsx'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'

import InputCheckBox from '@/components/common/input/checkBox/InputCheckBox'
import InputTextBox from '@/components/common/input/inputBox/InputTextBox'
import type { GetAdminUserManagementListParams } from '@/model/getAdminUserManagementListParams.ts'

/**
 * UserSearchFilterProps 인터페이스
 *
 * @interface UserSearchFilterProps
 * @property {SubmitHandler<GetAdminUserManagementListParams>} onSubmit - 검색 폼 제출 시 호출되는 함수
 */
interface UserSearchFilterProps {
  onSubmit: SubmitHandler<GetAdminUserManagementListParams>
}

/**
 * 사용자 검색 필터 컴포넌트
 *
 * 사용자가 회원 목록을 검색할 수 있는 필터 폼을 제공합니다.
 * 아이디 또는 이름을 선택하여 검색할 수 있는 기능을 포함합니다.
 *
 * @component
 * @param {UserSearchFilterProps} props - 컴포넌트 속성
 * @param {SubmitHandler<UserSearchFilterProps>} props.onSubmit - 검색 폼 제출 시 호출되는 함수
 */
const UserManagementSearchFilter: React.FC<UserSearchFilterProps> = ({ onSubmit }) => {
  /**
   * react-hook-form 훅을 사용하여 폼 상태 관리
   *
   * @property {Function} handleSubmit - 폼 제출 처리 함수
   * @property {Function} register - 입력 필드 등록 함수
   * @property {Function} reset - 폼 초기화 함수
   * @property {Object} control - 제어 컴포넌트를 위한 컨트롤 객체
   */
  const { handleSubmit, register, reset, control } = useForm<GetAdminUserManagementListParams>({
    defaultValues: {
      searchType: 'all',
      keyword: undefined,
      userRoles: undefined,
    },
  })

  return (
    <div className="w-full mx-auto pb-6">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 space-y-4">
            {/* 검색 조건 및 검색어 */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">
                검색 조건
              </label>
              <div className="flex items-center gap-4 flex-1">
                <InputSelectBox
                  id="searchType"
                  control={control}
                  options={[
                    { value: 'all', label: '전체' },
                    { value: 'userId', label: '아이디' },
                    { value: 'userName', label: '이름' },
                  ]}
                  className="w-32"
                />
                <InputTextBox
                  type="text"
                  id="keyword"
                  register={register}
                  placeholder="검색어를 입력해주세요"
                />
              </div>
            </div>
            {/* 권한 구분 */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">
                권한 구분
              </label>
              <InputCheckBox
                id="userRoles"
                control={control}
                options={[
                  { value: 'IMPLEMENTER', label: '사업 시행자' },
                  { value: 'DECISION', label: '재결관' },
                  { value: 'DELIBERATE', label: '위원' },
                  { value: 'ADMIN', label: '관리자' },
                ]}
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-4 pt-4 justify-center">
              <SearchButton type="submit" />
              <ResetButton onClick={() => reset()} />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default UserManagementSearchFilter
