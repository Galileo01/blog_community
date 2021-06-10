import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Input, Card, Select, Table, notification, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import './index.less';
import { postType, postItem, pageBaseProps, UserInfo } from '../../../types/common';
import { searchUser, deleteByUid, setRoleByUid } from '../../../network/user';
const { Option } = Select;
const UserList: React.FC<pageBaseProps> = ({ setPath }) => {
  //查询 关键 词
  const [keyword, setWord] = useState('');
  const [userList, setList] = useState<UserInfo[]>([]);
  const [currPage, setPage] = useState(1);
  const [currOpreateUid, setUid] = useState(-1); //当前 操作的 Uid
  const [currSetNewRole, setRole] = useState(-1); //
  //用户搜索
  async function submitSearch(notif: boolean = true) {
    const { data } = await searchUser(keyword);
    if (data.success === 0) {
      notification.error({
        message: '查询失败',
      });
    } else {
      if (data.data.length === 0) {
        notification.info({
          message: '没有符合条件的用户,请更换关键词重新尝试',
        });
      } else {
        notif &&
          notification.success({
            message: '查询成功',
          });
        setList(data.data);
      }
    }
  }
  //提交 删除
  async function submitDelete(Uid: number) {
    const { data } = await deleteByUid(Uid);
    if (data.success === 0) {
      notification.error({
        message: '删除失败' + data.data,
      });
    } else {
      notification.success({
        message: '删除成功',
      });
      //重新搜索
      submitSearch(false);
    }
  }
  //提交 角色设置
  async function submitSetRole() {
    const { data } = await setRoleByUid(currOpreateUid, currSetNewRole);
    if (data.success === 0) {
      notification.error({
        message: '设置失败' + data.data,
      });
    } else {
      notification.success({
        message: '设置成功',
      });
      //重新搜索
      submitSearch(false);
    }
  }
  //进入页面先搜索 所有的用户
  useEffect(() => {
    submitSearch(false);
  }, []);
  const roleOptions = [
    {
      label: '系统管理员',
      value: 1,
    },
    {
      label: '管理员',
      value: 2,
    },
    {
      label: '普通用户',
      value: 3,
    },
  ];

  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Tel',
      dataIndex: 'tel',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '角色',
      width: '250px',
      render(user: UserInfo) {
        const showOptions = user.Uid == -1 ? roleOptions : roleOptions.filter(role => role.value > 1); //计算当前 用户应该展示选项
        return user.Uid === currOpreateUid ? (
          <Row>
            <Col span={16}>
              <Select defaultValue={user.role} onChange={value => setRole(value)}>
                {showOptions.map(item => (
                  <Option value={item.value}>{item.label}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Popconfirm
                title="此操作将更新该用户用户角色，确认继续？"
                okText="确认"
                cancelText="取消"
                onConfirm={() => {
                  submitSetRole();
                }}
                placement="left">
                <Button icon={<CheckOutlined />} type="primary" />
              </Popconfirm>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={16}>
              <span>{roleOptions.find(item => item.value === user.role)?.label}</span>
            </Col>
            <Col>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setUid(user.Uid);
                }}
                disabled={user.role === 1}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      title: '操作',
      key: 'oprate',
      render(user: UserInfo) {
        return (
          <div className="btns">
            <Popconfirm
              title="此操作将删除该用户，确认继续？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {
                submitDelete(user.Uid);
              }}
              placement="left">
              <Button icon={<DeleteOutlined />} danger disabled={user.role === 1} />
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
            placeholder="输入关键词进行模糊搜索(用户名)"
            enterButton
            onSearch={() => submitSearch()}
            allowClear
            onChange={e => setWord(e.target.value)}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={userList}
        bordered
        className="user_table"
        size="middle"
        pagination={{
          total: userList.length,
          current: currPage,
          pageSize: 10,
        }}
        rowKey="Uid"
        onChange={pagination => {
          // setParams({
          //   ...params,
          //   offset: (pagination?.current as number) - 1,
          // });
          setPage(pagination.current as number);
        }}
      />
    </Card>
  );
};

export default UserList;
