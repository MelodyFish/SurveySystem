import { makeAutoObservable, runInAction } from 'mobx'
import { makePersistable } from 'mobx-persist-store'
import { queryStaff, queryAllGroup } from '../service/common'

class GroupStore {
  staffList = []
  constructor() {
    makeAutoObservable(this)
    makePersistable(this, {name: 'staffList', properties: ['staffList'], storage: window.localStorage})
  }
  // getUserInfo() {
  //   return this.userInfo
  // }
  setGroupList() {
    queryStaff().then(res => {
      runInAction(()=>{
        const userList = res.data.userList
        userList.forEach(item => {
          item.key = item.username
        })
        this.staffList = userList
      });
    })
  }
}

export { GroupStore }