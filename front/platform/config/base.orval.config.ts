import { type HooksOptions, type OutputOptions } from 'orval'

export const commonOutputConfig: OutputOptions = {
  mode: 'tags-split',
  target: '../src/api',
  schemas: '../src/model',
  client: 'react-query',
  httpClient: 'axios',
  clean: true,
  prettier: true,
  mock: false,
  allParamsOptional: true,
  urlEncodeParameters: true,
  // 성능 최적화 설정
  biome: false, // prettier 사용 중이므로 비활성화
  override: {
    mutator: {
      path: '../src/util/http.ts',
      name: 'request',
    },
    formData: {
      path: '../src/util/requestFormData.ts',
      name: 'customFormDataFn',
    },
    query: {
      useQuery: true,
      useMutation: true,
      queryOptions: {
        path: './custom.query.options.ts',
        name: 'customQueryOptionsFn',
      },
    },
  },
}

export const commonHooks: Partial<HooksOptions> = {
  afterAllFilesWrite: 'prettier --write',
}
