import React, { useState } from 'react'
import dayjs  from 'dayjs'
import moment from 'moment'; 
import { Button, DatePicker, Radio, Input, message } from 'antd'
import { LinkOutlined, CopyOutlined } from '@ant-design/icons';
import { modifySurveyItemTitle } from '../../../../service/editor'
import './index.less'

const protocol = window.location.protocol
const host = window.location.host
export default function SettingDetails(props) {
  const { surveyId, title, startTime, endTime, subTitle } = props
  const [ value, setValue ] = useState(1)
  const { RangePicker } = DatePicker;
  const url = protocol + "//" +  host + '/#/q/'+ surveyId
  const setting = {
    startTime,
    endTime,
  }
  const dateFormat = "YYYY-MM-DD HH:mm:ss"

  function onTimeChange(value, dateString) {
    console.log('Formatted Selected Time: ', dateString)
    setting.startTime = dateString[0]
    setting.endTime = dateString[1]
  }
  function onStartChange(date, dateString) {
    setting.startTime = dateString
  }
  function onEndChange(date, dateString) {
    setting.endTime = dateString
  }
  // 单选变化
  function onChange(e) {
    setValue(e.target.value)
  }
  function copy() {
    // console.log('navigator', navigator)
    // navigator.clipboard.writeText(url)
    if(navigator.clipboard) {
      navigator.clipboard.writeText(url)
    } else {
      const inputElement = document.querySelector('#input');
      inputElement.select();
      document.execCommand('copy');
    }
    message.success('已复制到剪切板') 
  }
  // 保存修改
  function save() {
    modifySurveyItemTitle({
      surveyId,
      title,
      // subTitle,
      ...setting
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('修改成功')
      }
    })
  }
  //取消
  function cancel() {
    window.location.href = '/'
  }
  return (
    <div className='setting-details'>
      <div className='deadline'>
        <div>作答有效期</div>
        <div className='endtime'>
          {/* <span>开始日期</span> */}
          <RangePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss" 
            defaultValue={[moment(startTime, dateFormat), moment(endTime, dateFormat)]} format={dateFormat}
            onChange={onTimeChange}
          />

          {/* <DatePicker onChange={onStartChange} showTime placeholder='开始日期' /> */}
          {/* <span style={{padding:'0 20px'}}>~</span> */}
          {/* <span>结束日期</span> */}
          {/* <DatePicker onChange={onEndChange} showTime placeholder='结束日期' /> */}
        </div>
        <div style={{marginTop: '20px'}}>通知形式</div>
        <Radio.Group onChange={onChange} value={value}>
          <div>
            <Radio value={1}>相同地址答题</Radio>
            <span>注意！每个地址只能答题一次</span>
          </div>
          
          <div className='survey-link'>
            <Input style={{width: '450px', padding: '3px 11px'}} value={url} id='input' />
            <Button type='primary' icon={<CopyOutlined />} onClick={copy}>
              复制地址
            </Button>
            <Button icon={<LinkOutlined />} onClick={()=>{window.open(`/#/q/${surveyId}`)}}>打开问卷</Button>
          </div>
          {/* <Radio value={2}>个人匹配地址答题</Radio> */}
        </Radio.Group>
      </div>
      <div style={{marginTop:'40px'}}>
        <Button 
          type='primary' 
          onClick={save}
        >
          保存修改
        </Button>
        <Button 
          style={{marginLeft: '40px'}}
          onClick={cancel}
        >
          取消
        </Button>
      </div>
    </div>
  )
}
