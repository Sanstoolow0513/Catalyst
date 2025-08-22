// src/renderer/styles/theme.ts
import { createTheme } from '@mui/material/styles';

// 主题类型定义
export interface ThemeColors {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeTransition {
  fast: string;
  normal: string;
  slow: string;
}

export interface ThemeBorderRadius {
  small: string;
  medium: string;
  large: string;
  xlarge: string;
}

export interface ThemeComponentStyles {
  background: string;
  border: string;
  [key: string]: any;
}

export interface Theme {
  // 基础背景色
  background: string;
  foreground: string;
  surface: string;
  surfaceVariant: string;

  // 文本颜色
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // 边框颜色
  border: string;
  borderLight: string;
  divider: string;

  // 主要颜色
  primary: ThemeColors;

  // 次要颜色
  secondary: ThemeColors;

  // 强调色
  accent: string;
  accentHover: string;

  // 状态颜色
  success: ThemeColors;
  error: ThemeColors;
  warning: ThemeColors;
  info: ThemeColors;

  // 组件特定样式
  sidebar: {
    background: string;
    border: string;
    itemHover: string;
    itemActive: string;
    text: string;
    textActive: string;
  };

  titleBar: {
    background: string;
    border: string;
    text: string;
    icon: string;
    iconHover: string;
    height: string;
  };

  input: {
    background: string;
    border: string;
    borderFocus: string;
    text: string;
    placeholder: string;
  };
  inputBorder: string;
  inputBackground: string;
  inputFocusBorder: string;

  card: {
    background: string;
    border: string;
    shadow: string;
    shadowHover: string;
  };

  button: {
    background: string;
    border: string;
    borderRadius: string;
    shadow: string;
    shadowHover: string;
  };

  // 间距系统
  spacing: ThemeSpacing;

  // 过渡动画
  transition: ThemeTransition;

  // 圆角系统
  borderRadius: ThemeBorderRadius;

  // 主题名称
  name: 'light' | 'dark';
}

// 浅色模式主题
export const lightTheme: Theme = {
  // 基础背景色
  background: '#F9FAFB',      // 页面背景
  foreground: '#FFFFFF',      // 前景元素背景
  surface: '#FFFFFF',         // 卡片、面板背景
  surfaceVariant: '#F3F4F6',  // 变体表面（如输入框背景）

  // 文本颜色
  textPrimary: '#111827',     // 主要文本
  textSecondary: '#4B5563',   // 次要文本
  textTertiary: '#9CA3AF',    // 第三级文本（如占位符）

  // 边框颜色
  border: '#E5E7EB',          // 标准边框
  borderLight: '#F3F4F6',     // 浅边框
  divider: '#E5E7EB',         // 分隔线

  // 主要颜色
  primary: {
    main: '#2563EB',          // 主色
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },

  // 次要颜色
  secondary: {
    main: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
    contrastText: '#FFFFFF',
  },

  // 强调色
  accent: '#7C3AED',
  accentHover: '#6D28D9',
  
  // 渐变色
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  
  // 卡片层次色
  cardLayer: {
    primary: '#F0F9FF',
    secondary: '#F8FAFC',
    accent: '#FEF3C7',
  },

  // 状态颜色
  success: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#FFFFFF' },
  error: { main: '#EF4444', light: '#F87171', dark: '#DC2626', contrastText: '#FFFFFF' },
  warning: { main: '#F59E0B', light: '#FBBF24', dark: '#D97706', contrastText: '#FFFFFF' },
  info: { main: '#06B6D4', light: '#22D3EE', dark: '#0891B2', contrastText: '#FFFFFF' },

  // 组件特定样式
  sidebar: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    itemHover: '#F3F4F6',
    itemActive: '#EFF6FF',
    text: '#374151',
    textActive: '#2563EB',
  },

  titleBar: {
    background: 'rgba(255, 255, 255, 0.8)',
    border: '#E5E7EB',
    text: '#111827',
    icon: '#4B5563',
    iconHover: '#111827',
    height: '48px',
  },

  input: {
    background: '#F9FAFB',
    border: '#E5E7EB',
    borderFocus: '#2563EB',
    text: '#111827',
    placeholder: '#9CA3AF',
  },
  inputBorder: '#E5E7EB',
  inputBackground: '#F9FAFB',
  inputFocusBorder: '#2563EB',

  card: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowHover: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
  },

  button: {
    background: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowHover: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  },

  // 间距系统
  spacing: {
    xs: '4px',   // 4px
    sm: '8px',   // 8px
    md: '16px',  // 16px
    lg: '24px',  // 24px
    xl: '32px',  // 32px
    xxl: '48px', // 48px
  },

  // 过渡动画
  transition: {
    fast: '150ms',   // 150ms
    normal: '300ms', // 300ms
    slow: '500ms',   // 500ms
  },

  // 圆角系统
  borderRadius: {
    small: '8px',    // 8px - 用于按钮、标签等小元素
    medium: '12px',  // 12px - 用于卡片、输入框等
    large: '16px',   // 16px - 用于页面容器、模态框等
    xlarge: '20px',  // 20px - 用于特殊场景
  },

  name: 'light',
};

