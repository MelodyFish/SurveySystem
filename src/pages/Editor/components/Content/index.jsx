import React, { useState, Fragment, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Form,
  Input,
  Button,
  Radio,
  Select,
  Modal,
  Checkbox,
  Tooltip,
  Space,
  Rate,
  Popconfirm,
  message,
  Row,
  Col 
} from 'antd'
import { v4 as uuid } from 'uuid'
import { 
  DeleteOutlined, 
  PlayCircleOutlined, 
  EyeOutlined, 
  CopyOutlined, 
  PlusCircleOutlined,
  MinusOutlined
} from '@ant-design/icons'
import { publishSurvey, fillSurveyAnswer } from '../../../../service/editor'
import './index.less'

const { TextArea, Search } = Input
const layout = {
  labelCol: {
    span: 22,
    // offset: 8
  },
  wrapperCol: {
    span: 22,
  },
}

export default function Content(props) {
  const { fields, setFields, curIndex, setCurIndex, setDroppable, modifySurveyItemTitle, hasOptions } = props
  const [ open, setOpen ] = useState(false)
  const [ inputShow, setInputShow ] = useState(false)
  const [ checkboxInputShow, setCheckboxInputShow ] = useState(false)
  // const [ labelInputShow, setLabelInputShow ] = useState(false)
  const [ curOptionIndex, setCurOptionIndex ] = useState(0)
  const [ configs2, setConfigs2 ] = useState([])
  const [ isPreview, setIsPreview ] = useState(false)
  const [ form ] = Form.useForm()
  const [ form1 ] = Form.useForm()
  let distribution = []
  let [ myIndex, setMyIndex ] = useState(0)
  let { configs, title, subTitle, surveyId } = fields
  let [ curAmount, setCurAmount ] = useState(0)
  let [ lastPaginationAmount, setLastPaginationAmount ] = useState(0)
  let [ isFinished, setIsFinished ] = useState(false)
  let [ uploadedData, setUpLoadedData ] = useState([])
  const curElement = configs[curIndex]
  const [ labelInputValue, setLabelInputValue ] = useState(curElement?.label)
  const curOptions = curElement?.options || []
  let len = configs.length || 0
  const paginationArr = configs.filter(item => 
    item.type === 'pagination'
  )
  const totalPagination = paginationArr.length
  const noPaginationArrLen = configs.filter(item => 
    item.type !== 'pagination'
  ).length
  const nav = useNavigate()
  const location = useLocation()
  const suffix = (
    <DeleteOutlined
      style={{
        fontSize: 16,
        color: '#e10101',
      }}
      onClick={(index,type)=>delOption(index, type)}
    />
  )
  let sourceIndex
  let targetIndex
  let singleOptionInputValue
  useEffect(() => {
    if(curOptionIndex>=0) {
      setCurOptionIndex(-1)
    }
  }, [curElement])
  
  useEffect(()=> {
    // distribution.splice(0, distribution.length/2)
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
  useEffect(() => {
    if(isFinished) {
      console.log('uploadedData', uploadedData)
    }
  }, [isFinished])
  
  
  function getCurIndex(name, label, type) {
    let curIndex
    configs.filter(item => {
      return item.type!=='pagination' && item.type!=='paragraph'
    }).map((item, index) => {
      if(item.name === name) {
        curIndex = index + 1
      }
    })
    return `${curIndex}.${label}${type ==='checkbox'?'(多选)':''}`
  }
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
  function publish() {
    // publishSurvey(fields).then(res => {
    //   if(res.data.errorCode === 0) {
    //     message.success('发布成功')
    //     nav('/')
    //   }
    // })
  }
  function preview() {
    setOpen(true)
    setCurAmount(distribution[0])
    setMyIndex(0)
    setIsPreview(true)
  }
  function handleSelect(index) {
    setCurIndex(index)
  }
  function changeOptionLabel(e, index, type) {
    e.stopPropagation()
    setCurOptionIndex(index)
    if(!isPreview) {
      switch (type) {
        case 'radio':
          setInputShow(true)
          break;
        case 'checkbox':
          setCheckboxInputShow(true)
        default:
          break;
      }
    }
  }
  function singleOptionChange(e, index) {
    e.stopPropagation()
    let value = e.target.value
    singleOptionInputValue = value
  }
  function onBlur(index, type, label) {
    curOptions[index].label = singleOptionInputValue || label
    setFields({...fields, configs})
    setCurOptionIndex(-1)
    switch (type) {
      case 'radio':
        setInputShow(false)
        break;
      case 'checkbox':
        setCheckboxInputShow(false)
      default:
        break;
    }
  }
  function delOption(index, type) {
    if(curOptions.length === 1) {
      message.error('选项数量最少为1！')
      return ;
    }
    curOptions.splice(index, 1)
    curOptions.forEach((item, index) => {
      item.value = `${curIndex+1}-${index+1}`
    })
    setFields({...fields,configs})
    switch (type) {
      case 'radio':
        setInputShow(false)
        break;
      case 'checkbox':
        setCheckboxInputShow(false)
      default:
        break;
    }
  }
  // function showPaginationRange(pagination, curPaginationIndex) {
  //   const remainConfigs = configs.filter((item, index)=> {
  //     return item.type!=='pagination' && curPaginationIndex < index
  //   })
  //   const remainConfigsLen = remainConfigs.length
  //   let lastIndexEle = remainConfigs[remainConfigsLen-1] || ''
  //   let lastQuestionIndex 
  //   configs.map((item, index) => {
  //     if(item.name === lastIndexEle?.name) {
  //       lastQuestionIndex = index
  //     }
  //   })
  //   if(remainConfigs.length) {
  //     return `(
  //       Q${pagination===1?++curPaginationIndex:curPaginationIndex} ~ Q${lastQuestionIndex}
  //     )`
  //   }
  // }
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
    const curLen = nextIndex?nextIndex:len-1
    for(let i=startIndex; i<=curLen; i++) {
      arr.push(configs[i])
    }
    arr = arr.filter(item => item.type !== 'pagination')
    let index1
    let index2
    filterArr.map((item, index) => {
      if(arr[0]?.name === item.name){
        index1 = index+1
      }
      if(arr[arr.length-1]?.name === item.name){
        index2 = index+1
      }
    })
    if(index1&&index2) {
      distribution = [...distribution,index2-index1+1 ]
    }
    // setFields({...fields, distribution:newArr})
    return index1?`(Q${index1}~Q${index2})`: ''
  }
  function detectIsNormalType(type) {
    switch (type) {
      case 'paragraph':
      case 'pagination':  
        return false;
      default:
        return true;
    }
  }
  function selectTypetoItem(type,col,options,placeholder,mulInputs,paragraphDesc,pagination,index1) {
    switch (type) {
      case 'input':
        return <Input placeholder={placeholder} />
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
          <Radio.Group>
            <Row >
              {
                options?.map((option, index) => {
                  const { label, value } = option
                  return (
                    <Col span={col === 1 ? 24 : col === 2 ? 12 : 8}>
                      <Radio 
                        style={{
                          lineHeight: '32px',
                          display: inputShow&&(curOptionIndex===index)&&(curIndex===index1)? 'none': 'block'
                        }} 
                        key={value} 
                        value={value}
                        onClick={(e)=>{changeOptionLabel(e, index, type)}}
                      >
                        {label}
                      </Radio>
                      <Search
                        style={{
                          display: inputShow&&(curOptionIndex===index)&&(curIndex===index1)? 'block': 'none',
                          width: '80%'
                        }}
                        defaultValue={label}
                        onChange={(e)=>singleOptionChange(e,index, label)}
                        onBlur={()=>onBlur(index, type, label)}
                        onSearch={()=>delOption(index, type)}
                        enterButton={<Button
                          className='del-btn'
                          style={{
                            marginTop: '9px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          type="primary"
                          danger
                          icon={<MinusOutlined />}
                        />}
                      />
                      {/* <Button 
                        className='del-btn'
                        style={{
                          display: inputShow&&(curOptionIndex===index)&&(curIndex ===index1)? 'block': 'none',
                        }}
                        type="primary"
                        danger 
                        shape="circle" 
                        icon={<MinusOutlined />}
                        onClick={()=>delOption(index, type)}
                      /> */}
                    </Col>
                  )
                })
              }
            </Row>
          </Radio.Group>
        )
      case 'checkbox':
        return (
          <Checkbox.Group>
            <Row>
              {
                options?.map((option,index) => {
                  const { label, value } = option
                  return (
                    <Col span={col === 1 ? 24 : col === 2 ? 12 : 8}>
                      <Checkbox 
                        style={{
                          lineHeight: '32px',
                          display: checkboxInputShow&&(curOptionIndex===index)&&(curIndex===index1)? 'none': ''
                        }} 
                        key={value} 
                        value={value}
                        onClick={(e)=>{changeOptionLabel(e, index, type)}}
                      >
                        {label}
                      </Checkbox>
                      <Search
                        style={{
                          display: checkboxInputShow&&(curOptionIndex===index)&&(curIndex===index1)? '': 'none',
                          width: '80%'
                        }}
                        defaultValue={label}
                        onChange={(e)=>singleOptionChange(e,index)}
                        onBlur={()=>onBlur(index, type, label)}
                        onSearch={()=>delOption(index, type)}
                        enterButton={<Button
                          className='del-btn'
                          style={{
                            // display: checkboxInputShow&&(curOptionIndex===index)&&(curIndex ===index1)? 'block': 'none',
                            marginTop: '9px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                          type="primary"
                          danger
                          icon={<MinusOutlined />}
                        />}
                        // suffix={<Button 
                        //   className='del-btn'
                        //   style={{
                        //     display: checkboxInputShow&&(curOptionIndex===index)&&(curIndex ===index1)? 'block': 'none',
                        //   }}
                        //   type="primary"
                        //   danger
                        //   shape="circle" 
                        //   icon={<MinusOutlined />}
                        //   onClick={()=>delOption(index, type)}
                        // />}
                      />
                      {/* <Button 
                        className='del-btn'
                        style={{
                          display: checkboxInputShow&&(curOptionIndex===index)&&(curIndex ===index1)? 'block': 'none',
                        }}
                        type="primary"
                        danger
                        shape="circle" 
                        icon={<MinusOutlined />}
                        onClick={()=>delOption(index, type)}
                      /> */}
                    </Col>
                  )
                })
              }
            </Row>
          </Checkbox.Group>
          // <Checkbox.Group options={options} />
        )
      case 'select':
        return <Select options={options} placeholder={placeholder} />
      case 'rate':
        return <Rate count={10} />
      case 'paragraph':
        return <h3>{paragraphDesc}</h3>
      case 'pagination':
        return <h3>页码：{showCurPagination(pagination, totalPagination)} {showPaginationRange(pagination, index1)}</h3>
      default:
        return null
    }
  }
  function onFinish(values) {
    // fillSurveyAnswer({
    //   surveyId: location.state.surveyId,
    //   answers: values
    // }).then(res => {
    //   console.log('res', res.data)
    // })
  }
  function onFinishFailed(errors) {
    console.log('errors', errors)
  }
  function handleDragover(e) {
    e.preventDefault()
  }
  function dragStart(e, index) {
    // console.log('当前拖动的元素', index)
    sourceIndex = index
  }
  function dragEnter(e, index) {
    e.stopPropagation()
    e.preventDefault()
    // console.log(`正在进入第 ${index}个元素`)
    targetIndex = index
  }
  // 拖拽放下时
  function handleDrop(e) {
    e.stopPropagation()
    e.preventDefault()
    const curEle = configs[sourceIndex]
    if(curEle) {
      configs.splice(sourceIndex, 1)
      configs.splice(targetIndex, 0, curEle)
      configs.forEach((config, configIndex)=> {
        let curOptions = config.options
        if(curOptions?.length) {
          curOptions.forEach((item, index) => {
            item.value = `${configIndex+1}-${index+1}`
          })
        }
      })
      setFields({...fields, configs})
    }
    // setDroppable(true)
  }
  function titleChange(e) {
    title = e.target.value
    setFields({...fields, title})
    // modifySurveyItemTitle({
    //   surveyId,
    //   title
    // })
  }
  function subTitleChange(e) {
    subTitle = e.target.value
    setFields({...fields, subTitle})
  }
  function toggleLabel(index) {
  }
  function labelInputShowChange(e) {
    curElement.labelInputShow = true
    setFields({...fields, configs})
    // setLabelInputShow(true)
  }
  function labelChange(e) {
    curElement.label = e.target.value
    // setFields({...fields, configs})
  }
  function setCurElementLabel() {
    curElement.labelInputShow = false
    setFields({...fields, configs})
    // curElement.label = labelInputValue
    // setLabelInputShow(false)
  }
  function copy(e, index) {
    e.stopPropagation()
    // DeepClone
    const source = JSON.parse(JSON.stringify(configs[index]))
    source.name = uuid()
    const randomSurveyItemId = Math.random()
    source.surveyItemId = randomSurveyItemId
    source.options?.forEach(item => {
      item.surveyItemId = randomSurveyItemId
      item.surveyItemOptionId = Math.random()
    })
    configs.push({...source})
    setFields({...fields, configs})
  }
  function handleDelete(e, index) {
    e.stopPropagation()
    configs.splice(index, 1)
    let current = 1
    configs.forEach(item => {
      if(item.type==='pagination') {
        item.pagination = current
        current++
      }
    })
    message.success('删除成功')
    setFields({...fields, configs})
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
  function addOption() {
    const nextOptionsLen = curOptions.length + 1
    curOptions.forEach((item, index) => {
      // item.label = `选项${index+1}`
      item.value = `${curIndex+1}-${index+1}`
    })
    curOptions.push({
      label: `选项${nextOptionsLen}`,
      value: `${curIndex+1}-${nextOptionsLen}`
    })
    setFields({...fields, configs})
  }
  function modalClose() {
    setOpen(false)
    setIsPreview(false)
    // setUpLoadedData([])
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
    return arr
  }
  function submitSurvey() {
    form1.validateFields(mapNames()).then(res => {
      if(curAmount === noPaginationArrLen || !curAmount) {
        setUpLoadedData(res)
        setIsFinished(true)
        modalClose()
      }
      console.log('res', res)
      setMyIndex(++myIndex)
    }).catch(error => {
      console.log('error', error)
    })
  }
  return (
    <div className='content'>
      <div className="tools">
        <Space>
          <Button 
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={publish}
          >
            发布
          </Button>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={preview}
          >
            预览
          </Button>
        </Space>
      </div>
      <div
        className="core"
        onDragOver={handleDragover}
        onDrop={(e)=>handleDrop(e)}
      >
        <Space 
          className='titles'
          direction="vertical"
        >
          <Input defaultValue="问卷标题" maxLength={54} value={title} onChange={titleChange} />
          {/* <Search defaultValue="问卷标题" maxLength={54} value={title} /> */}
          <TextArea  
            showCount 
            maxLength={200}
            value={subTitle} 
            onChange={subTitleChange}
            style={{
              maxHeight: 100,
              resize: 'none',
            }}
          />
        </Space>
        <Form {...layout} layout='vertical' form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} labelWrap='true' >
          {
            configs.map((item, index) => {
              const { label, labelInputShow, required, name, type, options, placeholder, col, hasDesc, description, mulInputs, paragraphDesc, pagination } = item
              return (
                <Form.Item
                  className={`${curIndex===index?'active':''}`}
                  style={{padding: '10px 0'}}
                  key={uuid()}
                  // name={name}
                  // id={name}
                  // label={detectIsNormalType(type)?getCurIndex(name,label):''}
                  draggable={(type==='pagination'&& pagination===1)?false:true}
                  onDragEnter={(e)=>dragEnter(e, index)}
                  onDragStart={(e)=>dragStart(e, index)}
                  onClick={()=>handleSelect(index)}
                  name={hasName(type)?null:name}
                  rules={hasName(type)?null:[{required}]}
                  // onDoubleClick={(index)=>toggleLabel(index)}
                >
                  <span
                    id={name}
                    className={`label ${detectIsNormalType(type)&&required?'star':''}`}
                    style={{display: !labelInputShow ? '' : 'none', cursor:'pointer'}}
                    // onClick={labelInputShowChange}
                    onDoubleClick={labelInputShowChange}
                  >
                    {detectIsNormalType(type)?getCurIndex(name,label,type):''}
                  </span>
                  {
                    type!=='pagination' && (
                      <Tooltip title="复制">
                        <Button
                          onClick={(e)=>copy(e, index)}
                          className='tool copy'
                          shape="circle" 
                          icon={<CopyOutlined />} 
                          type='primary'
                        />
                      </Tooltip>
                    )
                  }
                  <Tooltip title="删除">
                    <Popconfirm
                      title="您确定要删除吗？"
                      onConfirm={(e)=>handleDelete(e, index)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Button
                        className='tool del'
                        shape="circle" 
                        icon={<DeleteOutlined />} 
                        danger 
                      />
                    </Popconfirm>
                  </Tooltip>
                  {
                    labelInputShow && (
                      <Input 
                        maxLength={54}
                        style={{display: curIndex === index?'': 'none'}}
                        placeholder='请输入问题名称'
                        value={labelInputValue}
                        onChange={labelChange}
                        onBlur={setCurElementLabel}
                      /> 
                    )
                  }
                  {
                    hasDesc && (
                      <div>{description}</div>
                    )
                  }
                  { selectTypetoItem(type,col,options,placeholder,mulInputs,paragraphDesc,pagination,index) }
                  {/* <Form.Item name={hasName(type)? null: name}>
                  { selectTypetoItem(type,col,options,name,placeholder,mulInputs,paragraphDesc,pagination,index) }
                  </Form.Item> */}
                  {(type!=='select')&&hasOptions(type) && (curIndex === index)? (
                    <Button 
                      icon={<PlusCircleOutlined />}
                      onClick={addOption}
                    >
                      添加选项
                    </Button>
                  ): null}
                </Form.Item>
              )
            })
          }
        </Form>
      </div>
      <Modal 
        title="预览" 
        width={800} 
        visible={open} 
        footer={null} 
        onCancel={modalClose} 
        maskTransitionName=""
        transitionName=""
      >
        <Space 
          className='titles'
          direction="vertical"
        >
          <h2 style={{textAlign:'center'}}>{title}</h2>
          <h3>{subTitle}</h3>
        </Space>
        <Form {...layout} layout='vertical' form={form1} onFinish={onFinish}>
          {
            configs2.slice(myIndex?lastPaginationAmount:0, curAmount).map((item, index) => {
              const { 
                label, required, name, type, options, placeholder, col, hasDesc, description, mulInputs, paragraphDesc, pagination, min, number
              } = item
              return (
                <Form.Item
                  className={curIndex===index? 'active': ''}
                  style={{padding: '10px 0'}}
                  key={uuid()}
                  label={detectIsNormalType(type)?getCurIndex(name,label,type):''}
                  name={hasName(type)?null:name}
                  // rules={hasName(type)?null:[{required}]}
                  rules={hasName(type)?null:isCheckbox(type,required,min,number)}
                >
                  {
                    hasDesc && (
                      <div>{description}</div>
                    )
                  }
                  {/* { selectTypetoItem(type, col, options, name, placeholder, mulInputs, paragraphDesc,pagination,index) } */}
                  <Form.Item name={hasName(type)?null:name} >
                    { selectTypetoItem(type, col, options, placeholder, mulInputs, paragraphDesc,pagination,index) }
                  </Form.Item>
                </Form.Item>
              )
            })
          }
          <Form.Item>
            <Button onClick={submitSurvey}>
            {
              (curAmount === noPaginationArrLen || !curAmount) ?'': '下一题'
            }
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
