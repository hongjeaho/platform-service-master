import BaseLayout from '@/layout/BaseLayout'
import committeeMember from '@/router/admin/committeeMember'
import districtCharge from '@/router/admin/districtCharge'
import userManagement from '@/router/admin/userManagement'

export default [
  {
    path: 'admin',
    element: <BaseLayout />,
    children: [...districtCharge, ...committeeMember, ...userManagement],
  },
]
