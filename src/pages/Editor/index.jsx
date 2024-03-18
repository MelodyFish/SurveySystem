import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import Sider from './components/Sider'
import Content from './components/Content'
import Right from './components/Right'
import { modifySurveyItemTitle, querySurveyItemFields } from '../../service/editor'
import './index.less'

const initFields = {
  surveyId: 0,
  title: '请输入问卷标题', 
  subTitle: '------', 
  // distribution: [],
  configs:[]
}

export default function Editor() {
  const [ fields, setFields ] = useState(initFields)
  const [ curIndex, setCurIndex ] = useState(0)
  const [ droppable, setDroppable ] = useState(false)
  const { configs } = fields
  const location = useLocation()
  let paginateLen = configs.filter(item => 
    item.type === 'pagination'
  ).length
  useEffect(()=> {
    // querySurveyItemFields(
    //   location.state.surveyId
    // ).then(res => {
    //   if(res.data.errorCode === 0) {
    //     // res.data.survey.title = '请输入问卷标题'
    //     // res.data.survey.subTitle = '请输入问卷描述'
    //     res.data.survey.configs.forEach(item => {
    //       item.labelInputShow = false
    //       // if(item.type === 'checkbox') {
    //       //   item.max = item.options.length || 1
    //       // }
    //     })
    //     setFields(res.data.survey)
    //   }
    // })
  }, [])
  // useEffect(() => {
  //   const config = {
  //     pagination: paginateLen + 1,
  //   }
  //   if(showOne) {
  //     let arr = []
  //     const filterConfigs = configs.filter(item=> item.type !== 'pagination')
  //     filterConfigs.map((item, index) => {
  //       arr.push({...config, pagination: index + 1})
  //       arr.push(item)
  //       if(index === filterConfigs.length-1) {
  //         arr.push({...config, pagination: index + 2})
  //       }
  //     })
  //     setFields({...fields, configs:arr})
  //   }
  // }, [showOne])
  
  function hasOptions(type) {
    switch (type) {
      case 'checkbox':
      case 'radio': 
      case 'select':
        return true;
      default: 
        return false
    }
  }
  function generateItem(type, label='标题', placeholder='请输入') {
    let mulInputName = uuid()
    const config = {
      label,
      labelInputShow: false,
      required: true,
      name: type=='textArea'? '': uuid(),
      placeholder,
      type,
      hasDesc: false,
      description: '请输入题干内容',
      options: hasOptions(type)? [
        {
          label: '选项1',
          value: `${curIndex+1}-1`
        },
        {
          label: '选项2',
          value: `${curIndex+1}-2`
        }
      ]: [],
      col: 1,
      mulInputs: type=='textArea'? [
        {
          subTitle: '填空1',
          name: [mulInputName, `填空1`]
        },
        {
          subTitle: '填空2',
          name: [mulInputName, `填空2`]
        }
      ]: [],
      userGroups: [],
      paragraphDesc: '请在此编写段落说明!',
      pagination: type==='pagination'?paginateLen + 1: null,
      min: 1,
    }
    config.number = config.max = config.options.length 
    if(type==='pagination'&& !paginateLen) {
      configs.unshift({...config, name:uuid()})
    }
    if(config.pagination === 1) {
      let { pagination } = config
      configs.push({...config, pagination: ++pagination})
    } else {
      configs.push(config)
    }
    setFields({...fields, configs})
  }
  return (
    <div className='editor'>
      <Sider
        fields={fields}
        setFields={setFields}
        curIndex={curIndex}
        setCurIndex={setCurIndex} 
        generateItem={generateItem}
      />
      <Content 
        fields={fields} 
        setFields={setFields} 
        hasOptions={hasOptions}
        curIndex={curIndex} 
        setCurIndex={setCurIndex} 
        setDroppable={setDroppable}
        // modifySurveyItemTitle={modifySurveyItemTitle}
      />
      <Right 
        fields={fields} 
        setFields={setFields}
        curIndex={curIndex}
        hasOptions={hasOptions}
      />
    </div>
  )
}
