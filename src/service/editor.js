import request from '../utils/request'

// 修改当前id问卷的标题和开始结束时间
function modifySurveyItemTitle(data) {
  return request({
    url: 'survey/survey/update',
    method: 'post',
    data:{
      action: '2',
      survey: data
    }
  })
}
 // 发布 && 更新问卷
function publishSurvey(data) {
  return request({
    url: 'survey/surveyedit/update',
    method: 'post',
    data: {
      survey: data
    }
  })
}
// 获取当前id的问卷的具体配置
function querySurveyItemFields(surveyId) {
  return request({
    url: 'survey/surveyedit/query',
    method: 'post',
    data: {
      surveyId
    }
  })
}
// // 查询该用户要填写的问卷
// function querySurveyAnswer(surveyId) {
//   return request({
//     url: 'survey/surveyanswer/query',
//     method: 'post',
//     data: {
//       surveyId
//     }
//   })
// }

// 填写问卷
function fillSurveyAnswer(params) {
  return request({
    url: 'survey/surveyanswer/update',
    method: 'post',
    data: {
      surveyAnswer: params
    }
  })
}

export { modifySurveyItemTitle, publishSurvey, querySurveyItemFields, fillSurveyAnswer }