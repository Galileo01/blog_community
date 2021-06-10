import React from 'react';
import './index.less';
import icon from '../../static/404.png';
export default function NotFound() {
  return (
    <main className="not-found">
      <section className="content">
        <img src={icon} alt="" />
        <h3 className="text">Not Found</h3>
      </section>
    </main>
  );
}
