import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ThemeContext } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import UnifiedProxyPage from './pages/UnifiedProxyPage';
import ChatPage from './pages/ChatPage';
import DevEnvironmentPage from './pages/DevEnvironmentPage';
import SettingsPage from './pages/SettingsPage';
import InfoPage from './pages/InfoPage';

function App() {
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    // This should never happen if the provider is correctly set up
    return <div>Error: Theme context is not available.</div>;
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/proxy-management" element={<UnifiedProxyPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dev-environment" element={<DevEnvironmentPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
