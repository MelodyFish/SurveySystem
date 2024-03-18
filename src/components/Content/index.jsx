import React, { useState } from 'react'
import { Layout } from 'antd'
// import { DeleteOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons'
import './index.less'

const { Content } = Layout
export default function MyContent(props) {
  const { children } = props
  return (
    <Content className='content'>
      { children }
    </Content>
  )
}
