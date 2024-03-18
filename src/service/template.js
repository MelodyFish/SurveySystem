import request from '../utils/request'

// 获取模板列表
function queryTemplateLists() {
  return request({
    url: 'survey/template/query',
    method: 'post',
    data: {}
  })
}

// 更新某个模板
function handleTemplate(data) {
  return request({
    url: 'survey/template/update',
    method: 'post',
    data
  })
}

export { queryTemplateLists, handleTemplate }