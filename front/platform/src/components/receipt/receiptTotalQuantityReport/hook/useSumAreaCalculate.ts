import { useMemo } from 'react'
import { type Control, useWatch } from 'react-hook-form'

import { sumCalculate } from '@/util/caseCalculateUtils'

interface Props {
  control: Control<any>
}

const useSumCntCalculate = ({ control }: Props) => {
  const landArea = useWatch({
    control,
    name: 'landArea',
  })

  const decisionLandArea = useWatch({
    control,
    name: 'decisionLandArea',
  })

  const etcArea = useWatch({
    control,
    name: 'etcArea',
  })

  const decisionEtcArea = useWatch({
    control,
    name: 'decisionEtcArea',
  })

  const totalLandArea = useMemo(
    () => sumCalculate(landArea, decisionLandArea),
    [landArea, decisionLandArea],
  )
  const totalEtcArea = useMemo(
    () => sumCalculate(etcArea, decisionEtcArea),
    [etcArea, decisionEtcArea],
  )

  const sumArea = useMemo(() => sumCalculate(landArea, etcArea), [landArea, etcArea])
  const sumDecisionArea = useMemo(
    () => sumCalculate(decisionLandArea, decisionEtcArea),
    [decisionLandArea, decisionEtcArea],
  )
  const sumTotalArea = useMemo(
    () => sumCalculate(totalLandArea, totalEtcArea),
    [totalLandArea, totalEtcArea],
  )

  return {
    totalLandArea,
    totalEtcArea,
    sumArea,
    sumDecisionArea,
    sumTotalArea,
  }
}

export default useSumCntCalculate
