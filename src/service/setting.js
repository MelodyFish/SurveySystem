import request from '../utils/request'

// 删除该问卷
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
// 获取所有受测者
function queryTesters(surveyId) {
  return request({
    url: 'survey/survey/querytester',
    method: 'post',
    data:{
      surveyId
    }
  })
}
// 更新受测者
function updateTesters(data) {
  return request({
    url: 'survey/survey/updatetester',
    method: 'post',
    data
  })
}
function sendEmail(data) {
  return request({
    url: 'survey/survey/sendnotification',
    method: 'post',
    data
  })
}
// 查询统计
function getStatistics(data) {
  return request({
    url: 'survey/surveystatistics/query',
    method: 'post',
    data
  })
}
// 查询分组列表
function getGroupLists() {
  return request({
    url: 'survey/group/query',
    method: 'post',
    data:{}
  })
}

// export excel
function exportExcel(id) {
  return request({
    url: `survey/surveystatistics/export/${id}`,
    method: 'get',
    params:{}
  })
}

export { delSurveyListItem, queryTesters, updateTesters, sendEmail, getStatistics, getGroupLists, exportExcel }