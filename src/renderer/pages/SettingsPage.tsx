import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Card, 
  Button, 
  Input, 
  Label, 
  Select, 
  SelectWrapper, 
  FormGroup,
  Textarea,
  PageContainer,
  TabButton,
  Switch,
  ToastContainer,
  ToastComponent,
  FormRow
} from '../components/common';
import { useUser } from '../contexts/UserContext';
import { 
  User as UserIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
  MessageSquare as MessageIcon,
  Database as DatabaseIcon,
  Upload as UploadIcon
} from 'lucide-react';

// 页面标题样式
const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
`;

// 标签页容器
const TabsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.border};
  
  @media (max-width: 768px) {
    overflow-x: auto;
    padding-bottom: ${props => props.theme.spacing.sm};
  }
`;

// 标签页内容
const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

// 区块标题
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

// 表单网格
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 头像容器
const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${props => props.theme.surfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.primary.main};
  color: white;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all ${props => props.theme.transition.fast} ease;
  
  &:hover {
    background-color: ${props => props.theme.primary.dark};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

// 开关容器
const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} 0;
`;

// 按钮组
const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

type TabType = 'user' | 'general' | 'llm' | 'proxy' | 'backup';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

const SettingsPage: React.FC = () => {
  const { nickname, avatar, setProfile } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('user');
  const [loading, setLoading] = useState(false);
  
  // 用户设置
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState(nickname);
  const [userAvatar, setUserAvatar] = useState<string | null>(avatar);
  const [userBio, setUserBio] = useState('');
  
  // 通用设置
  const [theme, setTheme] = useState('auto');
  const [language, setLanguage] = useState('zh-CN');
  const [startup, setStartup] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // LLM设置
  const [llmProvider, setLlmProvider] = useState('openai');
  const [llmModel, setLlmModel] = useState('gpt-3.5-turbo');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  
  // 代理设置
  const [vpnUrl, setVpnUrl] = useState('');
  const [proxyAutoStart, setProxyAutoStart] = useState(false);
  
  // 全局浮窗提醒
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastId, setToastId] = useState(0);

  useEffect(() => {
    loadSettings();
    setUserNickname(nickname);
    setUserAvatar(avatar);
  }, [nickname, avatar]);

  const loadSettings = async () => {
    try {
      const result = await window.electronAPI.config.getAll();
      if (result.success && result.data) {
        const config = result.data;
        
        // 用户设置
        setUserName(config.user.name || '');
        setUserEmail(config.user.email || '');
        setUserNickname(config.user.nickname || '');
        setUserBio(config.user.bio || '');
        
        // 通用设置
        setTheme(config.app.theme || 'auto');
        setLanguage(config.app.language || 'zh-CN');
        setStartup(config.app.startup || false);
        setMinimizeToTray(config.app.minimizeToTray || false);
        setNotifications(config.app.notifications || true);
        
        // LLM设置
        setLlmProvider(config.llm.provider || 'openai');
        setLlmModel(config.llm.model || 'gpt-3.5-turbo');
        // 从localStorage加载Base URL（因为当前API没有这个字段）
        const savedBaseUrl = localStorage.getItem('llmBaseUrl');
        if (savedBaseUrl) {
          setBaseUrl(savedBaseUrl);
        }
        
        // 代理设置
        setVpnUrl(config.proxy.vpnProviderUrl || '');
        setProxyAutoStart(config.proxy.autoStart || false);
        
        // 获取API密钥
        const apiKeyResult = await window.electronAPI.llm.getApiKey(llmProvider);
        if (apiKeyResult.success && apiKeyResult.data) {
          setApiKey(apiKeyResult.data);
        }
      }
    } catch (error) {
      showToast('加载设置失败', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = toastId;
    setToastId(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // 3秒后自动移除
    setTimeout(() => {
      setToasts(prev => prev.map(toast => 
        toast.id === id ? { ...toast, exiting: true } : toast
      ));
      
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 300);
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, exiting: true } : toast
    ));
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUserSettings = async () => {
    setLoading(true);
    try {
      await window.electronAPI.config.setUserName(userName);
      await window.electronAPI.config.setUserEmail(userEmail);
      // 保存用户昵称和简介到本地存储（因为当前API没有这些字段）
      localStorage.setItem('userBio', userBio);
      setProfile({ nickname: userNickname, avatar: userAvatar });
      showToast('用户设置已保存', 'success');
    } catch (error) {
      showToast('保存用户设置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveGeneralSettings = async () => {
    setLoading(true);
    try {
      await window.electronAPI.config.setTheme(theme as any);
      await window.electronAPI.config.setLanguage(language);
      await window.electronAPI.config.setStartup(startup);
      await window.electronAPI.config.setMinimizeToTray(minimizeToTray);
      await window.electronAPI.config.setNotifications(notifications);
      showToast('通用设置已保存', 'success');
    } catch (error) {
      showToast('保存通用设置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveLLMSettings = async () => {
    setLoading(true);
    try {
      // 保存API密钥
      await window.electronAPI.llm.setApiKey(llmProvider, apiKey);
      
      // 保存提供商配置（包括Base URL）
      await window.electronAPI.llm.setProviderConfig({
        provider: llmProvider,
        baseUrl: baseUrl,
        apiKey: apiKey
      });
      
      // 保存到localStorage
      localStorage.setItem('llmBaseUrl', baseUrl);
      
      showToast('LLM设置已保存', 'success');
    } catch (error) {
      showToast('保存LLM设置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveProxySettings = async () => {
    setLoading(true);
    try {
      await window.electronAPI.config.setVpnUrl(vpnUrl);
      await window.electronAPI.config.setProxyAutoStart(proxyAutoStart);
      showToast('代理设置已保存', 'success');
    } catch (error) {
      showToast('保存代理设置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportConfig = async () => {
    try {
      const result = await window.electronAPI.config.export();
      if (result.success) {
        showToast('配置已导出', 'success');
      } else {
        showToast('导出配置失败', 'error');
      }
    } catch (error) {
      showToast('导出配置失败', 'error');
    }
  };

  const importConfig = async () => {
    try {
      const result = await window.electronAPI.config.import();
      if (result.success) {
        showToast('配置已导入', 'success');
        loadSettings(); // 重新加载设置
      } else {
        showToast('导入配置失败', 'error');
      }
    } catch (error) {
      showToast('导入配置失败', 'error');
    }
  };

  const resetConfig = async () => {
    if (confirm('确定要重置所有设置吗？此操作不可撤销。')) {
      try {
        const result = await window.electronAPI.config.reset();
        if (result.success) {
          showToast('设置已重置', 'success');
          loadSettings(); // 重新加载设置
        } else {
          showToast('重置设置失败', 'error');
        }
      } catch (error) {
        showToast('重置设置失败', 'error');
      }
    }
  };

  const tabs = [
    { id: 'user', label: '用户', icon: UserIcon },
    { id: 'general', label: '通用', icon: SettingsIcon },
    { id: 'llm', label: 'LLM', icon: MessageIcon },
    { id: 'proxy', label: '代理', icon: ShieldIcon },
    { id: 'backup', label: '备份', icon: DatabaseIcon }
  ] as const;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <SettingsIcon size={28} />
          设置
        </PageTitle>
        <PageSubtitle>
          管理应用程序的各项设置和个性化配置
        </PageSubtitle>
      </PageHeader>

      <TabsContainer>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            icon={<tab.icon size={16} />}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabsContainer>

      <TabContent>
        {activeTab === 'user' && (
          <Card $variant="elevated" $padding="large">
            <SectionHeader>
              <UserIcon size={20} />
              <div>
                <SectionTitle>个性化设置</SectionTitle>
                <SectionDescription>
                  配置您的个人信息和偏好
                </SectionDescription>
              </div>
            </SectionHeader>

            <FormGrid>
              <FormGroup>
                <Label>头像</Label>
                <AvatarContainer>
                  <Avatar>
                    {userAvatar ? (
                      <img src={userAvatar} alt="User avatar" />
                    ) : (
                      <UserIcon size={48} color="#999" />
                    )}
                  </Avatar>
                  <UploadButton>
                    <UploadIcon size={16} />
                    上传头像
                    <HiddenInput 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarUpload}
                    />
                  </UploadButton>
                </AvatarContainer>
              </FormGroup>

              <div>
                <FormGroup>
                  <Label>昵称</Label>
                  <Input
                    value={userNickname}
                    onChange={(e) => setUserNickname(e.target.value)}
                    placeholder="输入您的昵称"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>姓名</Label>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="输入您的姓名"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>邮箱</Label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="输入您的邮箱地址"
                  />
                </FormGroup>
              </div>
            </FormGrid>

            <FormGroup>
              <Label>个人简介</Label>
              <Textarea
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                placeholder="简单介绍一下自己"
                rows={4}
              />
            </FormGroup>

            <ButtonGroup>
              <Button
                onClick={saveUserSettings}
                disabled={loading}
                variant="primary"
              >
                {loading ? '保存中...' : '保存设置'}
              </Button>
            </ButtonGroup>
          </Card>
        )}

        {activeTab === 'general' && (
          <Card $variant="elevated" $padding="large">
            <SectionHeader>
              <SettingsIcon size={20} />
              <div>
                <SectionTitle>通用设置</SectionTitle>
                <SectionDescription>
                  配置应用程序的基本行为和外观
                </SectionDescription>
              </div>
            </SectionHeader>

            <FormGrid>
              <FormGroup>
                <Label>主题</Label>
                <SelectWrapper>
                  <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light">浅色</option>
                    <option value="dark">深色</option>
                    <option value="auto">跟随系统</option>
                  </Select>
                </SelectWrapper>
              </FormGroup>

              <FormGroup>
                <Label>语言</Label>
                <SelectWrapper>
                  <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="zh-CN">简体中文</option>
                    <option value="en">English</option>
                  </Select>
                </SelectWrapper>
              </FormGroup>
            </FormGrid>

            <SwitchContainer>
              <div>
                <Label>开机启动</Label>
                <SectionDescription>
                  应用程序将在系统启动时自动运行
                </SectionDescription>
              </div>
              <Switch
                checked={startup}
                onChange={setStartup}
              />
            </SwitchContainer>

            <SwitchContainer>
              <div>
                <Label>最小化到托盘</Label>
                <SectionDescription>
                  关闭窗口时将应用程序最小化到系统托盘
                </SectionDescription>
              </div>
              <Switch
                checked={minimizeToTray}
                onChange={setMinimizeToTray}
              />
            </SwitchContainer>

            <SwitchContainer>
              <div>
                <Label>通知</Label>
                <SectionDescription>
                  启用应用程序的通知功能
                </SectionDescription>
              </div>
              <Switch
                checked={notifications}
                onChange={setNotifications}
              />
            </SwitchContainer>

            <ButtonGroup>
              <Button
                onClick={saveGeneralSettings}
                disabled={loading}
                variant="primary"
              >
                {loading ? '保存中...' : '保存设置'}
              </Button>
            </ButtonGroup>
          </Card>
        )}

        {activeTab === 'llm' && (
          <Card $variant="elevated" $padding="large">
            <SectionHeader>
              <MessageIcon size={20} />
              <div>
                <SectionTitle>LLM 设置</SectionTitle>
                <SectionDescription>
                  配置大型语言模型的相关设置
                </SectionDescription>
              </div>
            </SectionHeader>

            <FormGrid>
              <FormGroup>
                <Label>提供商</Label>
                <SelectWrapper>
                  <Select value={llmProvider} onChange={(e) => setLlmProvider(e.target.value)}>
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Gemini</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="custom">自定义</option>
                  </Select>
                </SelectWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Base URL</Label>
                <Input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="输入 API Base URL"
                />
              </FormGroup>
            </FormGrid>

            <FormGrid>
              <FormGroup>
                <Label>模型</Label>
                <Input
                  type="text"
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  placeholder="输入模型名称"
                />
              </FormGroup>

              <FormGroup>
                <Label>API 密钥</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入您的 API 密钥"
                />
              </FormGroup>
            </FormGrid>

            <ButtonGroup>
              <Button
                onClick={saveLLMSettings}
                disabled={loading || !apiKey.trim() || !baseUrl.trim() || !llmModel.trim()}
                variant="primary"
              >
                {loading ? '保存中...' : '保存设置'}
              </Button>
            </ButtonGroup>
          </Card>
        )}

        {activeTab === 'proxy' && (
          <Card $variant="elevated" $padding="large">
            <SectionHeader>
              <ShieldIcon size={20} />
              <div>
                <SectionTitle>代理设置</SectionTitle>
                <SectionDescription>
                  配置系统代理的相关设置
                </SectionDescription>
              </div>
            </SectionHeader>

            <FormGroup>
              <Label>VPN 提供商 URL</Label>
              <Input
                value={vpnUrl}
                onChange={(e) => setVpnUrl(e.target.value)}
                placeholder="输入 VPN 提供商的配置 URL"
              />
            </FormGroup>

            <SwitchContainer>
              <div>
                <Label>代理自动启动</Label>
                <SectionDescription>
                  应用程序启动时自动开启代理服务
                </SectionDescription>
              </div>
              <Switch
                checked={proxyAutoStart}
                onChange={setProxyAutoStart}
              />
            </SwitchContainer>

            <ButtonGroup>
              <Button
                onClick={saveProxySettings}
                disabled={loading}
                variant="primary"
              >
                {loading ? '保存中...' : '保存设置'}
              </Button>
            </ButtonGroup>
          </Card>
        )}

        {activeTab === 'backup' && (
          <>
            <Card $variant="elevated" $padding="large">
              <SectionHeader>
                <DatabaseIcon size={20} />
                <div>
                  <SectionTitle>配置管理</SectionTitle>
                  <SectionDescription>
                    导入、导出和重置应用程序配置
                  </SectionDescription>
                </div>
              </SectionHeader>

              <ButtonGroup>
                <Button
                  onClick={exportConfig}
                  variant="outline"
                  startIcon={<UploadIcon size={16} />}
                >
                  导出配置
                </Button>
                <Button
                  onClick={importConfig}
                  variant="outline"
                  startIcon={<UploadIcon size={16} />}
                >
                  导入配置
                </Button>
                <Button
                  onClick={resetConfig}
                  variant="danger"
                  startIcon={<UploadIcon size={16} />}
                >
                  重置配置
                </Button>
              </ButtonGroup>
            </Card>
          </>
        )}
      </TabContent>

      {/* 全局浮窗提醒 */}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastComponent 
            key={toast.id} 
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
            exiting={toast.exiting}
          />
        ))}
      </ToastContainer>
    </PageContainer>
  );
};

export default SettingsPage;