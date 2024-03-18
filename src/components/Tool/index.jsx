import React from 'react'
import './index.less'

export default function Tool(props) {
  const { children } = props
  return (
    <div className='tool-box'>
      {children}
    </div>
  )
}
