# Mihomo 核心代理功能设计方案

## 1. 概述

本文档旨在详细描述 Catalyst 项目中基于 Mihomo 的核心代理功能的设计方案，包括系统代理、代理组切换和指定具体代理的实现。

## 2. 功能需求

根据项目要求，需要实现以下核心功能：

1. **系统代理功能**：能够启动/停止 Mihomo 代理服务
2. **代理组切换功能**：能够在不同的代理组之间进行切换
3. **指定具体代理功能**：能够选择代理组中的具体代理节点

## 3. 技术实现方案

### 3.1 系统架构

```
┌─────────────────┐    IPC     ┌──────────────────┐
│  渲染进程 (UI)   │ ◄─────────►│   主进程 (服务)   │
└─────────────────┘            └──────────────────┘
                                      │
                                      │ HTTP API
                                      ▼
                              ┌──────────────────┐
                              │   Mihomo 进程    │
                              └──────────────────┘
```

### 3.2 系统代理功能

#### 3.2.1 现有实现分析

当前项目已经实现了基本的 Mihomo 服务管理功能：

1. `MihomoService` 类负责管理 Mihomo 进程的启动、停止和配置管理
2. 通过 IPC 事件与渲染进程通信
3. 支持配置文件的加载和保存

#### 3.2.2 功能增强

需要增强的功能包括：

1. 添加系统代理设置功能（设置系统代理为 Mihomo 的监听端口）
2. 添加状态监听机制，实时更新 UI 状态

### 3.3 代理组切换功能

#### 3.3.1 API 接口设计

根据 Mihomo 手册，代理组切换通过以下 API 实现：

- **GET** `/proxies`: 获取所有代理和策略组的信息
- **PUT** `/proxies/{group_name}`: 选择特定代理组下的节点

#### 3.3.2 实现方案

1. 在 `MihomoService` 中添加 HTTP 客户端（使用 axios）
2. 实现获取代理组信息的方法
3. 实现切换代理组的方法
4. 通过 IPC 事件暴露给渲染进程

### 3.4 指定具体代理功能

#### 3.4.1 功能描述

允许用户选择代理组中的具体代理节点，通过以下 API 实现：

- **PUT** `/proxies/{group_name}`: 选择特定代理组下的节点
  - Body: `{"name": "代理节点名称"}`

#### 3.4.2 实现方案

1. 在代理组切换功能基础上，实现选择具体代理节点的方法
2. 提供 UI 界面展示代理组和代理节点列表

## 4. 详细设计

### 4.1 MihomoService 增强

#### 4.1.1 添加 HTTP 客户端

```typescript
import axios, { AxiosInstance } from 'axios';

class MihomoService {
  private apiClient: AxiosInstance;
  
  constructor() {
    // 初始化 API 客户端
    this.apiClient = axios.create({
      baseURL: 'http://127.0.0.1:9090', // 默认外部控制器地址
      timeout: 5000
    });
  }
}
```

#### 4.1.2 添加代理组相关方法

```typescript
// 获取所有代理和策略组信息
public async getProxies(): Promise<any> {
  try {
    const response = await this.apiClient.get('/proxies');
    return response.data;
  } catch (error) {
    console.error('[MihomoService] Failed to get proxies:', error);
    throw error;
  }
}

// 选择代理组中的特定代理
public async selectProxy(groupName: string, proxyName: string): Promise<void> {
  try {
    await this.apiClient.put(`/proxies/${encodeURIComponent(groupName)}`, {
      name: proxyName
    });
  } catch (error) {
    console.error('[MihomoService] Failed to select proxy:', error);
    throw error;
  }
}
```

### 4.2 IPC 事件扩展

#### 4.2.1 添加新的 IPC 事件常量

在 `src/shared/ipc-events.ts` 中添加：

```typescript
export const IPC_EVENTS = {
  // ... 现有事件
  
  // Mihomo 代理组相关事件
  MIHOMO_GET_PROXIES: 'mihomo:get-proxies',
  MIHOMO_SELECT_PROXY: 'mihomo:select-proxy',
};
```

#### 4.2.2 添加 IPC 处理器

在 `src/main/ipc-handlers/mihomo-ipc.ts` 中添加：

```typescript
ipcMain.handle(IPC_EVENTS.MIHOMO_GET_PROXIES, async () => {
  try {
    const proxies = await mihomoService.getProxies();
    return { success: true, data: proxies };
  } catch (error) {
    console.error('Failed to get proxies:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle(IPC_EVENTS.MIHOMO_SELECT_PROXY, async (_event, groupName: string, proxyName: string) => {
  try {
    await mihomoService.selectProxy(groupName, proxyName);
    return { success: true };
  } catch (error) {
    console.error('Failed to select proxy:', error);
    return { success: false, error: (error as Error).message };
  }
});
```

### 4.3 渲染进程 API 扩展

#### 4.3.1 更新类型定义

在 `src/renderer/types/electron.d.ts` 中添加：

```typescript
export interface IMihomoAPI {
  // ... 现有方法
  
  // 新增方法
  getProxies: () => Promise<{ success: boolean; data?: any; error?: string }>;
  selectProxy: (groupName: string, proxyName: string) => Promise<{ success: boolean; error?: string }>;
}
```

#### 4.3.2 更新 preload 脚本

在 `src/main/preload.ts` 中添加：

```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  mihomo: {
    // ... 现有方法
    getProxies: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_GET_PROXIES),
    selectProxy: (groupName: string, proxyName: string) => 
      ipcRenderer.invoke(IPC_EVENTS.MIHOMO_SELECT_PROXY, groupName, proxyName),
  },
  // ...
});
```

## 5. UI 界面设计

### 5.1 代理组显示管理界面

#### 5.1.1 功能需求

1. 显示所有代理组列表
2. 显示每个代理组的当前选中代理
3. 允许用户切换代理组中的代理节点
4. 显示代理节点的延迟信息（可选）

#### 5.1.2 界面组件设计

1. **ProxyGroupList**: 显示代理组列表
2. **ProxyGroupItem**: 显示单个代理组及其选中代理
3. **ProxySelector**: 代理选择器，用于选择代理组中的具体代理

## 6. 实现计划

### 6.1 第一阶段：增强 MihomoService

1. 添加 HTTP 客户端支持
2. 实现代理组相关方法
3. 测试 API 连接和功能

### 6.2 第二阶段：扩展 IPC 通信

1. 添加新的 IPC 事件
2. 实现 IPC 处理器
3. 更新渲染进程 API

### 6.3 第三阶段：创建 UI 界面

1. 设计代理组显示管理界面
2. 实现代理组列表组件
3. 实现代理选择功能

### 6.4 第四阶段：测试和优化

1. 功能测试
2. 性能优化
3. 错误处理完善

## 7. 注意事项

1. **错误处理**：需要妥善处理 Mihomo 进程未启动、API 连接失败等情况
2. **状态同步**：确保 UI 状态与 Mihomo 实际状态保持一致
3. **性能考虑**：避免频繁的 API 调用，适当使用缓存机制
4. **安全性**：如果配置了 API 密钥，需要在请求中添加认证头

## 8. 后续扩展

1. 添加代理节点延迟测试功能
2. 实现代理组的增删改功能
3. 添加代理配置的导入导出功能
4. 实现系统代理自动设置功能