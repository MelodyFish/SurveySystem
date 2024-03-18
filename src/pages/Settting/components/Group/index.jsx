import React, { useState, useEffect } from 'react'
import { Transfer, Tree, Input } from 'antd'
import { getGroupLists } from '../../../../service/setting'
import './index.less'

export default function Group(props) {
  const { groupKeys, setGroupKeys } = props
  const [ treeData, setTreeData ] = useState([])
  const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey)
  const generateTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key),
      children: generateTree(children, checkedKeys),
  }))
  const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
    const transferDataSource = []
    function flatten(list = []) {
      list.forEach((item) => {
        transferDataSource.push(item)
        flatten(item.children)
      })
    }
    flatten(dataSource)
    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        className="tree-transfer"
        render={(item) => item.title}
        showSelectAll={false}
      >
        {({ direction, onItemSelect, selectedKeys }) => {
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys]
            return (
              <div>
                <Tree
                  checkable
                  checkedKeys={checkedKeys}
                  treeData={generateTree(dataSource, targetKeys)}
                  onCheck={(_, { node: { key } }) => {
                    onItemSelect(key, !isChecked(checkedKeys, key))
                  }}
                  onSelect={(_, { node: { key } }) => {
                    onItemSelect(key, !isChecked(checkedKeys, key))
                  }}
                />
              </div>
            );
          }
        }}
      </Transfer>
    )
  }
  useEffect(() => {
    getGroupLists().then(res => {
      const data = res.data.page.list
      data.forEach(item => {
        item.key = item.groupId
        item.title = item.groupName
        item.children = item.members
        item.children.forEach((child, index) => {
          // child.key = `${child.groupId}-${index}`
          child.key = child.username
          child.title = child.username
        })
      })
      setTreeData(data)
    })
  }, [])
  function onChange(keys) {
    setGroupKeys(keys)
  }
  function onSearchChange(e) {
    // setExpandedKeys(newExpandedKeys);
    // setSearchValue(value);
    // setAutoExpandParent(true);
  }
  return (
    <div className='setting-group'>
      {/* <Search
        style={{
          marginBottom: 8,
        }}
        placeholder="Search"
        onChange={onSearchChange}
      /> */}
      <TreeTransfer 
        dataSource={treeData} 
        targetKeys={groupKeys}
        onChange={onChange} 
      />
    </div>
  )
}
