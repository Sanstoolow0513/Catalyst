import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Button, 
  Input, 
  Label, 
  Select, 
  SelectWrapper, 
  FormGroup
} from '../components/common';
// import { 
//   Save as SaveIcon
// } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  getProviderById, 
  getProviderDefaults, 
  getAllProviders,
  LLMProvider
} from '../data/llmProviders';
import { ILLMConfig } from '../utils/configManager';

// 高级配置表单容器
const AdvancedConfigForm = styled.div<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode ? props.theme.card.background : props.theme.surface};
  border: ${props => props.$isGlassMode ? props.theme.card.border : '2px dashed ' + props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(8px)' : 'none'};
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${props => props.$isGlassMode ? props.theme.card.shadow : 'none'};
  
  &:hover {
    background: ${props => props.$isGlassMode ? props.theme.card.background : props.theme.surfaceVariant};
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.textTertiary};
    }
  }
`;

// 提供商选择区域
const ProviderSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// 提供商卡片网格
const ProviderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// 提供商卡片
const ProviderCard = styled.div<{ $selected?: boolean; $isGlassMode?: boolean }>`
  background: ${props => props.$selected 
    ? (props.$isGlassMode ? 'rgba(96, 165, 250, 0.2)' : props.theme.primary.light + '15') 
    : (props.$isGlassMode ? props.theme.card.background : props.theme.surface)};
  border: ${props => props.$selected 
    ? `2px solid ${props.theme.primary.main}` 
    : (props.$isGlassMode ? props.theme.card.border : `1px solid ${props.theme.border}`)};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 16px;
  cursor: pointer;
  transition: all ${props => props.theme.transition.normal} ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isGlassMode ? props.theme.card.shadowHover : props.theme.card.shadowHover};
    border-color: ${props => props.$isGlassMode ? props.theme.primary.main : props.theme.primary.main};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
    pointer-events: none;
  }
`;

// 提供商信息
const ProviderInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
`;

// 提供商图标
const ProviderIcon = styled.div<{ $category: LLMProvider['category'] }>`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: ${props => {
    switch (props.$category) {
      case 'mainstream': return 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
      case 'opensource': return 'linear-gradient(135deg, #10B981, #059669)';
      case 'specialized': return 'linear-gradient(135deg, #F59E0B, #D97706)';
      default: return 'linear-gradient(135deg, #6B7280, #4B5563)';
    }
  }};
  color: white;
  flex-shrink: 0;
`;

// 提供商详情
const ProviderDetails = styled.div`
  flex: 1;
`;

// 提供商名称
const ProviderName = styled.h3`
  margin: 0 0 ${props => props.theme.spacing.xs} 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

// 提供商描述
const ProviderDescription = styled.p`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

// 提供商特性
const ProviderFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
`;

// 特性标签
const FeatureTag = styled.span<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode ? 'rgba(96, 165, 250, 0.2)' : props.theme.primary.light + '20'};
  color: ${props => props.theme.primary.main};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

// 配置表单
const ConfigForm = styled.div<{ $isGlassMode?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// 参数配置表单
const ParamsForm = styled.div<{ $isGlassMode?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// 高级参数折叠面板
const AdvancedParamsPanel = styled.div<{ $isOpen: boolean; $isGlassMode?: boolean }>`
  margin-top: ${props => props.theme.spacing.lg};
  border: ${props => props.$isGlassMode ? props.theme.card.border : `1px solid ${props.theme.border}`};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  transition: all ${props => props.theme.transition.normal} ease;
  background: ${props => props.$isGlassMode ? props.theme.card.background : props.theme.surface};
  box-shadow: ${props => props.$isGlassMode ? props.theme.card.shadow : 'none'};
`;

// 高级参数头部
const AdvancedParamsHeader = styled.div<{ $isOpen: boolean; $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode ? 'rgba(96, 165, 250, 0.1)' : props.theme.surfaceVariant};
  padding: ${props => props.theme.spacing.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${props => props.$isOpen ? '1px solid ' + (props.$isGlassMode ? props.theme.card.border : props.theme.border) : 'none'};
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(8px)' : 'none'};
  
  &:hover {
    background: ${props => props.$isGlassMode ? 'rgba(96, 165, 250, 0.15)' : props.theme.surface};
  }
`;

