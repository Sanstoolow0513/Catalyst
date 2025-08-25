import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  User as UserIcon,
  Database as DatabaseIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  RefreshCw as RefreshIcon,
  Monitor as MonitorIcon,
  Settings as SettingsIcon
} from 'lucide-react';
import ModernCard from '../components/common/ModernCard';
import SettingsSidebar from '../components/common/SettingsSidebar';
import StatusIndicator from '../components/common/StatusIndicator';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useConfig } from '../contexts/ConfigContext';

// Toast 组件 - 现代化设计
const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ToastComponent = styled(motion.div)<{ 
  type: 'success' | 'error' | 'info'; 
  exiting?: boolean 
}>`
  padding: 12px 20px;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid;
  min-width: 200px;
  max-width: 400px;
  
  ${props => {
    switch(props.type) {
      case 'success':
        return css`
          background: ${props.theme.name === 'dark' 
            ? 'rgba(16, 185, 129, 0.2)' 
            : 'rgba(16, 185, 129, 0.1)'};
          color: ${props.theme.success.main};
          border-color: ${props.theme.name === 'dark' 
            ? 'rgba(16, 185, 129, 0.3)' 
            : 'rgba(16, 185, 129, 0.2)'};
        `;
      case 'error':
        return css`
          background: ${props.theme.name === 'dark' 
            ? 'rgba(239, 68, 68, 0.2)' 
            : 'rgba(239, 68, 68, 0.1)'};
          color: ${props.theme.error.main};
          border-color: ${props.theme.name === 'dark' 
            ? 'rgba(239, 68, 68, 0.3)' 
            : 'rgba(239, 68, 68, 0.2)'};
        `;
      default:
        return css`
          background: ${props.theme.name === 'dark' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(37, 99, 235, 0.1)'};
          color: ${props.theme.primary.main};
          border-color: ${props.theme.name === 'dark' 
            ? 'rgba(59, 130, 246, 0.3)' 
            : 'rgba(37, 99, 235, 0.2)'};
        `;
    }
  }}
  
  opacity: ${props => props.exiting ? 0 : 1};
  transform: translateY(${props => props.exiting ? '-20px' : '0'});
  transition: all 0.3s ease;
`;

// 简洁设置页面容器
const ModernSettingsContainer = styled.div`
  height: 100%;
  background: ${props => props.theme.background};
  position: relative;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  overflow: hidden;
`;

// 主布局容器
const MainLayout = styled.div`
  display: flex;
  height: 100%;
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 24px;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
`;


// 主内容区域 - 简洁设计
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.card.shadow};
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
`;

// 页面头部 - 简洁设计
const ContentHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 页面标题 - 简洁设计
const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 标签页内容 - 现代化设计
const TabContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(37, 99, 235, 0.3)'};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.5)' 
      : 'rgba(37, 99, 235, 0.5)'};
  }
`;

// 区块标题 - 简洁设计
const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 设置项卡片
const SettingsCard = styled(ModernCard)`
  margin-bottom: 16px;
`;

// 表单网格
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

// 表单组
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 表单标签
const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 4px;
`;

// 表单输入 - 简洁设计
const FormInput = styled.input`
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.input.background};
  color: ${props => props.theme.input.text};
  font-size: 0.9rem;
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.input.borderFocus};
    box-shadow: ${props => props.theme.button.shadowHover};
  }
  
  &::placeholder {
    color: ${props => props.theme.input.placeholder};
  }
  
  &:read-only {
    background: ${props => props.theme.surfaceVariant};
    cursor: not-allowed;
  }
`;

// 头像容器
const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: ${props => props.theme.button.shadow};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 开关容器 - 简洁设计
const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${props => props.theme.surfaceVariant};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 12px;
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:hover {
    background: ${props => props.theme.surface};
    border-color: ${props => props.theme.primary.main};
  }
`;

// 开关信息
const SwitchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SwitchLabel = styled.div`
  font-weight: 500;
  color: ${props => props.theme.textPrimary};
  font-size: 0.95rem;
`;

const SwitchDescription = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

