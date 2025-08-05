import React, { useState, useContext, createContext, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import CryptoJS from 'crypto-js';

// 创建认证上下文
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 从electron-store获取存储的token
    ipcRenderer.invoke('config:get', 'authToken').then(token => {
      if (token) {
        setToken(token);
        // 这里可以添加验证token有效性的逻辑
      }
    });
  }, []);

  const login = async (credentials) => {
    try {
      // 加密密码
      const encryptedPassword = CryptoJS.AES.encrypt(
        credentials.password,
        'secret-key' // 实际项目中应使用更安全的密钥管理
      ).toString();

      // 发送登录请求
      const response = await ipcRenderer.invoke('auth:login:request', {
        username: credentials.username,
        password: encryptedPassword
      });

      if (response.success) {
        setUser({ username: credentials.username });
        setToken(response.token);
        // 存储token到electron-store
        ipcRenderer.invoke('config:set', 'authToken', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    ipcRenderer.invoke('config:delete', 'authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { user, login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ username, password });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const configData = e.target.result;
      try {
        await ipcRenderer.invoke('config:upload:request', configData);
        alert('配置上传成功');
      } catch (error) {
        alert('配置上传失败: ' + error.message);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDownload = async () => {
    try {
      const configData = await ipcRenderer.invoke('config:download:request');
      const blob = new Blob([configData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      alert('配置下载失败: ' + error.message);
    }
  };

  return (
    <div className="settings-container">
      <h1>系统设置</h1>

      {!user ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>用户登录</h2>
          <div>
            <label>用户名:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>密码:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">登录</button>
        </form>
      ) : (
        <div className="user-info">
          <h2>欢迎, {user.username}</h2>
          <button onClick={() => logout()}>退出登录</button>
        </div>
      )}

      <div className="config-section">
        <h2>配置文件管理</h2>
        <div>
          <input type="file" onChange={handleFileChange} accept=".json" />
          <button onClick={handleUpload} disabled={!selectedFile}>
            上传配置
          </button>
        </div>
        <div>
          <button onClick={handleDownload}>下载配置</button>
        </div>
      </div>
    </div>
  );
};

export { SettingsPage };