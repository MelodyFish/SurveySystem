import React, { Fragment, useState, useEffect, useCallback } from 'react'
import { Input, Switch, Divider, Button, Select, Radio, InputNumber, message } from 'antd'
import { useStore } from '../../../../store/index'
import { queryAllGroup } from '../../../../service/common'
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import './index.less'

const options = [
  {
    label: '单列',
    value: 1,
  },
  {
    label: '2列',
    value: 2,
  },
  {
    label: '3列',
    value: 3,
  },
];
export default function Right(props) {
  const { fields, setFields, curIndex, hasOptions } = props
  const [ groupList, setGroupList ] = useState([])
  const [ testers, setTesters ] = useState([])
  // const [ allGroupAndStaff, setAllGroupAndStaff ] = useState([])
  const { groupStore } = useStore()
  const staffList = groupStore.staffList
  const { configs } = fields
  const [ colValue, setColValue ] = useState(1)
  const curElement = configs[curIndex]
  const curType = curElement?.type
  const curOptions = curElement?.options || []
  const [ minNumber, setMinNumber ] = useState(1)
  const [ maxNumber, setMaxNumber ] = useState(curElement?.max)
  const [ number, setNumber ] = useState(curElement?.number)
  const curMulInputs = curElement?.mulInputs || []
  useEffect(() => {
    queryAllGroup().then(res => {
      if(res.data.errorCode === 0) {
        setGroupList(res.data.groupList)
      }
    })
  }, [])
  // useEffect(() => {
  //   // console.log('xxxxxxxxxxxxx', curElement)
  //   if(curType === 'checkbox') {
  //     setMinNumber(curElement.min)
  //     setMaxNumber(curElement.max)
  //     console.log('xxxxxxxxxxxxx', curElement?.number)
  //     setNumber(curElement.number)
  //   }
  // }, [fields])
  
  useEffect(() => {
    if(curType === 'checkbox') {
      setMinNumber(curElement.min)
      setMaxNumber(curElement.max)
      setNumber(curElement.number)
      // setFields({...fields, configs})
    }
  }, [curElement])
  useEffect(() => {
    if(curType==='checkbox') {
      curElement.max = curOptions.length
      // curElement.number = curOptions.length  
      // setNumber(curOptions.length)  
      
      setMaxNumber(curOptions.length)
      setFields({...fields, configs})
    }
  }, [curOptions.length])
  useEffect(()=> {
    setColValue(curElement?.col || 1)
    setMinNumber(curElement?.min || 1)
    // setNumber(curElement?.number || 1)
  }, [curIndex])
  useEffect(() => {
    let list = groupList.map(item => {
      const { groupName, groupId} = item
      return {
        label: groupName,
        value: groupId,
      }
    })
    list = [...list, ...staffList.map(item => {
      const { username, cnname } = item
      return {
        label: cnname,
        value: username,
        // value: cnname
      }
    })]
    setTesters(list)
  }, [groupList])
  function showPlaceholder() {
    if(curType==='input' || curType === 'select') {
      return true
    }
    return false
  }
  function titleChange(e) {
    let title = e.target.value
    curElement.label = title
    setFields({...fields, configs})
    // setDebounce(title)
  }
  function placeHolderChange(e) {
    let placeholder = e.target.value
    curElement.placeholder = placeholder
    setFields({...fields, configs})
  }
  function requiredChange(checked) {
    curElement.required = checked
    setFields({...fields, configs})
  }
  // 题干说明是否开启
  function hasDescChange(checked) {
    curElement.hasDesc = checked
    setFields({...fields, configs})
  }
  // 段落说明
  function paragraphChange(e) {
    let value = e.target.value
    curElement.label = value
    curElement.paragraphDesc = value
    setFields({...fields, configs})
  }
  // 更新提干内容说明
  function descChange(e) {
    curElement.description = e.target.value
    setFields({...fields, configs})
  }
  function getUserGroupMembers() {
    return curElement?.userGroups.map(item => 
      item.username || item.groupId
    ).join(';')
  }
  // 受测者输入框变化时
  // function onGroupChange(value) {
  //   console.log('select', value)
  //   const userGroups = value.map(item => {
  //     if(typeof item === 'string') {
  //       return {
  //         username: item
  //       }
  //     } else {
  //       return {
  //         groupId: item
  //       }
  //     }
  //   })
  //   curElement.userGroups = userGroups
  //   setFields({...fields, configs})
  // }
  function testersChange(value) {
    let arr = []
    value.map(item => {
      if(typeof item === 'string') {
        arr.push({
          username: item
        })
      } else if(typeof item === 'number') {
        arr.push({
          groupId: item
        })
        
      }
    })
    curElement.userGroups = arr
    setFields({...fields, configs})
  }
  function showTesters() {
    let arr = []
    testers.map(item => {
      curElement?.userGroups.map(tester => {
        if(tester.groupId && tester.groupId === item.value) {
          arr.push(item.value)
        } else if(tester.username && tester.username === item.value) {
          arr.push(item.value)
        }
      })
    })
    return arr
  }
  function optionChange(e, index) {
    let value = e.target.value
    curOptions[index].label = value
    // curOptions[index].value = `${curIndex+1}-${index}`
    setFields({...fields, configs})
  }
  function delOption(index) {
    if(curOptions.length === 1) {
      message.error('选项数量最少为1！')
      return ;
    }
    curOptions.splice(index, 1)
    curOptions.forEach((item, index) => {
      item.value = `${curIndex+1}-${index+1}`
    })
    setFields({...fields,configs})
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
  // 多项填空设置
  function mulInputsChange(e, index) {
    let value = e.target.value
    curMulInputs[index].subTitle = value
    curMulInputs[index].name[1] = value
    // curOptions[index].value = `${curIndex+1}-${index}`
    setFields({...fields, configs})
  }
  function delMulInputs(index) {
    curMulInputs.splice(index, 1)
    curMulInputs.forEach((item, index) => {
      item.name[1] = curMulInputs[index].subTitle
    })
    setFields({...fields, configs})
  }
  function addMulInputs() {
    const nextOptionsLen = curMulInputs.length + 1
    curMulInputs.forEach((item, index) => {
      item.name[1] = curMulInputs[index].subTitle
    })
    curMulInputs.push({
      subTitle: `填空${nextOptionsLen}`,
      name: [curMulInputs[0].name[0], `填空${Math.random()}`]
    })
    setFields({...fields, configs})
  }
  // Col Change
  function colChange(e) {
    const value = e.target.value
    curElement.col = value
    setColValue(value)
    setFields({...fields, configs})
    console.log('colChange', value)
  }
  function ignoreItem() {
    switch (curType) {
      case 'textArea':
      case 'pagination':
      case 'paragraph':
        return 'none'
      default:
        return ''
    }
  }
  // 选项数量1变化
  function onNumberChange(value) {
    if(value<=number) {
      setMinNumber(value)
      curElement.min = value
      setFields({...fields, configs})
    }
  }
  // 选项数量2变化
  function onNumber2Change(value) {
    // console.log('curElement', curElement)
    if(value >= minNumber) {
      setNumber(value)
      curElement.number = value
      setFields({...fields, configs})
    }
  }
  const rightTools = (
    <div className='settings-tool'>
      <ul>
        <li style={{display: ignoreItem()}}>
          <div className='setting-name'>标题：</div>
          <Input value={curElement?.label} onChange={titleChange} maxLength={54} />
        </li>
        <li className={showPlaceholder()?'': 'hidden'}>
          <div className='setting-name'>占位提示：</div>
          <Input onChange={placeHolderChange} value={curElement?.placeholder} maxLength={54} />
        </li>
        <li style={{display: ignoreItem()}}>
          <div className='setting-name'>是否必填：</div>
          <Switch defaultChecked checked={curElement?.required} onChange={requiredChange} />
        </li>
        <li style={{display: ignoreItem()}}>
          <div className='setting-name'>题干说明：</div>
          <Switch defaultChecked checked={curElement?.hasDesc || false} onChange={hasDescChange} />
        </li >
        {
          curElement?.hasDesc? (
            <li style={{display: ignoreItem()}}>
              <div className='setting-name'>题干内容：</div>
              <Input onChange={descChange} maxLength={54} />
            </li>
          ): null
        }
        {
          curElement?.type==='paragraph'?(
            <li>
              <div className='setting-name'>段落说明：</div>
              <Input onChange={paragraphChange} />
            </li>
          ): null
        }
        {/* <li style={{margin: '40px 0'}}>
          <div>受测者：</div>
          <Select
            mode="multiple"
            style={{width: '180px'}}
            placeholder='请选择受测分组或受测人员'
            maxTagCount={4}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={onGroupChange}
            options={allGroupAndStaff}
          />
        </li> */}
      </ul>
      <ul className={`options ${curType==='select'?'': 'hidden'}`}>
          <li key={1} style={{height: '100%'}}>
            <div className='setting-name'>选项设置：</div>
            <div style={{display:'felx', flexDirection: 'column', height:'100%'}}>
              {
                curOptions.map((option, index)=> {
                  const { label, value } = option
                  return (
                    <div className='option-item'>
                      <Input 
                      value={label} 
                      onChange={(e)=>optionChange(e, index)} 
                      />
                      <Button 
                        className='del-btn'
                        type="primary"
                        danger 
                        shape="circle" 
                        icon={<MinusOutlined />}
                        onClick={()=>delOption(index)}
                      />
                    </div>
                  )
                })
              }
              <Button 
                icon={<PlusCircleOutlined />}
                onClick={addOption}
              >
                添加选项
              </Button>
            </div>
          </li>
      </ul>
      <ul className={`options ${hasOptions(curType)?'': 'hidden'}`}>
        <li>
          <div className='setting-name'>选项布局：</div>
          <Radio.Group
            className='col-btns'
            options={options} 
            onChange={colChange} 
            value={colValue} 
            optionType="button" 
          />
        </li>
      </ul>
      <ul className={`options ${curType==='checkbox'?'': 'hidden'}`}>
        <li>
          <div className='setting-name'>选项数量：</div>
          <InputNumber min={1} max={maxNumber} defaultValue={1} value={minNumber} onChange={onNumberChange} /> ~
          <InputNumber min={1} max={maxNumber} defaultValue={1} value={number} onChange={onNumber2Change} />
        </li>
      </ul>
      <ul className={`options ${curType==='textArea'?'': 'hidden'}`}>
        <Divider>多项填空设置</Divider>
        {
          curMulInputs.map((option, index)=> {
            const { subTitle, name } = option
            return (
              <li key={index}>
                <Input 
                  value={subTitle} 
                  onChange={(e)=>mulInputsChange(e, index)} 
                />
                <Button 
                  className='del-btn'
                  type="primary"
                  danger 
                  shape="circle" 
                  icon={<MinusOutlined />}
                  onClick={()=>delMulInputs(index, name)}
                />
              </li>
            )
          })
        }
        <Button 
          icon={<PlusCircleOutlined />}
          onClick={addMulInputs}
        >
          添加选项
        </Button>
      </ul>
      <ul style={{display: ignoreItem()}}>
        <li >
          <div className='setting-name'>受测者：</div>
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            maxTagCount={3}
            value={showTesters()}
            filterOption={(input, option) =>{
              if(option.label.toLowerCase().includes(input.toLowerCase())) {
                return option.label
              }
            }}
            onChange={testersChange}
            options={testers}
          />
          {/* <TextArea value={getUserGroupMembers()} placeholder='请在此输入人员分组，以“;”分隔开来' onChange={groupChange} /> */}
        </li>
        {/* <li>
          <div>受测者：</div>
          <TextArea value={getUserGroupMembers()} placeholder='请在此输入人员分组，以“;”分隔开来' onChange={groupChange} />
        </li> */}
      </ul>
    </div>
    
  )
  return (
    <div className='right'>
      <div className="title">题目设置</div>
      { configs.length? rightTools: null }
    </div>
  )
}