// 开关组件 - 简洁设计
const Switch = styled.div<{ $checked: boolean }>`
  width: 48px;
  height: 24px;
  background: ${props => props.$checked 
    ? props.theme.primary.main 
    : props.theme.borderLight};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all ${props => props.theme.transition.normal} ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.$checked ? '26px' : '2px'};
    transition: all ${props => props.theme.transition.normal} ease;
    box-shadow: ${props => props.theme.button.shadow};
  }
  
  &:hover {
    transform: scale(1.02);
  }
`;

// 按钮组
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

// 简洁按钮设计
const ModernButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'outline' | 'danger' }>`
  padding: 12px 24px;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.9rem;
  font-weight: 500;
  transition: all ${props => props.theme.transition.normal} ease;
  cursor: pointer;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  ${props => {
    switch(props.$variant) {
      case 'primary':
        return css`
          background: ${props => props.theme.primary.main};
          color: ${props => props.theme.primary.contrastText};
          border-color: ${props => props.theme.primary.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.primary.dark};
            border-color: ${props => props.theme.primary.dark};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      case 'secondary':
        return css`
          background: ${props => props.theme.secondary.main};
          color: ${props => props.theme.secondary.contrastText};
          border-color: ${props => props.theme.secondary.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.secondary.dark};
            border-color: ${props => props.theme.secondary.dark};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      case 'outline':
        return css`
          background: ${props => props.theme.surface};
          color: ${props => props.theme.primary.main};
          border-color: ${props => props.theme.primary.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.primary.main};
            color: ${props => props.theme.primary.contrastText};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      case 'danger':
        return css`
          background: ${props => props.theme.error.main};
          color: ${props => props.theme.error.contrastText};
          border-color: ${props => props.theme.error.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.error.dark};
            border-color: ${props => props.theme.error.dark};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      default:
        return css`
          background: ${props => props.theme.surface};
          color: ${props => props.theme.textPrimary};
          border-color: ${props => props.theme.border};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.surfaceVariant};
            border-color: ${props => props.theme.borderLight};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
`;

// 保存栏 - 简洁设计
const SaveBar = styled(motion.div)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.card.shadowHover};
  z-index: 1000;
  min-width: 280px;
`;

// 保存状态指示器容器
const SaveStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 标签页容器（用于移动端）- 简洁设计
const TabsContainer = styled.div`
  display: none;
  gap: 8px;
  margin-bottom: 24px;
  padding: 16px;
  background: ${props => props.theme.surfaceVariant};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

// 标签页按钮 - 简洁设计
const TabButton = styled(motion.button)<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all ${props => props.theme.transition.normal} ease;
  background: ${props => props.$active 
    ? props.theme.primary.main 
    : props.theme.surfaceVariant};
  color: ${props => props.$active ? props.theme.primary.contrastText : props.theme.textSecondary};
  
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
`;


type TabType = 'user' | 'system' | 'backup';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

