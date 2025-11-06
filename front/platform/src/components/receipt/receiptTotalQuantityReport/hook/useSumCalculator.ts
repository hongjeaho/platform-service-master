import type { Control } from 'react-hook-form'

import useSumAreaCalculate from './useSumAreaCalculate'
import useSumCntCalculate from './useSumCntCalculate'
import useSumPriceCalculate from './useSumPriceCalculate'

interface Props {
  control: Control<any>
}

const useSumCalculator = ({ control }: Props) => {
  const sumCntCalculate: Record<string, number> = useSumCntCalculate({ control })
  const sumAreaCalculate: Record<string, number> = useSumAreaCalculate({ control })
  const sumPriceCalculate: Record<string, number> = useSumPriceCalculate({ control })

  return {
    ...sumCntCalculate,
    ...sumAreaCalculate,
    ...sumPriceCalculate,
  }
}

export default useSumCalculator
