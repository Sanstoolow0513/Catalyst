// src/renderer/contexts/ThemeContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, muiLightTheme, muiDarkTheme, Theme } from '../styles/theme';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
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
  const [theme, setTheme] = useState(lightTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? lightTheme : darkTheme;
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
  };

  // 在页面加载时从 localStorage 读取用户偏好的主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme(darkTheme);
      setIsDarkMode(true);
    }
  }, []);

  // 当主题改变时，将其保存到 localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // 当主题改变时，同步更新HTML的data-theme属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const muiTheme = isDarkMode ? muiDarkTheme : muiLightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, muiTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
