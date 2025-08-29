import React, { useContext, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ThemeContext } from './contexts/ThemeContext';
import { ConfigProvider } from './contexts/ConfigContext';
import NotificationSystem from './components/common/NotificationSystem';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProxyPage = lazy(() => import('./pages/ProxyPage'));
const ModernChatPage = lazy(() => import('./pages/ModernChatPage'));
const DevEnvironmentPage = lazy(() => import('./pages/UnifiedDevEnvironmentPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const TestPage = lazy(() => import('./pages/TestPage'));
const LLMConfigPage = lazy(() => import('./pages/LLMConfigPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));

const preloadPage = (importFn: () => Promise<unknown>) => {
  setTimeout(importFn, 100);
};

const preloadCommonPages = () => {
  preloadPage(() => import('./pages/ProxyPage'));
  preloadPage(() => import('./pages/SettingsPage'));
  preloadPage(() => import('./pages/UnifiedDevEnvironmentPage'));
};

const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

function App() {
  const themeContext = useContext(ThemeContext);
  
  React.useEffect(() => {
    preloadCommonPages();
  }, []);
  
  if (!themeContext) {
    // This should never happen if the provider is correctly set up
    return <div>Error: Theme context is not available.</div>;
  }

  return (
    <Router>
      <ConfigProvider>
        <MainLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/proxy-management" element={<ProxyPage />} />
              <Route path="/chat" element={<ModernChatPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/llm-config" element={<LLMConfigPage />} />
              <Route path="/dev-environment" element={<DevEnvironmentPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/info" element={<InfoPage />} />
            </Routes>
          </Suspense>
        </MainLayout>
        <NotificationSystem />
      </ConfigProvider>
    </Router>
  );
}

export default App;
