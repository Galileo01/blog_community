import axios from './index';

import { CommentItem, nestedCommentItem } from '../types/common';
interface commentRes {
  data: CommentItem[];
  success: number;
}
interface addRes {
  data: CommentItem;
  success: number;
}
//提交 评论项 类型
interface submitCommentItem {
  Pid: number;
  replyCid: number | null;
  content: string;
  username: string;
}


// 获取 某个帖子的 评论  并 构造为 嵌套结构
async function _getByPid(Pid: number) {
  return axios.get<commentRes>('/comment/getByPid', {
    params: {
      Pid,
    },
  });
}
//获取之后处理
export async function getByPid(Pid: number) {
  const { data } = await _getByPid(Pid)
  if (!data.success) return [];
  const commentList = data.data;
  console.log(commentList);

  //第一层的评论
  const firstLevel = commentList.filter((item) => item.replyCid === null);
  const secondLevel = commentList.filter((item) => item.replyCid !== null);
  console.log(firstLevel, secondLevel);

  const result: nestedCommentItem[] = firstLevel.map((item) => {
    const { Cid } = item;
    const children = secondLevel.filter((item2) => item2.replyCid === Cid); //找到所有 回复item 的评论
    return {
      ...item,
      children,
    };
  });
  return result;
}
export function addComment(info: submitCommentItem) {
  return axios.post<addRes>('/comment/add', info);
}