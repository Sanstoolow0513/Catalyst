import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Button, 
  Input, 
  Label, 
  Select, 
  SelectWrapper, 
  FormGroup,
  PageContainer,
  TabButton,
  Switch,
  ToastContainer,
  ToastComponent,
} from '../components/common';
import SettingsSidebar from '../components/common/SettingsSidebar';
import StatusIndicator from '../components/common/StatusIndicator';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User as UserIcon,
  Settings as SettingsIcon,
  MessageSquare as MessageIcon,
  Database as DatabaseIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  RefreshCw as RefreshIcon,
  Plus as PlusIcon,
  Trash2 as DeleteIcon,
  Edit as EditIcon,
  Radio as RadioIcon,
  Palette as PaletteIcon,
  Monitor as MonitorIcon,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Bell as BellIcon
} from 'lucide-react';

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  text-shadow: ${props => props.theme.textShadow.light};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

// 设置页面内容容器
const SettingsContentContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

// 主内容区域
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background};
  min-height: 0;
`;

// 页面头部
const ContentHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surface};
`;

// 标签页容器（用于移动端）
const TabsContainer = styled.div`
  display: none;
  gap: 8px;
  margin-bottom: 32px;
  padding: 16px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

// 标签页内容
const TabContent = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
  
  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.borderLight};
  }
`;

// 区块标题
const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: ${props => props.theme.textShadow.medium};
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
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.sm};
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
// 紧凑表单网格
const CompactFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

// 设置区块
const SettingsSection = styled(motion.div)<{ $variant?: 'default' | 'primary' | 'accent' | 'important' }>`
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return props.theme.cardLayer.primary;
      case 'accent': return props.theme.cardLayer.accent;
      case 'important': return props.theme.primary.light + '10';
      default: return props.theme.surface;
    }
  }};
  border: ${props => {
    switch (props.$variant) {
      case 'primary': return `1px solid ${props.theme.primary.light}`;
      case 'accent': return `1px solid ${props.theme.warning.light}`;
      case 'important': return `2px solid ${props.theme.primary.main}`;
      default: return `1px solid ${props.theme.border}`;
    }
  }};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: ${props => {
    switch (props.$variant) {
      case 'important': return props.theme.cardShadow.important;
      default: return props.theme.cardShadow.default;
    }
  }};
  position: relative;
  z-index: 1;
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:hover {
    box-shadow: ${props => {
      switch (props.$variant) {
        case 'important': return props.theme.cardShadow.importantHover;
        default: return props.theme.cardShadow.hover;
      }
    }};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 统一保存栏
const SaveBar = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.theme.surface};
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.border};
  padding: 8px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.cardShadow.hover};
  z-index: 1000;
  transition: all ${props => props.theme.transition.normal} ease;
  min-width: 280px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.cardShadow.importantHover};
  }
`;

