import { useMemo } from 'react'
import { type Control, useWatch } from 'react-hook-form'

import { sumCalculate } from '@/util/caseCalculateUtils'

interface Props {
  control: Control<any>
}

const useSumCntCalculate = ({ control }: Props) => {
  const landCnt = useWatch({
    control,
    name: 'landCnt',
  })

  const decisionLandCnt = useWatch({
    control,
    name: 'decisionLandCnt',
  })

  const objCnt = useWatch({
    control,
    name: 'objCnt',
  })

  const decisionObjCnt = useWatch({
    control,
    name: 'decisionObjCnt',
  })

  const goodwillCnt = useWatch({
    control,
    name: 'goodwillCnt',
  })

  const decisionGoodwillCnt = useWatch({
    control,
    name: 'decisionGoodwillCnt',
  })
  const etcCnt = useWatch({
    control,
    name: 'etcCnt',
  })

  const decisionEtcCnt = useWatch({
    control,
    name: 'decisionEtcCnt',
  })

  const totalLandCnt = useMemo(
    () => sumCalculate(landCnt, decisionLandCnt),
    [landCnt, decisionLandCnt],
  )
  const totalObjCnt = useMemo(() => sumCalculate(objCnt, decisionObjCnt), [objCnt, decisionObjCnt])
  const totalGoodwillCnt = useMemo(
    () => sumCalculate(goodwillCnt, decisionGoodwillCnt),
    [goodwillCnt, decisionGoodwillCnt],
  )
  const totalEtcCnt = useMemo(() => sumCalculate(etcCnt, decisionEtcCnt), [etcCnt, decisionEtcCnt])

  const sumCnt = useMemo(
    () => sumCalculate(landCnt, objCnt) + sumCalculate(goodwillCnt, etcCnt),
    [landCnt, objCnt, goodwillCnt, etcCnt],
  )
  const sumDecisionCnt = useMemo(
    () =>
      sumCalculate(decisionLandCnt, decisionObjCnt) +
      sumCalculate(decisionGoodwillCnt, decisionEtcCnt),
    [decisionLandCnt, decisionObjCnt, decisionGoodwillCnt, decisionEtcCnt],
  )

  const sumTotalCnt = useMemo(
    () => totalLandCnt + totalObjCnt + totalGoodwillCnt + totalEtcCnt,
    [totalLandCnt, totalObjCnt, totalGoodwillCnt, totalEtcCnt],
  )

  return {
    totalLandCnt,
    totalObjCnt,
    totalGoodwillCnt,
    totalEtcCnt,
    sumCnt,
    sumDecisionCnt,
    sumTotalCnt,
  }
}

export default useSumCntCalculate
