import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ThemeContext } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import SystemProxyPage from './pages/SystemProxyPage';
import ChatPage from './pages/ChatPage';
import MihomoConfigPage from './pages/MihomoConfigPage';
import DevEnvironmentPage from './pages/DevEnvironmentPage';

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
          <Route path="/system-proxy" element={<SystemProxyPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/mihomo-config" element={<MihomoConfigPage />} />
          <Route path="/dev-environment" element={<DevEnvironmentPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
