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
  Settings as SettingsIcon,
  Camera as CameraIcon
} from 'lucide-react';
import StatusIndicator from '../components/common/StatusIndicator';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useConfig } from '../contexts/ConfigContext';
import { PageContainer } from '../components/common/PageContainer';

const WelcomeCard = styled(motion.div)<{ $isDarkMode?: boolean; $isGlassMode?: boolean }>`
  background: ${props => {
    if (props.$isGlassMode) {
      return 'linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)';
    }
    return props.$isDarkMode 
      ? 'linear-gradient(135deg, #1e293b, #334155)' 
      : 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
  }};
  border-radius: 20px;
  padding: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: ${props => {
    if (props.$isGlassMode) {
      return '1px solid rgba(148, 163, 184, 0.15)';
    }
    return `1px solid ${props.theme.border}`;
  }};
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  align-items: center;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
  box-shadow: ${props => {
    if (props.$isGlassMode) {
      return '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)';
    }
    return '0 1px 2px rgba(0, 0, 0, 0.05)';
  }};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${props => {
      if (props.$isGlassMode) {
        return 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(167, 139, 250, 0.05) 30%, transparent 60%)';
      }
      return props.$isDarkMode 
        ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' 
        : 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)';
    }};
    animation: float 12s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isGlassMode 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)' 
      : 'none'};
    pointer-events: none;
    border-radius: 20px;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
`;

const WelcomeTitle = styled.h2<{ $isGlassMode?: boolean }>`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.8rem 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

const WelcomeSubtitle = styled.p<{ $isGlassMode?: boolean }>`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

const ContentSection = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SettingsSection = styled.div<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SectionIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  line-height: 1.4;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label<{ $isGlassMode?: boolean }>`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 4px;
`;

const FormInput = styled.input<{ $isGlassMode?: boolean }>`
  padding: 12px 16px;
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.25)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 8px;
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.12)' 
    : props.theme.input.background};
  color: ${props => props.theme.input.text};
  font-size: 0.95rem;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }
  
  &::placeholder {
    color: ${props => props.theme.input.placeholder};
  }
  
  &:read-only {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.15)' 
      : props.theme.surfaceVariant};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const AvatarUploadButton = styled(motion.button)<{ $isGlassMode?: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.primary.main};
  border: 2px solid ${props => props.$isGlassMode ? 'rgba(255, 255, 255, 0.2)' : props.theme.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(10px)' : 'none'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  &:hover {
    background: ${props => props.theme.primary.dark};
    transform: scale(1.05);
  }
`;

const SwitchContainer = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surfaceVariant};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme.surface};
    border-color: ${props => props.theme.primary.main};
  }
`;

const SwitchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SwitchLabel = styled.div<{ $isGlassMode?: boolean }>`
  font-weight: 500;
  color: ${props => props.theme.textPrimary};
  font-size: 1rem;
`;

const SwitchDescription = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

const Switch = styled.div<{ $checked: boolean; $isGlassMode?: boolean }>`
  width: 48px;
  height: 24px;
  background: ${props => props.$checked 
    ? props.theme.primary.main 
    : (props.$isGlassMode ? 'rgba(148, 163, 184, 0.3)' : props.theme.borderLight)};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.$checked ? '26px' : '2px'};
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)<{ 
  $variant?: 'primary' | 'danger' | 'default'; 
  $isGlassMode?: boolean 
}>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  
  ${props => {
    switch(props.$variant) {
      case 'primary':
        return css`
          background: ${props.theme.primary.main};
          color: white;
          &:hover { background: ${props.theme.primary.dark}; }
        `;
      case 'danger':
        return css`
          background: ${props.theme.error.main};
          color: white;
          &:hover { background: ${props.theme.error.dark}; }
        `;
      default:
        return css`
          background: ${props => props.$isGlassMode 
            ? 'rgba(30, 41, 59, 0.12)' 
            : props.theme.surfaceVariant};
          color: ${props.theme.textPrimary};
          border: ${props => props.$isGlassMode 
            ? '1px solid rgba(148, 163, 184, 0.15)' 
            : `1px solid ${props.theme.border}`};
          &:hover { 
            background: ${props => props.$isGlassMode 
              ? 'rgba(51, 65, 85, 0.15)' 
              : props.theme.surface}; 
          }
        `;
    }
  }}
