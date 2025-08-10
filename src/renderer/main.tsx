import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeContext';
import GlobalStyles from './styles/globalStyles';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <GlobalStyles />
      <App />
    </CustomThemeProvider>
  </React.StrictMode>,
);
