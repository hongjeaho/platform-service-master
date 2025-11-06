import React from 'react'
import { Link } from 'react-router-dom'

import { RECEIPT_BUTTON_TEXTS } from '@/constants/receipt/receiptButtonTexts'

const ReceiptWriteButtons: React.FC = () => (
  <div className="mt-6 flex justify-center gap-5 p-3">
    <button
      type="button"
      className="px-6 py-2 rounded-md font-medium transition-all cursor-pointer bg-gray-600 text-white hover:bg-gray-700"
    >
      <Link to="/receipt/application">{RECEIPT_BUTTON_TEXTS.LIST_VIEW}</Link>
    </button>
  </div>
)

export default ReceiptWriteButtons
