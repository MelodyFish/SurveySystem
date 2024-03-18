import request from '../utils/request'

// 查询该用户要填写的问卷
function querySurveyAnswer(surveyId, preview=false) {
  return request({
    url: 'survey/survey/query',
    method: 'get',
    params: {
      surveyId,
      preview
    }
  })
}

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
export { querySurveyAnswer, fillSurveyAnswer }