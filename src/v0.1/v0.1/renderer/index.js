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
  //更新proxy
  document.getElementById("add-btn").addEventListener("click",()=>{
    ipcRenderer.send("proxy-changed");
  })

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