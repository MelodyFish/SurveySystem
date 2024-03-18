import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { setSession, getSession } from '../../utils/session'
import routes from '../../routes'
import './index.less'

const { Sider } = Layout;
export default function MySider() {
  const nav = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const items = routes[0].children.filter(route => !route.hidden)

  items.forEach(route => {
    route.key = route.path
  })
  function routeNav(key) {
    nav(key)
    setSession('curSelect', key)
  }
  return (
    <Sider width={200} theme={'light'} >
      <Menu 
        mode="inline"
        defaultSelectedKeys={[pathname]}
        selectedKeys={[pathname]}
        // defaultOpenKeys={['sub1']}
        style={{
          height: '100%',
          borderRight: 0,
        }}
        // items={items}
        onClick={({key})=> routeNav(key)}
      >
        {
          items.map(item => {
            const { path, label, icon } = item 
            return <Menu.Item key={path} icon={icon}>{label}</Menu.Item>
          })
        }
      </Menu>
    </Sider>
  )
}
