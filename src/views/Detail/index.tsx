import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, BackTop, notification, Card } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import marked from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css'; //
import Tocify from '../../components/tocify';
import filterXSS from 'xss';
import PostNumberInfo from '../../components/PostNumberInfo';
import { useParams } from 'react-router-dom';
import { formatTime } from '../../common/utils';
import CommentWapper from './CommentWapper'; //评论组件

import { postItem } from '../../types/common';
import { getPostByPid, increReadCount, increStarCount } from '../../network/post';
import './index.less';
interface DetailProps {}
const Detail: React.FC<DetailProps> = () => {
  //渲染 html
  const renderer = new marked.Renderer();
  const tocify = new Tocify();
  //在marked 生成 html 同时 生成tocify 导航
  renderer.heading = function (text, level, raw) {
    const anchor = tocify.add(text, level);
    return `<a id="${anchor}" href="#${anchor}" class="anchor-fix"><h${level}>${text}</h${level}></a>\n`;
  };
  //marked配置
  marked.setOptions({
    renderer,
    // gfm:true,//github 风格
    pedantic: false, //容错 并尝试修正
    sanitize: false, //忽略html
    breaks: false, //github 换行符
    smartLists: true, //列表渲染
    highlight: code => {
      //添加 hljs 的类名  使用 主题样式
      return `<div class="hljs"> 
            ${highlight.highlightAuto(code).value}
            </div>`;
    },
  });
  const [postData, setPost] = useState<postItem | null>(null);
  const { Pid } = useParams<{ Pid: string }>();
  const PidNum = parseInt(Pid, 10);

  // 持续 10s之后发送 阅读次数递增 请求
  useEffect(() => {
    let timer = setTimeout(async () => {
      const { data, status } = await increReadCount(PidNum);
      if (data.success === 0) {
        notification.error({
          message: '阅读次数增加失败',
        });
        console.log(data.data);
      }
      clearTimeout(timer);
    }, 5000);
    //组件卸载时  取消定时器
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);
  async function getPostData() {
    const { data } = await getPostByPid(PidNum);
    if (data.success) {
      setPost(data.data);
    } else {
    }
  }
  useEffect(() => {
    getPostData();
  }, []);
  async function submitStar() {
    const { data } = await increStarCount(PidNum);
    if (data.success === 0) {
      notification.error({
        message: '点赞失败',
      });
      console.log(data.data);
    } else {
      notification.success({
        message: '点赞成功',
      });
    }
  }
  return (
    <>
      <BackTop />
      <main className="detail">
        <Row className="comm_main" justify="center">
          <Col className="comm_right" xs={0} sm={0} md={6} lg={4} xl={4}>
            <section className="navbar">
              <div className="title">文章导航</div>
              <div className="post_nav anchor_nav">
                <tocify.Tocify />
              </div>
            </section>
          </Col>
          <Col className="comm_left" xs={23} sm={23} md={16} lg={18} xl={14}>
            {postData && (
              <section className="post">
                <div className="post_title">{postData.title}</div>
                <div className="other-info">
                  <div className="small update-time">更新时间 :{formatTime(postData.updateTime)}</div>
                  <PostNumberInfo
                    readCount={postData.readCount}
                    commentCount={postData.commentCount}
                    starCount={postData.starCount}
                  />
                </div>
                <div className="content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(filterXSS(postData.content)),
                    }}></div>
                </div>
              </section>
            )}
            <Card className="btn-wapper">
              <span className="btn" onClick={submitStar}>
                <span className="text">点赞</span>
                <LikeOutlined />
              </span>
            </Card>
            <CommentWapper Pid={PidNum} />
          </Col>
        </Row>
      </main>
    </>
  );
};
export default Detail;