const SettingsPage: React.FC = () => {
  const { nickname, avatar } = useUser();
  const { theme } = useTheme();
  const { llmConfigs, activeConfig, refreshConfigs } = useConfig();
  const [activeSection, setActiveSection] = useState<TabType>('user');
  
  // 用户设置
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState(nickname);
  const [userAvatar, setUserAvatar] = useState<string | null>(avatar);
  
  // 系统设置
  const [startup, setStartup] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
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
        
        // 系统设置
        setStartup(config.app.startup || false);
        setMinimizeToTray(config.app.minimizeToTray || false);
        setNotifications(config.app.notifications || true);
      }
      
      // 刷新LLM配置
      await refreshConfigs();
    } catch (error) {
      console.error('加载设置失败:', error);
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

  
  // 统一保存所有设置
  const saveAllSettings = async () => {
    setSaveStatus('saving');
    try {
      // 用户信息现在是只读的，不需要保存
      
      // 保存系统设置
      await window.electronAPI.config.setStartup(startup);
      await window.electronAPI.config.setMinimizeToTray(minimizeToTray);
      await window.electronAPI.config.setNotifications(notifications);
      
      // 刷新LLM配置
      await refreshConfigs();
        
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
    startup, minimizeToTray, notifications,
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
    { id: 'system', label: '系统', icon: MonitorIcon },
    { id: 'backup', label: '备份', icon: DatabaseIcon }
  ] as const;

  return (
    <ModernSettingsContainer>
      <MainLayout>
        {/* 侧边栏导航 */}
        <SettingsSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        {/* 主内容区域 */}
        <MainContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* 页面头部 */}
          <ContentHeader>
            <PageTitle>
            </PageTitle>
          </ContentHeader>

          {/* 移动端标签页 */}
          <TabsContainer>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                $active={activeSection === tab.id}
                onClick={() => setActiveSection(tab.id as TabType)}
              >
                <tab.icon size={16} />
                {tab.label}
              </TabButton>
            ))}
          </TabsContainer>

          <TabContent>
        {activeSection === 'user' && (
          <SettingsCard
            variant="glass"
            padding="large"
            borderRadius="large"
            hoverable={false}
            animationDelay={0.4}
          >
            <SectionTitle>个人信息</SectionTitle>
            
            <FormGrid>
              <FormGroup>
                <FormLabel>头像</FormLabel>
                <AvatarContainer>
                  <Avatar>
                    {userAvatar ? (
                      <img src={userAvatar} alt="User avatar" />
                    ) : (
                      <UserIcon size={48} color={theme.iconColor.default} />
                    )}
                  </Avatar>
                </AvatarContainer>
              </FormGroup>

              <FormGroup>
                <FormLabel>昵称</FormLabel>
                <FormInput
                  value={userNickname}
                  readOnly
                  placeholder="您的昵称"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>邮箱</FormLabel>
                <FormInput
                  type="email"
                  value={userEmail}
                  readOnly
                  placeholder="您的邮箱地址"
                />
              </FormGroup>
            </FormGrid>
          </SettingsCard>
        )}

        
        {activeSection === 'system' && (
          <SettingsCard
            variant="glass"
            padding="large"
            borderRadius="large"
            hoverable={false}
            animationDelay={0.4}
          >
            <SectionTitle>系统行为</SectionTitle>

            <SwitchContainer>
              <SwitchInfo>
                <SwitchLabel>开机启动</SwitchLabel>
                <SwitchDescription>
                  应用程序将在系统启动时自动运行
                </SwitchDescription>
              </SwitchInfo>
              <Switch 
                $checked={startup}
                onClick={() => setStartup(!startup)}
              />
            </SwitchContainer>

            <SwitchContainer>
              <SwitchInfo>
                <SwitchLabel>最小化到托盘</SwitchLabel>
                <SwitchDescription>
                  关闭窗口时将应用程序最小化到系统托盘
                </SwitchDescription>
              </SwitchInfo>
              <Switch 
                $checked={minimizeToTray}
                onClick={() => setMinimizeToTray(!minimizeToTray)}
              />
            </SwitchContainer>

            <SwitchContainer>
              <SwitchInfo>
                <SwitchLabel>通知</SwitchLabel>
                <SwitchDescription>
                  启用应用程序的通知功能
                </SwitchDescription>
              </SwitchInfo>
              <Switch 
                $checked={notifications}
                onClick={() => setNotifications(!notifications)}
              />
            </SwitchContainer>
          </SettingsCard>
        )}

        
        
        
        
        {activeSection === 'backup' && (
          <SettingsCard
            variant="glass"
            padding="large"
            borderRadius="large"
            hoverable={false}
            animationDelay={0.4}
          >
            <SectionTitle>配置管理</SectionTitle>

            <ButtonGroup>
              <ModernButton
                onClick={exportConfig}
                $variant="outline"
              >
                <UploadIcon size={16} />
                导出配置
              </ModernButton>
              <ModernButton
                onClick={importConfig}
                $variant="outline"
              >
                <UploadIcon size={16} />
                导入配置
              </ModernButton>
              <ModernButton
                onClick={resetConfig}
                $variant="danger"
              >
                <RefreshIcon size={16} />
                重置配置
              </ModernButton>
            </ButtonGroup>
          </SettingsCard>
        )}
      </TabContent>
        </MainContent>
      </MainLayout>
      
      {/* 统一保存栏 */}
      {activeSection !== 'backup' && (
        <SaveBar
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
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
          <ModernButton
            onClick={saveAllSettings}
            disabled={saveStatus === 'saving' || !hasUnsavedChanges}
            $variant="primary"
          >
            <SaveIcon size={16} />
            {saveStatus === 'saving' ? '保存中...' : '保存'}
          </ModernButton>
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
    </ModernSettingsContainer>
  );
};

export default SettingsPage;