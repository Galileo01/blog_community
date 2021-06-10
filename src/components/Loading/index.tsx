import React from 'react';
import { Spin } from 'antd';
import './index.less';
export default function Loading() {
  return (
    <Spin wrapperClassName="loading" size="large">
      <h2>Data is loading.....</h2>
    </Spin>
  );
}
