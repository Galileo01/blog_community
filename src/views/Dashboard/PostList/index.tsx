import React from 'react';
import { Row, Col, Button, Input, Card, Select, Table, notification, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import './index.less';
import { postType, postItem, pageBaseProps } from '../../../types/common';
import { usePostQuery } from '../../../common/hooks';
import { deletePostByPid } from '../../../network/post';
const PostList: React.FC<pageBaseProps> = ({ setPath }) => {
  const { params, setParams, postList, total, _postQuery } = usePostQuery('admin');
  async function _deletePostByPid(Pid: number) {
    const { data } = await deletePostByPid(Pid);
    if (data.success === 1) {
      notification.success({
        message: '帖子删除成功',
      });
      _postQuery();
    } else
      notification.error({
        message: '帖子删失败',
      });
  }
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '阅读次数',
      dataIndex: 'readCount',
      sorter: (a: postItem, b: postItem) => a.readCount - b.readCount,
    },
    {
      title: '点赞次数',
      dataIndex: 'starCount',
      sorter: (a: postItem, b: postItem) => a.starCount - b.starCount,
    },
    {
      title: '评论个数',
      dataIndex: 'commentCount',
      sorter: (a: postItem, b: postItem) => a.commentCount - b.commentCount,
    },
    {
      title: '操作',
      key: 'oprate',
      render(post: postItem) {
        return (
          <div className="btns">
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={() => {
                setPath('/dashboard/postEdit/' + post.Pid);
              }}
            />
            <Popconfirm
              title="此操作将删除该帖子，确认继续？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => _deletePostByPid(post.Pid)}
              placement="left">
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <Card className="post_list">
      <Row>
        <Col span={12}>
          <Input.Search
            placeholder="输入关键词进行模糊搜索：用户名、帖子标题、描述、关键词"
            enterButton
            onSearch={value => {
              setParams({
                ...params,
                keyword: value,
              });
            }}
            allowClear
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={postList}
        bordered
        className="post_table"
        size="middle"
        pagination={{
          total,
          current: params.offset + 1,
          pageSize: 15,
        }}
        rowKey="Pid"
        onChange={pagination => {
          setParams({
            ...params,
            offset: (pagination?.current as number) - 1,
          });
        }}
      />
    </Card>
  );
};

export default PostList;
