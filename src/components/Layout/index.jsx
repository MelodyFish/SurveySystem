import React from 'react'
import { useOutlet, useNavigate } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '../Header'
import Content from '../Content'
import Sider from '../Sider'
import { auth } from '../../utils/auth'

export default function MyLayout() {
  const Outlet = useOutlet()
  const nav = useNavigate()
  let value = JSON.parse(localStorage.getItem('userInfo'))?.userInfo
  if(value) {
    if(!auth()) {
      setTimeout(() => {
        nav('/page403')
      }, 300)
    }
  }
  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Header />
      <Layout style={{backgroundColor: '#f7f7f7'}}>
        {/* <Sider /> */}
        <Content>
          { Outlet }
        </Content>
      </Layout>
    </Layout>
  )
}
