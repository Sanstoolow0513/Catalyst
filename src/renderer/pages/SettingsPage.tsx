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
} from '../components/common';
import { useUser } from '../contexts/UserContext';
import { 
  User as UserIcon,
  Settings as SettingsIcon,
  MessageSquare as MessageIcon,
  Database as DatabaseIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  RefreshCw as RefreshIcon
} from 'lucide-react';

// 页面标题样式
const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.gradient.primary};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

// 标签页容器
const TabsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 2px solid ${props => props.theme.borderLight};
  padding-bottom: ${props => props.theme.spacing.sm};
  background: linear-gradient(to right, ${props => props.theme.surface}, ${props => props.theme.cardLayer.primary});
  border-radius: ${props => props.theme.borderRadius.medium} ${props => props.theme.borderRadius.medium} 0 0;
  padding: ${props => props.theme.spacing.md};
  margin-left: -${props => props.theme.spacing.lg};
  margin-right: -${props => props.theme.spacing.lg};
  padding-left: ${props => props.theme.spacing.lg};
  padding-right: ${props => props.theme.spacing.lg};
  
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
const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 500;
`;

const SectionHeader = styled.div<{ $variant?: 'default' | 'primary' | 'accent' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.borderLight};
  
  & > div > ${SectionTitle} {
    background: ${props => {
      switch (props.$variant) {
        case 'primary': return props.theme.gradient.primary;
        case 'accent': return props.theme.gradient.warning;
        default: return 'none';
      }
    }};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: ${props => props.$variant ? 'transparent' : props.theme.textPrimary};
  }
`;

