import React, { useState, useMemo } from 'react';
import { Col, Row, Input, Button, Select, Card, Popconfirm, message, Modal } from 'antd';
import marked from 'marked';
import { postType, pageBaseProps } from '../../../types/common';
import { addPost, updatePost } from '../../../network/post';
import useGetPost from './useGetPost';
import { useGetUserInfo } from '../../../common/hooks';
import './index.less';
marked.setOptions({
  renderer: new marked.Renderer(),
  pedantic: false,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

const PostAdd: React.FC<pageBaseProps> = ({ setPath }) => {
  const userInfo = useGetUserInfo();
  //内容输入模式
  const [mode, setMode] = useState('input');

  //帖子内容
  const [content, setContent] = useState('');
  //确认框是否 可见
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState(0);
  const [keywords, setWords] = useState('');

  // md 转换为html 格式 对应为       计算属性
  const contentHtml = useMemo(() => {
    return marked(content);
  }, [content]);

  //文件选择框
  let fileInput: HTMLInputElement | null = null;
  //手动触发 点击事件

  function handleVisibleChange() {
    if (content.length > 0 && !visible) {
      setVisible(true);
    } else if (content.length === 0 && visible) {
      setVisible(false);
    } else if (content.length === 0) {
      fileClick();
    }
  }

  function fileClick() {
    // 如果内容的长度大于 0 则需要 在选择文件时 弹出确认框
    fileInput?.click();
  }
  function fileChange() {
    if (fileInput && fileInput instanceof HTMLInputElement && fileInput.files?.length === 1) {
      const file = fileInput.files[0];
      console.log(file);

      const reader = new FileReader();
      reader.readAsText(fileInput.files[0]);
      reader.onload = () => {
        // setVisible(false);
        console.log(reader.result);
        setContent(reader.result as string);
        setVisible(false);
        setTitle(file.name); //默认把文件名称设置为 title
      };
    }
  }

  //请求数据 并回调
  const { postInfo, oprate, Pid } = useGetPost(() => {
    //postInfo 更新就 同步到表单数据
    if (postInfo) {
      const { title, desc, content, keywords, type } = postInfo;
      setContent(content);
      setDesc(desc);
      setWords(keywords);
      setTitle(title);
      setType(type);
    }
  });

  function submitClick() {
    if (!title || !desc || !content) return message.warn('请保证标题、内容、简介都不为空');
    console.log(content);
    Modal.confirm({
      title: '确认提交吗？',
      okText: '确认',
      cancelText: '我再检查一下',
      onOk: submitPost,
      maskClosable: true,
    });
  }
  //发送提交请求
  async function submitPost() {
    const request = oprate === 'add' ? addPost : updatePost; //当前页面操作
    const text = oprate === 'add' ? '添加' : '编辑';
    const {
      data: { data, success },
    } = await request({
      title,
      type,
      content,
      desc,
      keywords,
      Pid: +Pid,
      username: userInfo.name,
      Uid: userInfo.Uid,
    });
    // console.log(data);
    if (success === 1) {
      Modal.confirm({
        title: `${text} 成功,继续${text}还是跳转到帖子列表？`,
        cancelText: '继续' + text,
        okText: '跳转到帖子列表',
        onOk: () => {
          setPath('/dashoard/postList'); // 跳转 并设置父组件 菜单Keys
        },
      });
    } else message.error(text + '失败');
  }

  return (
    <Card className="post_add">
      <Row>
        <Col span={16}>
          <Input placeholder="博客标题" onChange={e => setTitle(e.target.value)} allowClear value={title} />
        </Col>
        <Col span={2} offset={2}>
          <Button type="primary" onClick={submitClick}>
            {oprate === 'add' ? '发布帖子' : '提交修改'}
          </Button>
        </Col>
      </Row>
      <Row align="middle">
        <Col span={3} className="type_choose">
          <span>输入方式:</span>
          <Select defaultValue="input" onChange={value => setMode(value)}>
            <Select.Option value="input">输入</Select.Option>
            <Select.Option value="md">md文件</Select.Option>
          </Select>
        </Col>
        <Col span={4} offset={3}>
          {mode === 'md' && (
            <>
              <input type="file" style={{ display: 'none' }} ref={ele => (fileInput = ele)} onChange={fileChange} />
              <Popconfirm
                title="此操作会清空当前输入的内容，确定继续？"
                okText="确定"
                cancelText="取消"
                visible={visible}
                onVisibleChange={handleVisibleChange}
                onConfirm={fileClick}
                onCancel={() => setVisible(false)}>
                <Button type="primary">选择文件</Button>
              </Popconfirm>
            </>
          )}
        </Col>
      </Row>
      <Row className="input_wapper" gutter={10}>
        <Col span={10}>
          <Input.TextArea
            placeholder="markdown格式的博客内容"
            className="input"
            onChange={e => setContent(e.target.value)}
            value={content}
          />
        </Col>
        <Col span={10}>
          <div className="html_preview" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
        </Col>
        <Col span={4}>
          <Input.TextArea
            rows={5}
            placeholder="文章简介"
            showCount
            onChange={e => setDesc(e.target.value)}
            allowClear
            value={desc}
          />
          <Input
            placeholder="输入关键词，空格分隔"
            allowClear
            onChange={e => setWords(e.target.value)}
            value={keywords}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PostAdd;