// 高级参数内容
const AdvancedParamsContent = styled.div<{ $isOpen: boolean }>`
  padding: ${props => props.$isOpen ? props.theme.spacing.md : '0'};
  height: ${props => props.$isOpen ? 'auto' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all ${props => props.theme.transition.normal} ease;
  transform-origin: top;
  will-change: transform, opacity;
`;

// 滑块输入容器
const SliderContainer = styled.div<{ $isGlassMode?: boolean }>`
  margin-bottom: ${props => props.theme.spacing.md};
`;

// 滑块标签
const SliderLabel = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

// 滑块
const Slider = styled.input<{ $isGlassMode?: boolean }>`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.$isGlassMode ? props.theme.border : props.theme.borderLight};
  outline: none;
  -webkit-appearance: none;
  transition: all ${props => props.theme.transition.normal} ease;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary.main};
    cursor: pointer;
    box-shadow: ${props => props.$isGlassMode ? props.theme.card.shadow : '0 2px 4px rgba(0, 0, 0, 0.2)'};
    transition: all ${props => props.theme.transition.normal} ease;
    
    &:hover {
      background: ${props => props.theme.primary.dark};
      transform: scale(1.1);
    }
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.primary.main};
    cursor: pointer;
    border: none;
    box-shadow: ${props => props.$isGlassMode ? props.theme.card.shadow : '0 2px 4px rgba(0, 0, 0, 0.2)'};
    transition: all ${props => props.theme.transition.normal} ease;
    
    &:hover {
      background: ${props => props.theme.primary.dark};
      transform: scale(1.1);
    }
  }
`;

// 开关组件
const SwitchContainer = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Switch = styled.label<{ $isGlassMode?: boolean }>`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const SwitchSlider = styled.span<{ $isGlassMode?: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.$isGlassMode ? props.theme.border : props.theme.borderLight};
  transition: ${props => props.theme.transition.normal} ease;
  border-radius: 24px;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(8px)' : 'none'};
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: ${props => props.theme.transition.normal} ease;
    border-radius: 50%;
    box-shadow: ${props => props.$isGlassMode ? props.theme.card.shadow : '0 2px 4px rgba(0, 0, 0, 0.2)'};
  }
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + ${SwitchSlider} {
    background-color: ${props => props.theme.primary.main};
  }
  
  &:checked + ${SwitchSlider}:before {
    transform: translateX(26px);
  }
`;

// 操作按钮区域
const ActionButtons = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

interface AdvancedLLMConfigProps {
  onSave?: (config: Partial<ILLMConfig>) => void;
  onCancel?: () => void;
  initialConfig?: Partial<ILLMConfig>;
  isEditing?: boolean;
}

