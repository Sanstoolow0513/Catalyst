// src/renderer/styles/theme.ts

export const lightTheme = {
  body: '#FFFFFF',
  text: '#333333',
  sidebar: '#F5F5F5',
  border: '#DDDDDD',
  accent: '#007BFF',
};

export const darkTheme = {
  body: '#1E1E1E',
  text: '#E0E0E0',
  sidebar: '#2D2D2D',
  border: '#444444',
  accent: '#4D9EFF',
};

export type Theme = typeof lightTheme;