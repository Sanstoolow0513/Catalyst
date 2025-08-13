// src/renderer/styles/globalStyles.ts

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.background}; /* 使用新的 background */
    color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out; /* 更平滑的过渡 */
  }

  code {
    font-family: 'Fira Code', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  a {
    color: ${({ theme }) => theme.accent};
    text-decoration: none;
    transition: color 0.2s ease-in-out;
  }

  a:hover {
    color: ${({ theme }) => theme.accent.light}; /* 使用 accent.light 作为悬停颜色 */
    text-decoration: none; /* 移除下划线，保持简洁 */
  }

  /* 全局焦点样式 */
  :focus {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
    border-radius: 4px; /* 配合圆角设计 */
  }

  /* 移除按钮和输入框的默认焦点轮廓 */
  button:focus, input:focus, textarea:focus, select:focus {
    outline: none;
  }
`;

export default GlobalStyles;
