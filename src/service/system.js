import request from '../utils/request'

function getSystemUsers() {
  return request({
    url: '/survey/systemuser/query',
    method: 'post',
    data: {}
  })
}
function updateSystemUsers(data) {
  return request({
    url: '/survey/systemuser/update',
    method: 'post',
    data
  })
}

export { getSystemUsers, updateSystemUsers }