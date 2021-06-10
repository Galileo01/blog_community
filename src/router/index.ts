//页面路由
import { lazy } from 'react';
import Home from '../views/Home';
//处理主页面之外  的页面懒加载
const Login = lazy(() => import('../views/Login'));
const Profile = lazy(() => import('../views/Profile'));
const NotFound = lazy(() => import('../views/404'));
const Detail = lazy(() => import('../views/Detail'));
const Dashboard = lazy(() => import('../views/Dashboard'));
const PostList = lazy(() => import('../views/Dashboard/PostList'));
const PostAdd = lazy(() => import('../views/Dashboard/PostAdd'));
const UserList = lazy(() => import('../views/Dashboard/UserList'))
//路由
export const router = [
  {
    path: '/login',
    component: Login,
    name: '登陆'
  },
  {
    path: '/home',
    component: Home,
    name: '首页'
  },
  {
    path: '/profile/:Uid',
    component: Profile,
    name: '个人中心'
  },
  {
    path: '/detail/:Pid',
    component: Detail,
    name: '帖子详情'
  },
  {
    path: '/dashboard',
    component: Dashboard,
    name: '控制面板'
  },
  {
    path: '/404',
    component: NotFound,
    name: '页面不见了'
  }
];

export const adminRouter = [
  {
    path: '/dashboard/postList', //'/home'
    component: PostList,
    title: '帖子列表',
    isShow: true,
    minRole: 3
  },
  {
    path: '/dashboard/postAdd',
    component: PostAdd,
    title: '添加帖子',
    isShow: true,
    minRole: 3
  },
  {
    path: '/dashboard/postEdit/:Pid',
    component: PostAdd,
    title: '编辑帖子',
    isShow: false,
    minRole: 3
  },
  {
    path: '/dashboard/userList',
    component: UserList,
    title: '用户列表',
    isShow: true,
    minRole: 2
  },
];

export default router;
