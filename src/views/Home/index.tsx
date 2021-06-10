import React, { useEffect, useState } from 'react';
import { BackTop, Row, Col, Input, notification } from 'antd';
import PostList from '../../components/PostList';
import PostListNav from '../../components/PostListNav';
import { usePostQuery } from '../../common/hooks';
import { getAllPost } from '../../network/post';
import { postBaseInfo } from '../../types/common';
export default function Home() {
  const { params, setParams, postList, total, _postQuery } = usePostQuery('common');
  const postTitles = postList.map(item => item.title);
  // async function getData() {
  //   const { data } = await getAllPost();
  //   console.log(data);

  //   if (data.success) {
  //     setList(data.data.postList);
  //   }
  // }
  // useEffect(() => {
  //   getData();
  // }, []);
  function searchHandler(value: string) {
    console.log(value);
    if (value.length === 0) {
      notification.warn({
        message: '输入关键字',
      });
      return;
    } else {
    }
  }
  return (
    <main className="home">
      <BackTop />
      <main className="index">
        <Row className="comm_main" justify="center">
          <Col className="comm_right" xs={0} sm={0} md={6} lg={4} xl={4}>
            <PostListNav titleList={postTitles} />
          </Col>
          <Col className="comm_left" xs={23} sm={23} md={16} lg={18} xl={14}>
            <section className="header_search" style={{ marginTop: '10px' }}>
              <Input.Search
                placeholder="输入关键词进行模糊搜索：用户名、帖子标题、描述、关键词"
                enterButton
                onSearch={value => {
                  setParams({
                    ...params,
                    keyword: value,
                  });
                }}
                allowClear
              />
            </section>
            <PostList itemList={postList} headerText="所有帖子" />
          </Col>
        </Row>
      </main>
    </main>
  );
}
