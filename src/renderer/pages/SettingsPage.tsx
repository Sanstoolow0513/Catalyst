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
import StatusIndicator from '../components/common/StatusIndicator';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useConfig } from '../contexts/ConfigContext';

// 页面容器 - 使用与其他页面一致的玻璃容器
const GlassPageContainer = styled.div<{ $isGlassMode?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${props => props.$isGlassMode 
    ? 'transparent' 
    : (props.theme?.background || '#F9FAFB')};
  color: ${props => props.theme?.textPrimary || '#111827'};
  padding: ${props => props.theme?.spacing?.xl || '32px'};
  position: relative;
  
  ${props => props.$isGlassMode && `
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(244, 114, 182, 0.04) 0%, transparent 50%),
        linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%);
      z-index: -2;
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 60% 40%, rgba(34, 197, 94, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.03) 0%, transparent 40%);
      z-index: -1;
      pointer-events: none;
      animation: ambient 20s ease-in-out infinite;
    }
  `}
  
  @keyframes ambient {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

// 欢迎卡片
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
  padding: 2rem;
  margin-bottom: 2rem;
  border: ${props => {
    if (props.$isGlassMode) {
      return '1px solid rgba(148, 163, 184, 0.15)';
    }
    return `1px solid ${props.theme.border}`;
  }};
  position: relative;
  overflow: hidden;
  min-height: 160px;
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
`;

const WelcomeTitle = styled.h1<{ $isGlassMode?: boolean }>`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

const WelcomeSubtitle = styled.p<{ $isGlassMode?: boolean }>`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

// 页面布局
const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
`;

// 设置区块
const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// 区块标题
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  background: ${props => props.theme?.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.1)'
  };
  color: ${props => props.theme?.primary?.main || '#2563EB'};
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme?.textPrimary || '#111827'};
  font-size: 1.5rem;
  font-weight: 600;
`;

const SectionDescription = styled.p`
  margin: 0;
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  font-size: 0.9rem;
  line-height: 1.5;
`;

// 设置卡片
const SettingsCard = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.15)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.2)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 16px;
  }
`;

// 表单网格
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

// 表单组
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 表单标签
const FormLabel = styled.label<{ $isGlassMode?: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 4px;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 2px rgba(0, 0, 0, 0.3)' 
    : 'none'};
`;

// 表单输入
const FormInput = styled.input<{ $isGlassMode?: boolean }>`
  padding: 12px 16px;
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.2)' 
    : `1px solid ${props.theme.border}`};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.1)' 
    : props.theme.input.background};
  color: ${props => props.theme.input.text};
  font-size: 0.9rem;
  transition: all ${props => props.theme.transition.normal} ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(10px)' : 'none'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
    box-shadow: ${props => props.$isGlassMode 
      ? '0 0 0 3px rgba(59, 130, 246, 0.2)' 
      : props.theme.button.shadowHover};
  }
  
  &::placeholder {
    color: ${props => props.theme.input.placeholder};
  }
  
  &:read-only {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.1)' 
      : props.theme.surfaceVariant};
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

// 开关容器
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
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 12px;
  transition: all ${props => props.theme.transition.normal} ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme.surface};
    border-color: ${props => props.theme.primary.main};
  }
`;

// 开关信息
const SwitchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SwitchLabel = styled.div<{ $isGlassMode?: boolean }>`
  font-weight: 500;
  color: ${props => props.theme.textPrimary};
  font-size: 0.95rem;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 2px rgba(0, 0, 0, 0.3)' 
    : 'none'};
`;

const SwitchDescription = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 2px rgba(0, 0, 0, 0.2)' 
    : 'none'};
`;

