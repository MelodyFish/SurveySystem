import request from '../utils/request'

function delSurveyListItem(data) {
  return request({
    url: 'survey/survey/update',
    method: 'post',
    data:{
      action: '3',
      survey: data
    }
  })
}
// 查询所有员工信息
function queryStaff() {
  return request({
    url: 'survey/common/queryuser',
    method: 'post',
    data:{
    }
  })
}
// 查询所有分组
function queryAllGroup() {
  return request({
    url: 'survey/common/querygroup',
    method: 'post',
    data:{
    }
  })
}
export { delSurveyListItem, queryStaff, queryAllGroup }