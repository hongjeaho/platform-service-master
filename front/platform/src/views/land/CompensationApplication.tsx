import TabContent from '@components/common/ui/navigation/tab/TabContent'
import ExpropriationCompensation from '@components/land/compensationApplication/ExpropriationCompensation'
import LandAcquisitionSystem from '@components/land/compensationApplication/LandAcquisitionSystem'
import React, { useState } from 'react'

const tabs = [
  { label: '토지수용제도란', id: 1 },
  { label: '수용보상금안내', id: 2 },
]

const CompensationApplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1)
  return (
    <TabContent tabs={tabs} activeTab={activeTab} setActiveTab={id => setActiveTab(id)}>
      <>
        {activeTab === 1 && <LandAcquisitionSystem />}
        {activeTab === 2 && <ExpropriationCompensation />}
      </>
    </TabContent>
  )
}

export default CompensationApplication