// 深色模式主题
export const darkTheme: Theme = {
  // 基础背景色
  background: '#030712',      // 页面背景
  foreground: '#111827',      // 前景元素背景
  surface: '#111827',         // 卡片、面板背景
  surfaceVariant: '#1F2937',  // 变体表面（如输入框背景）

  // 文本颜色
  textPrimary: '#F9FAFB',     // 主要文本
  textSecondary: '#9CA3AF',   // 次要文本
  textTertiary: '#4B5563',    // 第三级文本（如占位符）

  // 边框颜色
  border: '#374151',          // 标准边框
  borderLight: '#4B5563',     // 浅边框
  divider: '#374151',         // 分隔线

  // 主要颜色
  primary: {
    main: '#3B82F6',          // 主色
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },

  // 次要颜色
  secondary: {
    main: '#94A3B8',
    light: '#CBD5E1',
    dark: '#64748B',
    contrastText: '#030712',
  },

  // 强调色
  accent: '#A78BFA',
  accentHover: '#8B5CF6',
  
  // 渐变色
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  
  // 卡片层次色
  cardLayer: {
    primary: '#1E3A8A',
    secondary: '#1F2937',
    accent: '#78350F',
  },

  // 状态颜色
  success: { main: '#34D399', light: '#6EE7B7', dark: '#10B981', contrastText: '#FFFFFF' },
  error: { main: '#F87171', light: '#FCA5A5', dark: '#EF4444', contrastText: '#FFFFFF' },
  warning: { main: '#FBBF24', light: '#FCD34D', dark: '#F59E0B', contrastText: '#FFFFFF' },
  info: { main: '#22D3EE', light: '#67E8F9', dark: '#06B6D4', contrastText: '#FFFFFF' },

  // 组件特定样式
  sidebar: {
    background: '#111827',
    border: '#374151',
    itemHover: '#1F2937',
    itemActive: 'rgba(59, 130, 246, 0.1)',
    text: '#9CA3AF',
    textActive: '#60A5FA',
  },

  titleBar: {
    background: 'rgba(17, 24, 39, 0.8)',
    border: '#374151',
    text: '#F9FAFB',
    icon: '#9CA3AF',
    iconHover: '#F9FAFB',
    height: '48px',
  },

  input: {
    background: '#1F2937',
    border: '#374151',
    borderFocus: '#3B82F6',
    text: '#F9FAFB',
    placeholder: '#4B5563',
  },
  inputBorder: '#374151',
  inputBackground: '#1F2937',
  inputFocusBorder: '#3B82F6',

  card: {
    background: '#111827',
    border: '#374151',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    shadowHover: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  },

  button: {
    background: '#111827',
    border: 'none',
    borderRadius: '8px',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    shadowHover: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  },

  // 间距系统
  spacing: {
    xs: '4px',   // 4px
    sm: '8px',   // 8px
    md: '16px',  // 16px
    lg: '24px',  // 24px
    xl: '32px',  // 32px
    xxl: '48px', // 48px
  },

  // 过渡动画
  transition: {
    fast: '150ms',   // 150ms
    normal: '300ms', // 300ms
    slow: '500ms',   // 500ms
  },

  // 圆角系统
  borderRadius: {
    small: '8px',    // 8px - 用于按钮、标签等小元素
    medium: '12px',  // 12px - 用于卡片、输入框等
    large: '16px',   // 16px - 用于页面容器、模态框等
    xlarge: '20px',  // 20px - 用于特殊场景
  },

  name: 'dark',
};

// MUI主题配置 - 浅色模式
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
    divider: lightTheme.divider,
    border: lightTheme.border,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12, // 默认圆角设置为12px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: '8px', // 按钮圆角为8px
          '&:hover': {
            boxShadow: 'none',
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
          borderRadius: '12px', // 卡片圆角为12px
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // 输入框圆角为12px
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // 输入框圆角为12px
        },
      },
    },
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

// MUI主题配置 - 深色模式
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
    divider: darkTheme.divider,
    border: darkTheme.border,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12, // 默认圆角设置为12px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: '8px', // 按钮圆角为8px
          '&:hover': {
            boxShadow: 'none',
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
          borderRadius: '12px', // 卡片圆角为12px
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // 输入框圆角为12px
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // 输入框圆角为12px
        },
      },
    },
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

// 导出主题类型
export type AppTheme = Theme;