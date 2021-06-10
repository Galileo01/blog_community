import React, { useState, Suspense, useEffect, useMemo } from 'react';
import { Layout, Menu, Modal, Spin } from 'antd';
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom';
import { UnorderedListOutlined, EditOutlined, DoubleLeftOutlined, TeamOutlined } from '@ant-design/icons';
import { useGetUserInfo } from '../../common/hooks';
import './index.less';
import { adminRouter } from '../../router';
import Loading from '../../components/Loading';
const { Content, Sider } = Layout;

//菜单图标
const menuIcons: { [key: string]: JSX.Element } = {
  '/dashboard/postList': <UnorderedListOutlined />,
  '/dashboard/postAdd': <EditOutlined />,
  '/dashboard/userList': <TeamOutlined />,
};
export default function DashBoard() {
  const userInfo = useGetUserInfo();
  const [collapsed, setCollapsed] = useState(false); //侧边导航是否折叠
  const history = useHistory();
  const defaultKeys: string[] = history.location.pathname.includes('/postAdd')
    ? ['/dashboard/postAdd']
    : ['/dashboard/postList'];
  const [selectedKeys, setKeys] = useState(defaultKeys);

  function changeKeys({ key, path }: { key: string; path: string }) {
    console.log(key);
    history.push(path);
    // setKeys([key]);
  }
  //传入 页面组件 控制 路由
  function setPath(path: string) {
    history.push(path);
  }
  // console.log(selectedKeys);
  const location = useLocation();
  //监听location.pathname 变化 动态 更新菜单
  useEffect(() => {
    console.log('pathname changed', location.pathname);
    setKeys([location.pathname]);
  }, [location.pathname]);

  function mainMenuItemClick(key: React.ReactText) {
    if (typeof key === 'string') {
      // console.log(key);
      if (key === 'exit') {
        history.goBack();
      } else
        changeKeys({
          key,
          path: key,
        });
    }
  }
  //要渲染 的 路由
  const renderRoutes = useMemo(() => {
    if (userInfo.role === 3) return adminRouter.slice(0, 3);
    //只有管理员有 用户管理权限
    else return adminRouter;
  }, [userInfo]);
  //要显示的菜单列表
  const menuList = useMemo(
    () => adminRouter.filter(item => item.isShow && userInfo.role <= item.minRole),
    [adminRouter]
  );
  return (
    <Layout style={{ minHeight: '100vh' }} className="dash-board">
      <Layout className="site-layout">
        <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} width={150}>
          <Menu theme="dark" mode="inline" onClick={({ key }) => mainMenuItemClick(key)} selectedKeys={selectedKeys}>
            {menuList.map(({ title, path }) => {
              return (
                <Menu.Item key={path} icon={menuIcons[path]}>
                  {title}
                </Menu.Item>
              );
            })}
            <Menu.Item icon={<DoubleLeftOutlined />} key="exit">
              返回
            </Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ margin: '0 16px' }}>
          <Suspense fallback={<Loading />}>
            <Switch>
              {/* 未登录 强制重定向 到 登录页面 */}
              {/* 渲染同时传递 函数props */}
              {userInfo.Uid !== -1 ? (
                renderRoutes.map(item => (
                  <Route path={item.path} render={() => <item.component setPath={setPath} />} key={item.path} />
                ))
              ) : (
                <Redirect to="/login" />
              )}
              <Redirect from="/dashboard" to="/dashboard/postList" strict />
            </Switch>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
