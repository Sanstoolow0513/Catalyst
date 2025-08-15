# Mihomo 手册

本手册旨在提供一份详尽的 `mihomo` 使用指南，内容涵盖基础配置、API 调用以及一些高级技巧。

## 章节一：`config.yaml` 配置文件详解

`config.yaml` 是 `mihomo` 的核心配置文件，通过修改此文件可以自定义其行为。

### 1.1 基础配置

```yaml
# 混合端口 (mixed-port)
# 同时监听 HTTP 和 SOCKS5 协议的端口。
# 例如: 7890
mixed-port: 7890

# 允许局域网连接 (allow-lan)
# 设置为 true 后，局域网内的其他设备可以连接到此代理。
# 默认值为 false。
allow-lan: true

# 代理模式 (mode)
# - rule: 规则模式，根据规则进行分流。
# - global: 全局模式，所有流量都走代理。
# - direct: 直连模式，所有流量都不走代理。
mode: rule

# 日志级别 (log-level)
# - info: 显示普通信息。
# - warning: 显示警告信息。
# - error: 显示错误信息。
# - debug: 显示用于调试的详细信息。
# - silent: 不输出任何日志。
log-level: info

# 外部控制器 (external-controller)
# RESTful API 的监听地址，用于与其他程序或脚本进行交互。
external-controller: '127.0.0.1:9090'

# 外部 UI (external-ui)
# 用于托管 Web UI 界面的目录路径。
# 例如: 'path/to/your/ui/folder'
# external-ui: 'dashboard'

# API 密钥 (secret)
# 为 RESTful API 设置密码，增强安全性。
# secret: 'your-secret-password'
```

### 1.2 代理节点 (proxies)

在此部分定义您的代理服务器。

```yaml
proxies:
  # Shadowsocks (SS) 示例
  - name: "SS-节点"
    type: ss
    server: your-server-address
    port: your-server-port
    cipher: aes-256-gcm
    password: "your-password"
    udp: true # 开启 UDP 转发

  # VMess 示例
  - name: "VMess-节点"
    type: vmess
    server: your-server-address
    port: your-server-port
    uuid: "your-uuid"
    alterId: 0
    cipher: auto
    tls: true # 开启 TLS
    network: "ws" # 使用 WebSocket 传输
    ws-opts:
      path: "/your-path"
      headers:
        Host: your-host.com
```

### 1.3 代理组 (proxy-groups)

代理组用于对代理节点进行分组和策略管理。

```yaml
proxy-groups:
  # 手动选择 (select)
  # 可以在 UI 界面或通过 API 手动选择使用的节点。
  - name: "手动选择"
    type: select
    proxies:
      - "SS-节点"
      - "VMess-节点"

  # 自动测速 (url-test)
  # 自动选择延迟最低的节点。
  - name: "自动选择"
    type: url-test
    url: 'http://www.gstatic.com/generate_204'
    interval: 300 # 测速间隔 (秒)
    proxies:
      - "SS-节点"
      - "VMess-节点"

  # 故障转移 (fallback)
  # 当主节点不可用时，自动切换到备用节点。
  - name: "故障转移"
    type: fallback
    url: 'http://www.gstatic.com/generate_204'
    interval: 300
    proxies:
      - "SS-节点"
      - "VMess-节点"
```

### 1.4 规则 (rules)

规则定义了网络流量的走向。

```yaml
rules:
  # 直连局域网和私有地址
  - 'DOMAIN-SUFFIX,local,DIRECT'
  - 'IP-CIDR,127.0.0.0/8,DIRECT'
  - 'IP-CIDR,172.16.0.0/12,DIRECT'
  - 'IP-CIDR,192.168.0.0/16,DIRECT'
  - 'IP-CIDR,10.0.0.0/8,DIRECT'

  # 屏蔽广告
  - 'DOMAIN-KEYWORD,ad,REJECT'

  # 直连中国大陆常见域名
  - 'GEOIP,CN,DIRECT'
  - 'DOMAIN-SUFFIX,cn,DIRECT'

  # 其他流量走代理
  - 'MATCH,手动选择'
```

## 章节二：RESTful API

通过 `external-controller` 提供的 API，您可以动态地与 `mihomo` 进行交互。

### 2.1 API 请求认证