// 表单网格 - 优化布局
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 紧凑表单网格
const CompactFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 设置区块
const SettingsSection = styled.div<{ $variant?: 'default' | 'primary' | 'accent' }>`
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return props.theme.cardLayer.primary;
      case 'accent': return props.theme.cardLayer.accent;
      default: return props.theme.surface;
    }
  }};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'primary': return props.theme.primary.light;
      case 'accent': return props.theme.warning.light;
      default: return props.theme.border;
    }
  }};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 统一保存栏
const SaveBar = styled.div`
  position: sticky;
  bottom: 0;
  background: linear-gradient(to bottom, ${props => props.theme.surface}EE, ${props => props.theme.surface});
  backdrop-filter: blur(10px);
  border-top: 1px solid ${props => props.theme.border};
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} -${props => props.theme.spacing.lg} 0;
  margin-left: -${props => props.theme.spacing.lg};
  margin-right: -${props => props.theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  border-radius: 0 0 ${props => props.theme.borderRadius.medium} ${props => props.theme.borderRadius.medium};
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// 保存状态
const SaveStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
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
  background: ${props => props.theme.gradient.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
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
  background: ${props => props.theme.gradient.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all ${props => props.theme.transition.normal} ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  border-radius: ${props => props.theme.borderRadius.small};
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:hover {
    background-color: ${props => props.theme.surfaceVariant};
    padding-left: ${props => props.theme.spacing.sm};
    padding-right: ${props => props.theme.spacing.sm};
    margin-left: -${props => props.theme.spacing.sm};
    margin-right: -${props => props.theme.spacing.sm};
  }
`;

// 按钮组
const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

type TabType = 'user' | 'preferences' | 'llm' | 'backup';

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
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState(nickname);
  const [userAvatar, setUserAvatar] = useState<string | null>(avatar);
  
  // 偏好设置
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
  
  // 代理设置（合并到偏好设置）
  const [vpnUrl, setVpnUrl] = useState('');
  const [proxyAutoStart, setProxyAutoStart] = useState(false);
  
  // 统一保存状态
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
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
        setUserEmail(config.user.email || '');
        setUserNickname(config.user.nickname || '');
        
        // 偏好设置
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
        const apiKeyResult = await window.electronAPI.llm.getApiKey(config.llm.provider || 'openai');
        if (apiKeyResult.success && apiKeyResult.data) {
          setApiKey(apiKeyResult.data);
        }
      }
    } catch {
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
      await window.electronAPI.config.setUserEmail(userEmail);
      setProfile({ nickname: userNickname, avatar: userAvatar });
      showToast('用户设置已保存', 'success');
    } catch {
      showToast('保存用户设置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 统一保存所有设置
  const saveAllSettings = async () => {
    setLoading(true);
    try {
      // 保存用户设置
      await window.electronAPI.config.setUserEmail(userEmail);
      setProfile({ nickname: userNickname, avatar: userAvatar });
      
      // 保存偏好设置
      await window.electronAPI.config.setTheme(theme as 'light' | 'dark' | 'auto');
      await window.electronAPI.config.setLanguage(language);
      await window.electronAPI.config.setStartup(startup);
      await window.electronAPI.config.setMinimizeToTray(minimizeToTray);
      await window.electronAPI.config.setNotifications(notifications);
      
      // 保存代理设置
      await window.electronAPI.config.setVpnUrl(vpnUrl);
      await window.electronAPI.config.setProxyAutoStart(proxyAutoStart);
      
      // 保存LLM设置
      await window.electronAPI.llm.setApiKey(llmProvider, apiKey);
      await window.electronAPI.llm.setProviderConfig({
        provider: llmProvider,
        baseUrl: baseUrl,
        apiKey: apiKey
      });
      localStorage.setItem('llmBaseUrl', baseUrl);
      
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      showToast('所有设置已保存', 'success');
    } catch {
      showToast('保存设置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 监听变化以标记未保存状态
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    userEmail, userNickname, userAvatar,
    theme, language, startup, minimizeToTray, notifications,
    vpnUrl, proxyAutoStart,
    llmProvider, llmModel, apiKey, baseUrl
  ]);

  const exportConfig = async () => {
    try {
      const result = await window.electronAPI.config.export();
      if (result.success) {
        showToast('配置已导出', 'success');
      } else {
        showToast('导出配置失败', 'error');
      }
    } catch {
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
    } catch {
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
      } catch {
        showToast('重置设置失败', 'error');
      }
    }
  };

  const tabs = [
    { id: 'user', label: '用户', icon: UserIcon },
    { id: 'preferences', label: '偏好', icon: SettingsIcon },
    { id: 'llm', label: 'LLM', icon: MessageIcon },
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
          <SettingsSection $variant="primary">
            <SectionHeader $variant="primary">
              <UserIcon size={20} />
              <div>
                <SectionTitle>个人信息</SectionTitle>
                <SectionDescription>
                  配置您的个人资料和头像
                </SectionDescription>
              </div>
            </SectionHeader>

            <CompactFormGrid>
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

              <FormGroup>
                <Label>昵称</Label>
                <Input
                  value={userNickname}
                  onChange={(e) => setUserNickname(e.target.value)}
                  placeholder="输入您的昵称"
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
            </CompactFormGrid>
          </SettingsSection>
        )}

        {activeTab === 'preferences' && (
          <>
            <SettingsSection $variant="primary">
              <SectionHeader $variant="primary">
                <SettingsIcon size={20} />
                <div>
                  <SectionTitle>外观与语言</SectionTitle>
                  <SectionDescription>
                    配置应用程序的界面语言和主题
                  </SectionDescription>
                </div>
              </SectionHeader>

              <CompactFormGrid>
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
              </CompactFormGrid>
            </SettingsSection>

            <SettingsSection $variant="accent">
              <SectionHeader $variant="accent">
                <SettingsIcon size={20} />
                <div>
                  <SectionTitle>系统行为</SectionTitle>
                  <SectionDescription>
                    配置应用程序的启动和关闭行为
                  </SectionDescription>
                </div>
              </SectionHeader>

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
            </SettingsSection>

            <SettingsSection $variant="primary">
              <SectionHeader $variant="primary">
                <MessageIcon size={20} />
                <div>
                  <SectionTitle>网络代理</SectionTitle>
                  <SectionDescription>
                    配置VPN和网络代理设置
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
            </SettingsSection>
          </>
        )}

        {activeTab === 'llm' && (
          <SettingsSection $variant="accent">
            <SectionHeader $variant="accent">
              <MessageIcon size={20} />
              <div>
                <SectionTitle>语言模型配置</SectionTitle>
                <SectionDescription>
                  配置大型语言模型的提供商和连接信息
                </SectionDescription>
              </div>
            </SectionHeader>

            <CompactFormGrid>
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
                <Label>模型</Label>
                <Input
                  type="text"
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  placeholder="输入模型名称"
                />
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

              <FormGroup>
                <Label>API 密钥</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入您的 API 密钥"
                />
              </FormGroup>
            </CompactFormGrid>
          </SettingsSection>
        )}

        {activeTab === 'backup' && (
          <SettingsSection $variant="primary">
            <SectionHeader $variant="primary">
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
                startIcon={<RefreshIcon size={16} />}
              >
                重置配置
              </Button>
            </ButtonGroup>
          </SettingsSection>
        )}

        {/* 统一保存栏 */}
        {activeTab !== 'backup' && (
          <SaveBar>
            <SaveStatus>
              {hasUnsavedChanges ? (
                <span style={{ color: '#f59e0b' }}>● 有未保存的更改</span>
              ) : lastSaved ? (
                <span>● 已保存于 {lastSaved.toLocaleTimeString()}</span>
              ) : (
                <span>● 所有设置已保存</span>
              )}
            </SaveStatus>
            <Button
              onClick={saveAllSettings}
              disabled={loading || !hasUnsavedChanges}
              variant="primary"
              startIcon={<SaveIcon size={16} />}
            >
              {loading ? '保存中...' : '保存所有设置'}
            </Button>
          </SaveBar>
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