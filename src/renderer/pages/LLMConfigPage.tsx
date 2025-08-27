import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Button, 
  Input, 
  Label, 
  Select, 
  SelectWrapper, 
  FormGroup,
  PageContainer,
    ToastContainer,
  ToastComponent,
  Card
} from '../components/common';
import StatusIndicator from '../components/common/StatusIndicator';
import { 
  Settings as SettingsIcon,
  MessageSquare as MessageIcon,
  Plus as PlusIcon,
  Trash2 as DeleteIcon,
  Edit as EditIcon,
  Radio as RadioIcon,
  Save as SaveIcon
} from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { ILLMConfig } from '../utils/configManager';


// 主要页面容器 - 复用HomePage的样式
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
  padding-bottom: 100px; /* 为固定保存栏留出足够空间 */
  position: relative;
  min-height: 0; /* 确保flex容器正确收缩 */
  
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
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.$isGlassMode ? 'rgba(51, 65, 85, 0.2)' : 'transparent'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isGlassMode ? 'rgba(148, 163, 184, 0.3)' : (props.theme?.border || '#E5E7EB')};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.$isGlassMode ? 'rgba(203, 213, 225, 0.5)' : (props.theme?.textTertiary || '#9CA3AF')};
    }
  }
`;

// 顶部信息卡片 - 复用HomePage的WelcomeCard样式
const ConfigWelcomeCard = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => {
    if (props.$isGlassMode) {
      return 'linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)';
    }
    return 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
  }};
  border-radius: 20px;
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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
      return 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)';
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


// 欢迎标题样式
const WelcomeTitle = styled.h1<{ $isGlassMode?: boolean }>`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)' 
    : 'none'};
`;

const WelcomeSubtitle = styled.p<{ $isGlassMode?: boolean }>`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)' 
    : 'none'};
`;

// 区块标题
const SectionTitle = styled.h3<{ $isGlassMode?: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.textPrimary};
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15)' 
    : 'none'};
`;

const SectionDescription = styled.p<{ $isGlassMode?: boolean }>`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 500;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 4px rgba(0, 0, 0, 0.2)' 
    : 'none'};
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

// 设置区块
const SettingsSection = styled(motion.div)<{ $variant?: 'default' | 'primary' | 'accent' | 'important'; $isGlassMode?: boolean }>`
  background: ${props => {
    if (props.$isGlassMode) {
      return 'rgba(30, 41, 59, 0.08)';
    }
    switch (props.$variant) {
      case 'primary': return props.theme.cardLayer.primary;
      case 'accent': return props.theme.cardLayer.accent;
      case 'important': return props.theme.primary.light + '10';
      default: return props.theme.surface;
    }
  }};
  border: ${props => {
    if (props.$isGlassMode) {
      return '1px solid rgba(148, 163, 184, 0.15)';
    }
    switch (props.$variant) {
      case 'primary': return `1px solid ${props.theme.primary.light}`;
      case 'accent': return `1px solid ${props.theme.warning.light}`;
      case 'important': return `2px solid ${props.theme.primary.main}`;
      default: return `1px solid ${props.theme.border}`;
    }
  }};
  border-radius: ${props => props.$isGlassMode ? '20px' : props.theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${props => {
    if (props.$isGlassMode) {
      return '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)';
    }
    switch (props.$variant) {
      case 'important': return props.theme.shadow.xl;
      default: return props.theme.shadow.card;
    }
  }};
  position: relative;
  z-index: 1;
  transition: all ${props => props.theme.transition.normal} ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.$isGlassMode 
      ? 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(167, 139, 250, 0.05) 30%, transparent 60%)' 
      : 'none'};
    animation: float 12s ease-in-out infinite;
    pointer-events: none;
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
    border-radius: ${props => props.$isGlassMode ? '20px' : props.theme.borderRadius.medium};
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  &:hover {
    box-shadow: ${props => {
      if (props.$isGlassMode) {
        return '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)';
      }
      switch (props.$variant) {
        case 'important': return '0 8px 32px rgba(0, 0, 0, 0.2)';
        default: return props.theme.shadow.cardHover;
      }
    }};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

// 统一保存栏
const SaveBar = styled.div<{ $isGlassMode?: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.$isGlassMode ? 'rgba(30, 41, 59, 0.8)' : props.theme.surface};
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'blur(10px)'};
  border: ${props => props.$isGlassMode ? '1px solid rgba(148, 163, 184, 0.3)' : `1px solid ${props.theme.border}`};
  padding: 8px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-radius: ${props => props.$isGlassMode ? '20px' : props.theme.borderRadius.large};
  box-shadow: ${props => props.$isGlassMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
    : props.theme.shadow.cardHover};
  z-index: 1000;
  transition: all ${props => props.theme.transition.normal} ease;
  min-width: 280px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)' 
      : '0 8px 32px rgba(0, 0, 0, 0.2)'};
  }
