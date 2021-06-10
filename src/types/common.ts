//帖子类型 枚举
export enum postType {
  ARTICLE,
  NOTE,
  OTHER,
}

export interface postBaseInfo {
  title: string;
  desc: string;
  type: postType;
  Pid: number;
  Uid: number;
  username: string,
  keywords: string;
  readCount: number;
  starCount: number;
  commentCount: number,
  updateTime: string;
}
export interface postItem extends postBaseInfo {
  content: string;
}

export interface UserInfo {
  Uid: number,
  name: string,
  role: number,
  emial: string,
  tel: number,
  wid: string,
  avatar: string;
  createTime: number
}

//搜索结果项
export interface suggestItem {
  title: string;
  Pid: number;
}

export interface CommentItem {
  Cid: number;
  Pid: number;
  replyCid: number;
  content: string;
  username: string;
  commentTime: string;
}

//input Ref引用
export type inputRef =
  | HTMLInputElement
  | undefined
  | HTMLTextAreaElement
  | null;

//页面组件 基础 props
export interface pageBaseProps {
  setPath: (key: string) => void;
}
//评论item
export interface CommentItem {
  Cid: number;
  Pid: number;
  replyCid: number;
  content: string;
  username: string;
  commentTime: string;
}
//嵌套的评论 item
export interface nestedCommentItem extends CommentItem {
  children: CommentItem[];
}