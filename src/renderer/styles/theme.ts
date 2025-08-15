// src/renderer/styles/theme.ts
import { createTheme } from '@mui/material/styles';

export const lightTheme = {
  // 基础颜色 - 调整为更柔和的色调
  background: '#F5F7FA',
  foreground: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F0F2F5',
  
  // 文本颜色 - 调整为更柔和的黑色
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // 边框和分割线 - 使用透明边框实现无边框效果
  border: 'transparent',
  borderLight: 'transparent',
  divider: 'transparent',
  
  // 主色调 - 现代科技蓝
  primary: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  
  // 次要色调
  secondary: {
    main: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
    contrastText: '#FFFFFF',
  },
  
  // 强调色
  accent: '#7C3AED',
  accentHover: '#6D28D9',
  
  // 状态颜色
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  
  info: {
    main: '#06B6D4',
    light: '#22D3EE',
    dark: '#0891B2',
    contrastText: '#FFFFFF',
  },
  
  // 侧边栏
  sidebar: {
    background: '#FFFFFF',
    border: 'transparent',
    itemHover: '#F8F9FA',
    itemActive: '#EFF6FF',
    text: '#374151',
    textActive: '#2563EB',
  },
  
  // 顶部栏
  titleBar: {
    background: '#FFFFFF',
    border: 'transparent',
    text: '#1F1F1F',
    icon: '#6B7280',
    iconHover: '#374151',
    height: '48px',
  },
  
  // 输入框
  input: {
    background: '#F8F9FA',
    border: 'transparent',
    borderFocus: '#2563EB',
    text: '#333333',
    placeholder: '#9CA3AF',
  },
  inputBorder: 'transparent',
  inputBackground: '#F8F9FA',
  inputFocusBorder: '#2563EB',
  
  // 卡片
  card: {
    background: '#FFFFFF',
    border: 'transparent',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    shadowHover: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  
  // 按钮样式
  button: {
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  
  // 动画时长
  transition: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // 圆角大小
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '20px',
  },
  
  // 名称标识
  name: 'light',
};

export const darkTheme = {
  // 基础颜色 - 调整为更有层次感的暗色
  background: '#121212',
  foreground: '#1E1E1E',
  surface: '#1E1E1E',
  surfaceVariant: '#2A2A2A',
  
  // 文本颜色 - 调整为更柔和的白色
  textPrimary: '#EDEDED',
  textSecondary: '#B0B0B0',
  textTertiary: '#888888',
  
  // 边框和分割线 - 使用透明边框实现无边框效果
  border: 'transparent',
  borderLight: 'transparent',
  divider: 'transparent',
  
  // 主色调 - 深色科技蓝
  primary: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  
  // 次要色调
  secondary: {
    main: '#94A3B8',
    light: '#CBD5E1',
    dark: '#64748B',
    contrastText: '#FFFFFF',
  },
  
  // 强调色
  accent: '#A78BFA',
  accentHover: '#8B5CF6',
  
  // 状态颜色
  success: {
    main: '#34D399',
    light: '#6EE7B7',
    dark: '#10B981',
    contrastText: '#FFFFFF',
  },
  
  error: {
    main: '#F87171',
    light: '#FCA5A5',
    dark: '#EF4444',
    contrastText: '#FFFFFF',
  },
  
  warning: {
    main: '#FBBF24',
    light: '#FCD34D',
    dark: '#F59E0B',
    contrastText: '#FFFFFF',
  },
  
  info: {
    main: '#22D3EE',
    light: '#67E8F9',
    dark: '#06B6D4',
    contrastText: '#FFFFFF',
  },
  
  // 侧边栏
  sidebar: {
    background: '#1E1E1E',
    border: 'transparent',
    itemHover: '#2A2A2A',
    itemActive: '#2D2D2D',
    text: '#B0B0B0',
    textActive: '#3B82F6',
  },
  sidebarBackground: '#1E1E1E',
  
  // 顶部栏
  titleBar: {
    background: '#1E1E1E',
    border: 'transparent',
    text: '#EDEDED',
    icon: '#888888',
    iconHover: '#B0B0B0',
    height: '48px',
  },
  
  // 输入框
  input: {
    background: '#2A2A2A',
    border: 'transparent',
    borderFocus: '#3B82F6',
    text: '#EDEDED',
    placeholder: '#888888',
  },
  inputBorder: 'transparent',
  inputBackground: '#2A2A2A',
  inputFocusBorder: '#3B82F6',
  
  // 卡片
  card: {
    background: '#1E1E1E',
    border: 'transparent',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowHover: '0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
  },
  
  // 按钮样式
  button: {
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    shadowHover: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  },
  
  // 动画时长
  transition: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // 圆角大小
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '20px',
  },
  
  // 名称标识
  name: 'dark',
};

// MUI主题配置
export const muiLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: lightTheme.primary,
    secondary: lightTheme.secondary,
    error: lightTheme.error,
    warning: lightTheme.warning,
    info: lightTheme.info,
    success: lightTheme.success,
    background: {
      default: lightTheme.background,
      paper: lightTheme.surface,
    },
    text: {
      primary: lightTheme.textPrimary,
      secondary: lightTheme.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: lightTheme.button.shadow,
          '&:hover': {
            boxShadow: lightTheme.button.shadowHover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: lightTheme.card.shadow,
          '&:hover': {
            boxShadow: lightTheme.card.shadowHover,
          },
          borderRadius: lightTheme.borderRadius.large,
        },
      },
    },
  },
});

export const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: darkTheme.primary,
    secondary: darkTheme.secondary,
    error: darkTheme.error,
    warning: darkTheme.warning,
    info: darkTheme.info,
    success: darkTheme.success,
    background: {
      default: darkTheme.background,
      paper: darkTheme.surface,
    },
    text: {
      primary: darkTheme.textPrimary,
      secondary: darkTheme.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: darkTheme.button.shadow,
          '&:hover': {
            boxShadow: darkTheme.button.shadowHover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: darkTheme.card.shadow,
          '&:hover': {
            boxShadow: darkTheme.card.shadowHover,
          },
          borderRadius: darkTheme.borderRadius.large,
        },
      },
    },
  },
});

export type Theme = typeof lightTheme;