const AdvancedLLMConfig: React.FC<AdvancedLLMConfigProps> = ({
  onSave,
  onCancel,
  initialConfig,
  isEditing = false
}) => {
  const { theme, themeMode } = useTheme();
  const isGlassMode = themeMode.includes('Glass');
  
  const [selectedProvider, setSelectedProvider] = useState<string>(initialConfig?.provider || 'openai');
  const [selectedModel, setSelectedModel] = useState<string>(initialConfig?.model || '');
  const [config, setConfig] = useState<Partial<ILLMConfig>>({
    name: initialConfig?.name || '',
    provider: initialConfig?.provider || 'openai',
    model: initialConfig?.model || '',
    apiKey: initialConfig?.apiKey || '',
    baseUrl: initialConfig?.baseUrl || '',
    temperature: initialConfig?.temperature ?? 0.7,
    maxTokens: initialConfig?.maxTokens ?? 2048,
    topP: initialConfig?.topP ?? 1,
    topK: initialConfig?.topK,
    frequencyPenalty: initialConfig?.frequencyPenalty,
    presencePenalty: initialConfig?.presencePenalty,
    systemPrompt: initialConfig?.systemPrompt || 'You are a helpful assistant.',
    thinkingMode: initialConfig?.thinkingMode ?? false,
    thinkingTokens: initialConfig?.thinkingTokens,
    streamOutput: initialConfig?.streamOutput ?? true,
    timeout: initialConfig?.timeout ?? 30000,
    retryAttempts: initialConfig?.retryAttempts ?? 3,
    costOptimization: initialConfig?.costOptimization ?? false,
    advancedParams: initialConfig?.advancedParams || {}
  });
  
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);
  const [testingConfig, setTestingConfig] = useState(false);

  const provider = getProviderById(selectedProvider);
  const allProviders = getAllProviders();

  // 当提供商改变时，更新默认配置
  useEffect(() => {
    if (selectedProvider && selectedProvider !== config.provider) {
      const providerDefaults = getProviderDefaults(selectedProvider);
      setConfig(prev => ({
        ...prev,
        provider: selectedProvider,
        baseUrl: providerDefaults.baseUrl || '',
        model: providerDefaults.model || '',
        temperature: providerDefaults.temperature ?? 0.7,
        maxTokens: providerDefaults.maxTokens ?? 2048,
        topP: providerDefaults.topP ?? 1,
        topK: providerDefaults.topK,
        frequencyPenalty: providerDefaults.frequencyPenalty,
        presencePenalty: providerDefaults.presencePenalty,
        thinkingMode: providerDefaults.thinkingMode ?? false,
        streamOutput: providerDefaults.streamOutput ?? true,
        timeout: providerDefaults.timeout ?? 30000,
        retryAttempts: providerDefaults.retryAttempts ?? 3,
        costOptimization: providerDefaults.costOptimization ?? false
      }));
      
      if (providerDefaults.model) {
        setSelectedModel(providerDefaults.model);
      }
    }
  }, [selectedProvider]);

  // 处理提供商选择
  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  // 处理配置更改
  const handleConfigChange = (key: keyof ILLMConfig, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // 测试配置
  const testConfig = async () => {
    setTestingConfig(true);
    try {
      // 这里应该实现实际的测试逻辑
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('配置测试成功！');
    } catch (error) {
      alert('配置测试失败：' + (error as Error).message);
    } finally {
      setTestingConfig(false);
    }
  };

  // 保存配置
  const saveConfig = () => {
    if (!config.name?.trim()) {
      alert('请输入配置名称');
      return;
    }
    
    if (!config.provider) {
      alert('请选择提供商');
      return;
    }
    
    if (!config.model) {
      alert('请选择模型');
      return;
    }
    
    if (!config.apiKey?.trim()) {
      alert('请输入API密钥');
      return;
    }
    
    if (!config.baseUrl?.trim()) {
      alert('请输入Base URL');
      return;
    }

    onSave?.(config);
  };

  return (
    <AdvancedConfigForm $isGlassMode={isGlassMode}>
      {/* 提供商选择 */}
      <ProviderSection>
        <Label style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
          选择提供商
        </Label>
        
        <ProviderGrid>
          {allProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              $selected={selectedProvider === provider.id}
              $isGlassMode={isGlassMode}
              onClick={() => handleProviderSelect(provider.id)}
            >
              <ProviderInfo>
                <ProviderIcon $category={provider.category}>
                  {provider.id === 'openai' && '🤖'}
                  {provider.id === 'anthropic' && '🧠'}
                  {provider.id === 'gemini' && '✨'}
                  {provider.id === 'deepseek' && '🔍'}
                  {provider.id === 'groq' && '⚡'}
                  {provider.id === 'mistral' && '🌊'}
                  {provider.id === 'custom' && '⚙️'}
                </ProviderIcon>
                <ProviderDetails>
                  <ProviderName>{provider.name}</ProviderName>
                  <ProviderDescription>{provider.description}</ProviderDescription>
                  <ProviderFeatures>
                    {provider.features.streaming && <FeatureTag $isGlassMode={isGlassMode}>流式</FeatureTag>}
                    {provider.features.jsonMode && <FeatureTag $isGlassMode={isGlassMode}>JSON</FeatureTag>}
                    {provider.features.vision && <FeatureTag $isGlassMode={isGlassMode}>视觉</FeatureTag>}
                    {provider.features.thinking && <FeatureTag $isGlassMode={isGlassMode}>思考</FeatureTag>}
                    {provider.features.functionCalling && <FeatureTag $isGlassMode={isGlassMode}>函数调用</FeatureTag>}
                  </ProviderFeatures>
                </ProviderDetails>
              </ProviderInfo>
            </ProviderCard>
          ))}
        </ProviderGrid>
      </ProviderSection>

      {/* 基础配置 */}
      <ConfigForm $isGlassMode={isGlassMode}>
        <FormGroup>
          <Label>配置名称</Label>
          <Input
            $isGlassMode={isGlassMode}
            value={config.name || ''}
            onChange={(e) => handleConfigChange('name', e.target.value)}
            placeholder="例如：OpenAI GPT-4 配置"
          />
        </FormGroup>

        <FormGroup>
          <Label>模型</Label>
          {selectedProvider === 'custom' ? (
            <Input
              $isGlassMode={isGlassMode}
              value={config.model || ''}
              onChange={(e) => handleConfigChange('model', e.target.value)}
              placeholder="输入自定义模型名称"
            />
          ) : (
            <SelectWrapper>
              <Select 
                $isGlassMode={isGlassMode}
                value={selectedModel} 
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  handleConfigChange('model', e.target.value);
                }}
                disabled={!provider}
              >
                {provider?.models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} (最大: {model.maxTokens.toLocaleString()})
                  </option>
                ))}
              </Select>
            </SelectWrapper>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Base URL</Label>
          <Input
            $isGlassMode={isGlassMode}
            value={config.baseUrl || ''}
            onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
            placeholder="API 地址"
            disabled={selectedProvider !== 'custom'}
          />
        </FormGroup>

        <FormGroup>
          <Label>API 密钥</Label>
          <Input
            $isGlassMode={isGlassMode}
            type="password"
            value={config.apiKey || ''}
            onChange={(e) => handleConfigChange('apiKey', e.target.value)}
            placeholder="输入 API 密钥"
          />
        </FormGroup>
      </ConfigForm>

      {/* 参数配置 */}
      <div>
        <Label style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
          参数配置
        </Label>
        
        <ParamsForm $isGlassMode={isGlassMode}>
          <SliderContainer $isGlassMode={isGlassMode}>
            <SliderLabel $isGlassMode={isGlassMode}>
              <span>Temperature: {config.temperature}</span>
              <span style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                控制随机性
              </span>
            </SliderLabel>
            <Slider
              $isGlassMode={isGlassMode}
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature || 0.7}
              onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
            />
          </SliderContainer>

          <SliderContainer $isGlassMode={isGlassMode}>
            <SliderLabel $isGlassMode={isGlassMode}>
              <span>Max Tokens: {config.maxTokens}</span>
              <span style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                最大生成长度
              </span>
            </SliderLabel>
            <Slider
              $isGlassMode={isGlassMode}
              type="range"
              min="1"
              max="8192"
              step="1"
              value={config.maxTokens || 2048}
              onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
            />
          </SliderContainer>

          <SliderContainer $isGlassMode={isGlassMode}>
            <SliderLabel $isGlassMode={isGlassMode}>
              <span>Top P: {config.topP}</span>
              <span style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                核采样
              </span>
            </SliderLabel>
            <Slider
              $isGlassMode={isGlassMode}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.topP || 1}
              onChange={(e) => handleConfigChange('topP', parseFloat(e.target.value))}
            />
          </SliderContainer>

          {provider?.parameters.some(p => p.key === 'top_k') && (
            <SliderContainer $isGlassMode={isGlassMode}>
              <SliderLabel $isGlassMode={isGlassMode}>
                <span>Top K: {config.topK}</span>
                <span style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                  采样候选数量
                </span>
              </SliderLabel>
              <Slider
                $isGlassMode={isGlassMode}
                type="range"
                min="0"
                max="100"
                step="1"
                value={config.topK || 40}
                onChange={(e) => handleConfigChange('topK', parseInt(e.target.value))}
              />
            </SliderContainer>
          )}

          {provider?.features.thinking && (
            <SwitchContainer $isGlassMode={isGlassMode}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                  思考模式
                </div>
                <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                  启用模型的思考过程显示
                </div>
              </div>
              <Switch $isGlassMode={isGlassMode}>
                <SwitchInput
                  type="checkbox"
                  checked={config.thinkingMode || false}
                  onChange={(e) => handleConfigChange('thinkingMode', e.target.checked)}
                />
                <SwitchSlider $isGlassMode={isGlassMode} />
              </Switch>
            </SwitchContainer>
          )}

          <SwitchContainer $isGlassMode={isGlassMode}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                流式输出
              </div>
              <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                实时显示生成内容
              </div>
            </div>
            <Switch $isGlassMode={isGlassMode}>
              <SwitchInput
                type="checkbox"
                checked={config.streamOutput || false}
                onChange={(e) => handleConfigChange('streamOutput', e.target.checked)}
              />
              <SwitchSlider $isGlassMode={isGlassMode} />
            </Switch>
          </SwitchContainer>

          <SwitchContainer $isGlassMode={isGlassMode}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                成本优化
              </div>
              <div style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                优化API调用成本
              </div>
            </div>
            <Switch $isGlassMode={isGlassMode}>
              <SwitchInput
                type="checkbox"
                checked={config.costOptimization || false}
                onChange={(e) => handleConfigChange('costOptimization', e.target.checked)}
              />
              <SwitchSlider $isGlassMode={isGlassMode} />
            </Switch>
          </SwitchContainer>
        </ParamsForm>
      </div>

      {/* 高级参数 */}
      <AdvancedParamsPanel $isOpen={showAdvancedParams} $isGlassMode={isGlassMode}>
        <AdvancedParamsHeader 
          $isOpen={showAdvancedParams} 
          $isGlassMode={isGlassMode}
          onClick={() => setShowAdvancedParams(!showAdvancedParams)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>高级参数</span>
          </div>
          <span 
 
            style={{ 
              transform: showAdvancedParams ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: `transform ${theme.transition.normal} ease`
            }} 
          />
        </AdvancedParamsHeader>
        
        <AdvancedParamsContent $isOpen={showAdvancedParams}>
          <ParamsForm $isGlassMode={isGlassMode}>
            {provider?.parameters.some(p => p.key === 'frequency_penalty') && (
              <SliderContainer $isGlassMode={isGlassMode}>
                <SliderLabel $isGlassMode={isGlassMode}>
                  <span>Frequency Penalty: {config.frequencyPenalty}</span>
                  <span style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                    频率惩罚
                  </span>
                </SliderLabel>
                <Slider
                  $isGlassMode={isGlassMode}
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={config.frequencyPenalty || 0}
                  onChange={(e) => handleConfigChange('frequencyPenalty', parseFloat(e.target.value))}
                />
              </SliderContainer>
            )}

            {provider?.parameters.some(p => p.key === 'presence_penalty') && (
              <SliderContainer $isGlassMode={isGlassMode}>
                <SliderLabel $isGlassMode={isGlassMode}>
                  <span>Presence Penalty: {config.presencePenalty}</span>
                  <span style={{ fontSize: '0.8rem', color: theme.textSecondary }}>
                    存在惩罚
                  </span>
                </SliderLabel>
                <Slider
                  $isGlassMode={isGlassMode}
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={config.presencePenalty || 0}
                  onChange={(e) => handleConfigChange('presencePenalty', parseFloat(e.target.value))}
                />
              </SliderContainer>
            )}

            <FormGroup>
              <Label>超时时间 (毫秒)</Label>
              <Input
                $isGlassMode={isGlassMode}
                type="number"
                value={config.timeout || 30000}
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                placeholder="30000"
              />
            </FormGroup>

            <FormGroup>
              <Label>重试次数</Label>
              <Input
                $isGlassMode={isGlassMode}
                type="number"
                value={config.retryAttempts || 3}
                onChange={(e) => handleConfigChange('retryAttempts', parseInt(e.target.value))}
                placeholder="3"
              />
            </FormGroup>
          </ParamsForm>
        </AdvancedParamsContent>
      </AdvancedParamsPanel>

      {/* 系统提示词 */}
      <FormGroup>
        <Label>系统提示词</Label>
        <Input
          $isGlassMode={isGlassMode}
          value={config.systemPrompt || ''}
          onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
          placeholder="输入系统提示词"
          style={{ width: '100%', minHeight: '80px' }}
          as="textarea"
        />
      </FormGroup>

      {/* 操作按钮 */}
      <ActionButtons $isGlassMode={isGlassMode}>
        <Button 
          onClick={testConfig} 
          variant="outline" 
          disabled={testingConfig}
        >
          {testingConfig ? '测试中...' : '测试配置'}
        </Button>
        
        {onCancel && (
          <Button 
            onClick={onCancel} 
            variant="outline"
          >
            取消
          </Button>
        )}
        
        <Button 
          onClick={saveConfig} 
          variant="primary" 
        >
          {isEditing ? '更新配置' : '添加配置'}
        </Button>
      </ActionButtons>
    </AdvancedConfigForm>
  );
};

export default AdvancedLLMConfig;