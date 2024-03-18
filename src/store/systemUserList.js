import { makeAutoObservable, runInAction } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { message } from 'antd'
import { getSystemUsers, updateSystemUsers } from '../service/system'

class SystemUserListStore {
  systemUserList = []
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {name: 'systemUserList', properties: ['systemUserList'], storage: window.localStorage})
  }
  getSystemUserList(value) {
    this.systemUserList = value
    // getSystemUsers()
    // getSystemUsers().then(res => {
    //   runInAction(()=>{
    //     const value = res.data.page.list
    //     value.forEach(item => {
    //       item.key = item.username
    //     })
    //     this.systemUserList = value
    //   });
    // })
  }
}

export { SystemUserListStore }