// 保存状态指示器容器
const SaveStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
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
  box-shadow: ${props => props.theme.cardShadow.hover};
  
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
  box-shadow: ${props => props.theme.cardShadow.default};
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
`;

// 按钮组
const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

// LLM配置项
const LlmConfigItem = styled.div<{ $isActive: boolean }>`
  background: ${props => props.$isActive ? props.theme.primary.light + '10' : props.theme.surface};
  border: 2px solid ${props => props.$isActive ? props.theme.primary.main : props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  transition: background-color ${props => props.theme.transition.normal} ease, border-color ${props => props.theme.transition.normal} ease;
`;

// LLM配置表单
const LlmConfigForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

// 配置头部
const ConfigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

// 配置名称
const ConfigName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

// 配置操作
const ConfigActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

// 新增配置表单
const NewConfigForm = styled.div`
  background: ${props => props.theme.surface};
  border: 2px dashed ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

type TabType = 'user' | 'preferences' | 'llm' | 'backup' | 'appearance' | 'system' | 'network' | 'privacy' | 'notifications' | 'general';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

const SettingsPage: React.FC = () => {
  const { nickname, avatar, setProfile } = useUser();
  const { themeMode, setThemeMode } = useTheme();
  const [activeSection, setActiveSection] = useState<TabType>('user');
  
  // 用户设置
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState(nickname);
  const [userAvatar, setUserAvatar] = useState<string | null>(avatar);
  
  // 偏好设置  
  const [language, setLanguage] = useState('zh-CN');
  const [startup, setStartup] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  
  // LLM设置
  const [llmConfigs, setLlmConfigs] = useState<Array<{
    id: string;
    name: string;
    provider: string;
    model: string;
    apiKey: string;
    baseUrl: string;
    isActive: boolean;
  }>>([]);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState({
    name: '',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1'
  });
  
  // 代理设置（合并到偏好设置）
  const [vpnUrl, setVpnUrl] = useState('');
  const [proxyAutoStart, setProxyAutoStart] = useState(false);
  
  // 隐私设置
  const [dataCollection, setDataCollection] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [crashReports, setCrashReports] = useState(true);
  
  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // 统一保存状态
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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
        
        // 偏好设置 - 避免覆盖 ThemeContext 的状态
        if (!isSettingsLoaded) {
          setThemeMode(config.app.theme || 'auto');
          setIsSettingsLoaded(true);
        }
        setLanguage(config.app.language || 'zh-CN');
        setStartup(config.app.startup || false);
        setMinimizeToTray(config.app.minimizeToTray || false);
        setNotifications(config.app.notifications || true);
        
        // LLM设置 - 从localStorage加载多个配置
        const savedConfigs = localStorage.getItem('llmConfigs');
        let configs = [];
        
        if (savedConfigs) {
          try {
            const parsedConfigs = JSON.parse(savedConfigs);
            if (Array.isArray(parsedConfigs) && parsedConfigs.length > 0) {
              configs = parsedConfigs;
            }
          } catch (error) {
            console.error('解析LLM配置失败:', error);
          }
        }
        
        if (configs.length === 0) {
          // 如果没有保存的配置，创建一个默认配置
          const defaultConfig = {
            id: generateId(),
            name: '默认配置',
            provider: config.llm.provider || 'openai',
            model: config.llm.model || 'gpt-3.5-turbo',
            apiKey: '',
            baseUrl: localStorage.getItem('llmBaseUrl') || 'https://api.openai.com/v1',
            isActive: true
          };
          configs = [defaultConfig];
        }
        
        setLlmConfigs(configs);
        
        // 获取当前激活配置的API密钥
        const activeConfig = configs.find(config => config.isActive) || configs[0];
        if (activeConfig) {
          const apiKeyResult = await window.electronAPI.llm.getApiKey(activeConfig.provider);
          if (apiKeyResult.success && apiKeyResult.data) {
            // 更新激活配置的API密钥
            setLlmConfigs(prev => prev.map(config => 
              config.isActive ? { ...config, apiKey: apiKeyResult.data } : config
            ));
          }
        }
        
        // 代理设置
        setVpnUrl(config.proxy.vpnProviderUrl || '');
        setProxyAutoStart(config.proxy.autoStart || false);
        
        // 隐私设置
        setDataCollection(config.privacy?.dataCollection ?? true);
        setAnalyticsEnabled(config.privacy?.analyticsEnabled ?? false);
        setCrashReports(config.privacy?.crashReports ?? true);
        
        // 通知设置
        setEmailNotifications(config.notifications?.email ?? true);
        setPushNotifications(config.notifications?.push ?? true);
        setSoundEnabled(config.notifications?.sound ?? true);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      showToast('加载设置失败', 'error');
    }
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addLlmConfig = () => {
    if (!newConfig.name.trim()) {
      showToast('请输入配置名称', 'error');
      return;
    }
    
    const config = {
      ...newConfig,
      id: generateId(),
      isActive: llmConfigs.length === 0 // 第一个配置默认激活
    };
    
    setLlmConfigs(prev => [...prev, config]);
    setNewConfig({
      name: '',
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1'
    });
    showToast('配置已添加', 'success');
  };

  const updateLlmConfig = (id: string, updates: Partial<typeof newConfig>) => {
    setLlmConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, ...updates } : config
    ));
  };

  const deleteLlmConfig = (id: string) => {
    const configToDelete = llmConfigs.find(c => c.id === id);
    if (configToDelete?.isActive && llmConfigs.length > 1) {
      // 如果删除的是激活的配置，激活另一个配置
      const nextConfig = llmConfigs.find(c => c.id !== id);
      if (nextConfig) {
        updateLlmConfig(nextConfig.id, { isActive: true });
      }
    }
    
    setLlmConfigs(prev => prev.filter(config => config.id !== id));
    showToast('配置已删除', 'success');
  };

  const setActiveConfig = (id: string) => {
    setLlmConfigs(prev => prev.map(config => ({
      ...config,
      isActive: config.id === id
    })));
    showToast('已切换配置', 'success');
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

  // 统一保存所有设置
  const saveAllSettings = async () => {
    setSaveStatus('saving');
    try {
      // 保存用户设置
      await window.electronAPI.config.setUserEmail(userEmail);
      setProfile({ nickname: userNickname, avatar: userAvatar });
      
      // 保存偏好设置
      await window.electronAPI.config.setTheme(themeMode as 'light' | 'dark' | 'auto');
      await window.electronAPI.config.setLanguage(language);
      await window.electronAPI.config.setStartup(startup);
      await window.electronAPI.config.setMinimizeToTray(minimizeToTray);
      await window.electronAPI.config.setNotifications(notifications);
      
      // 保存代理设置
      await window.electronAPI.config.setVpnUrl(vpnUrl);
      await window.electronAPI.config.setProxyAutoStart(proxyAutoStart);
      
      // 保存LLM设置
      const activeConfig = llmConfigs.find(config => config.isActive);
      if (activeConfig) {
        await window.electronAPI.llm.setApiKey(activeConfig.provider, activeConfig.apiKey);
        await window.electronAPI.llm.setProviderConfig({
          provider: activeConfig.provider,
          baseUrl: activeConfig.baseUrl,
          apiKey: activeConfig.apiKey
        });
        localStorage.setItem('llmBaseUrl', activeConfig.baseUrl);
      }
      
      // 保存所有LLM配置到localStorage
      localStorage.setItem('llmConfigs', JSON.stringify(llmConfigs));
      
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      showToast('所有设置已保存', 'success');
      
      // 3秒后恢复到idle状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('保存设置失败:', error);
      setSaveStatus('error');
      showToast('保存设置失败', 'error');
      
      // 3秒后恢复到idle状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  // 监听变化以标记未保存状态
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    userEmail, userNickname, userAvatar,
    themeMode, language, startup, minimizeToTray, notifications,
    vpnUrl, proxyAutoStart,
    dataCollection, analyticsEnabled, crashReports,
    emailNotifications, pushNotifications, soundEnabled,
    llmConfigs, newConfig
  ]);

  const exportConfig = async () => {
    try {
      const result = await window.electronAPI.config.export();
      if (result.success) {
        showToast('配置已导出', 'success');
      } else {
        showToast('导出配置失败', 'error');
      }
    } catch (error) {
      console.error('导出配置失败:', error);
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
      console.error('导入配置失败:', error);
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
        console.error('重置设置失败:', error);
        showToast('重置设置失败', 'error');
      }
    }
  };

  const tabs = [
    { id: 'user', label: '用户', icon: UserIcon },
    { id: 'appearance', label: '外观', icon: PaletteIcon },
    { id: 'system', label: '系统', icon: MonitorIcon },
    { id: 'network', label: '网络', icon: GlobeIcon },
    { id: 'privacy', label: '隐私', icon: ShieldIcon },
    { id: 'notifications', label: '通知', icon: BellIcon },
    { id: 'llm', label: 'LLM', icon: MessageIcon },
    { id: 'backup', label: '备份', icon: DatabaseIcon }
  ] as const;

  return (
    <PageContainer>
      <SettingsContentContainer>
        {/* 侧边栏导航 */}
        <SettingsSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        {/* 主内容区域 */}
        <MainContent>
          {/* 页面头部 */}
          <ContentHeader>
            <PageTitle>设置</PageTitle>
            <PageSubtitle>
              管理应用程序的各项设置和个性化配置
            </PageSubtitle>
          </ContentHeader>

          {/* 移动端标签页 */}
          <TabsContainer>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                $active={activeSection === tab.id}
                onClick={() => setActiveSection(tab.id as TabType)}
                icon={<tab.icon size={16} />}
                variant="segment"
              >
                {tab.label}
              </TabButton>
            ))}
          </TabsContainer>

          <TabContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
        {activeSection === 'user' && (
          <SettingsSection 
            $variant="primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
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
                      <UserIcon size={48} color={props => props.theme.iconColor.default} />
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

        {activeSection === 'appearance' && (
          <SettingsSection 
            $variant="primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SectionHeader $variant="primary">
              <PaletteIcon size={20} />
              <div>
                <SectionTitle>外观设置</SectionTitle>
                <SectionDescription>
                  配置应用程序的界面语言和主题
                </SectionDescription>
              </div>
            </SectionHeader>

            <CompactFormGrid>
              <FormGroup>
                <Label>主题模式</Label>
                <SelectWrapper>
                  <Select value={themeMode} onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark' | 'auto')}>
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
        )}

        {activeSection === 'system' && (
          <SettingsSection 
            $variant="important"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SectionHeader $variant="primary">
              <MonitorIcon size={20} />
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
        )}

        {activeSection === 'network' && (
          <SettingsSection 
            $variant="primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SectionHeader $variant="primary">
              <GlobeIcon size={20} />
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
        )}

        {activeSection === 'privacy' && (
          <SettingsSection 
            $variant="important"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SectionHeader $variant="primary">
              <ShieldIcon size={20} />
              <div>
                <SectionTitle>隐私设置</SectionTitle>
                <SectionDescription>
                  管理您的数据隐私和安全设置
                </SectionDescription>
              </div>
            </SectionHeader>

            <SwitchContainer>
              <div>
                <Label>数据收集</Label>
                <SectionDescription>
                  允许收集匿名使用数据以改善产品
                </SectionDescription>
              </div>
              <Switch
                checked={dataCollection}
                onChange={setDataCollection}
              />
            </SwitchContainer>

            <SwitchContainer>
              <div>
                <Label>使用分析</Label>
                <SectionDescription>
                  启用功能使用分析以帮助我们了解用户需求
                </SectionDescription>
              </div>
              <Switch
                checked={analyticsEnabled}
                onChange={setAnalyticsEnabled}
              />
            </SwitchContainer>

            <SwitchContainer>
              <div>
                <Label>崩溃报告</Label>
                <SectionDescription>
                  自动发送崩溃报告以帮助修复问题
                </SectionDescription>
              </div>
              <Switch
                checked={crashReports}
                onChange={setCrashReports}
              />
            </SwitchContainer>
          </SettingsSection>
        )}

        {activeSection === 'notifications' && (
          <SettingsSection 
            $variant="primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <SectionHeader $variant="primary">
              <BellIcon size={20} />
              <div>
                <SectionTitle>通知设置</SectionTitle>
                <SectionDescription>
                  配置各种通知和提醒的偏好设置
                </SectionDescription>
              </div>
            </SectionHeader>

            <SwitchContainer>
              <div>
                <Label>邮件通知</Label>
                <SectionDescription>
                  接收重要的邮件通知
                </SectionDescription>
              </div>
              <Switch
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
            </SwitchContainer>

            <SwitchContainer>
              <div>
                <Label>推送通知</Label>
                <SectionDescription>
                  接收实时推送通知
                </SectionDescription>
              </div>
              <Switch
                checked={pushNotifications}
                onChange={setPushNotifications}
              />
            </SwitchContainer>

            <SwitchContainer>
              <div>
                <Label>通知声音</Label>
                <SectionDescription>
                  启用通知提示音
                </SectionDescription>
              </div>
              <Switch
                checked={soundEnabled}
                onChange={setSoundEnabled}
              />
            </SwitchContainer>
          </SettingsSection>
        )}

        {activeSection === 'llm' && (
          <>
            <SettingsSection 
              $variant="primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
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
                    <Select value={themeMode} onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark' | 'auto')}>
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

            <SettingsSection 
              $variant="accent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
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

            <SettingsSection 
              $variant="primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
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

        {activeSection === 'llm' && (
          <SettingsSection 
            $variant="accent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SectionHeader $variant="accent">
              <MessageIcon size={20} />
              <div>
                <SectionTitle>语言模型配置</SectionTitle>
                <SectionDescription>
                  管理多个语言模型配置，可添加、编辑和删除不同的配置
                </SectionDescription>
              </div>
            </SectionHeader>

            {/* 新增配置表单 */}
            <NewConfigForm>
              <ConfigHeader>
                <ConfigName>
                  <PlusIcon size={16} />
                  添加新配置
                </ConfigName>
              </ConfigHeader>
              
              <LlmConfigForm>
                <FormGroup>
                  <Label>配置名称</Label>
                  <Input
                    value={newConfig.name}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：OpenAI GPT-4"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>提供商</Label>
                  <SelectWrapper>
                    <Select 
                      value={newConfig.provider} 
                      onChange={(e) => setNewConfig(prev => ({ ...prev, provider: e.target.value }))}
                    >
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
                    value={newConfig.model}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="gpt-4, gemini-pro 等"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Base URL</Label>
                  <Input
                    value={newConfig.baseUrl}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="API 地址"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>API 密钥</Label>
                  <Input
                    type="password"
                    value={newConfig.apiKey}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="输入 API 密钥"
                  />
                </FormGroup>
              </LlmConfigForm>

              <Button onClick={addLlmConfig} variant="primary" startIcon={<PlusIcon size={16} />}>
                添加配置
              </Button>
            </NewConfigForm>

            {/* 现有配置列表 */}
            {llmConfigs.map((config) => (
              <LlmConfigItem key={config.id} $isActive={config.isActive}>
                <ConfigHeader>
                  <ConfigName>
                    {config.isActive && <RadioIcon size={16} fill="currentColor" />}
                    {config.name}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                      ({config.provider} - {config.model})
                    </span>
                  </ConfigName>
                  
                  <ConfigActions>
                    {!config.isActive && (
                      <Button
                        onClick={() => setActiveConfig(config.id)}
                        variant="outline"
                        size="small"
                        startIcon={<RadioIcon size={14} />}
                      >
                        设为激活
                      </Button>
                    )}
                    <Button
                      onClick={() => setEditingConfig(editingConfig === config.id ? null : config.id)}
                      variant="outline"
                      size="small"
                      startIcon={<EditIcon size={14} />}
                    >
                      {editingConfig === config.id ? '取消' : '编辑'}
                    </Button>
                    {llmConfigs.length > 1 && (
                      <Button
                        onClick={() => deleteLlmConfig(config.id)}
                        variant="danger"
                        size="small"
                        startIcon={<DeleteIcon size={14} />}
                      >
                        删除
                      </Button>
                    )}
                  </ConfigActions>
                </ConfigHeader>

                {/* 编辑表单 */}
                {editingConfig === config.id && (
                  <LlmConfigForm>
                    <FormGroup>
                      <Label>配置名称</Label>
                      <Input
                        value={config.name}
                        onChange={(e) => updateLlmConfig(config.id, { name: e.target.value })}
                        placeholder="配置名称"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>提供商</Label>
                      <SelectWrapper>
                        <Select 
                          value={config.provider} 
                          onChange={(e) => updateLlmConfig(config.id, { provider: e.target.value })}
                        >
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
                        value={config.model}
                        onChange={(e) => updateLlmConfig(config.id, { model: e.target.value })}
                        placeholder="模型名称"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Base URL</Label>
                      <Input
                        value={config.baseUrl}
                        onChange={(e) => updateLlmConfig(config.id, { baseUrl: e.target.value })}
                        placeholder="API 地址"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>API 密钥</Label>
                      <Input
                        type="password"
                        value={config.apiKey}
                        onChange={(e) => updateLlmConfig(config.id, { apiKey: e.target.value })}
                        placeholder="API 密钥"
                      />
                    </FormGroup>
                  </LlmConfigForm>
                )}
              </LlmConfigItem>
            ))}

            {llmConfigs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <MessageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>暂无 LLM 配置，请添加一个配置开始使用</p>
              </div>
            )}
          </SettingsSection>
        )}

        {activeSection === 'backup' && (
          <SettingsSection 
            $variant="primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
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
      </TabContent>
        </MainContent>
      </SettingsContentContainer>
      
      {/* 统一保存栏 */}
      {activeSection !== 'backup' && (
        <SaveBar>
          <SaveStatusContainer>
            <StatusIndicator 
              status={
                saveStatus === 'saving' ? 'saving' :
                saveStatus === 'error' ? 'error' :
                saveStatus === 'saved' ? 'saved' :
                hasUnsavedChanges ? 'changed' : 'idle'
              }
              size="small"
            />
          </SaveStatusContainer>
          <Button
            onClick={saveAllSettings}
            disabled={saveStatus === 'saving' || !hasUnsavedChanges}
            variant="primary"
            startIcon={<SaveIcon size={16} />}
          >
            {saveStatus === 'saving' ? '保存中...' : '保存'}
          </Button>
        </SaveBar>
      )}

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