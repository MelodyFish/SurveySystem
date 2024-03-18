import React, { Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { isAdmin } from '../../utils/auth'

function RoleComponent(props) {
  const { children } = props
  const nav = useNavigate()
  useEffect(() => {
    if(!isAdmin()) {
      nav('/page403')
    }
  })
  return (
    <Fragment>
      {children}
    </Fragment>
  )
}
export default observer(RoleComponent)
