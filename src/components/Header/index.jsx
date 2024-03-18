import React from 'react'
import { Layout } from 'antd'
import { useStore } from '../../store/index'
import './index.less'

const { Header } = Layout
export default function MyHeader() {
  const { userStore } = useStore()
  const { cn } = userStore.userInfo || {cn:''}
  return (
    <Header className='header'>
      <h2 onClick={()=>window.location.href='/'}>HYGON 问卷系统</h2>
      <h3>{cn}</h3>
      {/* <h3>用户名</h3> */}
    </Header> 
  )
}
