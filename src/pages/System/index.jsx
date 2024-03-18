import React, { Fragment, useState, useEffect } from 'react'
import { Button, Table, Tabs, Space, Modal, Input, Form, message, Popconfirm } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../store/index'
import Tool from '../../components/Tool'
import { getSystemUsers, updateSystemUsers } from '../../service/system'
import './index.less'

function SystemUser() {
  const [ tableData, setTableData ] = useState([])
  const [ open, setOpen ] = useState(false)
  const [ curType, setCurType ] = useState(false)
  const [ curKey, setCurKey ] = useState('')
  const [ form ] = Form.useForm()
  const columns = [
    {
      title: '登录名',
      dataIndex: 'username',
      key: 'name',
      render: (_, {username})=> {
        return (
          <a 
            style={{cursor: 'pointer'}}
          >
            {username}
          </a>
        )
      }
    },
    {
      title: '用户名',
      dataIndex: 'cnname',
      key: 'cnname',
    },
    {
      title: '部门',
      dataIndex: 'deptcn',
      key: 'deptcn',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
    },
    {
      title: '操作',
      render: (_, { key, name, admin })=> {
        return (
          <Space size="middle">
            <Popconfirm
              title="您确定要删除吗？"
              onConfirm={() => del(key)}
              okText="确认"
              cancelText="取消"
            >
              <a href="#">{admin ? '' : '删除'}</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  function getTableData() {
    getSystemUsers().then(res => {
      let value = res.data.page.list
      value.forEach(item => {
        item.key = item.username
      })
      setTableData(value)
    })
    // setTableData(systemUserList)
  }
  function updateTableData(action, username) {
    updateSystemUsers({
      action,
      username
    }).then(res => {
      if(res.data.errorCode === 0) {
        getTableData()
        reset()
        message.success(`${action === 1 ? '新增': '删除'}成功!`)
      } else {
        // message.error(res.data.errorMsg)
        reset()
      }
    }).catch(err => {
      message.error('用户名不存在')
    })
  }
  useEffect(() => {
    // setTableData(systemUserList)
    getTableData()
  }, [])
  
  function handleAction(modalTitle) {
    setOpen(true)
    setCurType(modalTitle)
  }
  function del(key) {
    updateTableData(3, key)
  }
  function reset() {
    form.setFieldsValue({
      username: ''
    })
    setOpen(false)
  }
  function onFinish(values) {
    const { username } = values
    updateTableData(1, username)
  }
  return (
    <div className='group'>
      <Tabs
        className='tabs'
        defaultActiveKey='1'
        tabBarExtraContent={
          <Button type='primary' onClick={()=>handleAction('创建用户')}>新增</Button>
        }
      >
        <Tabs.TabPane tab='系统用户' key='1'>
          <Table dataSource={tableData} columns={columns} />
        </Tabs.TabPane>
      </Tabs>
      <Modal 
        width='600px'
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        title={curType} 
        visible={open} 
        onCancel={reset}
        footer={null}
      >
        <Form
          name="basic"
          layout='vertical'
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="设置账号"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入登录账号!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 18,
              span: 6,
            }}
            style={{
              marginTop: '40px'
            }}
          >
            <Button onClick={reset} style={{marginRight:'10px'}}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default observer(SystemUser)