`;

// 保存状态指示器容器
const SaveStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;


// LLM配置项
const LlmConfigItem = styled.div<{ $isActive: boolean; $isGlassMode?: boolean }>`
  background: ${props => {
    if (props.$isGlassMode) {
      return props.$isActive ? 'rgba(96, 165, 250, 0.15)' : 'rgba(30, 41, 59, 0.08)';
    }
    return props.$isActive ? props.theme.primary.light + '10' : props.theme.surface;
  }};
  border: ${props => {
    if (props.$isGlassMode) {
      return props.$isActive ? '1px solid rgba(96, 165, 250, 0.4)' : '1px solid rgba(148, 163, 184, 0.15)';
    }
    return `2px solid ${props.$isActive ? props.theme.primary.main : props.theme.border}`;
  }};
  border-radius: ${props => props.$isGlassMode ? '16px' : props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  transition: all ${props => props.theme.transition.normal} ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
    pointer-events: none;
    border-radius: ${props => props.$isGlassMode ? '16px' : props.theme.borderRadius.medium};
  }
  
  &:hover {
    background: ${props => {
      if (props.$isGlassMode) {
        return props.$isActive ? 'rgba(96, 165, 250, 0.2)' : 'rgba(51, 65, 85, 0.12)';
      }
      return props.$isActive ? props.theme.primary.light + '15' : props.theme.surfaceVariant;
    }};
    box-shadow: ${props => props.$isGlassMode 
      ? '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  }
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
const NewConfigForm = styled.div<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode ? 'rgba(30, 41, 59, 0.08)' : props.theme.surface};
  border: ${props => props.$isGlassMode ? '1px dashed rgba(148, 163, 184, 0.3)' : `2px dashed ${props.theme.border}`};
  border-radius: ${props => props.$isGlassMode ? '16px' : props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
    pointer-events: none;
    border-radius: ${props => props.$isGlassMode ? '16px' : props.theme.borderRadius.medium};
  }
  
  &:hover {
    background: ${props => props.$isGlassMode ? 'rgba(51, 65, 85, 0.12)' : props.theme.surfaceVariant};
  }
`;

// 参数配置表单
const ParamsConfigForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

const LLMConfigPage: React.FC = () => {
  const { themeMode } = useTheme();
  const { 
    llmConfigs, 
    addConfig, 
    updateConfig, 
    deleteConfig, 
    setActiveConfig, 
    refreshConfigs 
  } = useConfig();
  
  const isGlassMode = themeMode.includes('Glass');
  
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [newConfig, setNewConfig] = useState({
    name: '',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    systemPrompt: 'You are a helpful assistant.'
  });
  
  // 统一保存状态
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // 全局浮窗提醒
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastId, setToastId] = useState(0);

  const addLlmConfig = async () => {
    if (!newConfig.name.trim()) {
      showToast('请输入配置名称', 'error');
      return;
    }
    
    try {
      await addConfig(newConfig);
      
      setNewConfig({
        name: '',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        apiKey: '',
        baseUrl: 'https://api.openai.com/v1',
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1,
        systemPrompt: 'You are a helpful assistant.'
      });
      showToast('配置已添加', 'success');
    } catch (error) {
      console.error('添加配置失败:', error);
      showToast('添加配置失败', 'error');
    }
  };

  const updateLlmConfig = async (id: string, updates: Partial<ILLMConfig>) => {
    try {
      await updateConfig(id, updates);
    } catch (error) {
      console.error('更新配置失败:', error);
      showToast('更新配置失败', 'error');
    }
  };

  const deleteLlmConfig = async (id: string) => {
    try {
      await deleteConfig(id);
      showToast('配置已删除', 'success');
    } catch (error) {
      console.error('删除配置失败:', error);
      showToast('删除配置失败', 'error');
    }
  };

  const setActiveLlmConfig = async (id: string) => {
    try {
      await setActiveConfig(id);
      showToast('已切换配置', 'success');
    } catch (error) {
      console.error('切换配置失败:', error);
      showToast('切换配置失败', 'error');
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
      // 通过配置管理器保存所有设置
      await refreshConfigs();
      
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      showToast('配置已保存', 'success');
      
      // 3秒后恢复到idle状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('保存配置失败:', error);
      setSaveStatus('error');
      showToast('保存配置失败', 'error');
      
      // 3秒后恢复到idle状态
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  // 监听变化以标记未保存状态
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [llmConfigs, newConfig]);

  return (
    <GlassPageContainer $isGlassMode={isGlassMode}>
      {/* 顶部信息卡片 */}
      <ConfigWelcomeCard
        $isGlassMode={isGlassMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle $isGlassMode={isGlassMode}>
            语言模型配置
            <MessageIcon size={32} />
          </WelcomeTitle>
          <WelcomeSubtitle $isGlassMode={isGlassMode}>
            管理您的AI模型配置，添加、编辑和删除不同的LLM提供商设置，让Catalyst更好地为您服务。
          </WelcomeSubtitle>
        </WelcomeContent>
      </ConfigWelcomeCard>

      {/* 配置内容区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
            <SettingsSection 
              $variant="accent"
              $isGlassMode={isGlassMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <SectionHeader $variant="accent">
                <MessageIcon size={20} />
                <div>
                  <SectionTitle $isGlassMode={isGlassMode}>语言模型配置</SectionTitle>
                  <SectionDescription $isGlassMode={isGlassMode}>
                    管理多个语言模型配置，可添加、编辑和删除不同的配置
                  </SectionDescription>
                </div>
              </SectionHeader>

              {/* 新增配置表单 */}
              <NewConfigForm $isGlassMode={isGlassMode}>
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

                <ParamsConfigForm>
                  <FormGroup>
                    <Label>Temperature: {newConfig.temperature}</Label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={newConfig.temperature}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      style={{
                        width: '100%',
                        marginBottom: '8px',
                        accentColor: 'var(--primary-main)'
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Max Tokens: {newConfig.maxTokens}</Label>
                    <input
                      type="range"
                      min="1"
                      max="8192"
                      step="1"
                      value={newConfig.maxTokens}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        marginBottom: '8px',
                        accentColor: 'var(--primary-main)'
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Top P: {newConfig.topP}</Label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={newConfig.topP}
                      onChange={(e) => setNewConfig(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                      style={{
                        width: '100%',
                        marginBottom: '8px',
                        accentColor: 'var(--primary-main)'
                      }}
                    />
                  </FormGroup>
                </ParamsConfigForm>

                <FormGroup>
                  <Label>系统提示词</Label>
                  <Input
                    value={newConfig.systemPrompt}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    placeholder="输入系统提示词，例如：你是一个乐于助人的助手"
                    style={{ width: '100%' }}
                  />
                </FormGroup>

                <Button onClick={addLlmConfig} variant="primary" startIcon={<PlusIcon size={16} />}>
                  添加配置
                </Button>
              </NewConfigForm>

              {/* 现有配置列表 */}
              {llmConfigs.map((config) => (
                <LlmConfigItem key={config.id} $isActive={config.isActive} $isGlassMode={isGlassMode}>
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
                          onClick={() => setActiveLlmConfig(config.id)}
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
                    <div>
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

                      <ParamsConfigForm>
                        <FormGroup>
                          <Label>Temperature: {config.temperature}</Label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={config.temperature}
                            onChange={(e) => updateLlmConfig(config.id, { temperature: parseFloat(e.target.value) })}
                            style={{
                              width: '100%',
                              marginBottom: '8px',
                              accentColor: 'var(--primary-main)'
                            }}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Max Tokens: {config.maxTokens}</Label>
                          <input
                            type="range"
                            min="1"
                            max="8192"
                            step="1"
                            value={config.maxTokens}
                            onChange={(e) => updateLlmConfig(config.id, { maxTokens: parseInt(e.target.value) })}
                            style={{
                              width: '100%',
                              marginBottom: '8px',
                              accentColor: 'var(--primary-main)'
                            }}
                          />
                        </FormGroup>

                        <FormGroup>
                          <Label>Top P: {config.topP}</Label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={config.topP}
                            onChange={(e) => updateLlmConfig(config.id, { topP: parseFloat(e.target.value) })}
                            style={{
                              width: '100%',
                              marginBottom: '8px',
                              accentColor: 'var(--primary-main)'
                            }}
                          />
                        </FormGroup>
                      </ParamsConfigForm>

                      <FormGroup>
                        <Label>系统提示词</Label>
                        <Input
                          value={config.systemPrompt}
                          onChange={(e) => updateLlmConfig(config.id, { systemPrompt: e.target.value })}
                          placeholder="系统提示词"
                          style={{ width: '100%' }}
                        />
                      </FormGroup>
                    </div>
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

            {/* 提供商信息 */}
            <SettingsSection 
              $variant="primary"
              $isGlassMode={isGlassMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <SectionHeader $variant="primary">
                <SettingsIcon size={20} />
                <div>
                  <SectionTitle $isGlassMode={isGlassMode}>提供商信息</SectionTitle>
                  <SectionDescription $isGlassMode={isGlassMode}>
                    常见 LLM 提供商的配置信息
                  </SectionDescription>
                </div>
              </SectionHeader>

              <Card $padding="medium" $borderRadius="medium">
                <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>常见提供商的 Base URL:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                  <li style={{ marginBottom: '8px' }}><strong>OpenAI:</strong> https://api.openai.com/v1</li>
                  <li style={{ marginBottom: '8px' }}><strong>Gemini:</strong> https://generativelanguage.googleapis.com/v1beta</li>
                  <li style={{ marginBottom: '8px' }}><strong>OpenRouter:</strong> https://openrouter.ai/api/v1</li>
                </ul>
              </Card>
            </SettingsSection>
        </motion.div>
      
      {/* 统一保存栏 */}
      <SaveBar $isGlassMode={isGlassMode}>
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
    </GlassPageContainer>
  );
};

export default LLMConfigPage;