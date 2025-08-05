#!/bin/bash

# 安全测试脚本
echo "========== 安全测试开始 =========="

# 1. 暴力破解测试
echo "测试1: 暴力破解防护（5次失败锁定）"
for i in {1..6}; do
  response=$(curl -s -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}')
  echo "尝试 $i: $response"
done

# 2. JWT篡改测试
echo -e "\n测试2: JWT令牌篡改"
token=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}' | jq -r '.token')

# 篡改令牌签名
malicious_token="${token%?}x"
echo "原始令牌: $token"
echo "篡改令牌: $malicious_token"

echo "使用篡改令牌访问受保护资源:"
curl -s -X GET http://localhost:3000/config/download \
  -H "Authorization: Bearer $malicious_token"

# 3. 文件上传漏洞测试
echo -e "\n测试3: 超大文件上传"
dd if=/dev/zero of=large_file.json bs=2M count=1
curl -s -X POST http://localhost:3000/config/upload \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  --data-binary "@large_file.json"
rm large_file.json

echo -e "\n测试4: 畸形JSON上传"
curl -s -X POST http://localhost:3000/config/upload \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{"invalid":json}'

# 4. 未授权访问测试
echo -e "\n测试5: 未授权访问配置"
curl -s -X GET http://localhost:3000/config/download

echo -e "\n========== 安全测试完成 =========="