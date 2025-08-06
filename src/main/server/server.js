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

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 路由中间件
const authRouter = require('./routes/auth.js');
const configRouter = require('./routes/config.js');
app.use('/auth', authRouter);
app.use('/config', authenticateToken, configRouter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;