const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // 加载环境变量

const app = express();

// 安全中间件
app.use(helmet());
app.use(bodyParser.json());

// 内存存储配置（仅用于演示）
let configData = {};

// 路由中间件
const authRouter = require('./routes/auth');
const configRouter = require('./routes/config');
app.use('/auth', authRouter);
app.use('/config', configRouter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;