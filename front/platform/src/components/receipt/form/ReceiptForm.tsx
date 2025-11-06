import SkeletonLoading from '@components/common/loading/SkeletonLoading'
import StepBody from '@components/common/ui/navigation/stepper/StepBody'
import StepContent from '@components/common/ui/navigation/stepper/StepContent'
import StepLabel from '@components/common/ui/navigation/stepper/StepLabel'
import Stepper from '@components/common/ui/navigation/stepper/Stepper'
import useReceiptStepsMemo from '@components/receipt/form/hook/useReceiptStepsMemo'
import ReceiptFormFooterButton from '@components/receipt/form/ReceiptFormFooterButton'
import React, { Suspense } from 'react'

import { useGetReceiptCurrentStatusCode } from '@/api/receipt-base-api/receipt-base-api'

/**
 * ReceiptForm 컴포넌트의 Props 인터페이스
 */
interface ReceiptFormProps {
  /** 판정 시퀀스 번호 */
  judgSeq: number
}

/**
 * ReceiptForm은 여러 단계로 구성된 폼을 단계별로 처리하고 표시하는 React 컴포넌트입니다.
 *
 * 이 컴포넌트는 사용자가 특정 단계를 선택하거나 다음 단계/이전 단계로 이동할 수 있도록
 * 연속적인 단계 상태와 단계를 제어하는 기능을 제공합니다.
 *
 * 내부적으로 단계 데이터(stepsData)를 관리하며, 이에 따라 현재 단계(currentStep)에 알맞은 컴포넌트(FormComponent)를
 * 동적으로 표시합니다. 또한, 사용자 인터랙션을 처리하기 위한 몇 가지 콜백 함수(handleStepClick, handleNextStep, handlePrevStep)를 제공합니다.
 *
 */
const ReceiptForm: React.FC<ReceiptFormProps> = ({ judgSeq }) => {
  // 현재 케이스 정보의 상태 코드를 가져옵니다
  const { data: stateCode } = useGetReceiptCurrentStatusCode(judgSeq)
  const { stepsData, currentStep, setCurrentStep, stepComplete } = useReceiptStepsMemo(stateCode)

  /**
   * 사용자가 특정 단계(step)를 클릭했을 때 호출되는 함수.
   * 주어진 단계의 완료 여부를 확인한 후, 완료된 상태일 경우 현재 단계를 업데이트한다.
   *
   * @param {number} stepIndex - 사용자가 클릭한 단계의 인덱스.
   */
  const handleStepClick = (stepIndex: number) => {
    if (stepsData[stepIndex].completed) {
      setCurrentStep(stepIndex)
    }
  }

  /**
   * @function handleNextStep
   *
   * @description
   * 현재 단계를 다음 단계로 이동시키는 함수. 만약 현재 단계가 전체 단계의 마지막이 아니면,
   * 현재 단계를 한 단계 증가시킵니다.
   *
   */
  const handleNextStep = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1)
      stepComplete(currentStep)
    }
  }

  /**
   * 현재 진행 중인 단계(currentStep)를 이전 단계로 이동시키는 함수.
   * currentStep이 0보다 큰 경우에만 현재 단계를 감소시킴.
   */
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  /**
   * FormComponent 변수는 현재 단계에서 렌더링해야 할 폼 컴포넌트를 동적으로 가져오기 위한 변수입니다.
   * stepsData 배열은 여러 단계별 데이터 객체를 포함하고 있으며, 각 단계는 component 속성을 통해 렌더링될 컴포넌트를 정의합니다.
   * currentStep 변수는 현재 활성화된 단계의 인덱스를 나타냅니다.
   *
   * 이 변수는 stepsData[currentStep] 객체의 component 속성을 참조하여, 해당 단계에 알맞은 폼 컴포넌트를 지정합니다.
   * 동작 중 currentStep 값이 변경되면, FormComponent에 할당된 컴포넌트도 변경됩니다.
   */
  const currentStepData = stepsData[currentStep]
  const FormComponent = currentStepData.component

  return (
    <div className="bg-white rounded-lg shadow-lg p-1 mb-3">
      <Stepper steps={stepsData} currentStep={currentStep} onStepClick={handleStepClick} />
      <StepContent>
        <StepLabel stepData={currentStepData} />
        <StepBody>
          <Suspense fallback={<SkeletonLoading />}>
            <FormComponent formId={currentStepData.formId} handleNextStep={handleNextStep} />
          </Suspense>
        </StepBody>
      </StepContent>
      <ReceiptFormFooterButton
        formId={currentStepData.formId}
        currentStep={currentStep}
        handlePrevStep={handlePrevStep}
      />
    </div>
  )
}

export default ReceiptForm
