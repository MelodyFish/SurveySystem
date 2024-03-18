import { auth, isAdmin } from './utils/auth'
import { SnippetsOutlined, BellOutlined, TeamOutlined, CompassOutlined ,UserOutlined} from '@ant-design/icons'
import Layout from './components/Layout'
import AuthComponent from './components/AuthComponent'
import RoleComponent from './components/RoleComponent'

import Home from './pages/Home'
import Template from './pages/Template'
import Group from './pages/Group'
import System from './pages/System'

import Editor from './pages/Editor'
import Settting from './pages/Settting' 
import Questionnaire from './pages/Questionnaire'

import LoginCallBack from './pages/LoginCallBack'
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
      },
      {
        path: '/template',
        element: <Template />,
        label: '通知模板',
        icon: <BellOutlined />,
        hidden: true
      },
      {
        path: '/group',
        element: <Group />,
        label: '人员分组',
        icon: <TeamOutlined />,
        hidden: true
      },
      {
        path: '/system',
        element: <RoleComponent><System /></RoleComponent>,
        // element: <System />,
        label: '系统用户',
        icon: <UserOutlined />,
        hidden: !isAdmin()
      },
      {
        path: '/setting',
        element: <Settting />,
        hidden: true
      }
    ]
  },
  {
    path: '/q/:id',
    element: <AuthComponent><Questionnaire /></AuthComponent>
  },
  {
    path: '/logincallback',
    element: <LoginCallBack />
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