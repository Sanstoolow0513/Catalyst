# API 详细参考文档

本文档专为 AI 助手设计，详细描述了 Catalyst 项目中所有 API 接口的详细信息，包括参数、返回值和使用示例。

## 1. 配置管理 API

### 1.1 获取完整配置
- **事件**: `config:get`
- **描述**: 获取应用的完整配置对象
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: Config,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:get');
  if (response.success) {
    console.log('当前配置:', response.data);
  }
  ```

### 1.2 保存完整配置
- **事件**: `config:set`
- **描述**: 保存完整的配置对象
- **参数**: 
  ```typescript
  Config // 完整的配置对象
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const newConfig = { /* 配置对象 */ };
  const response = await ipcRenderer.invoke('config:set', newConfig);
  if (response.success) {
    console.log('配置保存成功');
  }
  ```

### 1.3 获取配置项
- **事件**: `config:get-item`
- **描述**: 获取特定配置项的值
- **参数**: 
  ```typescript
  string // 配置项键名，如 'general.theme'
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: any,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:get-item', 'general.theme');
  if (response.success) {
    console.log('当前主题:', response.data);
  }
  ```

### 1.4 设置配置项
- **事件**: `config:set-item`
- **描述**: 设置特定配置项的值
- **参数**: 
  ```typescript
  {
    key: string,    // 配置项键名
    value: any      // 配置项值
  }
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:set-item', {
    key: 'general.theme',
    value: 'dark'
  });
  if (response.success) {
    console.log('主题设置成功');
  }
  ```

### 1.5 重置配置
- **事件**: `config:reset`
- **描述**: 将配置重置为默认值
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:reset');
  if (response.success) {
    console.log('配置已重置为默认值');
  }
  ```

### 1.6 导出配置
- **事件**: `config:export`
- **描述**: 导出当前配置为 JSON 字符串
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: string,  // JSON 格式的配置字符串
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:export');
  if (response.success) {
    // 保存到文件或复制到剪贴板
    console.log('配置导出成功:', response.data);
  }
  ```

### 1.7 导入配置
- **事件**: `config:import`
- **描述**: 从 JSON 字符串导入配置
- **参数**: 
  ```typescript
  string // JSON 格式的配置字符串
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const configString = '{/* JSON 配置字符串 */}';
  const response = await ipcRenderer.invoke('config:import', configString);
  if (response.success) {
    console.log('配置导入成功');
  }
  ```

### 1.8 获取使用统计
- **事件**: `config:get-statistics`
- **描述**: 获取应用使用统计信息
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: UsageData[],
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:get-statistics');
  if (response.success) {
    console.log('使用统计:', response.data);
  }
  ```

### 1.9 重置使用统计
- **事件**: `config:reset-statistics`
- **描述**: 重置使用统计信息
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:reset-statistics');
  if (response.success) {
    console.log('使用统计已重置');
  }
  ```

### 1.10 获取备份列表
- **事件**: `config:get-backups`
- **描述**: 获取配置备份列表
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: BackupInfo[],
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:get-backups');
  if (response.success) {
    console.log('备份列表:', response.data);
  }
  ```

### 1.11 创建备份
- **事件**: `config:create-backup`
- **描述**: 创建新的配置备份
- **参数**: 
  ```typescript
  string // 备份名称
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:create-backup', '我的备份');
  if (response.success) {
    console.log('备份创建成功');
  }
  ```

### 1.12 恢复备份
- **事件**: `config:restore-backup`
- **描述**: 从备份恢复配置
- **参数**: 
  ```typescript
  string // 备份 ID
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:restore-backup', 'backup-id-123');
  if (response.success) {
    console.log('备份恢复成功');
  }
  ```

### 1.13 删除备份
- **事件**: `config:delete-backup`
- **描述**: 删除指定的配置备份
- **参数**: 
  ```typescript
  string // 备份 ID
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('config:delete-backup', 'backup-id-123');
  if (response.success) {
    console.log('备份删除成功');
  }
  ```

## 2. Mihomo 代理 API

### 2.1 启动代理
- **事件**: `mihomo:start`
- **描述**: 启动 Mihomo 代理服务
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:start');
  if (response.success) {
    console.log('代理启动成功');
  }
  ```

### 2.2 停止代理
- **事件**: `mihomo:stop`
- **描述**: 停止 Mihomo 代理服务
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:stop');
  if (response.success) {
    console.log('代理已停止');
  }
  ```

### 2.3 获取代理状态
- **事件**: `mihomo:get-status`
- **描述**: 获取 Mihomo 代理服务的当前状态
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: MihomoStatus,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:get-status');
  if (response.success) {
    console.log('代理状态:', response.data);
  }
  ```

### 2.4 获取配置文件内容
- **事件**: `mihomo:get-config`
- **描述**: 获取当前 Mihomo 配置文件的内容
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: string,  // YAML 格式的配置内容
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:get-config');
  if (response.success) {
    console.log('配置内容:', response.data);
  }
  ```

