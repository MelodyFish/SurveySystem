function auth() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))?.userInfo
  const systemUserList = JSON.parse(localStorage.getItem('systemUserList'))?.systemUserList.map(item => item.username)
  return systemUserList?.includes(userInfo?.username)
}
function isAdmin() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))?.userInfo?.username
  const systemUserList = JSON.parse(localStorage.getItem('systemUserList'))?.systemUserList.filter(item => item.username === userInfo)
  return (systemUserList?.length && systemUserList[0].admin)
}
export { auth, isAdmin }