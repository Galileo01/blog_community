import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd'
import { UserInfo } from '../types/common';
import { useSelector } from 'react-redux';
import { postItem } from '../types/common';
import { postQueryParams } from '../types/network';
import { postQuery } from '../network/post';

//获取用户信息
export function useGetUserInfo() {
  const userInfo = useSelector<UserInfo, UserInfo>(state => state);
  return userInfo;
}


//封装 帖子查询的 逻辑
export function usePostQuery(mode: 'admin' | 'common') {
  const init: postQueryParams = {
    type: 'all',
    keyword: '',
    offset: 0,
    limit: 15,
    mode
  };
  const [postList, setList] = useState<postItem[]>([]);
  const [params, setParams] = useState<postQueryParams>(init); //组件挂载之后 从store 恢复之前的参数
  const [total, setTotal] = useState(0);

  async function _postQuery() {
    // console.log(params);
    const {
      data
    } = await postQuery(params);
    if (data.success === 0) return notification.error({
      message: '数据请求失败',
    });
    // console.log(isFirst);
    else if (data.data.postList.length === 0)
      notification.info({
        message: '没有符合条件的数据，换个关键词吧',
      });
    else {
      notification.success({
        message: '数据请求成功',
      });
      const { postList, total } = data.data;
      setList(postList);
      setTotal(total);
    }
  }

  //params 参数变化重新  请求
  useEffect(() => {
    _postQuery();
  }, [params]);

  return {
    params,
    setParams,
    postList,
    total,
    _postQuery,
  };
}