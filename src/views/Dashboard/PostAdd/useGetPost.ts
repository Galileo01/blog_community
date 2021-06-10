import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { postItem } from '../../../types/common';
import { getPostByPid } from '../../../network/post';

//如果是编辑页面  要获取指定id的帖子信息
export default function useGetPost(callback: () => void) {
  const [postInfo, setInfo] = useState<postItem>();
  const [oprate, setOprate] = useState('add');
  const params = useParams<{
    Pid: string;
  }>();
  const { Pid } = params;
  async function getPost(Pid: number) {
    const {
      data,
    } = await getPostByPid(Pid);
    if (data.success === 0) return message.error('数据请求失败');
    setInfo(data.data);
  }
  //渲染之后 判断并请求数据
  useEffect(() => {
    // console.log(Pid);
    if (Pid) {
      getPost(+Pid);
      setOprate('edit');//
    }
  }, []);
  //postInfo 更新之后 调用回调函数
  useEffect(callback, [postInfo]);
  return {
    postInfo,
    oprate,
    Pid,
  };
}