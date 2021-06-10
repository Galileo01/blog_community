import axios from './index';
import { postBaseInfo, postItem, postType } from '../types/common';
import {
  resData,
  resListData,
  postQueryParams,
} from '../types/network';
//基础信息
type basePostListRes = resData<{ postList: postBaseInfo[] }>;
//完整信息
type postListRes = resData<{ postList: postItem[] }>;

//添加帖子的 返回数据
type postAddRes = resData<number>;

//添加 帖子 的参数 类型
export interface submitPostItem {
  username: string,
  title: string;
  desc: string;
  type: postType;
  keywords: string;
  content: string;
  Uid: number,
  Pid?: number
}

export function getAllPost() {
  return axios.get<basePostListRes>('/post/getAll');
}
export function addPost(info: submitPostItem) {
  return axios.post<postAddRes>('/post/add', info);
}

export function updatePost(info: submitPostItem) {
  return axios.post<postAddRes>('/post/update', info);
}

//条件查询
export function postQuery(params: postQueryParams) {
  return axios
    .get<resData<{
      postList: postItem[];
      total: number;
    }>>('/post/query', {
      params: {
        ...params,
      },
    })
  // .catch(errHandler);
}

export function getPostByPid(Pid: number) {
  return axios.get<resData<postItem>>('/post/getByPid', {
    params: {
      Pid,
    },
  });
}

export function getPostsByUid(Uid: number) {
  return axios.get<resData<postBaseInfo[]>>('/post/getByUid', {
    params: {
      Uid,
    },
  });
}
export function deletePostByPid(Pid: number) {
  return axios.post<resData<number>>('/post/deleteByPid', {
    Pid,
  });
}

//递增 帖子的 阅读次数
export function increReadCount(Pid: number) {
  return axios.post<resData<number>>('/post/increReadCount', {
    Pid,
  });
}
//点赞
export function increStarCount(Pid: number) {
  return axios.post<resData<number>>('/post/increStarCount', {
    Pid
  })
}