import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Table, Transfer } from 'antd'
import difference from 'lodash/difference'
import { setLocalStorage } from '../../../../utils/session'
import { queryStaff } from '../../../../service/common'

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
export default function Manual(props) {
  const { targetKeys, setTargetKeys, staffList } = props
  const [ mockData, setMockData ] = useState([])
  const location = useLocation()
  const surveyId = location.state.surveyId
  useEffect(() => {
    setMockData(staffList)
  }, [])
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

  // 点击穿梭框中间切换时触发
  function onChange(nextTargetKeys) {
    // setLocalStorage('targetKeys', JSON.stringify(nextTargetKeys))
    setTargetKeys(nextTargetKeys)
  }
  return (
    <TableTransfer
      dataSource={mockData}
      targetKeys={targetKeys}
      showSearch
      showSelectAll={true}
      filterOption={(inputValue, item) =>
        item.cnname.indexOf(inputValue) !== -1 
      }
      onChange={onChange}
      leftColumns={leftTableColumns}
      rightColumns={rightTableColumns}
    />
  )
}
