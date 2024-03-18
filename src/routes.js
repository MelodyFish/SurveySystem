import { auth, isAdmin } from './utils/auth'
import { SnippetsOutlined, BellOutlined, TeamOutlined, CompassOutlined ,UserOutlined} from '@ant-design/icons'
import Layout from './components/Layout'
import AuthComponent from './components/AuthComponent'

import Editor from './pages/Editor'
import Questionnaire from './pages/Questionnaire'

import Page403 from './pages/Page403'
import Page404 from './pages/Page404'
console.log('isAdmin()', isAdmin())
const routes = [
  {
    // element: <AuthComponent><Layout /></AuthComponent>,
    element: <Layout />,
    children: [
      // {
      //   path: '/',
      //   element: <Home />,
      //   label: '问卷中心',
      //   icon: <SnippetsOutlined />
      // },
      {
        path: '/',
        element: <Editor />,
        label: '编辑问卷',
        icon: <CompassOutlined />,
        hidden: true
      }
    ]
  },
  {
    path: '/q/:id',
    element: <AuthComponent><Questionnaire /></AuthComponent>
  },
  {
    path: '/page403',
    element: <Page403 />
  },
  {
    path: '*',
    element: <Page404 />
  }
]

export default routes