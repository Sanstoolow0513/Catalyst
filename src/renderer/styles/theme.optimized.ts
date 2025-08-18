// src/renderer/styles/theme.optimized.ts
import { createTheme, Theme as MUITheme } from '@mui/material/styles';

// 基础主题类型定义
export interface BaseTheme {
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
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };

  // 次要颜色
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };

  // 强调色
  accent: string;
  accentHover: string;

  // 状态颜色
  success: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  error: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  warning: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  info: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };

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
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };

  // 过渡动画
  transition: {
    fast: string;
    normal: string;
    slow: string;
  };

  // 圆角系统
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };

  // 主题名称
  name: 'light' | 'dark';
}

// 导出主题类型
export type AppTheme = BaseTheme;

// 定义颜色调色板
const lightPalette = {
  background: '#F9FAFB',
  foreground: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',
  primary: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
    contrastText: '#FFFFFF',
  },
  accent: '#7C3AED',
  accentHover: '#6D28D9',
  success: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#FFFFFF' },
  error: { main: '#EF4444', light: '#F87171', dark: '#DC2626', contrastText: '#FFFFFF' },
  warning: { main: '#F59E0B', light: '#FBBF24', dark: '#D97706', contrastText: '#FFFFFF' },
  info: { main: '#06B6D4', light: '#22D3EE', dark: '#0891B2', contrastText: '#FFFFFF' },
};

const darkPalette = {
  background: '#030712',
  foreground: '#111827',
  surface: '#111827',
  surfaceVariant: '#1F2937',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#4B5563',
  border: '#374151',
  borderLight: '#4B5563',
  divider: '#374151',
  primary: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#94A3B8',
    light: '#CBD5E1',
    dark: '#64748B',
    contrastText: '#030712',
  },
  accent: '#A78BFA',
  accentHover: '#8B5CF6',
  success: { main: '#34D399', light: '#6EE7B7', dark: '#10B981', contrastText: '#FFFFFF' },
  error: { main: '#F87171', light: '#FCA5A5', dark: '#EF4444', contrastText: '#FFFFFF' },
  warning: { main: '#FBBF24', light: '#FCD34D', dark: '#F59E0B', contrastText: '#FFFFFF' },
  info: { main: '#22D3EE', light: '#67E8F9', dark: '#06B6D4', contrastText: '#FFFFFF' },
};

// 定义组件样式
const componentStyles = (palette: typeof lightPalette | typeof darkPalette) => ({
  sidebar: {
    background: palette.surface,
    border: palette.border,
    itemHover: palette.name === 'light' ? '#F3F4F6' : '#1F2937',
    itemActive: palette.name === 'light' ? '#EFF6FF' : 'rgba(59, 130, 246, 0.1)',
    text: palette.name === 'light' ? '#374151' : '#9CA3AF',
    textActive: palette.name === 'light' ? '#2563EB' : '#60A5FA',
  },
  titleBar: {
    background: palette.name === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 24, 39, 0.8)',
    border: palette.border,
    text: palette.textPrimary,
    icon: palette.name === 'light' ? '#4B5563' : '#9CA3AF',
    iconHover: palette.textPrimary,
    height: '48px',
  },
  input: {
    background: palette.name === 'light' ? '#F9FAFB' : '#1F2937',
    border: palette.border,
    borderFocus: palette.primary.main,
    text: palette.textPrimary,
    placeholder: palette.name === 'light' ? '#9CA3AF' : '#4B5563',
  },
  inputBorder: palette.border,
  inputBackground: palette.name === 'light' ? '#F9FAFB' : '#1F2937',
  inputFocusBorder: palette.primary.main,
  card: {
    background: palette.surface,
    border: palette.border,
    shadow: palette.name === 'light' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    shadowHover: palette.name === 'light' ? '0 4px 12px 0 rgba(0, 0, 0, 0.08)' : '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  },
  button: {
    background: palette.surface,
    border: 'none',
    borderRadius: '8px',
    shadow: palette.name === 'light' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    shadowHover: palette.name === 'light' ? '0 2px 4px 0 rgba(0, 0, 0, 0.1)' : '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  },
});

// 定义系统属性
const systemProperties = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  transition: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '20px',
  },
};

// 创建主题
const createAppTheme = (palette: typeof lightPalette | typeof darkPalette): AppTheme => ({
  ...palette,
  ...componentStyles(palette),
  ...systemProperties,
  name: palette.name,
});

// 浅色模式主题
export const lightTheme: AppTheme = createAppTheme({
  ...lightPalette,
  name: 'light',
});

// 深色模式主题
export const darkTheme: AppTheme = createAppTheme({
  ...darkPalette,
  name: 'dark',
});

// MUI主题配置创建函数
const createMuiTheme = (theme: AppTheme): MUITheme => 
  createTheme({
    palette: {
      mode: theme.name,
      primary: theme.primary,
      secondary: theme.secondary,
      error: theme.error,
      warning: theme.warning,
      info: theme.info,
      success: theme.success,
      background: {
        default: theme.background,
        paper: theme.surface,
      },
      text: {
        primary: theme.textPrimary,
        secondary: theme.textSecondary,
      },
      divider: theme.divider,
      border: theme.border,
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            boxShadow: 'none',
            borderRadius: '8px',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: theme.card.shadow,
            '&:hover': {
              boxShadow: theme.card.shadowHover,
            },
            borderRadius: '12px',
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
    },
    spacing: {
      unit: 8,
    },
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

// MUI主题配置
export const muiLightTheme = createMuiTheme(lightTheme);
export const muiDarkTheme = createMuiTheme(darkTheme);