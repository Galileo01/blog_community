import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, BackTop, Card, Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import { UserInfo, postBaseInfo } from '../../types/common';
import { useGetUserInfo } from '../../common/hooks';
import PostList from '../../components/PostList';
import { getByUid } from '../../network/user';
import { getPostsByUid } from '../../network/post';
import './index.less';

export default function Profile() {
  //获取redux 存储的 用户信息UserInfo
  const userInfo = useGetUserInfo();
  const [postList, setList] = useState<postBaseInfo[]>([]);
  const [userInfoInfetch, setInfo] = useState<UserInfo>();
  const { Uid } = useParams<{ Uid: string }>();
  //转换 数字 用于请求
  const UidNum = useMemo(() => parseInt(Uid, 10), [Uid]);
  const isSelfPage = useMemo(() => userInfo.Uid === UidNum, [userInfo, UidNum]); //当前是否是自己个人页面

  //进入页面 先验证
  async function getData() {
    //先发送获取 用户信息的 请求
    const { data: data1 } = await getByUid(UidNum);
    if (data1.success === 0) {
    } else {
      setInfo(data1.data);
    }
    //获取帖子列表
    const { data } = await getPostsByUid(UidNum);
    console.log(data);

    if (data.success === 0) {
    } else {
      setList(data.data);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <main className="profile">
      <BackTop />
      <div className="content">
        {userInfoInfetch && (
          <Card className="user-info">
            <Row justify="center">
              {userInfoInfetch.role === 1 && <Tag color="red">系统管理员</Tag>}
              {userInfoInfetch.role === 2 && <Tag color="gold">管理员</Tag>}
              {userInfoInfetch.role === 3 && <Tag color="green">普通用户</Tag>}
            </Row>
            <Avatar size={100} icon={<UserOutlined />} src={userInfoInfetch.avatar} />
            <Row justify="center">
              <Col span={2}>用户名</Col>
              <Col span={2}>{userInfoInfetch.name}</Col>
            </Row>
            <Row justify="center">
              <Col span={2}>Email</Col>
              <Col span={2}>{userInfoInfetch.emial || '空'}</Col>
            </Row>
            <Row justify="center">
              <Col span={2}>Tel</Col>
              <Col span={2}>{userInfoInfetch.tel || '空'}</Col>
            </Row>
            {isSelfPage && userInfo.role === 1 && (
              <Row>
                <Col span={3}>
                  <Link to="/dashboard">进入控制台</Link>
                </Col>
              </Row>
            )}
            {isSelfPage && (
              <Row>
                <Col span={3}>
                  <Link to="/dashboard">{userInfo.role < 3 ? '管理系统' : '管理我的帖子'}</Link>
                </Col>
              </Row>
            )}
          </Card>
        )}
        <section className="self-posts">
          <PostList itemList={postList} headerText={isSelfPage ? '我的帖子' : '他的帖子'} />
        </section>
      </div>
    </main>
  );
}
