import React from 'react'

import { RECEIPT_BUTTON_TEXTS } from '@/constants/receipt/receiptButtonTexts'
import { TOTAL_STEPS } from '@/constants/receipt/receiptSteps'

interface ReceiptFormFooterButtonProps {
  formId: string
  currentStep: number
  handlePrevStep: () => void
}

const ReceiptFormFooterButton: React.FC<ReceiptFormFooterButtonProps> = ({
  formId,
  currentStep,
  handlePrevStep,
}) => {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === TOTAL_STEPS - 1

  return (
    <div className="mt-6 flex justify-between p-3">
      <button
        onClick={handlePrevStep}
        disabled={isFirstStep}
        className={`px-6 py-2 rounded-md font-medium transition-all cursor-pointer ${
          isFirstStep
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        {RECEIPT_BUTTON_TEXTS.PREVIOUS_STEP}
      </button>
      <div className="flex gap-4">
        <button
          type="submit"
          form={formId}
          className="px-6 py-2 rounded-md font-medium transition-all cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
        >
          {isLastStep ? RECEIPT_BUTTON_TEXTS.COMPLETE : RECEIPT_BUTTON_TEXTS.NEXT_STEP}
        </button>
      </div>
    </div>
  )
}

export default ReceiptFormFooterButton
