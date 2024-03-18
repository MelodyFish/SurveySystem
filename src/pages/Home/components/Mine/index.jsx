import React, { useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Space, message, Popconfirm, Tag } from 'antd'
import { delSurveyListItem } from '../../../../service/home'
import './index.less'

export default function Mine(props) {
  const { tableData, getTableList } = props
  const nav = useNavigate()
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (_, {surveyId, title, creatorCn, createTime, sstatus, startTime, endTime, subTitle})=> {
        return (
          <a 
            style={{cursor: 'pointer'}}
            onClick={()=>redirectSetting(surveyId, title, creatorCn, createTime, sstatus, startTime, endTime, subTitle)}
          >
            {title}
          </a>
        )
      },
      width: '473'
    },
    {
      title: '受测者',
      dataIndex: 'respondentCount',
      key: 'respondentCount',
    },
    {
      title: '答卷数',
      dataIndex: 'answerCount',
      key: 'answerCount',
    },
    {
      title: '状态',
      dataIndex: 'sstatus',
      key: 'sstatus',
      render: (_, { sstatus })=> {
        const obj = renderStatus(sstatus)
        const { value, className } = obj
        return (
          <Tag className={className}>
            {value}
          </Tag>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '创建人',
      dataIndex: 'creatorCn',
      key: 'creatorCn',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, { surveyId })=> {
        return (
          <Space size="middle">
            <a onClick={()=>handleAction('编辑', surveyId)}>编辑</a>
            <a onClick={()=>handleAction('预览', surveyId)}>预览</a>
            <Popconfirm
              title="您确定要删除该问卷吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={()=>del(surveyId)}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  function renderStatus(status) {
    const obj = {}
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
        obj.value = '收集结束'
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
  function redirectSetting(surveyId, title, creatorCn, createTime, sstatus, startTime, endTime, subTitle) {
    nav('/setting', {state: {surveyId, title, creatorCn, createTime, sstatus, startTime, endTime, subTitle}})
  }
  function handleAction(type, surveyId) {
    if(type === '编辑') {
      // 跳转携带当前问卷ID
      nav('/editor', {state:{surveyId}})
    } else {
      nav(`/q/${surveyId}`, {state:{preview: true}})
    }
  }
  function del(surveyId) {
    delSurveyListItem({surveyId: surveyId}).then(res => {
      if(res.data.errorCode == 0) {
        message.success('删除成功!')
        getTableList()
      }
    })
  }
  return (
    <Fragment>
      <Table columns={columns} dataSource={tableData} />
    </Fragment>
  )
}
