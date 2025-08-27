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
  extraLarge: string;
}

export interface ThemeGradients {
  primary: string;
  success: string;
  warning: string;
  info: string;
  modern: string;
  sunset: string;
  ocean: string;
  forest: string;
  fire: string;
  luxury: string;
  sidebar: string;
  logo: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  card: string;
  cardHover: string;
  sidebar: string;
  sidebarHover: string;
  input: string;
  button: string;
  buttonHover: string;
}

export interface ThemeTextShadow {
  light: string;
  medium: string;
}

export interface ThemeCardLayer {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ThemeIconColor {
  default: string;
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

  // 渐变色
  gradient: ThemeGradients;

  // 卡片层次色
  cardLayer: ThemeCardLayer;

  // 阴影
  shadow: ThemeShadows;
  textShadow: ThemeTextShadow;

  // 图标颜色
  iconColor: ThemeIconColor;

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
  name: 'lightGlass' | 'darkGlass';
}

// 亮色主题 - 主流浅色设计
export const lightGlassTheme: Theme = {
  // 基础背景色 - 浅灰白色背景
  background: '#F8F9FA',
  foreground: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F3F4',

  // 文本颜色 - 深灰色系确保在浅色背景上清晰可读
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // 边框颜色 - 浅灰色边框分隔
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#E5E7EB',

  // 主要颜色 - 保持品牌色
  primary: {
    main: '#3182CE',
    light: '#4299E1',
    dark: '#2C5282',
    contrastText: '#FFFFFF',
  },

  // 次要颜色
  secondary: {
    main: '#805AD5',
    light: '#9F7AEA',
    dark: '#6B46C1',
    contrastText: '#FFFFFF',
  },

  // 强调色
  accent: '#ED64A6',
  accentHover: '#D53F8C',
  
  // 渐变色 - 适应浅色背景
  gradient: {
    primary: 'linear-gradient(135deg, #3182CE 0%, #805AD5 100%)',
    success: 'linear-gradient(135deg, #48BB78 0%, #38B2AC 100%)',
    warning: 'linear-gradient(135deg, #ED8936 0%, #F6AD55 100%)',
    info: 'linear-gradient(135deg, #4299E1 0%, #764AB2 100%)',
    modern: 'linear-gradient(135deg, #3182CE 0%, #805AD5 50%, #ED64A6 100%)',
    sunset: 'linear-gradient(135deg, #FB923C 0%, #E17055 100%)',
    ocean: 'linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)',
    forest: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
    fire: 'linear-gradient(135deg, #FB7185 0%, #FED7AA 100%)',
    luxury: 'linear-gradient(135deg, #9F7AEA 0%, #EC4899 100%)',
    sidebar: 'linear-gradient(135deg, #F8F9FA, #F1F3F4)',
    logo: 'linear-gradient(135deg, #3182CE, #805AD5)',
  },
  
  // 卡片层次色 - 浅色层次
  cardLayer: {
    primary: '#F8F9FA',
    secondary: '#F1F3F4',
    accent: '#F3F4F6',
  },

  // 阴影系统 - 传统浅色主题阴影
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    cardHover: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    sidebar: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    sidebarHover: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
    input: '0 1px 2px rgba(0, 0, 0, 0.05)',
    button: '0 1px 2px rgba(0, 0, 0, 0.05)',
    buttonHover: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
  },

  // 文本阴影 - 浅色主题不需要文本阴影
  textShadow: {
    light: 'none',
    medium: 'none',
  },

  // 图标颜色
  iconColor: {
    default: '#6B7280',
  },

  // 状态颜色 - 适应浅色背景
  success: { main: '#10B981', light: '#34D399', dark: '#059669', contrastText: '#FFFFFF' },
  error: { main: '#EF4444', light: '#F87171', dark: '#DC2626', contrastText: '#FFFFFF' },
  warning: { main: '#F59E0B', light: '#FBBF24', dark: '#D97706', contrastText: '#FFFFFF' },
  info: { main: '#3B82F6', light: '#60A5FA', dark: '#2563EB', contrastText: '#FFFFFF' },

  // 组件特定样式 - 主流浅色设计
  sidebar: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    itemHover: '#F8F9FA',
    itemActive: '#EBF5FF',
    text: '#1F2937',
    textActive: '#3182CE',
  },

  titleBar: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    text: '#1F2937',
    icon: '#6B7280',
    iconHover: '#1F2937',
    height: '48px',
  },

  input: {
    background: '#FFFFFF',
    border: '#D1D5DB',
    borderFocus: '#3182CE',
    text: '#1F2937',
    placeholder: '#9CA3AF',
  },
  inputBorder: '#D1D5DB',
  inputBackground: '#FFFFFF',
  inputFocusBorder: '#3182CE',

  card: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    shadowHover: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },

  button: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    borderRadius: '8px',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    shadowHover: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
  },

  // 间距系统
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // 过渡动画 - 适度的动画效果
  transition: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },

  // 圆角系统 - 现代设计圆角
  borderRadius: {
    small: '6px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    extraLarge: '20px',
  },

  name: 'lightGlass',
};

