const { ipcRenderer } = require('electron');
const path = require('path');

// 组件导入
const { ClashPanel } = require('./components/clash-panel');
const { SystemInfo } = require('./components/system-info');
const { ResourceMonitor } = require('./components/resource-monitor');
const { SoftwareInstaller } = require('./components/software-installer');
const { BrowserView } = require('./components/browser-view');

console.log('[renderer] 脚本开始执行');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[renderer] DOMContentLoaded 事件触发');

  document.getElementById('minimize-btn').addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
  });
  document.getElementById('maximize-btn').addEventListener('click', () => {
    ipcRenderer.send('maximize-window');
  });
  document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('close-window');
  });
  // 更新代理
  const addProxyBtn = document.getElementById("add-proxy-btn");
  if (addProxyBtn) {
    addProxyBtn.addEventListener("click", () => {
      const proxyUrlInput = document.getElementById("proxy-url");
      if (proxyUrlInput && proxyUrlInput.value.trim() !== "") {
        ipcRenderer.send("add-proxy", proxyUrlInput.value.trim());
        proxyUrlInput.value = ""; // 清空输入框
      } else {
        // 显示提示信息
        showNotification("请输入有效的代理URL", "warning");
      }
    });
  }

  // 添加通知功能
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

  // --- 初始化组件 ---
  // 仪表盘-系统信息组件初始化
  const systemInfo = new SystemInfo({
    containerId: 'system-info-container'
  });
  systemInfo.initialize();

  // 资源监控组件初始化
  const resourceMonitor = new ResourceMonitor({
    cpuProgressId: 'cpu-progress',
    memProgressId: 'mem-progress',
    gpuProgressId: 'gpu-progress'
  });
  resourceMonitor.initialize();

  // 代理-Clash组件初始化
  const clashPanel = new ClashPanel({
    statusTextId: 'clash-status-text',
    statusSpinnerId: 'clash-status-spinner',
    startBtnId: 'global-start-btn',
    stopBtnId: 'global-stop-btn',
    refreshNodesBtnId: 'refresh-nodes-btn',
    nodeListId: 'node-list'
  });
  clashPanel.initialize();

  // 工具箱-软件安装组件初始化
  const softwareInstaller = new SoftwareInstaller({
    containerId: 'toolkit-container',
    configPath: path.join(__dirname, '..', 'shared', 'config', 'software-config.json')
  });
  softwareInstaller.initialize();

  // 浏览器组件初始化
  const browserView = new BrowserView({
    webviewId: 'browser-webview',
    urlInputId: 'browser-url',
    goBtnId: 'browser-go-btn',
    loadingId: 'webview-loading'
  });
  browserView.initialize();

  // --- Particles 背景 ---
  initParticlesBackground();

  // --- 添加全局错误处理 ---
  window.addEventListener('error', (event) => {
    console.error('[renderer] 全局JavaScript错误:', event.error);
    showNotification(`JavaScript错误: ${event.error.message}`, 'error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[renderer] 未处理的Promise拒绝:', event.reason);
    showNotification(`未处理的Promise拒绝: ${event.reason.message || event.reason}`, 'error');
    event.preventDefault();
  });
});

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