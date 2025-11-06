import CommitteeMembersApplication from '@views/admin/committeeMember/application/CommitteeMembersApplication'
import CommitteeMemberModify from '@views/admin/committeeMember/modify/CommitteeMemberModify'
import CommitteeMemberWrite from '@views/admin/committeeMember/write/CommitteeMemberWrite'

import BaseLayout from '@/layout/BaseLayout'

export default [
  {
    path: 'committeeMember',
    element: <BaseLayout />,
    children: [
      {
        path: 'application',
        element: <CommitteeMembersApplication />,
        meta: { title: '위원회 명단' },
      },
      {
        path: 'write',
        element: <CommitteeMemberWrite />,
        meta: { title: '위원회 구성원 등록' },
      },
      {
        path: 'modify/:seq',
        element: <CommitteeMemberModify />,
        meta: { title: '위원회 구성원 수정' },
      },
    ],
  },
]
