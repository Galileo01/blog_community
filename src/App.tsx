import React, { Suspense } from 'react';
import { notification } from 'antd';
import { Route, Switch, Redirect, HashRouter, BrowserRouter } from 'react-router-dom';
import Loading from './components/Loading';
import GlobalHeader from './components/GlobalHeader';
import Footer from './components/Footer';
import router from './router';
import './App.less';
//配置全局
notification.config({
  placement: 'bottomRight',
});
//注册路由
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Suspense fallback={<Loading />}>
          <Switch>
            {router.map((item, index) => (
              <Route
                path={item.path}
                key={'route-item-' + index}
                render={() =>
                  item.path === '/login' ? (
                    <item.component />
                  ) : (
                    <>
                      <GlobalHeader centerTitle={item.name} />
                      <item.component />
                      {/* 控制面板不展示 页脚 */}
                      {!item.path.includes('dashboard') && <Footer />}
                    </>
                  )
                }
              />
            ))}
            <Redirect from="/" to="/home" exact />
            <Redirect to="404" />
          </Switch>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
