import { GETUSERINFO, REMOVEUSERINFO } from './const';
import { UserInfo } from '../types/common'
import { actionType } from '../types/redux'
const initial: UserInfo = {
  Uid: -1,
  name: '',
  role: 4,//游客
  wid: '',
  avatar: '',
  createTime: 0,
  emial: "",
  tel: 0
}
//若sesstionstorage 存的有就使用 
const sesstionS = sessionStorage.getItem('userInfo');
const defalutState = sesstionS ? JSON.parse(sesstionS) as UserInfo : initial;
//导出reducer
export default function userReducer(preState: UserInfo = defalutState, { type, payload }: actionType<UserInfo>) {
  console.log(type, payload);

  switch (type) {
    case GETUSERINFO:
      return payload;
    case REMOVEUSERINFO:
      return initial;
    default:
      return preState;
  }

}