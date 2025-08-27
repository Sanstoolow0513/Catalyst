// src/renderer/contexts/ThemeContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider } from 'styled-components';
import { lightGlassTheme, darkGlassTheme, muiLightGlassTheme, muiDarkGlassTheme, Theme } from '../styles/theme';

type ThemeMode = 'lightGlass' | 'darkGlass' | 'auto';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  muiTheme: ReturnType<typeof createTheme>;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a CustomThemeProvider');
  }
  return context;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const CustomThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(lightGlassTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('lightGlass');
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 使用 ref 来避免闭包问题
  const themeModeRef = React.useRef(themeMode);
  const systemPrefersDarkRef = React.useRef(systemPrefersDark);

  // 检测系统主题偏好
  const checkSystemTheme = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  // 根据模式和系统偏好确定使用哪个主题
  const getThemeForMode = (mode: ThemeMode, systemDark: boolean) => {
    switch (mode) {
      case 'darkGlass':
        return { theme: darkGlassTheme, isDark: true, name: 'darkGlass' as const };
      case 'lightGlass':
        return { theme: lightGlassTheme, isDark: false, name: 'lightGlass' as const };
      case 'auto':
        return systemDark 
          ? { theme: darkGlassTheme, isDark: true, name: 'darkGlass' as const }
          : { theme: lightGlassTheme, isDark: false, name: 'lightGlass' as const };
      default:
        return { theme: lightGlassTheme, isDark: false, name: 'lightGlass' as const };
    }
  };

  // 更新主题状态
  const updateTheme = (mode: ThemeMode, systemDark: boolean) => {
    const { theme, isDark, name } = getThemeForMode(mode, systemDark);
    setIsDarkMode(isDark);
    setTheme({ ...theme, name });
  };

  const toggleTheme = () => {
    const currentMode = themeModeRef.current;
    let newMode: ThemeMode;
    
    if (currentMode === 'lightGlass') {
      newMode = 'darkGlass';
    } else if (currentMode === 'darkGlass') {
      newMode = 'lightGlass';
    } else {
      newMode = isDarkMode ? 'lightGlass' : 'darkGlass';
    }
    
    setThemeModeState(newMode);
    themeModeRef.current = newMode;
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    themeModeRef.current = mode;
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 在页面加载时从配置系统读取主题设置
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // 首先尝试从 electron-store 获取配置
        const result = await window.electronAPI?.config?.getTheme();
        const savedThemeMode = result?.success ? result.data : localStorage.getItem('themeMode') as ThemeMode || 'lightGlass';
        const savedSidebarState = localStorage.getItem('sidebarCollapsed');
        
        // 初始化系统主题偏好
        const initialSystemPrefersDark = checkSystemTheme();
        setSystemPrefersDark(initialSystemPrefersDark);
        systemPrefersDarkRef.current = initialSystemPrefersDark;
        setThemeModeState(savedThemeMode);
        themeModeRef.current = savedThemeMode;
        
        // 根据保存的模式和系统偏好更新主题
        updateTheme(savedThemeMode, initialSystemPrefersDark);
        
        if (savedSidebarState === 'true') {
          setIsSidebarCollapsed(true);
        }

        // 同步到 localStorage
        localStorage.setItem('themeMode', savedThemeMode);

        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: { matches: boolean }) => {
          const newSystemPrefersDark = e.matches;
          setSystemPrefersDark(newSystemPrefersDark);
          systemPrefersDarkRef.current = newSystemPrefersDark;
          // 使用 ref 来获取最新的 themeMode
          if (themeModeRef.current === 'auto') {
            updateTheme('auto', newSystemPrefersDark);
          }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // 清理函数
        return () => {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        // 降级到 localStorage
        const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode || 'lightGlass';
        const initialSystemPrefersDark = checkSystemTheme();
        setSystemPrefersDark(initialSystemPrefersDark);
        systemPrefersDarkRef.current = initialSystemPrefersDark;
        setThemeModeState(savedThemeMode);
        themeModeRef.current = savedThemeMode;
        updateTheme(savedThemeMode, initialSystemPrefersDark);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, []);

  // 当主题模式改变时，更新主题并保存到配置系统
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveTheme = async () => {
      try {
        // 保存到 electron-store
        await window.electronAPI?.config?.setTheme(themeMode);
        // 同时保存到 localStorage 作为备份
        localStorage.setItem('themeMode', themeMode);
        // 更新主题
        updateTheme(themeMode, systemPrefersDark);
      } catch (error) {
        console.error('Failed to save theme:', error);
        // 降级到 localStorage
        localStorage.setItem('themeMode', themeMode);
        updateTheme(themeMode, systemPrefersDark);
      }
    };

    saveTheme();
  }, [themeMode, systemPrefersDark, isInitialized]);

  // 同步 ref 和 state
  useEffect(() => {
    systemPrefersDarkRef.current = systemPrefersDark;
  }, [systemPrefersDark]);

  // 当侧边栏状态改变时，将其保存到 localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  // 当主题改变时，同步更新HTML的data-theme属性
  useEffect(() => {
    if (!isInitialized) return;
    // 立即更新主题属性
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, isInitialized]);

  const muiTheme = isDarkMode ? muiDarkGlassTheme : muiLightGlassTheme;

  // 避免在初始化完成前渲染，防止主题闪烁
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode, 
      isSidebarCollapsed, 
      themeMode,
      toggleTheme, 
      setThemeMode,
      toggleSidebar, 
      muiTheme 
    }}>
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={{ ...theme, name: isDarkMode ? 'darkGlass' : 'lightGlass' }}>
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};