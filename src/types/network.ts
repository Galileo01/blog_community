import { postType } from './common';

interface SuccessRes<T> {
  success: 1,
  data: T
}
interface FailRes {
  success: 0,
  data: string
}


//数据返回类型  泛型
export type resData<T> = SuccessRes<T> | FailRes;
//列表泛型
export type resListData<T> = {
  data: T[];
  success: 1;
} | FailRes

//postQuery 查询参数
export interface postQueryParams {
  type: postType | 'all';
  keyword: string;
  offset: number;
  limit: number;
  mode: 'common' | 'admin'
}

