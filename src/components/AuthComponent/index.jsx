import React, { Fragment, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import ssoconfig from '../../assets/data/ssoconfig.json';

function AuthComponent(props) {
  const { children } = props
  const location = useLocation()
  const { pathname, hash } = location
  let userInfo = JSON.parse(localStorage.getItem('userInfo'))?.userInfo
  if (!userInfo) {
    const url = window.location.protocol + '//' + window.location.host + '/#/logincallback';
    window.location.href = ssoconfig.ssourl + '?app=tsv&returnUrl=' + encodeURIComponent(url) +'&redirect=' + encodeURIComponent(hash?hash:pathname);
  }
  return (
    <Fragment>
      {children}
    </Fragment>
  )
}
export default observer(AuthComponent)
