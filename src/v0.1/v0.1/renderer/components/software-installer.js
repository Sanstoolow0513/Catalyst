const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

/**
 * 软件安装器组件类
 */
class SoftwareInstaller {
  /**
   * 创建软件安装器组件
   * @param {Object} options - 组件选项
   * @param {string} options.containerId - 容器元素ID
   * @param {string} options.configPath - 软件配置文件路径
   */
  constructor(options) {
    this.container = document.getElementById(options.containerId);
    this.configPath = options.configPath;
    this.softwareList = [];

    // 验证元素是否存在
    if (!this.container) console.error('[SoftwareInstaller] 找不到容器元素');
  }

  /**
   * 初始化组件
   */
  initialize() {
    console.log('[SoftwareInstaller] 初始化软件安装器组件');
    this.loadSoftwareConfig();
    this.setupEventListeners();
  }

  /**
   * 设置事件监听器
   * @private
   */
  setupEventListeners() {
    // 监听安装状态更新
    ipcRenderer.on('installation-status', (event, { id, status, message }) => {
      console.log(`[SoftwareInstaller] 安装状态更新: ${id}, ${status}`, message || '');
      this.updateInstallationStatus(id, status, message);
    });
  }

  /**
   * 加载软件配置
   * @private
   */
  loadSoftwareConfig() {
    console.log(`[SoftwareInstaller] 加载软件配置: ${this.configPath}`);
    
    if (!this.container) return;
    
    try {
      // 确保配置文件目录存在
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      // 检查配置文件是否存在，不存在则创建示例配置
      if (!fs.existsSync(this.configPath)) {
        const exampleConfig = [
          {
            'id': 'vscode',
            'name': 'Visual Studio Code',
            'description': '轻量级但功能强大的源代码编辑器',
            'url': 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user',
            'installer_args': '/VERYSILENT /MERGETASKS=!runcode'
          },
          {
            'id': 'git',
            'name': 'Git',
            'description': '分布式版本控制系统',
            'url': 'https://github.com/git-for-windows/git/releases/download/v2.37.1.windows.1/Git-2.37.1-64-bit.exe',
            'installer_args': '/VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS="icons,ext\\reg\\shellhere,assoc,assoc_sh"'
          }
        ];
        
        fs.writeFileSync(this.configPath, JSON.stringify(exampleConfig, null, 2), 'utf-8');
        console.log(`[SoftwareInstaller] 创建示例配置文件: ${this.configPath}`);
      }
      
      // 读取配置文件
      const configContent = fs.readFileSync(this.configPath, 'utf-8');
      this.softwareList = JSON.parse(configContent);
      
      // 渲染软件列表
      this.renderSoftwareList();
    } catch (error) {
      console.error('[SoftwareInstaller] 加载软件配置失败:', error);
      this.container.innerHTML = '<p style="color: var(--accent-error);">加载软件列表失败</p>';
    }
  }

  /**
   * 渲染软件列表
   * @private
   */
  renderSoftwareList() {
    if (!this.container || !this.softwareList) return;
    
    // 清空容器
    this.container.innerHTML = '';
    
    if (this.softwareList.length === 0) {
      this.container.innerHTML = '<p>没有可安装的软件</p>';
      return;
    }
    
    // 渲染每个软件卡片
    this.softwareList.forEach(software => {
      const card = document.createElement('div');
      card.className = 'installer-card';
      
      card.innerHTML = `
        <h3>${software.name}</h3>
        <p>${software.description || ''}</p>
        <button class="btn btn-primary install-btn" data-id="${software.id}">安装</button>
      `;
      
      // 添加安装按钮点击事件
      const installBtn = card.querySelector('.install-btn');
      installBtn.addEventListener('click', () => {
        this.installSoftware(software);
      });
      
      this.container.appendChild(card);
    });
  }

  /**
   * 安装软件
   * @param {Object} software - 软件信息
   * @private
   */
  installSoftware(software) {
    console.log(`[SoftwareInstaller] 开始安装 ${software.name}`);
    
    // 禁用安装按钮并更新文本
    const button = this.container.querySelector(`.install-btn[data-id="${software.id}"]`);
    if (button) {
      button.textContent = '准备安装...';
      button.disabled = true;
    }
    
    // 发送安装请求到主进程
    ipcRenderer.send('install-software', software);
  }

  /**
   * 更新安装状态
   * @param {string} id - 软件ID
   * @param {string} status - 安装状态
   * @param {string} message - 状态消息
   * @private
   */
  updateInstallationStatus(id, status, message) {
    const button = this.container.querySelector(`.install-btn[data-id="${id}"]`);
    if (!button) return;
    
    switch (status) {
      case 'downloading':
        button.textContent = '下载中...';
        button.classList.remove('btn-primary');
        button.disabled = true;
        break;
      case 'installing':
        button.textContent = '安装中...';
        button.disabled = true;
        break;
      case 'success':
        button.textContent = '安装成功';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        button.disabled = true;
        break;
      case 'error':
        button.textContent = '安装失败';
        button.classList.remove('btn-primary');
        button.classList.add('btn-error');
        button.disabled = false; // 允许重试
        if (message) {
          alert(`安装失败: ${message}`);
        }
        break;
    }
  }

  /**
   * 刷新软件列表
   */
  refresh() {
    this.loadSoftwareConfig();
  }
}

module.exports = { SoftwareInstaller }; 