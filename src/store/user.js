import { makeAutoObservable, runInAction } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { initByToken } from '../service/auth'

class UserStore {
  userInfo = null
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {name: 'userInfo', properties: ['userInfo'], storage: window.localStorage})
  }
  getUserInfo() {
    return this.userInfo
  }
  setUserInfo(value) {
    this.userInfo = value
    // initByToken()
    // initByToken().then(res => {
    //   runInAction(()=>{
    //     this.userInfo = res.data.userInfo
    //     // if(redirect) {
    //     //   window.location.href = redirect === '/'? redirect: `/#${redirect}`
    //     // }
    //   })
    // })
  }
}

export { UserStore }