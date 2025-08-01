# Catalyst 样式指南

本指南概述了 Catalyst 项目的设计系统和 CSS 规范，旨在保持 UI 的一致性和可维护性。

## 设计原则

1. **模块化**：组件独立，可复用
2. **响应式**：移动优先，自适应布局
3. **无障碍**：对比度达标，语义化标签
4. **性能优化**：减少重绘，高效渲染

## 色彩系统

### 主题色
- 主色：`#4d6df3`
- 成功色：`#00c9a7`
- 警告色：`#ffac1e`
- 错误色：`#ff5a87`

### 深色模式
```css
:root {
  --background-color: #0f1720;
  --card-background-color: #1a2432;
  --text-color: #e3f1ff;
}
```

### 浅色模式
```css
[data-theme="light"] {
  --background-color: #f5f7fa;
  --card-background-color: #ffffff;
  --text-color: #2d3849;
}
```

## 间距系统

基于 8px 单位的间距系统：
```css
--spacing-xs: 8px;
--spacing-sm: 12px;
--spacing-base: 16px;
--spacing-md: 24px;
--spacing-lg: 32px;
```

## 版式规范

### 字体
- 主字体：`"Exo 2", sans-serif`
- 代码字体：`"Fira Code", monospace`

### 字号
```css
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
```

## 组件规范

### 卡片组件
```css
.card {
  background: var(--card-background-color);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}
```

### 按钮
```css
.btn {
  border-radius: var(--border-radius-base);
  padding: var(--spacing-sm) var(--spacing-base);
  transition: all 0.2s;
}
```

### 消息气泡
```css
.message {
  border-radius: var(--border-radius-lg);
  position: relative;
  animation: fadeIn 0.3s ease;
}

.message.user::after {
  border-color: transparent transparent transparent var(--primary-color);
}
```

## 响应式断点

```css
--breakpoint-sm: 576px;
--breakpoint-md: 768px;
--breakpoint-lg: 992px;
```

## 实用工具类

```css
/* 布局 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 文字截断 */
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 深色模式切换 */
.theme-toggle {
  position: fixed;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 1000;
}
```

## 动画规范

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 最佳实践

1. 优先使用 CSS 变量
2. 组件样式隔离
3. 避免固定尺寸（使用相对单位）
4. 减少嵌套层级
5. 按功能组织样式文件