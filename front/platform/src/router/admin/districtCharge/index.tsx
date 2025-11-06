import DistrictChargesApplication from '@views/admin/districtCharge/application/DistrictChargesApplication'
import DistrictChargeModify from '@views/admin/districtCharge/modify/DistrictChargeModify'
import DistrictChargeWrite from '@views/admin/districtCharge/write/DistrictChargeWrite'

import BaseLayout from '@/layout/BaseLayout'

export default [
  {
    path: 'districtCharge',
    element: <BaseLayout />,
    children: [
      {
        path: 'application',
        element: <DistrictChargesApplication />,
        meta: { title: '구별 담당자' },
      },
      {
        path: 'write',
        element: <DistrictChargeWrite />,
        meta: { title: '구별 담당자 등록' },
      },
      {
        path: 'modify/:seq',
        element: <DistrictChargeModify />,
        meta: { title: '구별 담당자 수정' },
      },
    ],
  },
]
