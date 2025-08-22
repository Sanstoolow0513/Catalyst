import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import GlobalStyles from './styles/globalStyles';

ReactDOM.createRoot(document.getElementById('root') as any).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <UserProvider>
        <GlobalStyles />
        <App />
      </UserProvider>
    </CustomThemeProvider>
  </React.StrictMode>,
);
