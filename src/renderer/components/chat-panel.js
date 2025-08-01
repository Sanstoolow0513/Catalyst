const { ipcRenderer } = require('electron');

class ChatPanel {
  constructor(options) {
    this.container = document.getElementById(options.containerId);
    if (!this.container) {
      console.error(`找不到容器元素: ${options.containerId}`);
      return;
    }
    
    this.messages = [];
    this.apiKey = null;
  }

  initialize() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="chat-container">
        <div class="chat-header">
          <h3>AI 聊天</h3>
          <div class="api-key-status">
            <span id="api-key-status">API密钥: 未设置</span>
          </div>
        </div>
        
        <div class="chat-messages" id="chat-messages"></div>
        
        <div class="chat-input-area">
          <textarea id="chat-input" placeholder="输入消息..." rows="2"></textarea>
          <button id="send-btn" class="btn btn-primary">发送</button>
        </div>
        
        <div class="api-key-section">
          <input type="password" id="api-key-input" placeholder="输入OpenAI API密钥" />
          <button id="set-api-key-btn" class="btn btn-secondary">设置密钥</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const setApiKeyBtn = document.getElementById('set-api-key-btn');
    const apiKeyInput = document.getElementById('api-key-input');

    // 发送消息
    sendBtn.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (message) {
        this.addMessage('user', message);
        chatInput.value = '';
        
        ipcRenderer.invoke('llm-send-message', message).then((response) => {
          if (response.success) {
            this.addMessage('assistant', response.response);
          } else {
            this.addMessage('system', `错误: ${response.message}`);
          }
        });
      }
    });

    // 设置API密钥
    setApiKeyBtn.addEventListener('click', () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        ipcRenderer.invoke('llm-set-apikey', apiKey).then((result) => {
          if (result.success) {
            this.apiKey = apiKey;
            document.getElementById('api-key-status').textContent = 'API密钥: 已设置';
            this.addMessage('system', 'API密钥设置成功');
          } else {
            this.addMessage('system', `设置API密钥失败: ${result.message}`);
          }
          apiKeyInput.value = '';
        });
      }
    });

    // 回车发送消息
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  addMessage(role, content) {
    this.messages.push({ role, content });
    this.updateMessages();
  }

  updateMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';
    this.messages.forEach(msg => {
      const messageElement = document.createElement('div');
      messageElement.className = `message ${msg.role}`;
      
      let roleText = '你';
      if (msg.role === 'assistant') roleText = '助手';
      if (msg.role === 'system') roleText = '系统';
      
      messageElement.innerHTML = `
        <div class="message-header">
          <span class="message-role">${roleText}</span>
          <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="message-content">${msg.content}</div>
      `;
      
      messagesContainer.appendChild(messageElement);
    });

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

module.exports = { ChatPanel };