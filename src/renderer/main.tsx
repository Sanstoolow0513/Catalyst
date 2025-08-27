import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CustomThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import GlobalStyles from './styles/globalStyles';

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontFamily: 'Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>Application Error</h2>
          <p>Something went wrong while loading the application.</p>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Error Details</summary>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px',
              marginTop: '10px',
              overflow: 'auto'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as any).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CustomThemeProvider>
        <UserProvider>
          <GlobalStyles />
          <App />
        </UserProvider>
      </CustomThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