// 暗色玻璃主题 - 纯黑背景配合深色组件
export const darkGlassTheme: Theme = {
  // 基础背景色 - 纯黑背景
  background: '#000000',
  foreground: '#000000',
  surface: '#000000',
  surfaceVariant: '#000000',

  // 文本颜色 - 暖白色系减少刺眼感
  textPrimary: '#F0F0F0',     // 主要文本 - 暖白色
  textSecondary: '#C0C0C0',   // 次要文本 - 中灰色
  textTertiary: '#808080',    // 第三级文本 - 深灰色

  // 边框颜色 - 低透明度灰色边框
  border: 'rgba(128, 128, 128, 0.3)',          // 适度透明的边框
  borderLight: 'rgba(128, 128, 128, 0.2)',     // 细致的边框
  divider: 'rgba(128, 128, 128, 0.25)',         // 分隔线

  // 主要颜色
  primary: {
    main: '#60A5FA',          // 亮蓝色主色
    light: '#93C5FD',
    dark: '#3B82F6',
    contrastText: '#0F172A',
  },

  // 次要颜色
  secondary: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
    contrastText: '#0F172A',
  },

  // 强调色
  accent: '#F472B6',
  accentHover: '#EC4899',
  
  // 渐变色 - 黑色背景上的低饱和度渐变
  gradient: {
    primary: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)',
    success: 'linear-gradient(135deg, #34D399 0%, #22C55E 100%)',
    warning: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
    info: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
    modern: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
    sunset: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
    ocean: 'linear-gradient(135deg, #667EEA 0%, #764AB2 100%)',
    forest: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
    fire: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
    luxury: 'linear-gradient(135deg, #834D9B 0%, #D04AD6 100%)',
    sidebar: 'linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(167, 139, 250, 0.3))',
    logo: 'linear-gradient(135deg, #60A5FA, #A78BFA)',
  },
  
  // 卡片层次色 - 深色透明层次
  cardLayer: {
    primary: 'rgba(96, 165, 250, 0.1)',
    secondary: 'rgba(64, 64, 64, 0.08)',
    accent: 'rgba(251, 191, 36, 0.08)',
  },

  // 阴影系统 - 黑色背景上的深色阴影
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.7), 0 4px 6px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.8), 0 10px 10px rgba(0, 0, 0, 0.6)',
    card: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)',
    cardHover: '0 20px 25px rgba(0, 0, 0, 0.8), 0 10px 10px rgba(0, 0, 0, 0.6)',
    sidebar: '0 4px 6px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)',
    sidebarHover: '0 10px 15px rgba(0, 0, 0, 0.7), 0 4px 6px rgba(0, 0, 0, 0.5)',
    input: '0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)',
    button: '0 2px 4px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)',
    buttonHover: '0 4px 6px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)',
  },

  // 文本阴影 - 深色阴影增强可读性
  textShadow: {
    light: '0 1px 3px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)',
    medium: '0 2px 4px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.4)',
  },

  // 图标颜色
  iconColor: {
    default: '#C0C0C0',
  },

  // 状态颜色
  success: { main: '#34D399', light: '#6EE7B7', dark: '#10B981', contrastText: '#0F172A' },
  error: { main: '#F87171', light: '#FCA5A5', dark: '#EF4444', contrastText: '#0F172A' },
  warning: { main: '#FBBF24', light: '#FCD34D', dark: '#F59E0B', contrastText: '#0F172A' },
  info: { main: '#22D3EE', light: '#67E8F9', dark: '#06B6D4', contrastText: '#0F172A' },

  // 组件特定样式 - 深色半透明组件在黑色背景上
  sidebar: {
    background: 'rgba(32, 32, 32, 0.8)',
    border: 'rgba(64, 64, 64, 0.5)',
    itemHover: 'rgba(48, 48, 48, 0.9)',
    itemActive: 'rgba(96, 165, 250, 0.3)',
    text: '#F0F0F0',
    textActive: '#60A5FA',
  },

  titleBar: {
    background: 'rgba(24, 24, 24, 0.9)',
    border: 'rgba(48, 48, 48, 0.7)',
    text: '#F0F0F0',
    icon: '#C0C0C0',
    iconHover: '#F0F0F0',
    height: '48px',
  },

  input: {
    background: 'rgba(40, 40, 40, 0.8)',
    border: 'rgba(64, 64, 64, 0.6)',
    borderFocus: 'rgba(96, 165, 250, 0.5)',
    text: '#F0F0F0',
    placeholder: '#808080',
  },
  inputBorder: 'rgba(64, 64, 64, 0.6)',
  inputBackground: 'rgba(40, 40, 40, 0.8)',
  inputFocusBorder: 'rgba(96, 165, 250, 0.5)',

  card: {
    background: 'rgba(32, 32, 32, 0.7)',
    border: 'rgba(48, 48, 48, 0.5)',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)',
    shadowHover: '0 20px 25px rgba(0, 0, 0, 0.8), 0 10px 10px rgba(0, 0, 0, 0.6)',
  },

  button: {
    background: 'rgba(48, 48, 48, 0.8)',
    border: 'rgba(64, 64, 64, 0.6)',
    borderRadius: '12px',
    shadow: '0 2px 4px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)',
    shadowHover: '0 4px 6px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)',
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

  // 过渡动画 - 简化为无动画
  transition: {
    fast: '0ms',   // 无动画
    normal: '0ms', // 无动画
    slow: '0ms',   // 无动画
  },

  // 圆角系统
  borderRadius: {
    small: '12px',     // 玻璃态风格使用更大圆角
    medium: '16px',
    large: '20px',
    xlarge: '24px',
    extraLarge: '28px',
  },

  name: 'darkGlass',
};