// 开关组件
const Switch = styled.div<{ $checked: boolean; $isGlassMode?: boolean }>`
  width: 48px;
  height: 24px;
  background: ${props => props.$checked 
    ? props.theme.primary.main 
    : (props.$isGlassMode ? 'rgba(148, 163, 184, 0.3)' : props.theme.borderLight)};
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

// 按钮组件
const ModernButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'outline' | 'danger'; $isGlassMode?: boolean }>`
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
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(10px)' : 'none'};
  
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
          background: ${props => props.$isGlassMode 
            ? 'rgba(30, 41, 59, 0.1)' 
            : props.theme.surface};
          color: ${props => props.theme.textPrimary};
          border-color: ${props => props.theme.border};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.$isGlassMode 
              ? 'rgba(51, 65, 85, 0.15)' 
              : props.theme.surfaceVariant};
            border-color: ${props => props.theme.primary.main};
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

// Toast 组件
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

// 保存栏
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
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.card.shadowHover};
  z-index: 1000;
  min-width: 280px;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
`;

const SaveStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  const { llmConfigs, activeConfig, refreshConfigs } = useConfig();
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
    <GlassPageContainer $isGlassMode={isGlassMode}>
      <WelcomeCard
        $isDarkMode={isDarkMode}
        $isGlassMode={isGlassMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle $isGlassMode={isGlassMode}>
            系统设置
            <SettingsIcon size={32} />
          </WelcomeTitle>
          <WelcomeSubtitle $isGlassMode={isGlassMode}>
            在这里您可以管理用户信息、系统行为和配置备份等设置。
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeCard>

      <PageLayout>
        {/* 用户信息设置 */}
        <SettingsSection>
          <SectionHeader>
            <SectionIcon>
              <UserIcon size={24} />
            </SectionIcon>
            <div>
              <SectionTitle>用户信息</SectionTitle>
              <SectionDescription>管理您的个人资料和账户信息</SectionDescription>
            </div>
          </SectionHeader>
          
          <SettingsCard
            $isGlassMode={isGlassMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <FormGrid>
              <FormGroup>
                <FormLabel $isGlassMode={isGlassMode}>头像</FormLabel>
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
          </SettingsCard>
        </SettingsSection>

        {/* 系统行为设置 */}
        <SettingsSection>
          <SectionHeader>
            <SectionIcon>
              <MonitorIcon size={24} />
            </SectionIcon>
            <div>
              <SectionTitle>系统行为</SectionTitle>
              <SectionDescription>配置应用程序的运行行为和系统设置</SectionDescription>
            </div>
          </SectionHeader>
          
          <SettingsCard
            $isGlassMode={isGlassMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
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
          </SettingsCard>
        </SettingsSection>

        {/* 配置管理 */}
        <SettingsSection>
          <SectionHeader>
            <SectionIcon>
              <DatabaseIcon size={24} />
            </SectionIcon>
            <div>
              <SectionTitle>配置管理</SectionTitle>
              <SectionDescription>备份、导入和导出应用程序配置</SectionDescription>
            </div>
          </SectionHeader>
          
          <SettingsCard
            $isGlassMode={isGlassMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ButtonGroup>
              <ModernButton
                onClick={exportConfig}
                $isGlassMode={isGlassMode}
              >
                <UploadIcon size={16} />
                导出配置
              </ModernButton>
              <ModernButton
                onClick={importConfig}
                $isGlassMode={isGlassMode}
              >
                <UploadIcon size={16} />
                导入配置
              </ModernButton>
              <ModernButton
                onClick={resetConfig}
                $variant="danger"
                $isGlassMode={isGlassMode}
              >
                <RefreshIcon size={16} />
                重置配置
              </ModernButton>
            </ButtonGroup>
          </SettingsCard>
        </SettingsSection>
      </PageLayout>

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
        <ModernButton
          onClick={saveAllSettings}
          disabled={saveStatus === 'saving' || !hasUnsavedChanges}
          $variant="primary"
          $isGlassMode={isGlassMode}
        >
          <SaveIcon size={16} />
          {saveStatus === 'saving' ? '保存中...' : '保存'}
        </ModernButton>
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
    </GlassPageContainer>
  );
};

export default SettingsPage;