import React, { useState, Fragment, useEffect } from 'react'
import { Select, Button, Progress, Table, Modal } from 'antd'
import { v4 as uuid } from 'uuid'
import { getStatistics, exportExcel } from '../../../../service/setting'
import { DatabaseOutlined } from '@ant-design/icons'
import './index.less'

export default function Statistic(props) {
  const { surveyId } = props
  const [ tableData, setTableData ] = useState([])
  const [ params, setParams ] = useState({})
  const siftObj = {
    '层级': [
      {
        type: 'userLevel',
        label: '普通员工',
        value: '普通员工',
      },
      {
        type: 'userLevel',
        label: '二级部门副经理',
        value: '二级部门副经理',
      },
      {
        type: 'userLevel',
        label: '二级部门经理',
        value: '二级部门经理',
      },
      {
        type: 'userLevel',
        label: '一级部门副总经理',
        value: '一级部门副总经理',
      },
      {
        type: 'userLevel',
        label: '一级部门总经理',
        value: '一级部门总经理',
      },
      {
        type: 'userLevel',
        label: '分管副总裁',
        value: '分管副总裁',
      },
      {
        type: 'userLevel',
        label: '执行总监',
        value: '执行总监',
      },
    ],
    '司龄': [
      {
        type: 'lengthOfService',
        label: '小于0.5年',
        value: '小于0.5年',
      },
      {
        type: 'lengthOfService',
        label: '0.5-1年',
        value: '0.5-1年',
      },
      {
        type: 'lengthOfService',
        label: '1-2年',
        value: '1-2年',
      },
      {
        type: 'lengthOfService',
        label: '2-3年',
        value: '2-3年',
      },
      {
        type: 'lengthOfService',
        label: '3-5年',
        value: '3-5年',
      },
      {
        type: 'lengthOfService',
        label: '5年以上',
        value: '5年以上',
      },
    ],
    '性别': [
      {
        type: 'gender',
        label: '男',
        value: '男'
      },
      {
        type: 'gender',
        label: '女',
        value: '女'
      }
    ],
    '学历': [
      {
        type: 'education',
        label: '大学专科',
        value: '大学专科'
      },
      {
        type: 'education',
        label: '大学本科',
        value: '大学本科'
      },
      {
        type: 'education',
        label: '硕士研究生',
        value: '硕士研究生'
      },
      {
        type: 'education',
        label: '博士研究生',
        value: '博士研究生'
      },
    ],
    '年龄':[
      {
        type: 'age',
        label: '25岁以下',
        value: '25岁以下'
      },
      {
        type: 'age',
        label: '25-30岁',
        value: '25-30岁'
      },
      {
        type: 'age',
        label: '30-35岁',
        value: '30-35岁'
      },
      {
        type: 'age',
        label: '35-40岁',
        value: '35-40岁'
      },
      {
        type: 'age',
        label: '40-45岁',
        value: '40-45岁'
      },
      {
        type: 'age',
        label: '45-50岁',
        value: '45-50岁'
      },
      {
        type: 'age',
        label: '50岁以上',
        value: '50岁以上'
      },
    ],
    '职类': [
      {
        type: 'jobCategory',
        label: '职能序列',
        value: '职能序列'
      },
      {
        type: 'jobCategory',
        label: '销售序列',
        value: '销售序列'
      },
      {
        type: 'jobCategory',
        label: '技术序列',
        value: '技术序列'
      },
    ],
    '属地': [
      {
        type: 'site',
        label: '天津',
        value: '天津'
      },
      {
        type: 'site',
        label: '无锡',
        value: '无锡'
      },
      {
        type: 'site',
        label: '苏州',
        value: '苏州'
      },
      {
        type: 'site',
        label: '成都',
        value: '成都'
      },
      {
        type: 'site',
        label: '上海',
        value: '上海'
      },
      {
        type: 'site',
        label: '北京',
        value: '北京'
      },
    ]
  }
  const columns = [
    {
      title: '题目选项',
      dataIndex: 'label',
      key: 'label',
      width: 472
    },
    {
      title: '填选比例',
      dataIndex: 'rate',
      key: 'rate',
      render: (_, {rate})=> {
        return (<Progress percent={rate} />)
      }
    },
    {
      title: '填选次数',
      dataIndex: 'count',
      key: 'count',
      align: 'center'
    }
  ]
  const allData = [
    {
      key: 123,
      title: '请问你的年龄范围是?',
      type: '评分题',
      data: [
        {
          key: uuid(6),
          label: '小于25',
          rate: '10',
          count: '7'
        },
        {
          key: uuid(6),
          label: '25-30',
          rate: '50',
          count: '9'
        },
        {
          key: uuid(6),
          label: '30-40',
          rate: '20',
          count: '2'
        },
        {
          label: '40以上',
          rate: '20',
          count: '19'
        }
      ]
    },
    {
      key: 412,
      title: '请问你对IT部门满意程度',
      type: '评分题',
      data: [
        {
          label: '满意',
          rate: '30',
          count: '3'
        },
        {
          label: '不满意',
          rate: '70',
          count: '3'
        }
      ]
    }
  ]
  // useEffect(()=> {
  //   getStatisticsData()
  // }, [])
  useEffect(() => {
    getStatisticsData(params)
  }, [params])
  function getStatisticsData(data={}) {
    getStatistics({
      surveyId,
      pageInfo: {
        filters: data
      }
    }).then(res => {
      let list = filterData(res.data.page.list)
      setTableData(list)
    })
  }
  function filterData(list) {
    let value = list.filter(item => {
      return item.type!=='pagination' && item.type!=='paragraph'
    })
    value.forEach(item => {
      const { options, surveyItemId } = item
      if(options.length) {
        let total = options.reduce((pre, cur) => {
          return pre + cur.count
        }, 0)
        options.forEach(option => {
          const { surveyItemOptionId, count } = option
          option.total = total
          option.key = surveyItemOptionId
          option.rate = Math.round(count / total * 100)
        })
      }
      item.key = surveyItemId
    })
    return value
  }
  function swithchTypeToName(type) {
    let obj = {
      radio: '单选题',
      checkbox: '多选题',
      select: '选择题',
      input: '单项填空题',
      rate: '评分题'
    }
    return obj[type]
  }
  function handleChange(type, value) {
    let obj = {}
    obj[type] = value
    setParams({...params, ...obj})
    // switch (type) {
    //   case '':
        
    //     break;
    
    //   default:
    //     break;
    // }
    // 请求
  }
  // 导出原始数据
  function exportData() {
    window.location.href = `/survey/surveystatistics/export/${surveyId}`
  }
  return (
    <div className='statistic'>
      <div className="statistic-tool">
        <div className="tool-left">
          <span>筛选条件:</span>
          <div className="btns">
          {
            Object.values(siftObj).map((item, index) => {
              const selectValue = [params[item[0].type]].length?params[item[0].type]:''
              return (
                <Select
                  key={Math.random()}
                  showArrow
                  style={{
                    width: 120,
                  }}
                  mode="multiple"
                  value={selectValue}
                  placeholder={Object.keys(siftObj)[index]}
                  onChange={(value)=>handleChange(item[0].type, value)}
                  options={item}
                />
              )
            })
          }
          </div>
        </div>
        <div className="tool-right">
          <Button 
            type="link"
            icon={<DatabaseOutlined />}
            onClick={exportData}
          >
            导出原始数据
          </Button>
        </div>
      </div>
      <div className="statistic-data">
        {
          tableData.map(item => {
            const { label, type, options } = item
            return (
              <Fragment key={uuid(6)} >
                <h3 >{label}【{swithchTypeToName(type)}】</h3>
                <Table columns={columns} dataSource={options} pagination={false} />
              </Fragment>
            )
          })
        }
      </div>
    </div>
  )
}
