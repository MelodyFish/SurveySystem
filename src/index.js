import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ConfigProvider locale={zhCN}>
      <App />
      <SpeedInsights />
    </ConfigProvider>
  </Router>
)
