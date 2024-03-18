import React, { Fragment, useState, useEffect } from 'react'
import { Button, Table,Tabs, Space, Modal, Input, Form, message, Popconfirm } from 'antd'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import Tool from '../../components/Tool'
import { queryTemplateLists, handleTemplate } from '../../service/template'
import './index.less'

const entityExtension = {
  // 指定扩展类型
  type: 'entity',
  // 指定该扩展对哪些编辑器生效，不指定includeEditors则对所有编辑器生效
  // includeEditors: ['demo-editor-with-entity-extension'],
  // 指定扩展的entity名称，推荐使用全部大写，内部也会将小写转换为大写
  name: 'KEYBOARD-ITEM',
  // 在编辑器工具栏中增加一个控制按钮，点击时会将所选文字转换为该entity
  // control: {
  //   text: '测试'
  // },
  // 指定entity的mutability属性，可选值为MUTABLE和IMMUTABLE，表明该entity是否可编辑，默认为MUTABLE
  mutability: 'IMMUTABLE',
  // 指定通过上面新增的按钮创建entity时的默认附加数据
  data: {
    foo: 'hello'
  },
  // 指定entity在编辑器中的渲染组件
  component: (props) => {
    // 通过entityKey获取entity实例，关于entity实例请参考https://github.com/facebook/draft-js/blob/master/src/model/entity/DraftEntityInstance.js
    const entity = props.contentState.getEntity(props.entityKey)
    // 通过entity.getData()获取该entity的附加数据
    const { foo } = entity.getData()
    return <span data-foo={foo} className="keyboard-item">{props.children}</span>
  },
  // 指定html转换为editorState时，何种规则的内容将会转换成该entity
  importer: (nodeName, node, source) => {
    // source属性表明输入来源，可能值为create、paste或undefined
    if(node?.classList?.contains('asd')) {
    }
    if (nodeName.toLowerCase() === 'main' || (node.classList && node.classList.contains('keyboard-item'))) {
      // 此处可以返回true或者一个包含mutability和data属性的对象
      return {
        mutability: 'IMMUTABLE',
        data: {
          foo: node.dataset.foo
        },
      }
    }
  },
  // 指定输出该entnty在输出的html中的呈现方式
  exporter: (entityObject, originalText) => {
    // 注意此处的entityObject并不是一个entity实例，而是一个包含type、mutability和data属性的对象
    const { foo } = entityObject.data
    return <span data-foo={foo} className="keyboard-item">{originalText}</span>
  }
}

// 加载扩展模块
BraftEditor.use(entityExtension)
// BraftEditor.use可以同时传入单个或多个扩展
// BraftEditor.use(ext) 或者 BraftEditor.use([ext1, ext2, [ext3, ext4]])都是合法的

