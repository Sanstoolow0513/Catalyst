// src/renderer/styles/theme.ts
import { createTheme } from '@mui/material/styles';

export const lightTheme = {
  // 基础颜色
  background: '#F8F9FA',
  foreground: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F3F4',
  
  // 文本颜色
  textPrimary: '#1F1F1F',
  textSecondary: '#666666',
  textTertiary: '#999999',
  
  // 边框和分割线
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  divider: '#E5E7EB',
  
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
  accent: {
    main: '#7C3AED',
    light: '#8B5CF6',
    dark: '#6D28D9',
    contrastText: '#FFFFFF',
  },
  
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
    border: '#E5E7EB',
    itemHover: '#F8F9FA',
    itemActive: '#EFF6FF',
    text: '#374151',
    textActive: '#2563EB',
  },
  
  // 顶部栏
  titleBar: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    text: '#1F1F1F',
    icon: '#6B7280',
    iconHover: '#374151',
  },
  
  // 输入框
  input: {
    background: '#FFFFFF',
    border: '#D1D5DB',
    borderFocus: '#2563EB',
    text: '#1F1F1F',
    placeholder: '#9CA3AF',
  },
  inputBorder: '#D1D5DB',
  inputBackground: '#FFFFFF',
  inputFocusBorder: '#2563EB',
  
  // 卡片
  card: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    shadowHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
};

export const darkTheme = {
  // 基础颜色
  background: '#0F0F0F',
  foreground: '#1A1A1A',
  surface: '#1A1A1A',
  surfaceVariant: '#252525',
  
  // 文本颜色
  textPrimary: '#F3F4F6',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  
  // 边框和分割线
  border: '#374151',
  borderLight: '#2D2D2D',
  divider: '#374151',
  
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
  accent: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
    contrastText: '#FFFFFF',
  },
  
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
    background: '#FFFFFF',
    border: '#E5E7EB',
    itemHover: '#F8F9FA',
    itemActive: '#EFF6FF',
    text: '#374151',
    textActive: '#2563EB',
  },
  sidebarBackground: '#FFFFFF',
  
  // 顶部栏
  titleBar: {
    background: '#1A1A1A',
    border: '#374151',
    text: '#F3F4F6',
    icon: '#9CA3AF',
    iconHover: '#D1D5DB',
  },
  
  // 输入框
  input: {
    background: '#252525',
    border: '#374151',
    borderFocus: '#3B82F6',
    text: '#F3F4F6',
    placeholder: '#6B7280',
  },
  
  // 卡片
  card: {
    background: '#1A1A1A',
    border: '#374151',
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    shadowHover: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
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
        },
      },
    },
  },
});

export type Theme = typeof lightTheme;
