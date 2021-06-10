import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import md5 from 'blueimp-md5';
import { GETUSERINFO } from '../../redux/const';
import { login, register } from '../../network/user';
import './index.less';
import icon from '../../static/favicon.png';

export default function Login() {
  const dispatch = useDispatch();
  const [form] = Form.useForm<{ username: string; password: string }>();
  const [oprateType, setType] = useState<'log' | 'reg'>('log');
  const history = useHistory();
  function finishHandler() {
    form.validateFields().then(async ({ password, username }) => {
      const requestFun = oprateType === 'log' ? login : register;
      const res = await requestFun({ password: md5(password), username });
      const { data } = res;
      //data 是string 类型 的错误信息
      if (data.success === 0) {
        message.error(data.data);
        return;
      } else {
        //保存到store
        dispatch({
          type: GETUSERINFO,
          payload: data.data.userInfo,
        });
        sessionStorage.setItem('token', data.data.token);
        message.success(oprateType === 'log' ? '登录成功,即将回到上一个页面' : '注册成功,即将回到上一个页面', 1, () => {
          history.goBack(); //回到上一个页面
        });
        sessionStorage.setItem('userInfo', JSON.stringify(data.data.userInfo)); //存储到 绘画存储
      }
    });
  }
  return (
    <main className="container">
      <Card
        className="login_wapper"
        title={
          <>
            <img src={icon} alt="" />
            <h3>BlogCommunity</h3>
          </>
        }
        extra={<Link to="/home">首页</Link>}
        bordered>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={finishHandler}
          form={form}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" allowClear />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              allowClear
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <div className="btns">
              <Button
                type={oprateType === 'log' ? 'primary' : 'default'}
                htmlType="submit"
                className="login-form-button">
                {oprateType === 'log' ? '登录' : '注册'}
              </Button>
              <Button
                type="link"
                className="reg-btn"
                onClick={() => {
                  setType(oprateType === 'log' ? 'reg' : 'log');
                }}>
                {oprateType === 'log' ? '没有账号?' : '已有账号'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </main>
  );
}
