import React, { useState, useEffect } from 'react'
import { Button, Select, Tabs, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import Mine from './components/Mine'
import All from './components/All'
import { getSession, setSession } from '../../utils/session'
import { getSurveyLists, addSurveyListItem } from '../../service/home'
import { useStore } from '../../store/index'
import { isAdmin } from '../../utils/auth'
import './index.less'

const statusOptions = [
  {
    label: '停用',
    value: 4
  },
  {
    label: '设计中',
    value: 1
  },
  {
    label: '收集中',
    value: 2
  },
  {
    label: '收集结束',
    value: 3
  },
]
export default function Home() {
  const [ curTitle, setCurTitle ] = useState('')
  const [ curStatus, setCurStatus ] = useState('')
  const [ curTab, setCurTab ] = useState(getSession('curTab') || '1')
  const [ tableData, setTableData ] = useState([])
  const [ tableData2, setTableData2 ] = useState([])
  const [ allTableData, setAllTableData ] = useState([])
  const [ allTableData2, setAllTableData2 ] = useState([])
  const nav = useNavigate()
  const { userStore, groupStore } = useStore()
  const tabItems = [
    {
      label: `我的问卷`,
      key: '1',
      children: <Mine tableData={tableData} getTableList={getTableList}  />
    },
    {
      label: `全部问卷`,
      key: '2',
      children: <All tableData={allTableData} getTableList={getTableList} /> 
    }
  ]
  console.log('isAdmin', isAdmin())
  const items = isAdmin() ? tabItems : [tabItems[0]]

  useEffect(()=> {
    groupStore.setGroupList()
    getTableList()
  }, [])
  useEffect(() => {
  }, [tableData])
  function getTableList() {
    getSurveyLists().then(res => {
      const arr = res.data.page.list
      arr.forEach(item => {
        item.key = item.surveyId
      })
      setTableData(arr.filter(item => item.creator ===  userStore.userInfo.username))
      setTableData2(arr.filter(item => item.creator ===  userStore.userInfo.username))
      setAllTableData(arr)
      setAllTableData2(arr)
    })
  }
  function curStatusChange(value) {
    setCurStatus(value)
  }
  function reset() {
    setCurTitle('')
    setCurStatus('')
    getTableList()
  }
  function filterData(table) {
    return table.filter(item => {
      const { title, sstatus } = item
      if(curTitle && typeof curStatus === 'number') {
        return title.toLowerCase().includes(curTitle) && sstatus === curStatus
      } else if(curTitle) {
        return title.toLowerCase().includes(curTitle)
      } else {
        return sstatus === curStatus
      }
    })
  }
  function search() {
    let arr = []
    if(!curTitle && curStatus === '') {
      getTableList()
    } else {
      arr = filterData(curTab==='1'? tableData2: allTableData2)
    }
    if(curTab === '1') {
      setTableData(arr)
    } else {
      setAllTableData(arr)
    }
    
  }
  function addSurveyItem() {
    addSurveyListItem().then(res => {
      nav('/editor', {state:{surveyId: res.data.surveyId}})
    })
  }
  function onTabChange(key) {
    setSession('curTab', key)
    setCurTab(key)
  }
  return (
    <div className='home'>
      <div className="selectTool">
        <span style={{padding: '0 20px 0 0px'}}>问卷标题</span>
        <Input
          placeholder="请输入问卷名"
          onChange={(e)=>setCurTitle(e.target.value)}
          value={curTitle}
          style={{
            width: 120,
          }}
          maxLength={50}
        />
        <span style={{padding: '0 20px 0 50px'}}>问卷状态</span>
        <Select 
          style={{width: 120}}
          onChange={curStatusChange}
          value={curStatus}
          options={statusOptions}
        />
        <Button style={{margin: '0 15px 0 50px'}} onClick={reset}>重置</Button>
        <Button type='primary' onClick={search}>查询</Button>
      </div>
      <Tabs
        className='tabs'
        defaultActiveKey={curTab}
        onChange={onTabChange}
        tabBarExtraContent={
          <Button  type='primary' onClick={addSurveyItem}>
            新建问卷
          </Button>
        }
        // items={items}
      >
      {
        items.map(item => {
          const { label, key, children } = item
          return (
            <Tabs.TabPane tab={label} key={key}>
              {children}
            </Tabs.TabPane>
          )
        })
      }
      </Tabs>
    </div>
  )
}
