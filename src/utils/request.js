import axios from 'axios'
import { message } from 'antd'
import  ssoconfig  from '../assets/data/ssoconfig.json'
import { getLocalStorage, clearLocalStorage } from './session'

function request(config) {
  const instance = axios.create({
    // url = baseURL + config.url
    // baseURL: '/api',
    timeout: 5000
  })
  instance.interceptors.request.use(conf => {
    const token = getLocalStorage('token')
    if(token) {
      conf.headers.Authorization = `Bearer ${token}`
    }
    return conf
  })
  instance.interceptors.response.use(res => {
    if(res?.data.data.errorCode !== 0) {
      message.error(res?.data.data.errorMsg)
    }
    if(res?.data.data.errorCode === 20011) {
      setTimeout(() => {
        window.location.href = '/'
      },300)
    }
    return res.data
  }, err => {
    if(err.response.status == 401) {
      const { protocol, host, pathname, hash } = window.location
      clearLocalStorage('userInfo')
      clearLocalStorage('token')
      // clearLocalStorage('systemUserList')
      const url = protocol + '//' + host + '/#/logincallback';
      console.log('window.location', window.location)
      window.location.href = ssoconfig.ssourl + '?app=tsv&returnUrl=' + encodeURIComponent(url) +'&redirect=' + encodeURIComponent(hash?hash:pathname);
    } else if(err.response.status === 403) {
      window.location.href = '/page403'
    }
  })
  return instance(config)
}

export default request