
import axios from 'axios';
import { message } from 'antd'
import { AxiosResponse, AxiosError } from 'axios';
// import md5 from 'blueimp-md5';//http://localhost:8080
const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'http://121.41.225.12:8080';
const ins = axios.create({
  baseURL,
  timeout: 5000,
});

//请求 拦截器 携带token  进行身份验证
ins.interceptors.request.use((config) => {
  // console.log(config);
  const token = sessionStorage.getItem('token');//若存在token 则携带
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// //添加响应拦截器 解析 response  临时格式
ins.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    console.log(err);
    message.error('请求失败,状态码 ' + err.response?.status)
    return {
      data: {
        data: err.message,
        success: 0, //标志请求失败
      },
    };
  }
);

export default ins;