import BoardAnnouncementApplication from '@views/board/announcement/application/BoardAnnouncementApplication'
import BoardAnnouncementView from '@views/board/announcement/view/BoardAnnouncementView'

export default [
  {
    path: 'announcement/application',
    element: <BoardAnnouncementApplication />,
  },
  {
    path: 'announcement/application/:boardSeq',
    element: <BoardAnnouncementView isUpdate={false} />,
  },
  {
    path: 'announcement/write',
    element: <BoardAnnouncementView isUpdate={false} />,
  },
  {
    path: 'announcement/update/:boardSeq',
    element: <BoardAnnouncementView isUpdate={true} />,
  },
]