// MUI主题配置 - 浅色模式
export const muiLightGlassTheme = createTheme({
  palette: {
    mode: 'light', // 使用light模式
    primary: lightGlassTheme.primary,
    secondary: lightGlassTheme.secondary,
    error: lightGlassTheme.error,
    warning: lightGlassTheme.warning,
    info: lightGlassTheme.info,
    success: lightGlassTheme.success,
    background: {
      default: lightGlassTheme.background,
      paper: lightGlassTheme.surface,
    },
    text: {
      primary: lightGlassTheme.textPrimary,
      secondary: lightGlassTheme.textSecondary,
    },
    divider: lightGlassTheme.divider,
    border: lightGlassTheme.border,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8, // 现代设计圆角
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: '8px',
          background: lightGlassTheme.button.background,
          border: lightGlassTheme.button.border,
          color: lightGlassTheme.textPrimary,
          '&:hover': {
            boxShadow: lightGlassTheme.button.shadowHover,
            background: '#F8F9FA',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: lightGlassTheme.card.shadow,
          background: lightGlassTheme.card.background,
          border: lightGlassTheme.card.border,
          '&:hover': {
            boxShadow: lightGlassTheme.card.shadowHover,
          },
          borderRadius: '12px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          background: lightGlassTheme.input.background,
          color: lightGlassTheme.textPrimary,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          background: lightGlassTheme.input.background,
          color: lightGlassTheme.textPrimary,
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

// MUI主题配置 - 暗色玻璃模式（黑色背景）
export const muiDarkGlassTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: darkGlassTheme.primary,
    secondary: darkGlassTheme.secondary,
    error: darkGlassTheme.error,
    warning: darkGlassTheme.warning,
    info: darkGlassTheme.info,
    success: darkGlassTheme.success,
    background: {
      default: darkGlassTheme.background,
      paper: darkGlassTheme.surface,
    },
    text: {
      primary: darkGlassTheme.textPrimary,
      secondary: darkGlassTheme.textSecondary,
    },
    divider: darkGlassTheme.divider,
    border: darkGlassTheme.border,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16, // 玻璃态使用更大圆角
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: '12px',
          background: darkGlassTheme.button.background,
          border: darkGlassTheme.button.border,
          backdropFilter: 'blur(8px)',
          color: darkGlassTheme.textPrimary,
          '&:hover': {
            boxShadow: darkGlassTheme.button.shadowHover,
            background: 'rgba(64, 64, 64, 0.9)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: darkGlassTheme.card.shadow,
          background: darkGlassTheme.card.background,
          border: darkGlassTheme.card.border,
          backdropFilter: 'blur(8px)',
          '&:hover': {
            boxShadow: darkGlassTheme.card.shadowHover,
          },
          borderRadius: '16px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          background: darkGlassTheme.input.background,
          backdropFilter: 'blur(8px)',
          color: darkGlassTheme.textPrimary,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          background: darkGlassTheme.input.background,
          backdropFilter: 'blur(8px)',
          color: darkGlassTheme.textPrimary,
        },
      },
    },
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 0,
      shorter: 0,
      short: 0,
      standard: 0,
      complex: 0,
      enteringScreen: 0,
      leavingScreen: 0,
    },
    easing: {
      easeInOut: 'linear',
      easeOut: 'linear',
      easeIn: 'linear',
      sharp: 'linear',
    },
  },
});


// 导出主题类型
export type AppTheme = Theme;