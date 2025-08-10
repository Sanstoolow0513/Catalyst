// src/renderer/contexts/ThemeContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, Theme } from '../styles/theme';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const CustomThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  // 可选：在页面加载时从 localStorage 读取用户偏好的主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme(darkTheme);
    }
  }, []);

  // 可选：当主题改变时，将其保存到 localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme === lightTheme ? 'light' : 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};