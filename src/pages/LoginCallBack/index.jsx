import React, { Fragment ,useEffect } from 'react'
import queryString from 'query-string'
import { useStore } from '../../store/index'
import { setLocalStorage } from '../../utils/session'
import { getSystemUsers } from '../../service/system'
import { initByToken } from '../../service/auth'

export default function LoginCallback() {
  const { userStore, systemUserListStore } = useStore()
  useEffect(() => {
    window.history.replaceState(null,null,window.location.href.replace('/#', ''))
    const { access_token, redirect } = queryString.parse(window.location.search)
    const { protocol, host, hash } = window.location
    if(access_token) {
      setLocalStorage('token', access_token)
      console.log('redirect', redirect)
      console.log('window.location', window.location)
      Promise.all([initByToken(), getSystemUsers()]).then(res => {
        userStore.setUserInfo(res[0].data.userInfo)
        systemUserListStore.getSystemUserList(res[1].data.page.list)
        if(redirect) {
          window.location.href = redirect === '/'? redirect: `/#${redirect}`
        } else {
          const url = protocol + '//' + host + hash;
          window.location.href = url
        }
      })
    }
  }, [])
  return (
    <Fragment />
  )
}