如果设置了 `secret`，所有 API 请求都需要在请求头中加入 `Authorization` 字段。

**示例:**
`curl -H 'Authorization: Bearer your-secret-password' http://127.0.0.1:9090/logs`

### 2.2 常用 API 端点

#### 获取实时日志
- **GET** `/logs`

#### 获取实时流量
- **GET** `/traffic`

#### 获取实时内存占用
- **GET** `/memory`

#### 获取版本信息
- **GET** `/version`

#### 修改配置
- **GET** `/configs`: 获取当前配置。
- **PUT** `/configs?force=true`: 重新加载配置文件。
- **PATCH** `/configs`: 修改部分配置。
  - **Body:** `{"mixed-port": 7891}`

#### 代理和策略组
- **GET** `/proxies`: 获取所有代理和策略组的信息。
- **GET** `/proxies/代理组名`: 获取特定代理组的信息。
- **PUT** `/proxies/代理组名`: 选择特定代理组下的节点。
  - **Body:** `{"name": "SS-节点"}`
- **GET** `/proxies/代理组名/delay?url=...&timeout=...`: 测试延迟。

#### 连接管理
- **GET** `/connections`: 获取当前所有连接。
- **DELETE** `/connections`: 关闭所有连接。
- **DELETE** `/connections/:id`: 关闭指定 ID 的连接。

### 2.3 高级 API - 调试

需要将 `log-level` 设置为 `debug` 才能使用。

- **PUT** `/debug/gc`: 手动触发 Go 的垃圾回收。
- **GET** `/debug/pprof`: 获取性能分析数据。

## 章节三：核心语法与高级技巧

### 3.1 YAML 语法基础

`mihomo` 使用 YAML 作为配置文件格式。

- **大小写敏感**: `Port` 和 `port` 是不同的键。
- **缩进**: 使用空格进行缩进，表示层级关系。**不允许使用 Tab 键**。相同层级的元素必须左对齐。
- **注释**: 以 `#` 开头的行为注释。`#` 必须在行首或其前方有空格。

```yaml
# 这是一个正确的注释
port: 7890 # 这也是一个正确的注释
```

- **对象与数组**: YAML 是 JSON 的超集，因此可以直接使用 JSON 格式。

```yaml
# YAML 对象格式
tun:
  enable: true
  stack: system

# JSON 对象格式
tun: { "enable": true, "stack": "system" }

# YAML 数组格式
dns:
  - 223.5.5.5
  - 119.29.29.29

# JSON 数组格式
dns: ["223.5.5.5", "119.29.29.29"]
```

### 3.2 YAML 锚点与别名

使用 `&` 创建锚点，使用 `*` 引用锚点，可以实现配置复用。`<<` 用于合并。

```yaml
# 定义一个锚点 &p
p: &p
  type: http
  interval: 3600
  health-check:
    enable: true
    url: https://www.gstatic.com/generate_204
    interval: 300

proxy-providers:
  provider1:
    <<: *p # 引用锚点 p 的内容
    url: "your-provider-url"
    path: ./proxy_providers/provider1.yaml
```

### 3.3 域名通配符

在规则中可以使用通配符匹配域名，使用时建议用引号包裹。

- `*`: 匹配一级域名。`*.google.com` 匹配 `www.google.com`，但不匹配 `google.com` 或 `mail.www.google.com`。
- `+`: 匹配多级域名，包括主域名。`+.google.com` 匹配 `www.google.com`, `mail.www.google.com` 和 `google.com`。
- `.`: 匹配多级域名，但不包括主域名。`.google.com` 匹配 `www.google.com`, `mail.www.google.com`，但不匹配 `google.com`。

```yaml
fake-ip-filter:
  - '+.apple.com'
  - '*.music.163.com'
```

### 3.4 端口范围

使用 `-` 定义端口范围，使用 `,` 或 `/` 分隔多个端口或端口范围。

```yaml
# 匹配 80, 443, 以及 1000到2000之间的所有端口
rules:
 - 'DST-PORT,80,DIRECT'
 - 'DST-PORT,443,DIRECT'
 - 'DST-PORT,1000-2000,DIRECT'
```

## 章节四：结语

希望这份手册能帮助您更好地使用 `mihomo`。`mihomo` 功能强大，本文档仅介绍了常用部分，更多高级用法有待您进一步探索。