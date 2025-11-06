import { useMemo } from 'react'
import { type Control, useWatch } from 'react-hook-form'

import { sumCalculate } from '@/util/caseCalculateUtils'

interface Props {
  control: Control<any>
}

const useSumPriceCalculate = ({ control }: Props) => {
  const landPrice = useWatch({
    control,
    name: 'landPrice',
  })

  const decisionLandPrice = useWatch({
    control,
    name: 'decisionLandPrice',
  })

  const totalLandPrice = useMemo(
    () => sumCalculate(landPrice, decisionLandPrice),
    [landPrice, decisionLandPrice],
  )

  const objPrice = useWatch({
    control,
    name: 'objPrice',
  })

  const decisionObjPrice = useWatch({
    control,
    name: 'decisionObjPrice',
  })

  const totalObjPrice = useMemo(
    () => sumCalculate(objPrice, decisionObjPrice),
    [objPrice, decisionObjPrice],
  )

  const goodwillPrice = useWatch({
    control,
    name: 'goodwillPrice',
  })

  const decisionGoodwillPrice = useWatch({
    control,
    name: 'decisionGoodwillPrice',
  })

  const totalGoodwillPrice = useMemo(
    () => sumCalculate(goodwillPrice, decisionGoodwillPrice),
    [goodwillPrice, decisionGoodwillPrice],
  )

  const etcPrice = useWatch({
    control,
    name: 'etcPrice',
  })

  const decisionEtcPrice = useWatch({
    control,
    name: 'decisionEtcPrice',
  })

  const totalEtcPrice = useMemo(
    () => sumCalculate(etcPrice, decisionEtcPrice),
    [etcPrice, decisionEtcPrice],
  )

  const sumPrice = useMemo(
    () => sumCalculate(landPrice, objPrice) + sumCalculate(goodwillPrice, etcPrice),
    [landPrice, objPrice, goodwillPrice, etcPrice],
  )
  const sumDecisionPrice = useMemo(
    () =>
      sumCalculate(decisionLandPrice, decisionObjPrice) +
      sumCalculate(decisionGoodwillPrice, decisionEtcPrice),
    [decisionLandPrice, decisionObjPrice, decisionGoodwillPrice, decisionEtcPrice],
  )

  const sumTotalPrice = useMemo(
    () => totalLandPrice + totalObjPrice + totalGoodwillPrice + totalEtcPrice,
    [totalLandPrice, totalObjPrice, totalGoodwillPrice, totalEtcPrice],
  )

  return {
    totalLandPrice,
    totalObjPrice,
    totalGoodwillPrice,
    totalEtcPrice,
    sumPrice,
    sumDecisionPrice,
    sumTotalPrice,
  }
}

export default useSumPriceCalculate