export default function  NoticeTemplate() {
  const [ open, setOpen ] = useState(false)
  const [ curType, setCurType ] = useState('')
  const [ curKey, setCurKey ] = useState('')
  const [ tableData, setTableData ] = useState([])
  const [ form ] = Form.useForm()
  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      render: (_, {key, title, category, content})=> {
        return (
          <a 
            style={{cursor: 'pointer'}}
            onClick={()=>handleAction('编辑', key, title, category, content)}
          >
            {title}
          </a>
        )
      }
    },
    {
      title: '类型',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '操作',
      render: (_, { key, title, category, content })=> {
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
            <a onClick={()=>handleAction('编辑', key, title, category, content)}>编辑</a>
            <a onClick={()=>copy(title, category, content)}>复制</a>
          </Space>
        )
      }
    }
  ];
  // 富文本选项卡
  const controls = [
    'separator','font-size', 'line-height', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 
    'text-align', 'separator','headings', 'separator', 'link', 'hr', 'clear'
  ]
  // 扩展选项卡
  const extendControls = [
    {
      key: 'name',
      type: 'button',
      text: <b> 用户姓名 </b>,
      className: 'keyboard-item',
      onClick: ()=>insertValue('用户姓名')
    },
    {
      key: 'deadline',
      type: 'button',
      text: <b> 截止时间 </b>,
      className: 'keyboard-item',
      onClick: ()=>insertValue('截止时间')
    },
    {
      key: 'links',
      type: 'button',
      text: <b> 作答链接 </b>,
      className: 'keyboard-item',
      onClick: ()=>insertValue('作答链接')
    },
  ]
  // DOM挂载后获取富文本内容
  useEffect(()=> {
    // form.setFieldsValue({
    //   content: BraftEditor.createEditorState('<p>Hello World!</p>')
    // })
    getTemplateList()
  }, [])
  function getTemplateList() {
    queryTemplateLists().then(res => {
      const tableData = res.data.page.list
      tableData.forEach(item => {
        item.key = item.templateId
      })
      setTableData(tableData)
    })
  }
  function handleAction(modalTitle, key, title, category, content) {
    setOpen(true)
    setCurType(modalTitle)
    if(modalTitle ==='编辑') {
      setCurKey(key)
      form.setFieldsValue({
        title,
        category,
        content: BraftEditor.createEditorState(content)
      })
    } else {
      reset()
    }
  }
  function del(key) {
    handleTemplate({
      action: 3,
      template: {
        templateId: key
      }
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('删除成功!')
        getTemplateList()
      }
    })
  }
  function copy(title, category, content) {
    handleTemplate({
      action: 1,
      template: {
        title: title + '(copy)',
        category,
        content
      }
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('复制成功!')
        getTemplateList()
      } else {
        // message.error(res.data.errorMsg)
      }
    })
  }
  // 拓展选项卡
  function insertValue(type) {
    const htmlString = `<main class='asd'>${type} <br /></main>`
    form.setFieldsValue({
      content: ContentUtils.insertHTML(form.getFieldValue('content'), htmlString)
    })
  }
  function onFinish(values) {
    const { title, category } = values
    const params = {
      title,
      category,
      content: form.getFieldValue('content').toHTML()
    }
    if(curType === '编辑') {
      params.templateId = curKey
    }

    handleTemplate({
      action: curType === '编辑'? 2: 1,
      template: params
    }).then(res => {
      if(res.data.errorCode === 0) {
        getTemplateList()
        message.success('修改成功')
        setOpen(false)
      } else {
        // message.error(res.data.errorMsg)
      }
    })
    
    
  }
  function reset() {
    form.setFieldsValue({
      title: '',
      category: '',
      content:  ContentUtils.clear(form.getFieldValue('content'))
    })
  }
  return (
    <div className='template'> 
      <Tabs
        className='tabs'
        defaultActiveKey='1'
        tabBarExtraContent={
          <Button type='primary' onClick={()=>handleAction('新增')}>新增</Button>
        }
      >
        <Tabs.TabPane tab='通知模板' key='1'>
          <Table dataSource={tableData} columns={columns} />
        </Tabs.TabPane>
      </Tabs>
      <Modal 
        title={curType} 
        visible={open} 
        onCancel={()=>setOpen(false)}
        width='1000px'
        footer={null}
        maskTransitionName=""
        transitionName=""
      >
        <Form
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout='vertical'
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="模板名称"
            name="title"
            placeholder='请输入'
            rules={[
              {
                required: true,
                message: '请输入模板名称!',
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item
            label="模板类型"
            name="category"
            rules={[
              {
                required: true,
                message: '请输入模板类型!',
              }
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item
            label="邮件内容"
            name="content"
            wrapperCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: '请输入邮件内容!',
                validator: async () => {
                  let isEditorEmpty = form.getFieldValue('content').isEmpty()
                  if (isEditorEmpty) {
                    return Promise.reject('富文本编辑器为空')
                  }
                }
              },
            ]}
          >
            <BraftEditor
              controls={controls}
              extendControls={extendControls}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 20,
              span: 4,
            }}
          >
            <Button onClick={reset} style={{marginRight:'20px'}}>
              重置
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
