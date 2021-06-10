import axios from './index';
import { UserInfo } from '../types/common';
import { resData } from '../types/network';

interface LogRes {
  userInfo: UserInfo,
  token: string
}

//用户登录
export function login(info: { username: string; password: string }) {
  return axios
    .post<resData<LogRes>>('/user/login', info)
}

//用户注册
export function register(info: { username: string; password: string }) {
  return axios.post<resData<LogRes>>('/user/register', info)
}
//获取指定 Uid 的用户 信息
export function getByUid(Uid: number) {
  return axios.get<resData<UserInfo>>('/user/getByUid', {
    params: {
      Uid
    }
  })
}

//根据 名称搜索用户
export function searchUser(name: string) {
  return axios.get<resData<UserInfo[]>>('/user/search', {
    params: {
      name
    }
  })
}

//删除用户
export function deleteByUid(Uid: number) {
  return axios.post<resData<number>>('/user/deleteByUid', {
    Uid,
  });
}

export function setRoleByUid(Uid: number, role: number) {
  return axios.post<resData<number>>('/user/setRoleByUid', {
    Uid,
    role
  });
}