`;

const SaveBar = styled(motion.div)<{ $isGlassMode?: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.15)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.2)' 
    : `1px solid ${props.theme.border}`};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 280px;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
`;

const SaveStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

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
  border-radius: 8px;
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
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.2);
        `;
      case 'error':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        `;
      default:
        return css`
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-color: rgba(59, 130, 246, 0.2);
        `;
    }
  }}
  
  opacity: ${props => props.exiting ? 0 : 1};
  transform: translateY(${props => props.exiting ? '-20px' : '0'});
  transition: all 0.3s ease;
`;

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

const SettingsPage: React.FC = () => {
  const { nickname, avatar } = useUser();
  const { theme, isDarkMode, themeMode } = useTheme();
  const { refreshConfigs } = useConfig();
  const isGlassMode = themeMode.includes('Glass');
  
  // 用户设置
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState(nickname);
  const [userAvatar, setUserAvatar] = useState<string | null>(avatar);
  
  // 系统设置
  const [startup, setStartup] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // 保存状态
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Toast
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

  const saveAllSettings = async () => {
    setSaveStatus('saving');
    try {
      // 保存系统设置
      await window.electronAPI.config.setStartup(startup);
      await window.electronAPI.config.setMinimizeToTray(minimizeToTray);
      await window.electronAPI.config.setNotifications(notifications);
      
      await refreshConfigs();
        
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      showToast('所有设置已保存', 'success');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('保存设置失败:', error);
      setSaveStatus('error');
      showToast('保存设置失败', 'error');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [startup, minimizeToTray, notifications]);

  const handleAvatarUpload = async () => {
    try {
      const result = await window.electronAPI.dialog.openFile({
        filters: [
          { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] }
        ],
        properties: ['openFile']
      });
      
      if (result && !result.canceled) {
        const filePath = result.filePaths[0];
        // 这里可以添加图片处理逻辑，比如调整大小、格式转换等
        setUserAvatar(filePath);
        showToast('头像已更新', 'success');
      }
    } catch (error) {
      console.error('上传头像失败:', error);
      showToast('上传头像失败', 'error');
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
      console.error('导出配置失败:', error);
      showToast('导出配置失败', 'error');
    }
  };

  const importConfig = async () => {
    try {
      const result = await window.electronAPI.config.import();
      if (result.success) {
        showToast('配置已导入', 'success');
        loadSettings();
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
          loadSettings();
        } else {
          showToast('重置设置失败', 'error');
        }
      } catch (error) {
        console.error('重置设置失败:', error);
        showToast('重置设置失败', 'error');
      }
    }
  };

  return (
    <PageContainer>
      <WelcomeCard
        $isDarkMode={isDarkMode}
        $isGlassMode={isGlassMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle $isGlassMode={isGlassMode}>
            <SettingsIcon size={32} />
            系统设置
          </WelcomeTitle>
          <WelcomeSubtitle $isGlassMode={isGlassMode}>
            在这里您可以管理用户信息、系统行为和配置备份等设置。
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeCard>
      
      <ContentSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* 用户信息设置 */}
        <SettingsSection
          $isGlassMode={isGlassMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <SectionHeader>
            <SectionIcon $color="#3B82F6">
              <UserIcon size={24} />
            </SectionIcon>
            <div>
              <SectionTitle>用户信息</SectionTitle>
              <SectionDescription>管理您的个人资料和账户信息</SectionDescription>
            </div>
          </SectionHeader>
          
          <FormGrid>
            <FormGroup>
              <FormLabel $isGlassMode={isGlassMode}>头像</FormLabel>
              <AvatarContainer>
                <AvatarWrapper>
                  <Avatar>
                    {userAvatar ? (
                      <img src={userAvatar} alt="User avatar" />
                    ) : (
                      <UserIcon size={48} color={theme.iconColor.default} />
                    )}
                  </Avatar>
                  <AvatarUploadButton
                    $isGlassMode={isGlassMode}
                    onClick={handleAvatarUpload}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CameraIcon size={16} color="white" />
                  </AvatarUploadButton>
                </AvatarWrapper>
              </AvatarContainer>
            </FormGroup>

            <FormGroup>
              <FormLabel $isGlassMode={isGlassMode}>昵称</FormLabel>
              <FormInput
                value={userNickname}
                readOnly
                placeholder="您的昵称"
                $isGlassMode={isGlassMode}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel $isGlassMode={isGlassMode}>邮箱</FormLabel>
              <FormInput
                type="email"
                value={userEmail}
                readOnly
                placeholder="您的邮箱地址"
                $isGlassMode={isGlassMode}
              />
            </FormGroup>
          </FormGrid>
        </SettingsSection>

        {/* 系统行为设置 */}
        <SettingsSection
          $isGlassMode={isGlassMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <SectionHeader>
            <SectionIcon $color="#10B981">
              <MonitorIcon size={24} />
            </SectionIcon>
            <div>
              <SectionTitle>系统行为</SectionTitle>
              <SectionDescription>配置应用程序的运行行为和系统设置</SectionDescription>
            </div>
          </SectionHeader>
          
          <SwitchContainer $isGlassMode={isGlassMode}>
            <SwitchInfo>
              <SwitchLabel $isGlassMode={isGlassMode}>开机启动</SwitchLabel>
              <SwitchDescription $isGlassMode={isGlassMode}>
                应用程序将在系统启动时自动运行
              </SwitchDescription>
            </SwitchInfo>
            <Switch 
              $checked={startup}
              $isGlassMode={isGlassMode}
              onClick={() => setStartup(!startup)}
            />
          </SwitchContainer>

          <SwitchContainer $isGlassMode={isGlassMode}>
            <SwitchInfo>
              <SwitchLabel $isGlassMode={isGlassMode}>最小化到托盘</SwitchLabel>
              <SwitchDescription $isGlassMode={isGlassMode}>
                关闭窗口时将应用程序最小化到系统托盘
              </SwitchDescription>
            </SwitchInfo>
            <Switch 
              $checked={minimizeToTray}
              $isGlassMode={isGlassMode}
              onClick={() => setMinimizeToTray(!minimizeToTray)}
            />
          </SwitchContainer>

          <SwitchContainer $isGlassMode={isGlassMode}>
            <SwitchInfo>
              <SwitchLabel $isGlassMode={isGlassMode}>通知</SwitchLabel>
              <SwitchDescription $isGlassMode={isGlassMode}>
                启用应用程序的通知功能
              </SwitchDescription>
            </SwitchInfo>
            <Switch 
              $checked={notifications}
              $isGlassMode={isGlassMode}
              onClick={() => setNotifications(!notifications)}
            />
          </SwitchContainer>
        </SettingsSection>

        {/* 配置管理 */}
        <SettingsSection
          $isGlassMode={isGlassMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <SectionHeader>
            <SectionIcon $color="#8B5CF6">
              <DatabaseIcon size={24} />
            </SectionIcon>
            <div>
              <SectionTitle>配置管理</SectionTitle>
              <SectionDescription>备份、导入和导出应用程序配置</SectionDescription>
            </div>
          </SectionHeader>
          
          <ButtonGroup>
            <ActionButton
              onClick={exportConfig}
              $isGlassMode={isGlassMode}
            >
              <UploadIcon size={16} />
              导出配置
            </ActionButton>
            <ActionButton
              onClick={importConfig}
              $isGlassMode={isGlassMode}
            >
              <UploadIcon size={16} />
              导入配置
            </ActionButton>
            <ActionButton
              onClick={resetConfig}
              $variant="danger"
              $isGlassMode={isGlassMode}
            >
              <RefreshIcon size={16} />
              重置配置
            </ActionButton>
          </ButtonGroup>
        </SettingsSection>
      </ContentSection>

      {/* 保存栏 */}
      <SaveBar
        $isGlassMode={isGlassMode}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
        <ActionButton
          onClick={saveAllSettings}
          disabled={saveStatus === 'saving' || !hasUnsavedChanges}
          $variant="primary"
          $isGlassMode={isGlassMode}
        >
          <SaveIcon size={16} />
          {saveStatus === 'saving' ? '保存中...' : '保存'}
        </ActionButton>
      </SaveBar>

      {/* Toast 通知 */}
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