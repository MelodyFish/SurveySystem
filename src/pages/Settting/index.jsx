import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Tabs, Tag, Button, message, Popconfirm, Modal, Tooltip } from 'antd'
import SettingDetails from './components/SettingDetails'
import Progress from './components/Progress'
import Statistic from './components/Statistic'
import Manual from './components/Manual'
import Group from './components/Group'
import { useStore } from '../../store/index'
import { getSession, setSession } from '../../utils/session'
import { delSurveyListItem, queryTesters, updateTesters } from '../../service/setting'
import { modifySurveyListItem } from '../../service/home'
import './index.less'

export default function Setting() {
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ curTab, setCurTab ] = useState('1')
  const [ targetKeys, setTargetKeys ] = useState([])
  const [ groupKeys, setGroupKeys ] = useState([])
  const [ tableData, setTableData ] = useState([])
  const [ tableData2, setTableData2 ] = useState([])
  const nav = useNavigate()
  const location = useLocation()
  const { surveyId, title, subTitle, creatorCn, createTime, sstatus, startTime, endTime } = location.state
  const { groupStore } = useStore()
  const staffList = groupStore.staffList
  const items = [
    {
      label: `答题设置`,
      key: '1',
      children: <SettingDetails surveyId={surveyId} title={title} subTitle={subTitle} startTime={startTime} endTime={endTime} />,
    },
    {
      label: `受测者`,
      key: '2',
      children: <Progress 
                  tableData={tableData} 
                  setTableData={setTableData} 
                  tableData2={tableData2}
                  setTableData2={setTableData2} 
                  staffList={staffList} 
                  />,
    },
    {
      label: `默认统计`,
      key: '3',
      children: <Statistic surveyId={surveyId} />,
    },
  ]
  useEffect(()=> {
    getTesters()
  }, [])
  function getTesters() {
    queryTesters(surveyId).then(res => {
      res.data.page.list.forEach(item => {
        const { username } = item
        item.key = username
        staffList.map(groupItem => {
          if(username == groupItem.username) {
            item.cnname = groupItem.cnname
            item.mail = groupItem.mail
          }
        })
      })
      const targetKeys = res.data.page.list.map(item => {
        return item.username
      })
      setTargetKeys(targetKeys)
      // console.log('targetKeys', targetKeys)
      // console.log('res.data.page.list', res.data.page.list)
      setTableData(res.data.page.list)
      setTableData2(res.data.page.list)
    })
  }
  function renderStatus(status) {
    let obj = {}
    switch (status) {
      case 1:
        obj.className = 'design'
        obj.value = '设计中'
        break;
      case 2:
        obj.className = 'collect'
        obj.value = '收集中'
        break;
      case 3:
        obj.className = 'collect-done'
        obj.value = '结束'
        break;
      case 4:
        obj.className = 'discard'
        obj.value = '停用'
        break;
      default:
        obj.className = 'collect-done'
        obj.value = '收集结束'
        break;
    }
    return obj
  }
  function add() {
    setIsModalOpen(true)
  }
  function stop() {
    modifySurveyListItem({
      surveyId,
      sstatus: 4,
      // subTitle
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('停用成功')
      }
    }).catch(err => {
      message.error(err.data.errorMsg)
    })
  }
  function del() {
    delSurveyListItem({surveyId}).then(res => {
      if(res.data.errorCode === 0) {
        message.success('删除成功')
        nav('/', {replace: true})
      }
    })
  }
  function onTabChange(key) {
    setCurTab(key)
    setSession('settingTab', key)
    console.log('getSession', getSession('settingTab'))
  }
  function handleOk() {
    setIsModalOpen(false)
    let arr = []
    if(curTab === '1') {
      // 手动导入
      targetKeys.map((item, index) => {
        arr[index] = {
          username: item
        }
      })
    } else {
      // 分组导入
      arr = groupKeys.map(item => {
        return typeof item === 'string'? {username: item}: {groupId: item}
      })
    }
    updateTesters({
      surveyId,
      testers: arr
    }).then(res => {
      if(res.data.errorCode === 0) {
        getTesters()
        message.success('操作成功')
      }
    })
  }
  function handleCancel() {
    setIsModalOpen(false)
  }

  return (
    <div className='setting'>
      <div className="setting-tools">
        <div className="survey-info">
          <Tooltip title={title}>
            <div className='survey-title'>{title}</div>
          </Tooltip>
          
          <Tag className={renderStatus(sstatus)?.className}>{renderStatus(sstatus)?.value}</Tag>
          <span>创建人: {creatorCn}</span>
          <span>创建时间: {createTime}</span>
        </div>
        <div className="survey-btns">
          <Button type='primary' onClick={add}>
            添加受测者
          </Button>
          <Popconfirm
            title="你确定要停用该问卷吗？"
            onConfirm={stop}
            okText="确认"
            cancelText="取消"
          >
            <Button type='primary' style={{margin:'0 10px'}}>
              停用
            </Button>
          </Popconfirm>
          
          <Popconfirm
            title="你确定要删除该问卷吗？"
            onConfirm={del}
            okText="确认"
            cancelText="取消"
          >
            <Button>删除</Button>
          </Popconfirm>
          
        </div>
      </div>
      <Tabs  
        className='setting-tabs'
        defaultActiveKey="1"
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
      {/* <Tabs
        className='setting-tabs'
        defaultActiveKey="1"
        items={[
          {
            label: `答题设置`,
            key: '1',
            children: <SettingDetails surveyId={surveyId} title={title} />,
          },
          {
            label: `受测者`,
            key: '2',
            children: <Progress tableData={tableData} />,
          },
          {
            label: `默认统计`,
            key: '3',
            children: <Statistic surveyId={surveyId} />,
          },
        ]}
      /> */}
      <Modal 
        title="添加受测者"
        okText='确认'
        cancelText='取消'
        visible={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        width={900}
        maskTransitionName=""
        transitionName=""
      >
        {/* <Tabs
          defaultActiveKey="1"
          onChange={onTabChange}
          items={[
            {
              label: `手动导入`,
              key: '1',
              children: <Manual targetKeys={targetKeys} setTargetKeys={setTargetKeys} staffList={staffList} />
            },
            {
              label: `分组导入`,
              key: '2',
              children: <Group groupKeys={groupKeys} setGroupKeys={setGroupKeys} />,
            },
          ]}
        /> */}
        <Tabs  
          defaultActiveKey="1"
          onChange={onTabChange}
        >
          <Tabs.TabPane tab={'手动导入'} key={'1'}>
            <Manual targetKeys={targetKeys} setTargetKeys={setTargetKeys} staffList={staffList} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={'分组导入'} key={'2'}>
            <Group groupKeys={groupKeys} setGroupKeys={setGroupKeys} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}
