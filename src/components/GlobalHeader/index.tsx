import React, { memo, useMemo } from 'react';
import { Row, Col, Affix, Popconfirm, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { REMOVEUSERINFO } from '../../redux/const';
import { UserInfo } from '../../types/common';
import './index.less';
import icon from '../../static/favicon.png';
const Header: React.FC<{ centerTitle?: string }> = ({ centerTitle = '首页' }) => {
  const userInfo = useSelector<UserInfo, UserInfo>(store => store);

  const diapatch = useDispatch();
  //  退出登录 清除 用户信息
  function logout() {
    diapatch({
      type: REMOVEUSERINFO,
      padload: userInfo,
    });
    sessionStorage.removeItem('userInfo'); //清除 sessionStorage
    sessionStorage.removeItem('token'); //清除 sessionStorage
  }
  return (
    <Affix offsetTop={0}>
      <header className="header_wapper">
        <Row justify="space-between" align="middle">
          <Col span={3}>
            <Link className="icon-wapper" to="/home">
              <img src={icon} alt="" />
              <h3>BlogCommunity 社区</h3>
            </Link>
          </Col>
          <Col span={3}>
            <section className="center-text">
              <h3>{centerTitle}</h3>
            </section>
          </Col>
          <Col span={3}>
            {userInfo.Uid === -1 ? (
              <Link to="/login">登录</Link>
            ) : (
              <div className="avatar_wapper">
                <Link className="avatar" to={'/profile/' + userInfo.Uid}>
                  <Avatar size={40} icon={<UserOutlined />} src={userInfo.avatar} />
                  <span className="name">{userInfo.name}</span>
                </Link>
                <Popconfirm
                  title="此操作将会退出用户，确认继续？"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={logout}
                  placement="bottom">
                  <LogoutOutlined />
                </Popconfirm>
              </div>
            )}
          </Col>
        </Row>
      </header>
    </Affix>
  );
};
export default memo(Header);
