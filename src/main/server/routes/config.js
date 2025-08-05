const express = require('express');
const router = express.Router();

// 内存存储配置
let configData = {};

// 上传配置
// 添加配置上传的请求体大小限制和错误处理
const MAX_BODY_SIZE = '1mb';

router.post('/upload', (req, res) => {
  try {
    // 检查请求体大小
    const contentLength = req.headers['content-length'];
    if (contentLength > 1024 * 1024) { // 1MB限制
      console.error(`文件上传过大: ${contentLength}字节`);
      return res.status(413).json({ error: 'Payload too large' });
    }
    
    configData = req.body;
    res.json({ message: 'Config uploaded successfully' });
  } catch (err) {
    // 处理JSON解析错误
    if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
      console.error('畸形JSON上传:', err.message);
      return res.status(400).json({ error: 'Invalid JSON format' });
    }
    console.error('配置上传错误:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 下载配置
router.get('/download', (req, res) => {
  res.json(configData);
});

module.exports = router;