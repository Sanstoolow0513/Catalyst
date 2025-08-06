import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { NavBar } from './layouts/NavBar';
import './styles/global.css';

console.log('[renderer] React应用开始初始化');

// 创建根组件
const App = () => {
  // 添加全局错误处理
  React.useEffect(() => {
    const handleError = (event) => {
      console.error('[renderer] 全局JavaScript错误:', event.error);
      showNotification(`JavaScript错误: ${event.error.message}`, 'error');
    };

    const handleRejection = (event) => {
      console.error('[renderer] 未处理的Promise拒绝:', event.reason);
      showNotification(`未处理的Promise拒绝: ${event.reason.message || event.reason}`, 'error');
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // 初始化粒子背景
    initParticlesBackground();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

// 挂载应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 通知功能
function showNotification(message, type = "info") {
  // 创建通知元素
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // 设置样式
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: type === "error" ? "var(--error-color)" :
                    type === "warning" ? "var(--warning-color)" :
                    type === "success" ? "var(--success-color)" : "var(--primary-color)",
    color: "white",
    boxShadow: "var(--shadow-lg)",
    zIndex: "10000",
    maxWidth: "300px",
    wordWrap: "break-word",
    fontSize: "14px"
  });

  // 添加到页面
  document.body.appendChild(notification);

  // 3秒后自动移除
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

/**
 * 初始化粒子背景
 */
async function initParticlesBackground() {
  try {
    await tsParticles.load({
      id: 'tsparticles',
      options: {
        background: {
          color: {
            value: '#12121e', // 匹配CSS背景色
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            onClick: {
              enable: true,
              mode: 'push',
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
            push: {
              quantity: 4,
            },
          },
        },
        particles: {
          color: {
            value: '#6c63ff',
          },
          links: {
            color: '#6c63ff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      },
    });
  } catch (error) {
    console.error('[renderer] 初始化粒子背景失败:', error);
  }
}