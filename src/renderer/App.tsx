import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ThemeContext } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import HomePage from './pages/HomePage';
import ProxyPage from './pages/ProxyPage';
import ChatPage from './pages/ChatPage';
import ModernChatPage from './pages/ModernChatPage';
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
      <UserProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/proxy-management" element={<ProxyPage />} />
            <Route path="/chat" element={<ModernChatPage />} />
            <Route path="/modern-chat" element={<ModernChatPage />} />
            <Route path="/dev-environment" element={<DevEnvironmentPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/info" element={<InfoPage />} />
          </Routes>
        </MainLayout>
      </UserProvider>
    </Router>
  );
}

export default App;
