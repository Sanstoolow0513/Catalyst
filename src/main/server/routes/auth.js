const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 硬编码测试账号
const TEST_USER = {
  username: 'test',
  password: 'test123'
};

// 登录端点
// 登录失败计数器
let failedAttempts = 0;

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === TEST_USER.username && password === TEST_USER.password) {
    // 重置失败计数器
    failedAttempts = 0;
    // 生成JWT令牌（有效1小时）
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
    return res.json({ token });
  }
  
  // 增加失败计数
  failedAttempts++;
  console.warn(`登录失败尝试次数: ${failedAttempts}`);
  
  if (failedAttempts >= 5) {
    console.error('暴力破解防护触发: 账户锁定');
    return res.status(429).json({ error: 'Too many attempts, try later' });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;