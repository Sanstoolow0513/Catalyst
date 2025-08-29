import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Button,
  Card,
  PageContainer,
  ToastContainer,
  ToastComponent
} from '../components/common';
import StatusIndicator from '../components/common/StatusIndicator';
import AdvancedLLMConfig from '../components/AdvancedLLMConfig';
import { useConfig } from '../contexts/ConfigContext';
import { 
  LLM_PROVIDERS
} from '../data/llmProviders';


// 主要页面容器
const GlassPageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  padding: 20px;
  position: relative;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.textTertiary};
    }
  }
`;

// 顶部信息卡片
const ConfigWelcomeCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;


// 欢迎标题样式
const WelcomeTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.textPrimary};
`;

const WelcomeSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

// 区块标题
const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.textPrimary};
`;

const SectionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.sm};
  border-bottom: 1px solid ${props => props.theme.borderLight};
`;

// 设置区块
const SettingsSection = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// 统一保存栏
const SaveBar = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.2s ease;
  min-width: 280px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
`;

// 保存状态指示器容器
const SaveStatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;


// LLM配置项
const LlmConfigItem = styled.div<{ $isActive: boolean }>`
  background: ${props => props.$isActive ? props.theme.primary.light + '10' : props.theme.surface};
  border: 2px solid ${props => props.$isActive ? props.theme.primary.main : props.theme.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$isActive ? props.theme.primary.light + '15' : props.theme.surfaceVariant};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// // LLM配置表单
// const LlmConfigForm = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//   gap: ${props => props.theme.spacing.md};
//   margin-bottom: ${props => props.theme.spacing.md};
// `;

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

// // 新增配置表单
// const NewConfigForm = styled.div`
//   background: ${props => props.theme.surface};
//   border: 2px dashed ${props => props.theme.border};
//   border-radius: 8px;
//   padding: 24px;
//   margin-bottom: 24px;
  
//   &:hover {
//     background: ${props => props.theme.surfaceVariant};
//   }
// `;

// // 参数配置表单
// const ParamsConfigForm = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//   gap: ${props => props.theme.spacing.md};
//   margin-bottom: ${props => props.theme.spacing.md};
// `;

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  exiting?: boolean;
}

const LLMConfigPage: React.FC = () => {
  const { theme, themeMode } = useTheme();
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // 全局浮窗提醒
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastId, setToastId] = useState(0);


  // const updateLlmConfig = async (id: string, updates: Partial<ILLMConfig>) => {
//   try {
//     await updateConfig(id, updates);
//   } catch (error) {
//     console.error('更新配置失败:', error);
//     showToast('更新配置失败', 'error');
//   }
// };

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
  }, [llmConfigs]);

  return (
    <PageContainer>
      <GlassPageContainer>
      {/* 顶部信息卡片 */}
      <ConfigWelcomeCard>
        <WelcomeContent>
          <WelcomeTitle>
            语言模型配置
          </WelcomeTitle>
          <WelcomeSubtitle $isGlassMode={isGlassMode}>
            管理您的AI模型配置，添加、编辑和删除不同的LLM提供商设置，让Catalyst更好地为您服务。
          </WelcomeSubtitle>
        </WelcomeContent>
      </ConfigWelcomeCard>

      {/* 配置内容区域 */}
      <div>
            <SettingsSection>
              <SectionHeader>
                <div>
                  <SectionTitle>语言模型配置</SectionTitle>
                  <SectionDescription>
                    管理多个语言模型配置，可添加、编辑和删除不同的配置
                  </SectionDescription>
                </div>
              </SectionHeader>

              {/* 新增配置表单 */}
              {showAddForm && (
                <AdvancedLLMConfig
                  onSave={async (config) => {
                    try {
                      await addConfig(config);
                      setShowAddForm(false);
                      showToast('配置已添加', 'success');
                    } catch (error) {
                      console.error('添加配置失败:', error);
                      showToast('添加配置失败', 'error');
                    }
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
              
              {!showAddForm && (
                <Button 
                  onClick={() => setShowAddForm(true)} 
                  variant="outline"
                  style={{ marginBottom: '1rem' }}
                >
                  添加新配置
                </Button>
              )}

              {/* 现有配置列表 */}
              {llmConfigs.map((config) => (
                <LlmConfigItem key={config.id} $isActive={config.isActive}>
                  <ConfigHeader>
                    <ConfigName>
                      {config.isActive && <span style={{ color: theme.primary.main }}>●</span>}
                      {config.name}
                      <span style={{ fontSize: '0.85rem', color: theme.textSecondary, fontWeight: 'normal' }}>
                        ({config.provider} - {config.model})
                      </span>
                    </ConfigName>
                    
                    <ConfigActions>
                      {!config.isActive && (
                        <Button
                          onClick={() => setActiveLlmConfig(config.id)}
                          variant="outline"
                          size="small"
                        >
                          设为激活
                        </Button>
                      )}
                      <Button
                        onClick={() => setEditingConfig(editingConfig === config.id ? null : config.id)}
                        variant="outline"
                        size="small"
                      >
                        {editingConfig === config.id ? '取消' : '编辑'}
                      </Button>
                      {llmConfigs.length > 1 && (
                        <Button
                          onClick={() => deleteLlmConfig(config.id)}
                          variant="danger"
                          size="small"
                        >
                          删除
                        </Button>
                      )}
                    </ConfigActions>
                  </ConfigHeader>

                  {/* 编辑表单 */}
                  {editingConfig === config.id && (
                    <AdvancedLLMConfig
                      initialConfig={config}
                      onSave={async (updatedConfig) => {
                        try {
                          await updateConfig(config.id, updatedConfig);
                          setEditingConfig(null);
                          showToast('配置已更新', 'success');
                        } catch (error) {
                          console.error('更新配置失败:', error);
                          showToast('更新配置失败', 'error');
                        }
                      }}
                      onCancel={() => setEditingConfig(null)}
                    />
                  )}
                </LlmConfigItem>
              ))}

              {llmConfigs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: theme.textSecondary }}>
                  <p>暂无 LLM 配置，请添加一个配置开始使用</p>
                </div>
              )}
            </SettingsSection>

            {/* 提供商信息 */}
            <SettingsSection>
              <SectionHeader>
                <div>
                  <SectionTitle>支持的提供商</SectionTitle>
                  <SectionDescription>
                    目前支持 {LLM_PROVIDERS.length} 个主流 LLM 提供商
                  </SectionDescription>
                </div>
              </SectionHeader>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {LLM_PROVIDERS.map((provider) => (
                  <Card 
                    key={provider.id} 
                    $padding="medium" 
                    $borderRadius="medium"
                    $variant={isGlassMode ? 'glass' : 'elevated'}
                    $glassIntensity="light"
                  >
                    <h4 style={{ margin: '0 0 0.5rem 0', color: theme.textPrimary, fontSize: '1rem' }}>
                      {provider.name}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: theme.textSecondary, fontSize: '0.875rem' }}>
                      {provider.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {provider.features.streaming && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: theme.success.main,
                          background: theme.success.light + '20',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          流式
                        </span>
                      )}
                      {provider.features.vision && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: theme.warning.main,
                          background: theme.warning.light + '20',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          视觉
                        </span>
                      )}
                      {provider.features.thinking && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: theme.info.main,
                          background: theme.info.light + '20',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          思考
                        </span>
                      )}
                      {provider.models.length > 0 && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: theme.textSecondary,
                          background: theme.border + '20',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          {provider.models.length} 模型
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </SettingsSection>
        </div>
      
      {/* 统一保存栏 */}
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
    </PageContainer>
  );
};

export default LLMConfigPage;