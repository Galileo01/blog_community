import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//引入 redux 上下文
import { Provider } from 'react-redux';
import store from './redux';
ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
