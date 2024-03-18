import request from '../utils/request'

function queryGroupLists() {
  return request({
    url: 'survey/group/query',
    method: 'post',
    data: {}
  })
}

function updateGroup(data) {
  return request({
    url: 'survey/group/update',
    method: 'post',
    data
  })
}
export { queryGroupLists, updateGroup }