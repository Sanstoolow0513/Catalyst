/**
 * 浏览器视图组件类
 */
class BrowserView {
  /**
   * 创建浏览器视图组件
   * @param {Object} options - 组件选项
   * @param {string} options.webviewId - Webview元素ID
   * @param {string} options.urlInputId - URL输入框元素ID
   * @param {string} options.goBtnId - 前往按钮元素ID
   * @param {string} options.loadingId - 加载指示器元素ID
   */
  constructor(options) {
    this.webview = document.getElementById(options.webviewId);
    this.urlInput = document.getElementById(options.urlInputId);
    this.goBtn = document.getElementById(options.goBtnId);
    this.loading = document.getElementById(options.loadingId);
    
    // 默认URL
    this.defaultUrl = 'https://www.bing.com';

    // 验证元素是否存在
    if (!this.webview) console.error('[BrowserView] 找不到webview元素');
    if (!this.urlInput) console.error('[BrowserView] 找不到URL输入框元素');
    if (!this.goBtn) console.error('[BrowserView] 找不到前往按钮元素');
    if (!this.loading) console.error('[BrowserView] 找不到加载指示器元素');
  }

  /**
   * 初始化组件
   */
  initialize() {
    console.log('[BrowserView] 初始化浏览器视图组件');
    this.setupEventListeners();
    this.loadUrl(this.defaultUrl);
  }

  /**
   * 设置事件监听器
   * @private
   */
  setupEventListeners() {
    if (this.goBtn) {
      this.goBtn.addEventListener('click', () => {
        this.loadUrl(this.urlInput.value);
      });
    }
    
    if (this.urlInput) {
      this.urlInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          this.loadUrl(this.urlInput.value);
        }
      });
    }
    
    if (this.webview) {
      // 页面开始加载事件
      this.webview.addEventListener('did-start-loading', () => {
        console.log('[BrowserView] 页面开始加载');
        if (this.loading) this.loading.style.display = 'flex';
      });
      
      // 页面完成加载事件
      this.webview.addEventListener('did-stop-loading', () => {
        console.log('[BrowserView] 页面加载完成');
        if (this.loading) this.loading.style.display = 'none';
        
        // 更新URL输入框
        if (this.urlInput && this.webview.getURL) {
          this.urlInput.value = this.webview.getURL();
        }
      });
      
      // 页面标题更新事件
      this.webview.addEventListener('page-title-updated', (event) => {
        console.log(`[BrowserView] 页面标题更新: ${event.title}`);
      });
      
      // 页面图标更新事件
      this.webview.addEventListener('page-favicon-updated', () => {
        console.log('[BrowserView] 页面图标更新');
      });
      
      // 新窗口请求事件
      this.webview.addEventListener('new-window', (event) => {
        console.log(`[BrowserView] 新窗口请求: ${event.url}`);
        // 在当前webview中打开新链接，而不是创建新窗口
        this.loadUrl(event.url);
      });
      
      // 导航事件
      this.webview.addEventListener('will-navigate', (event) => {
        console.log(`[BrowserView] 即将导航到: ${event.url}`);
      });
    }
  }

  /**
   * 加载URL
   * @param {string} url - 要加载的URL
   */
  loadUrl(url) {
    console.log(`[BrowserView] 加载URL: ${url}`);
    
    // URL格式化处理
    if (!url) return;
    
    let formattedUrl = url.trim();
    
    // 如果URL不包含协议，添加https://
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    // 更新输入框
    if (this.urlInput) {
      this.urlInput.value = formattedUrl;
    }
    
    // 加载URL
    if (this.webview) {
      if (this.loading) this.loading.style.display = 'flex';
      this.webview.src = formattedUrl;
    }
  }

  /**
   * 刷新当前页面
   */
  refresh() {
    console.log('[BrowserView] 刷新页面');
    if (this.webview && this.webview.reload) {
      this.webview.reload();
    }
  }

  /**
   * 返回上一页
   */
  goBack() {
    console.log('[BrowserView] 返回上一页');
    if (this.webview && this.webview.goBack && this.webview.canGoBack()) {
      this.webview.goBack();
    }
  }

  /**
   * 前进到下一页
   */
  goForward() {
    console.log('[BrowserView] 前进到下一页');
    if (this.webview && this.webview.goForward && this.webview.canGoForward()) {
      this.webview.goForward();
    }
  }
}

module.exports = { BrowserView }; 