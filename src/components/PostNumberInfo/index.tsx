import React, { memo } from 'react';
import { EyeOutlined, CommentOutlined, LikeOutlined } from '@ant-design/icons';
import './index.less';
interface Props {
  readCount: number;
  starCount: number;
  commentCount: number;
}
const PostNumberInfo: React.FC<Props> = ({ readCount, commentCount, starCount }) => {
  return (
    <div className="post-number-into">
      <div className="small number-item">
        <EyeOutlined />
        <span className="number">{readCount}</span>
      </div>
      <div className="small number-item">
        <LikeOutlined />
        <span className="number">{starCount}</span>
      </div>
      <div className="small number-item">
        <CommentOutlined />
        <span className="number">{commentCount}</span>
      </div>
    </div>
  );
};
export default memo(PostNumberInfo);
