import UserManagementApplication from '@views/admin/userManagement/application/UserManagementApplication'
import UserManagementModify from '@views/admin/userManagement/modify/UserManagementModify'
import UserManagementWrite from '@views/admin/userManagement/write/UserManagementWrite'

export default [
  {
    path: 'userManagement/application',
    element: <UserManagementApplication />,
    meta: { title: '회원 관리' },
  },
  {
    path: 'userManagement/write',
    element: <UserManagementWrite />,
    meta: { title: '회원 등록' },
  },
  {
    path: 'userManagement/modify/:seq',
    element: <UserManagementModify />,
    meta: { title: '회원 수정' },
  },
]
