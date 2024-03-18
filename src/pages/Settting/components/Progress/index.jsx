import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import moment from 'moment'; 
import 'dayjs/locale/zh-cn';
// import locale from 'antd/es/date-picker/locale/zh_CN';
import { Select, Button, Table, Tag, Modal, Form, Input, DatePicker, message } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { queryTemplateLists } from '../../../../service/template'
import { sendEmail, queryTesters } from '../../../../service/setting'
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
      // console.log('Yes!')
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

export default function Progress(props) {
  const { tableData, setTableData,tableData2, setTableData2, staffList } = props
  const [ selectedRows, setSelectedRows ] = useState(0)
  const [ selectedTesters, setSelectedTesters ] = useState(0)
  const [ templateId, setTemplateId ] = useState(0)
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ modalTitle, setModalTitle ] = useState('')
  const [ templateOptions, setTemplateOptions ] = useState([])
  const [ form ] = Form.useForm()
  const location = useLocation()
  const nav = useNavigate()
  const dateFormat = 'YYYY-MM-DD hh:mm:ss'; // 定义时间格式
  const { creatorCn, createTime, surveyId, startTime, endTime } = location.state
  const columns = [
    {
      title: '姓名',
      dataIndex: 'cnname',
      key: 'cnname',
    },
    {
      title: '邮箱',
      dataIndex: 'mail',
      key: 'mail',
    },
    {
      title: '作答进度',
      dataIndex: 'sstatus',
      key: 'sstatus',
      render: (_, { sstatus })=> {
        const obj = renderStatus(sstatus)
        const { className, value } = obj
        return (
          <Tag className={className}>
            {value}
          </Tag>
        )
      }
    },
    {
      title: '最近催促时间',
      dataIndex: 'notifyTime',
      key: 'notifyTime'
    }
  ]
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows.length)
      setSelectedTesters(selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
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
      text: <b>用户姓名</b>,
      className: 'keyboard-item',
      onClick: ()=>insertValue('用户姓名')
    },
    {
      key: 'deadline',
      type: 'button',
      text: <b>截止时间</b>,
      className: 'keyboard-item',
      onClick: ()=>insertValue('截止时间')
    },
    {
      key: 'links',
      type: 'button',
      text: <b>作答链接</b>,
      className: 'keyboard-item',
      onClick: ()=>insertValue('作答链接')
    },
  ]
  useEffect(()=> {
    // getTesters()
  }, [])
  // 拓展选项卡
  function insertValue(type) {
    const htmlString = `<main class='asd'>${type}   <br /></main>`
    form.setFieldsValue({
      content: ContentUtils.insertHTML(form.getFieldValue('content'), htmlString)
    })
  }
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
      setTableData(res.data.page.list)
      setTableData2(res.data.page.list)
    })
  }
  function renderStatus(status) {
    const obj = {}
    switch (status) {
      case 0:
        obj.className = 'discard'
        obj.value = '已删除'
        break;
      case 1:
        obj.className = 'design'
        obj.value = '未开始'
        break;
      case 2:
      obj.className = 'collect'
      obj.value = '已回答'
      break;
      default:
        obj.className = 'discard'
        obj.value = '未开始'
        break;
    }
    return obj
  }
  function getTemplateList() {
    queryTemplateLists().then(res => {
      let list = res.data.page.list.map(item => ({
        label: item.title,
        value: item.templateId,
        content: item.content
      }))
      setTemplateOptions(list)
    })
  }
  // SelectChange
  function handleSelectChange(value) {
    setTableData(tableData2.filter(item => item.sstatus == value))
    // setTemplateOptions(templateOptions2.filter(item => item.sstatus == value))
  }
  function onTemplateChange(value) {
    let content = ''
    let title = ''
    templateOptions.map(item => {
      if(item.value === value) {
        content = item.content
        title = item.label
        setTemplateId(value)
      }
    })
    form.setFieldsValue({
      title,
      starttime: moment(startTime, dateFormat),
      endtime: moment(endTime, dateFormat),
      content: BraftEditor.createEditorState(content)
    })
  }
  function onEmailTitleChange(e) {
    form.setFieldsValue({
      title: e.target.value
    })
  };
  function handleAction(modalTitle) {
    setModalTitle(modalTitle)
    getTemplateList()
    setIsModalOpen(true)
  }
  // function sendEmail() {
  //   setModalTitle('发通知')
  //   setIsModalOpen(true)
  // }
  function clear() {
    form.setFieldsValue({
      starttime: '',
      endtime: '',
      template: '',
      title: '',
      content: ContentUtils.clear(form.getFieldValue('content'))
    })
  }
  function onFinishFailed(errorInfo) {
  }
  function onFinish(value) {
    // value.content = value.content.toHTML()
    sendEmail({
      templateId,
      testers: selectedTesters
    }).then(res => {
      if(res.data.errorCode === 0) {
        message.success('发送成功')
      }
    }).catch(err => {
      // message.error(err.data.errorMsg)
    })
    handleCancel()
    clear()
  }
  function handleCancel() {
    setIsModalOpen(false)
  }
  // 催促
  function urge() {
    sendEmail({
      templateId,
      testers: selectedTesters
    }).then(res => {
      if(res.data.errorCode === 0) {
        getTesters()
        message.success('发送成功')
      } else {
      }
    }).catch(err => {
      message.error(err.data.errorMSG)
    })
    handleCancel()
  }
  return (
    <div className='progress'>
      <div className="progress-tool">
        <div className="tool-left">
          <span>作答进度:</span>
          <Select
            // defaultValue="1"
            style={{
              width: 120,
            }}
            onChange={handleSelectChange}
            options={[
              {
                value: '1',
                label: '未开始',
              },
              {
                value: '2',
                label: '已完成',
              }
            ]}
          />
        </div>
        <div className="tool-right">
          <Button 
            type="link"
            icon={<MailOutlined />}
            onClick={()=> handleAction('发通知')} style={{marginRight: '15px'}}
          >
            发通知
          </Button>
          <Button 
            type="link"
            icon={<MailOutlined />}
            onClick={()=> handleAction('催促受测者')}
          >
            催促
          </Button>
          {/* <Button type='primary' onClick={()=> handleAction('发通知')} style={{marginRight: '15px'}}>发通知</Button> */}
          {/* <Button type='primary' onClick={()=> handleAction('催促受测者')}>催促</Button> */}
        </div>
      </div>
      <Table 
        columns={columns} 
        dataSource={tableData} 
        style={{marginTop: '20px'}}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
      <Modal 
        title={
          <div>
            <span style={{paddingRight: '50px'}}>{modalTitle}</span>
            <span>创建人: {creatorCn? creatorCn: 'XXX'}</span>
            <span style={{paddingLeft: '20px'}}>创建时间: {createTime}</span>
          </div>
        }
        okText='确认'
        cancelText='取消'
        visible={isModalOpen} 
        onCancel={handleCancel}
        width={900}
        footer={
          modalTitle === '发通知'? null: 
          <div>
            <Button onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" onClick={urge}>
              发送
            </Button>
          </div>
        }
        maskTransitionName=""
        transitionName=""
      >
        <div 
          style={{
            height:'40px', 
            lineHeight:'40px', 
            borderBottom: '1px solid #ccc',
            marginBottom: '20px'
          }}
        >
          本次选中: {selectedRows}人
        </div>
        {
          modalTitle === '发通知'? (
            <Form
              name="basic"
              labelCol={{
                span: 3,
              }}
              wrapperCol={{
                span: 18,
              }}
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="生效时间"
                name="starttime"
                placeholder='请输入'
                rules={[
                  {
                    required: true,
                    message: '请选择生效时间',
                  },
                ]}
              >
                <DatePicker showTime disabled defaultValue={moment(startTime, dateFormat)} format={dateFormat}/>
                {/* <DatePicker locale={locale} showTime /> */}
              </Form.Item>
              <Form.Item
                label="截止时间"
                name="endtime"
                placeholder='请输入'
                rules={[
                  {
                    required: true,
                    message: '请选择截止时间!',
                  },
                ]}
              >
                <DatePicker showTime disabled defaultValue={moment(endTime, dateFormat)} format={dateFormat} />
              </Form.Item>
              <Form.Item
                label="通知模板"
                name="template"
                rules={[
                  {
                    required: true,
                    message: '请选择模板!',
                  }
                ]}
              >
                <Select
                  style={{
                    width: 207,
                  }}
                  placeholder='请选择模板!'
                  onChange={onTemplateChange}
                  options={templateOptions}
                />
              </Form.Item>
              <div className='warn'>
                注：发送之前请先点击预览进行复核，大批量通知前建议先给自己发送一次，确保无误后再群发
              </div>
              {/* <Form.Item
                label="注："
                className='warn'
              >
                <span>发送之前请先点击预览进行复核，大批量通知前建议先给自己发送一次，确保无误后再群发</span>
              </Form.Item> */}
              <Form.Item
                label="邮件标题"
                name="title"
                onChange={onEmailTitleChange}
                rules={[
                  {
                    required: true,
                    message: '请输入邮件标题!',
                  }
                ]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
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
                  disabled
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
                <Button onClick={handleCancel} style={{marginRight:'10px'}}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  发送
                </Button>
              </Form.Item>
            </Form>
          ): (
            <div style={{margin: '20px 0'}}>
              <div className='urge-title'>邮件通知模板：</div>
              <Select
                placeholder='请选择通知模板'
                style={{
                  width: 207,
                }}
                onChange={onTemplateChange}
                options={templateOptions}
              />
            </div>
          )
        }
      </Modal>
    </div>
  )
}
