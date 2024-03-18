import React, { useState, useEffect, Fragment } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Radio, Select, Checkbox, Space, Rate, message, Row, Col } from 'antd'
import { v4 as uuid } from 'uuid'
import dayjs  from 'dayjs'
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { querySurveyAnswer, fillSurveyAnswer } from '../../service/questionnaire'
import './index.less'

const layout = {
  labelCol: {
    span: 22,
    // offset: 8
  },
  wrapperCol: {
    span: 22,
  },
}
export default function Questionnaire() {
  const [ fields, setFields ] = useState({})
  const [ configs2, setConfigs2 ] = useState([])
  let [ myIndex, setMyIndex ] = useState(0)
  const [ form1 ] = Form.useForm()
  const location = useLocation()
  const nav = useNavigate()
  const params = useParams()
  const { id } = params
  const preview = location.state?.preview
  let { configs=[], title, subTitle } = fields
  let distribution = []
  let [ curAmount, setCurAmount ] = useState(0)
  let [ lastPaginationAmount, setLastPaginationAmount ] = useState(0)
  let configsLen = configs.length || 0
  const paginationArr = configs.filter(item => 
    item.type === 'pagination'
  )
  const totalPagination = paginationArr.length
  const noPaginationArrLen = configs.filter(item => 
    item.type !== 'pagination'
  ).length

  useEffect(()=> {
    querySurveyAnswer(id, preview).then(res => {
      if(res.data.errorCode === 0) {
        const { survey } = res.data
        const curTimeStamp = dayjs().unix()
        const startTimeStamp = dayjs(survey.startTime).unix()
        const endTimeStamp = dayjs(survey.endTime).unix()
        // console.log('survey', curTimeStamp, startTimeStamp, endTimeStamp)
        if(preview) {
          setFields(survey)
        } else {
          if(curTimeStamp < startTimeStamp) {
            message.error('问卷尚未开始!')
            // nav('/')
          } else if(curTimeStamp > endTimeStamp) {
            message.error('问卷已结束!')
            setFields(survey)
            // nav('/')
          } else if(survey.configs.some(item => item.value)) {
            message.error('您已完成本次问卷!')
            setFields(survey)
          } else {
            setFields(survey)
          }
        }
      }
    })
  }, [])
  useEffect(() => {
    configs.map((item, index) => {
      const {type,col,options,value=null,placeholder,mulInputs,paragraphDesc,pagination} = item
      selectTypetoItem(type,col,options,value,placeholder,mulInputs,paragraphDesc,pagination,index)
    })
  }, [fields, myIndex])
  useEffect(()=> {
    setCurAmount(distribution[0])
    // setMyIndex(0)
    let value = JSON.stringify(configs)
    setConfigs2(JSON.parse(value).filter(item=>item.type!=='pagination'))
  }, [fields])
  useEffect(()=> {
    let value = JSON.stringify(configs)
    // 上一页的题目数量
    let lastPagination = curAmount
    setLastPaginationAmount(curAmount)
    // 当前页码
    let curPagination = distribution[myIndex]
    setConfigs2(JSON.parse(value).filter(item=>item.type!=='pagination'))
    if(myIndex) {
      setCurAmount(lastPagination + curPagination)
    }
  }, [myIndex])
  function getPriviewCurIndex(name, label, type) {
    let curIndex
    configs2.filter(item => {
      return item.type!=='pagination' && item.type!=='paragraph'
    }).map((item, index) => {
      if(item.name === name) {
        curIndex = index + 1
      }
    })
    return `${curIndex}.${label}${type ==='checkbox'?'(多选)':''}`
  }
  function exitPreview() {
    window.history.back()
  }
  function showDefaultValue(values) {
    if(preview) {
      return null
    } else {
      return values?values:null
    }
  }
  function showDisabled(values) {
    if(preview) {
      return false
    } else {
      return values?true:false
    }
  }
  function hasName(type) {
    switch (type) {
      case 'textArea':
      case 'paragraph':
        return true
      default:
        return false
    }
  }
  function selectTypetoItem(type,col,options,values,placeholder,mulInputs,paragraphDesc,pagination,index) {
    switch (type) {
      case 'input':
        return <Input 
          defaultValue={showDefaultValue(values)} 
          disabled={showDisabled(values)} 
          placeholder={placeholder} 
        />
      case 'textArea':
        // return <TextArea placeholder={placeholder} />
        return (
          <Fragment>
            {
              mulInputs.map(item => {
                const { subTitle, name } = item
                return (
                  <Fragment>
                    <h3>{subTitle}</h3>
                    <Form.Item 
                      name={name}
                      rules={[
                        {
                          required: true,
                        }
                      ]}
                    >
                      <Input placeholder='请输入!' />
                    </Form.Item>
                  </Fragment>
                )
              })
            }
          </Fragment>
        )
      case 'radio':
        return (
          <Radio.Group defaultValue={showDefaultValue(values)} disabled={showDisabled(values)}>
          {/* <Radio.Group > */}
            <Row >
              {
                options?.map(option => {
                  const { label, value } = option
                  return (
                    <Col span={col === 1 ? 24 : col === 2 ? 12 : 8}>
                      <Radio 
                        style={{
                          lineHeight: '32px',
                        }} 
                        key={value} 
                        value={value}
                      >
                        {label}
                      </Radio>
                    </Col>
                  )
                })
              }
            </Row>
          </Radio.Group>
        )
      case 'checkbox':
        return (
          <Checkbox.Group defaultValue={values?values.split(","):null} disabled={showDisabled(values)}>
          {/* <Checkbox.Group > */}
            <Row>
              {
                options?.map(option => {
                  const { label, value } = option
                  return (
                    <Col span={col === 1 ? 24 : col === 2 ? 12 : 8}>
                      <Checkbox 
                        style={{
                          lineHeight: '32px',
                        }} 
                        key={value} 
                        value={value}
                      >
                        {label}
                      </Checkbox>
                    </Col>
                  )
                })
              }
            </Row>
          </Checkbox.Group>
        )
      case 'select':
        return (
          <Select 
            options={options} 
            placeholder={placeholder} 
            defaultValue={showDefaultValue(values)}
            disabled={showDisabled(values)}
          />
        )
      case 'rate':
        return <Rate disabled={showDisabled(values)} defaultValue={showDefaultValue(values)} count={10} />
        // return <Rate />
      case 'paragraph':
        return <h3>{paragraphDesc}</h3>
      case 'pagination':
        return <h3>页码：{showCurPagination(pagination, totalPagination)} {showPaginationRange(pagination, index)}</h3>
      default:
        return null
    }
  }
  function showCurPagination(pagination) {
    let current
    paginationArr.map((item, index) => {
      if(item.pagination === pagination) {
        current = index + 1
      }
    })
    return `${current}/${totalPagination} `
    // return `${pagination}/${totalPagination} `
  }
  function showPaginationRange(pagination) {
    const filterArr = configs.filter(item=> {
      return item.type!=='pagination'
    })
    let startIndex
    let nextIndex
    configs.map((item, index) => {
      if(pagination === 1) {
        startIndex = 0
      } else {
        if(item.pagination === pagination) {
          startIndex = index
        }
      }
      if(item.pagination === pagination + 1) {
        nextIndex = index
      }
    })
    let arr = []
    const curLen = nextIndex?nextIndex:configsLen-1
    for(let i=startIndex; i<=curLen; i++) {
      arr.push(configs[i])
    }
    arr = arr.filter(item => item.type !== 'pagination')
    let index1
    let index2
    filterArr.map((item, index) => {
      if(arr[0]?.name === item.name){
        index1 = index + 1
      }
      if(arr[arr.length-1]?.name === item.name){
        index2 = index + 1
      }
    })
    if(index1&&index2) {
      distribution = [...distribution,index2-index1+1 ]
    }
    return index1?`(Q${index1}~Q${index2})`: ''
  }
  function isCheckbox(type, required, min, number) {
    if(type==='checkbox' && required) {
      return [
        {
          required,
        },
        {
          type: 'array',
          min,
          message: `最少选择${min}项`
        },
        {
          type: 'array',
          max: number,
          message: `最多选择${number}项`
        }
      ]
    } else if(type==='rate' && required) {
      return [
        {
          required
        },
        {
          type: 'number',
          min: 1,
          message: '请至少选一个!'
        }
      ]
    } else {
      return [
        {
          required
        }
      ]
    }
  }
  function mapNames() {
    let arr = []
    let index = myIndex ? lastPaginationAmount : 0
    configs2.map((v)=> {
      if(index < curAmount?curAmount:noPaginationArrLen) {
        if(v.type==='textArea') {
          v.mulInputs.map(item => {
            arr.push(item.name)
          })
        } else {
          if(v.type!=='paragraph') {
            arr.push(v.name)
          }
        }
      }
      index++
    })
    console.log('arr', arr)
    return arr
  }
  function submitSurvey() {
    form1.validateFields(mapNames()).then(res => { 
      if(!preview && (curAmount === noPaginationArrLen || !curAmount)) {
        fillSurveyAnswer({
          surveyId: id,
          answers: res
        }).then(res => {
          if(res.data.errorCode === 0) {
            message.success('已成功提交问卷')
            // window.location.href = 'https://ithelp.hygon.cn/'
          } else {
            // message.error(res.data.errorMsg)
          }
        })
      }
      setMyIndex(++myIndex)
    }).catch(error => {
    })
  }
  function generateBtnName() {
    const curTimeStamp = dayjs().unix()
    const endTimeStamp = dayjs(fields.endTime).unix()
    // const startTimeStamp = dayjs(fields.startTime).unix()
    // if(startTimeStamp == endTimeStamp && preview) {
    //   return (curAmount === noPaginationArrLen || !curAmount) ? `${preview ? '' : '提交'}` : '下一题'
    // }
    if(preview) {
      return (curAmount === noPaginationArrLen || !curAmount) ? '' : '下一题'
    }
    if(configs.length && curTimeStamp < endTimeStamp) {
      return (curAmount === noPaginationArrLen || !curAmount) ? `${preview ? '' : '提交'}` : '下一题'
    } else {
      return ''
    }
    // if(preview) {
    //   return ''
    // } else {
    //   if(configs.length && dayjs().unix() < dayjs(endTime).unix()) {
    //     return (curAmount === noPaginationArrLen || !curAmount) ? '提交' : '下一题'
    //   } else {
    //     return ''
    //   }
    // }
  }
  return (
    <Fragment>
      {
        preview && (
          <div className='preview'>
            <div className="exit">
              <MenuUnfoldOutlined 
                style={{fontSize:'20px', cursor:'pointer'}}
                onClick={exitPreview}
              />
              <span>退出预览</span>
            </div>
            <div className="tips">
            提示：当前为预览页面，答案不被记录
            </div>
          </div>
        )
      }
      <div className='q'>
      <Space 
        className='titles'
        direction="vertical"
      >
        <h2 style={{textAlign:'center'}}>{title}</h2>
        <h3>{subTitle}</h3>
      </Space>
      <Form {...layout} layout='vertical' form={form1}>
        {
          configs2.slice(myIndex?lastPaginationAmount:0, curAmount).map((item, index) => {
            const 
            { 
              label, required, name, value, type, options, placeholder, col, hasDesc, description, mulInputs, paragraphDesc, pagination, min, number
            } 
            = item
            return (
              <Form.Item
                // className={curIndex===index? 'active': ''}
                // required={required}
                // name={hasName(type)?null:name}
                // rules={hasName(type)?null:[{required}]}
                style={{padding: '10px 0'}}
                key={uuid()}
                label={(type==='paragraph'||type==='pagination')?'':getPriviewCurIndex(name,label,type)}
                name={hasName(type)?null:name} 
                // rules={hasName(type)?null:[{required}]}
                rules={hasName(type)?null:isCheckbox(type,required,min,number)}
              >
                {
                  hasDesc && (
                    <Form.Item>
                      <h4>{description}</h4>
                    </Form.Item>
                  )
                }
                {/* { selectTypetoItem(type, col, options,value,placeholder, mulInputs, paragraphDesc,pagination,index) } */}
                <Form.Item name={hasName(type)?null:name}>
                  { selectTypetoItem(type, col, options,value,placeholder, mulInputs, paragraphDesc,pagination,index) }
                </Form.Item>
              </Form.Item>
            )
          })
        }
        <Form.Item>
          <Button onClick={submitSurvey}>
          { generateBtnName() }
          </Button>
        </Form.Item>
      </Form>
      {/* <Form {...layout} layout='vertical' form={form1} onFinish={onFinish}>
        {
          configs.map((item, index) => {
            const { label, required, name, type, options, placeholder, hasDesc, desc, mulInputs, paragraphDesc } = item
            return (
              <Form.Item
                // className={curIndex===index? 'active': ''}
                style={{padding: '10px 0'}}
                key={uuid()}
                label={type=='paragraph'?'':label}
              >
                {
                  hasDesc?(
                    <Form.Item>
                      <h4>{desc}</h4>
                    </Form.Item>
                  ):null
                }
                <Form.Item name={hasName(type)?null:name} rules={hasName(type)?null:[{required}]}>
                  { selectTypetoItem(type, options, placeholder, mulInputs, paragraphDesc) }
                </Form.Item>
              </Form.Item>
            )
          })
        }
        {
          preview? null: (
            <Form.Item
              wrapperCol={{
                offset: 11,
                span: 3
              }}
            >
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          )
        }
      </Form> */}
    </div>
    </Fragment>
  )
}