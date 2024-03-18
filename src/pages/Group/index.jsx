import React, { Fragment, useState, useEffect,  } from 'react'
import { Button, Table, Space, Tabs, Modal, Transfer, Input, Form, message, Popconfirm } from 'antd'
import difference from 'lodash/difference'
import Tool from '../../components/Tool'
import { useStore } from '../../store/index'
import { queryGroupLists, updateGroup } from '../../service/group'
import './index.less'

const leftTableColumns = [
  {
    title: '姓名',
    dataIndex: 'cnname',
  }
]
const rightTableColumns = [
  {
    title: '姓名',
    dataIndex: 'cnname',
  },
  {
    title: '邮箱',
    dataIndex: 'mail',
  },
]

export default function MemberGroup() {
  const [ open, setOpen ] = useState(false)
  const [ curType, setCurType ] = useState(false)
  const [ tableData, setTableData ] = useState([]);
  const [ transferTable, setTransferTable ] = useState([]);
  const [ targetKeys, setTargetKeys ] = useState([]);
  const [ curKey, setCurKey ] = useState('');
  const [ form ] = Form.useForm()
  const columns = [
    {
      title: '组名',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (_, {key, groupName, members})=> {
        return (
          <a 
            style={{cursor: 'pointer'}}
            onClick={()=>handleAction('编辑', key, groupName, members)}
          >
            {groupName}
          </a>
        )
      }
    },
    {
      title: '人数',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      render: (_, { key, groupName, members })=> {
        // const { key, groupName, members } = record
        return (
          <Space size="middle">
            <Popconfirm
              title="您确定要删除吗？"
              onConfirm={()=>del(key)}
              okText="确认"
              cancelText="取消"
            >
              <a href="#">删除</a>
            </Popconfirm>
            <a onClick={()=>handleAction('编辑', key, groupName, members)}>编辑</a>
            <a onClick={()=>copy(key, groupName, members)}>复制</a>
          </Space>
        )
      }
    }
  ];
  const { groupStore } = useStore()
  const staffList = groupStore.staffList
  useEffect(() => {
    setTransferTable(staffList)
    getGroupLists()
  }, []);
  const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        const rowSelection = {
          // table的全选
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows.map(({ key }) => key)
            console.log('treeSelectedKeys', treeSelectedKeys)
            const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys)
            onItemSelectAll(diffKeys, selected)
          },
          onSelect({ key }, selected) {
            console.log(key)
            onItemSelect(key, selected)
          },
          selectedRowKeys: listSelectedKeys,
        };
        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
          />
        )
      }}
    </Transfer>
  )
  function getGroupLists() {
    queryGroupLists().then(res => {
      const data = res.data.page.list
      data.forEach(item => {
        item.key = item.groupId
        staffList.map(member => {
          if(item.creator === member.username) {
            item.creator = member.cnname
          }
        })
      })
      setTableData(data)
    })
  }
  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
  };
  function handleAction(modalTitle, key, groupName, members) {
    setOpen(true)
    setCurType(modalTitle)
    if(modalTitle ==='编辑') {
      setCurKey(key)
      form.setFieldsValue({
        groupName
      })
      setTargetKeys(members.map(item => item.username))
    }
  }
  function del(groupId) {
    updateGroup({
      action: 3,
      group: {
        groupId, 
      }
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('删除成功!')
        getGroupLists()
      } else {
        // message.error(res.data.errorMsg)
      }
    })
  }
  function copy(groupId, groupName, members) {
    updateGroup({
      action: 1,
      group: {
        groupName: groupName + '(copy)',
        members
      }
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('复制成功!')
        getGroupLists()
      } else {
        // message.error(res.data.errorMsg)
      }
    })
  }
  function reset() {
    form.setFieldsValue({
      groupName: ''
    })
    setTargetKeys([])
    setOpen(false)
  }
  function onFinish(values) {
    const { groupName } = values
    const members = targetKeys.map(item => ({
      username: item
    }))
    updateGroup({
      action: curType === '编辑'? 2 : 1,
      group: {
        groupId: curKey,
        groupName,
        members
      }
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('数据已更新!')
        getGroupLists()
      } else {
        // message.error(res.data.errorMsg)
      }
    })
    reset()
  }
  return (
    <div className='group'>
      <Tabs
        className='tabs'
        defaultActiveKey='1'
        tabBarExtraContent={
          <Button type='primary' onClick={()=>handleAction('新增')}>新增</Button>
        }
      >
        <Tabs.TabPane tab='人员分组' key='1'>
          <Table dataSource={tableData} columns={columns} />
        </Tabs.TabPane>
      </Tabs>
      <Modal
        className='modal'
        width='900px'
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
        maskTransitionName=""
        transitionName=""
      >
        <Form
          name="basic"
          layout='vertical'
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="组名"
            name="groupName"
            rules={[
              {
                required: true,
                message: '请输入组名!',
              }
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          <TableTransfer
            dataSource={transferTable}
            targetKeys={targetKeys}
            showSearch
            showSelectAll={true}
            filterOption={(inputValue, item) =>
              item.cnname.indexOf(inputValue) !== -1 
            }
            onChange={handleChange}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />
          <Form.Item
            wrapperCol={{
              offset: 20,
              span: 4,
            }}
            style={{
              marginTop: '40px'
            }}
          >
            <Button onClick={reset} style={{marginRight:'20px'}}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
