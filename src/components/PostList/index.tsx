import React from 'react';
import { List, Tag } from 'antd';
import { postBaseInfo } from '../../types/common';
import { formatTime } from '../../common/utils';
import PostNumberInfo from '../PostNumberInfo';
import './index.less';
interface Props {
  itemList: postBaseInfo[];
  headerText: string;
  isShowOp?: boolean;
}

const PostList: React.FC<Props> = ({ itemList, headerText }) => {
  return (
    <List
      header={<h3 className="list-title">{headerText}</h3>}
      itemLayout="vertical"
      dataSource={itemList}
      className="posts-list"
      renderItem={item => (
        <List.Item className="post-item" key={item.Pid}>
          <div className="item-header">
            <div className="left">
              <a className="username" href={'/profile/' + item.Uid}>
                {item.username}
              </a>
              <span className="update-time small">{formatTime(item.updateTime)}</span>
            </div>
            <div className="right small">
              {item.keywords.split(' ').map((word, index) => (
                <Tag key={'key' + index}>{word}</Tag>
              ))}
            </div>
          </div>
          <div className="item-title">
            <span className="jin" id={item.title}>
              #
            </span>
            -<a href={'/detail/' + item.Pid}>{item.title} </a>
          </div>
          <div className="item-desc ">{item.desc}</div>
          <PostNumberInfo readCount={item.readCount} commentCount={item.commentCount} starCount={item.starCount} />
        </List.Item>
      )}
    />
  );
};
export default PostList;
