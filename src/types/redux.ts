import { postQueryParams } from './network';
export interface userinfo {
  username: string;
  Uid: number;
}

//action 泛型
export interface actionType<T> {
  type: string;
  payload: T;
}