### 2.5 保存配置文件
- **事件**: `mihomo:save-config`
- **描述**: 保存 Mihomo 配置文件
- **参数**: 
  ```typescript
  string // YAML 格式的配置内容
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const configContent = '# YAML 配置内容';
  const response = await ipcRenderer.invoke('mihomo:save-config', configContent);
  if (response.success) {
    console.log('配置保存成功');
  }
  ```

### 2.6 获取代理信息
- **事件**: `mihomo:get-proxies`
- **描述**: 获取所有代理和代理组的信息
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: Proxies,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:get-proxies');
  if (response.success) {
    console.log('代理信息:', response.data);
  }
  ```

### 2.7 选择代理节点
- **事件**: `mihomo:select-proxy`
- **描述**: 在代理组中选择特定的代理节点
- **参数**: 
  ```typescript
  {
    groupName: string,   // 代理组名称
    proxyName: string    // 代理节点名称
  }
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:select-proxy', {
    groupName: '手动选择',
    proxyName: 'SS-节点'
  });
  if (response.success) {
    console.log('代理切换成功');
  }
  ```

### 2.8 获取配置 URL
- **事件**: `mihomo:get-config-url`
- **描述**: 获取 VPN 提供商的配置 URL
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: string,  // 配置 URL
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:get-config-url');
  if (response.success) {
    console.log('配置 URL:', response.data);
  }
  ```

### 2.9 从 URL 更新配置
- **事件**: `mihomo:update-config-from-url`
- **描述**: 从 VPN 提供商 URL 获取并更新配置
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('mihomo:update-config-from-url');
  if (response.success) {
    console.log('配置更新成功');
  }
  ```

## 3. LLM 对话 API

### 3.1 发送消息
- **事件**: `llm:send-message`
- **描述**: 向 LLM 发送消息并获取回复
- **参数**: 
  ```typescript
  {
    message: string,      // 用户消息内容
    conversationId: string, // 对话 ID
    model: string,        // 模型名称
    parameters: object    // 模型参数
  }
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: any,           // LLM 响应数据
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('llm:send-message', {
    message: '你好，AI！',
    conversationId: 'conv-123',
    model: 'gpt-3.5-turbo',
    parameters: {
      temperature: 0.7,
      maxTokens: 1000
    }
  });
  if (response.success) {
    console.log('AI 回复:', response.data);
  }
  ```

### 3.2 获取对话列表
- **事件**: `llm:get-conversations`
- **描述**: 获取所有对话的列表
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: Conversation[],
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('llm:get-conversations');
  if (response.success) {
    console.log('对话列表:', response.data);
  }
  ```

### 3.3 创建对话
- **事件**: `llm:create-conversation`
- **描述**: 创建新的对话
- **参数**: 
  ```typescript
  string // 对话标题
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: Conversation,  // 新创建的对话对象
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('llm:create-conversation', '新对话');
  if (response.success) {
    console.log('对话创建成功:', response.data);
  }
  ```

### 3.4 删除对话
- **事件**: `llm:delete-conversation`
- **描述**: 删除指定的对话
- **参数**: 
  ```typescript
  string // 对话 ID
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('llm:delete-conversation', 'conv-123');
  if (response.success) {
    console.log('对话删除成功');
  }
  ```

### 3.5 获取模型列表
- **事件**: `llm:get-models`
- **描述**: 获取支持的模型列表
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: string[],      // 模型名称数组
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('llm:get-models');
  if (response.success) {
    console.log('支持的模型:', response.data);
  }
  ```

### 3.6 获取提供商列表
- **事件**: `llm:get-providers`
- **描述**: 获取支持的 LLM 提供商列表
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: string[],      // 提供商名称数组
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('llm:get-providers');
  if (response.success) {
    console.log('支持的提供商:', response.data);
  }
  ```

## 4. 开发环境 API

### 4.1 获取软件列表
- **事件**: `dev:get-software-list`
- **描述**: 获取所有可安装软件的列表
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: SoftwareInfo[],
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('dev:get-software-list');
  if (response.success) {
    console.log('软件列表:', response.data);
  }
  ```

### 4.2 安装软件
- **事件**: `dev:install-software`
- **描述**: 开始安装指定的软件
- **参数**: 
  ```typescript
  string // 软件 ID
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: string,        // 安装任务 ID
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('dev:install-software', 'vscode');
  if (response.success) {
    console.log('安装任务已启动，任务 ID:', response.data);
  }
  ```

### 4.3 获取安装状态
- **事件**: `dev:get-install-status`
- **描述**: 获取指定安装任务的当前状态
- **参数**: 
  ```typescript
  string // 安装任务 ID
  ```
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: InstallTask,   // 安装任务状态对象
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('dev:get-install-status', 'task-123');
  if (response.success) {
    console.log('安装状态:', response.data);
  }
  ```

### 4.4 获取已安装软件
- **事件**: `dev:get-installed-software`
- **描述**: 获取已安装软件的列表
- **参数**: 无
- **返回值**: 
  ```typescript
  {
    success: boolean,
    data?: SoftwareInfo[], // 已安装软件数组
    error?: string
  }
  ```
- **使用示例**:
  ```typescript
  const response = await ipcRenderer.invoke('dev:get-installed-software');
  if (response.success) {
    console.log('已安装软件:', response.data);
  }
  ```