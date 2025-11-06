// 1. React 및 외부 라이브러리
// 2. 내부 모듈 (경로 별칭 사용)
import { BasicButton } from '@components/common/button'
import ContainerTitle from '@components/common/ContainerTitle'
import InputTextareaBox from '@components/common/input/inputBox/InputTextareaBox'
import InputSingleFileUploadBox from '@components/common/input/uploadBox/InputSingleFileUploadBox'
import ViewLoading from '@components/common/loading/ViewLoading'
import useConclusionProgressForm from '@components/conclusion/ConclusionProgress/conclusionSection/hook/useConclusionProgressForm'
import UseConclusionProgressSubmit from '@components/conclusion/ConclusionProgress/conclusionSection/hook/useConclusionProgressSubmit'
import ReferenceDialog from '@components/conclusion/ConclusionProgress/referenceDialog/ReferenceDialog.tsx'
import { Search } from 'lucide-react'
import React, { useState } from 'react'

// 3. 타입
import type { ConclusionContent } from '@/model'

// 4. 스타일
import styles from './ConclusionProgressForm.module.css'

interface ConclusionProgressFormProps {
  judgSeq: number
  opinionTemplateSeq: number
  conclusionContent: ConclusionContent | undefined
}

const ConclusionProgressForm: React.FC<ConclusionProgressFormProps> = ({
  judgSeq,
  opinionTemplateSeq,
  conclusionContent,
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useConclusionProgressForm({
    defaultValues: conclusionContent,
  })

  const { onSubmit, isPending } = UseConclusionProgressSubmit({
    judgSeq,
    opinionTemplateSeq,
  })

  const [isOpenReferenceConclusionOpinion, setOpenReferenceConclusionOpinion] = useState(false)
  const [isOpenReferenceDecree, setOpenReferenceDecree] = useState(false)
  const [isOpenReferencePrecedent, setOpenReferencePrecedent] = useState(false)

  const handleConclusionOpinionPopupSelect = (items: string) => {
    setValue('opinionContent', items)
    setOpenReferenceConclusionOpinion(false)
  }

  const handleDecreePopupSelect = (items: string) => {
    setValue('decreeContent', items)
    setOpenReferenceDecree(false)
  }

  const handlePrecedentPopupSelect = (items: string) => {
    setValue('precedentContent', items)
    setOpenReferencePrecedent(false)
  }

  return (
    <div className={styles.container}>
      <ReferenceDialog
        referenceType="conclusion"
        open={isOpenReferenceConclusionOpinion}
        onSelect={handleConclusionOpinionPopupSelect}
        onClose={() => setOpenReferenceConclusionOpinion(false)}
      />
      <ReferenceDialog
        referenceType="decree"
        open={isOpenReferenceDecree}
        onSelect={handleDecreePopupSelect}
        onClose={() => setOpenReferenceDecree(false)}
      />
      <ReferenceDialog
        referenceType="precedent"
        open={isOpenReferencePrecedent}
        onSelect={handlePrecedentPopupSelect}
        onClose={() => setOpenReferencePrecedent(false)}
      />

      <form
        id={'opinionCaseTemplateConclusionForm'}
        autoComplete={'off'}
        onSubmit={handleSubmit(onSubmit)}
      >
        <ViewLoading message={'검토 의견을 저장중 입니다.'} isVisible={isPending} />
        <div className={styles.sectionHeader}>
          <ContainerTitle title={'검토의견'} className={'pt-3'} />
          <BasicButton
            className={styles.searchButtonContent}
            variant={'outline'}
            onClick={() => setOpenReferenceConclusionOpinion(true)}
          >
            <span>찾아 보기</span>
            <Search size={16} className={styles.searchIcon} />
          </BasicButton>
        </div>
        <InputTextareaBox
          id={'opinionContent'}
          rows={8}
          register={register}
          error={errors.opinionContent}
          rules={{ required: '검토의견을 작성해 주세요' }}
        />
        <div className={styles.sectionHeader}>
          <ContainerTitle title={'법령'} className={'pt-3'} />
          <BasicButton
            className={styles.searchButtonContent}
            variant={'outline'}
            onClick={() => setOpenReferenceDecree(true)}
          >
            <span>찾아 보기</span>
            <Search size={16} className={styles.searchIcon} />
          </BasicButton>
        </div>
        <InputTextareaBox id={'decreeContent'} register={register} rows={8} />
        <div className={styles.sectionHeader}>
          <ContainerTitle title={'판례'} className={'pt-3'} />
          <BasicButton
            className={styles.searchButtonContent}
            variant={'outline'}
            onClick={() => setOpenReferencePrecedent(true)}
          >
            <span>찾아 보기</span>
            <Search size={16} className={styles.searchIcon} />
          </BasicButton>
        </div>
        <InputTextareaBox id={'precedentContent'} register={register} rows={8} />
        <ContainerTitle title={'재결관 첨부파일'} className={'pt-3'} />
        <InputSingleFileUploadBox id={`attachment`} control={control} />
        <div className={styles.buttonContainer}>
          <button type={'submit'} className={styles.submitButton}>
            의견 저장
          </button>
        </div>
      </form>
    </div>
  )
}
export default ConclusionProgressForm
