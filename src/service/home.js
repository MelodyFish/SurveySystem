import request from '../utils/request'

function getSurveyLists() {
  return request({
    url: 'survey/survey/query',
    method: 'post',
    data:{}
  })
}

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
function modifySurveyListItem(data) {
  return request({
    url: 'survey/survey/update',
    method: 'post',
    data:{
      action: '2',
      survey: data
    }
  })
}
function addSurveyListItem() {
  return request({
    url: 'survey/survey/update',
    method: 'post',
    data:{
      action: '1',
      survey: {}
    }
  })
}

export { getSurveyLists, delSurveyListItem, addSurveyListItem, modifySurveyListItem }