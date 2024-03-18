import React, { useState, useEffect } from 'react'
import { Tabs, Anchor } from 'antd'
import { v4 as uuid } from 'uuid'
import {
  CaretDownOutlined,
  CaretRightOutlined
} from '@ant-design/icons'
import './index.less'

const { Link } = Anchor
const leftTree = [
  {
    title: '选择题',
    isOpen: true,
    children: [
      {
        type: 'radio',
        label: '单选'
      },
      {
        type: 'checkbox',
        label: '多选题'
      },
      {
        type: 'select',
        label: '下拉框'
      },
    ]
  },
  {
    title: '填空题',
    isOpen: true,
    children: [
      {
        type: 'input',
        label: '单项填空'
      },
      // {
      //   type: 'textArea',
      //   label: '多项填空'
      // }
    ]
  },
  {
    title: '分页说明',
    isOpen: true,
    children: [
      {
        type: 'pagination',
        label: '分页栏'
      },
      {
        type: 'pagination',
        label: '一题一页',
        func: (callback) => {
          callback();
        }
      },
      {
        type: 'paragraph',
        label: '段落说明'
      }
    ]
  },
  {
    title: '评价题',
    isOpen: true,
    children: [
      {
        type: 'rate',
        label: '评价题'
      }
    ]
  }
]
export default function Sider(props) {
  const { fields, setFields, generateItem, setCurIndex, curIndex } = props
  const [ subjects, setSubjects ] = useState(leftTree)
  const [ setting, setSetting ] = useState(false)
  const { configs } = fields
  const items = [
    {
      label: `题型`,
      key: '1',
      children: (
        <ul className='subject'>
          {
            subjects.map((item, index) => {
              const { isOpen, title, children } = item
              return (
                <li className='subject-group' key={Math.random()}>
                  {
                    isOpen? 
                    <CaretDownOutlined onClick={()=>{toggle(index)}}/>:
                    <CaretRightOutlined onClick={()=>{toggle(index)}} />
                  }
                  <span>{title}</span>
                  <ul className='subject-items' style={{display: isOpen? 'flex': 'none'}}>
                    {
                      children.map(subItem => {
                        const { label, type, func } = subItem
                        return (
                          <li 
                            key={Math.random()}
                            className='subject-item'
                            draggable
                            onDragEnd={()=>onDragEnd(`${type}`)}
                            onClick={()=>{
                              // generateItem(`${type}`)
                              func?func(toSinglePage):generate(type)
                            }}
                          >
                            {label}
                          </li>
                        )
                      })
                    }
                  </ul>
                </li>
              )
            })
          }
        </ul>
      )
    },
    {
      label: `大纲`,
      key: '2',
      children: (
        <Anchor onClick={(e, link)=>navToCurElement(e, link)}>
          {
            fields.configs.filter(
              item => item.type!=='pagination' && item.type!=='paragraph'
            ).map((item, index) => {
              const { name, label } = item
              return (
                <Link 
                  key={Math.random()} 
                  href={`#${name}`} 
                  title={`${index+1}. ${label}`} 
                />
              )
            })
          }
        </Anchor>
      )
    }
  ]
  useEffect(() => {
    if(configs.length && setting) {
      let element
      element = document.getElementById(`${configs[curIndex]?.name}`)
      element.scrollIntoView()
      setSetting(false)
    }
  }, [curIndex])
  function toggle(index) {
    let arr = subjects
    arr[index].isOpen = !arr[index].isOpen
    setSubjects([...arr])
  }
  function generate(type) {
    generateItem(type)
    setSetting(true)
    setCurIndex(configs.length-1)
    if(type!='pagination') {
      setCurIndex(configs.length-1)
    }
  }
  function navToCurElement(e, { href }) {
    e.preventDefault()
    const curName = href.slice(1)
    console.log('e', href.slice(1))
    fields.configs.map((item, index) => {
      if(item.name === curName) {
        // console.log('index', index)
        setCurIndex(index)
      }
    })
  }
  function onDragEnd(type) {
    // if(droppable) {
    //   generateItem(type)
    // }
    generateItem(type)
    // setDroppable(false)
  }
  function onTabChange(key) {
  }
  function toSinglePage(type='pagination') {
    // setFields({...fields, showOne: true})
    let paginateLen = configs.filter(item => 
      item.type === 'pagination'
    ).length
    const config = {
      label: '标题',
      required: false,
      name: type=='textArea'? '': Math.random(),
      placeholder: '请输入',
      type,
      hasDesc: false,
      desc: '请输入题干内容',
      userGroups: [],
      paragraphDesc: '请在此编写段落说明!',
      pagination: type==='pagination'?paginateLen + 1: null,
      min: 1,
      max: 1,
      number: 1
    }
    let arr = []
    const filterConfigs = configs.filter(item=> item.type !== 'pagination')
    filterConfigs.map((item, index) => {
      arr.push({...config, name:uuid(), pagination: index + 1})
      arr.push(item)
      if(index === filterConfigs.length-1) {
        arr.push({...config, name:uuid(), pagination: index + 2})
      }
    })
    setSetting(true)
    setFields({...fields, configs:arr})
    setCurIndex(arr.length-1)
  }
  return (
    <div className='sider'>
      <Tabs
        className='tabs'
        defaultActiveKey='1'
        onChange={onTabChange}
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
