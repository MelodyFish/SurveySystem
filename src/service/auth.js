import request from '../utils/request'

function initByToken() {
  return request({
    url: 'user/initbytoken',
    methods: 'get',
    data:null
  })
}

export { initByToken }