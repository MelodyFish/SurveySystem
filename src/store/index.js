import { createContext, useContext } from 'react'
import { UserStore } from './user'
import { GroupStore } from './group'
import { SystemUserListStore } from './systemUserList'


class RootStore {
  constructor() {
    this.userStore = new UserStore()
    this.groupStore = new GroupStore()
    this.systemUserListStore = new SystemUserListStore()
  }
}
const rootStore = new RootStore()
const context = createContext(rootStore)
const useStore = () => useContext(context)

export { useStore }