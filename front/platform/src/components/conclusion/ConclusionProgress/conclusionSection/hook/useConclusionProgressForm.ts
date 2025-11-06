import { useForm } from 'react-hook-form'

import type { ConclusionContent } from '@/model'

interface UseConclusionProgressForm {
  defaultValues: ConclusionContent | undefined
}

const useConclusionProgressForm = ({ defaultValues }: UseConclusionProgressForm) => {
  return useForm<ConclusionContent>({
    defaultValues: {
      ...defaultValues,
      attachment: {
        originalFileName: defaultValues?.originalFileName,
        fileSeq: defaultValues?.conclusionFileSeq,
      },
    },
  })
}
export default useConclusionProgressForm
