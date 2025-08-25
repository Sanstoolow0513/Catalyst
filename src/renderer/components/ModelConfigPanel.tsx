import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ChevronDown, 
  ChevronUp,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { ChatConfig, ModelPreset, ConfigTemplate, ValidationResult } from '../types/chat';
import { 
  MODEL_PRESETS, 
  CONFIG_TEMPLATES, 
  PROVIDER_CONFIGS,
  validateConfig,
  getModelCapabilities 
} from '../utils/modelPresets';

interface ModelConfigPanelProps {
  config: ChatConfig;
  onChange: (config: ChatConfig) => void;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const ConfigContainer = styled(motion.div)<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '60px' : '320px'};
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 40px);
`;

const ConfigHeader = styled.div<{ $collapsed: boolean }>`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
`;

const ConfigTitle = styled.h3<{ $collapsed: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  display: ${props => props.$collapsed ? 'none' : 'flex'};
  align-items: center;
  gap: 8px;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
    color: ${props => props.theme.textPrimary};
  }
`;

const ConfigContent = styled.div<{ $collapsed: boolean }>`
  padding: ${props => props.$collapsed ? '0' : '16px'};
  overflow-y: auto;
  flex: 1;
  opacity: ${props => props.$collapsed ? 0 : 1};
  pointer-events: ${props => props.$collapsed ? 'none' : 'auto'};
  transition: opacity 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 2px;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 13px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
  }
  
  &::placeholder {
    color: ${props => props.theme.textTertiary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 13px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 13px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
  }
`;

const SliderGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.border};
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.primary.main};
    cursor: pointer;
    border: 2px solid ${props => props.theme.background};
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const SliderValue = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
  min-width: 40px;
  text-align: right;
`;

const PresetButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? props.theme.primary.main : props.theme.border};
  background: ${props => props.$active ? props.theme.primary.main : props.theme.background};
  color: ${props => props.$active ? props.theme.primary.contrastText : props.theme.textPrimary};
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary.main};
  }
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${props => props.$variant === 'primary' ? props.theme.primary.main : props.theme.border};
  background: ${props => props.$variant === 'primary' ? props.theme.primary.main : props.theme.background};
  color: ${props => props.$variant === 'primary' ? props.theme.primary.contrastText : props.theme.textPrimary};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ValidationStatus = styled.div<{ $type: 'success' | 'error' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
  
  ${props => {
    switch(props.$type) {
      case 'success':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: ${props.theme.success.main};
          border: 1px solid rgba(34, 197, 94, 0.2);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: ${props.theme.error.main};
          border: 1px solid rgba(239, 68, 68, 0.2);
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        `;
    }
  }}
`;

const ModelConfigPanel: React.FC<ModelConfigPanelProps> = ({
  config,
  onChange,
  isCollapsed = false,
  onCollapse
}) => {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });
  
  // 验证配置
  useEffect(() => {
    const result = validateConfig(config);
    setValidation(result);
  }, [config]);

  // 处理模型预设选择
  const handleModelPresetSelect = (preset: ModelPreset) => {
    const newConfig = {
      ...config,
      provider: preset.provider,
      model: preset.model,
      baseUrl: preset.baseUrl
    };
    
    // 根据模型能力调整参数
    const capabilities = getModelCapabilities(preset.model);
    if (capabilities) {
      newConfig.maxTokens = Math.min(config.maxTokens, capabilities.maxTokens);
    }
    
    onChange(newConfig);
  };

  // 处理配置模板应用
  const handleTemplateApply = (template: ConfigTemplate) => {
    onChange({
      ...config,
      ...template.config
    });
  };

  // 处理提供商变更
  const handleProviderChange = (provider: string) => {
    const providerConfig = PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS];
    if (providerConfig) {
      onChange({
        ...config,
        provider,
        baseUrl: providerConfig.baseUrl,
        model: providerConfig.models[0] || ''
      });
    }
  };

  // 重置配置
  const resetConfig = () => {
    const defaultTemplate = CONFIG_TEMPLATES.find(t => t.id === 'balanced');
    if (defaultTemplate) {
      onChange({
        ...config,
        ...defaultTemplate.config
      });
    }
  };

  
  return (
    <ConfigContainer 
      $collapsed={isCollapsed}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ConfigHeader $collapsed={isCollapsed}>
        <ConfigTitle $collapsed={isCollapsed}>
          <Settings size={16} />
          模型配置
        </ConfigTitle>
        <CollapseButton onClick={() => onCollapse?.(!isCollapsed)}>
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </CollapseButton>
      </ConfigHeader>

      <ConfigContent $collapsed={isCollapsed}>
        {/* 验证状态 */}
        {!validation.isValid && (
          <ValidationStatus $type="error">
            <AlertCircle size={14} />
            配置不完整
          </ValidationStatus>
        )}
        
        {validation.isValid && (
          <ValidationStatus $type="success">
            <CheckCircle2 size={14} />
            配置就绪
          </ValidationStatus>
        )}

        {/* 模型选择 */}
        <Section>
          <SectionTitle>模型选择</SectionTitle>
          
          <FormGroup>
            <Label>提供商</Label>
            <Select 
              value={config.provider} 
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              <option value="">选择提供商</option>
              {Object.entries(PROVIDER_CONFIGS).map(([key, provider]) => (
                <option key={key} value={key}>{provider.name}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>API 密钥</Label>
            <Input
              type="password"
              value={config.apiKey}
              onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
              placeholder="输入 API 密钥"
            />
          </FormGroup>

          <FormGroup>
            <Label>模型名称</Label>
            <Input
              value={config.model}
              onChange={(e) => onChange({ ...config, model: e.target.value })}
              placeholder="输入模型名称"
            />
          </FormGroup>

          <FormGroup>
            <Label>API 地址</Label>
            <Input
              value={config.baseUrl}
              onChange={(e) => onChange({ ...config, baseUrl: e.target.value })}
              placeholder="API 基础地址"
            />
          </FormGroup>

          {/* 快速预设 */}
          <div>
            <Label>快速预设</Label>
            <PresetGrid>
              {MODEL_PRESETS.slice(0, 4).map(preset => (
                <PresetButton
                  key={preset.id}
                  $active={config.model === preset.model}
                  onClick={() => handleModelPresetSelect(preset)}
                >
                  {preset.name}
                </PresetButton>
              ))}
            </PresetGrid>
          </div>
        </Section>

        {/* 生成参数 */}
        <Section>
          <SectionTitle>生成参数</SectionTitle>
          
          <FormGroup>
            <Label>Temperature</Label>
            <SliderGroup>
              <Slider
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => onChange({ ...config, temperature: parseFloat(e.target.value) })}
              />
              <SliderValue>{config.temperature.toFixed(1)}</SliderValue>
            </SliderGroup>
          </FormGroup>

          <FormGroup>
            <Label>Max Tokens</Label>
            <SliderGroup>
              <Slider
                type="range"
                min="1"
                max="8192"
                step="1"
                value={config.maxTokens}
                onChange={(e) => onChange({ ...config, maxTokens: parseInt(e.target.value) })}
              />
              <SliderValue>{config.maxTokens}</SliderValue>
            </SliderGroup>
          </FormGroup>

          <FormGroup>
            <Label>Top P</Label>
            <SliderGroup>
              <Slider
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.topP}
                onChange={(e) => onChange({ ...config, topP: parseFloat(e.target.value) })}
              />
              <SliderValue>{config.topP.toFixed(2)}</SliderValue>
            </SliderGroup>
          </FormGroup>

          {/* 配置模板 */}
          <div>
            <Label>配置模板</Label>
            <PresetGrid>
              {CONFIG_TEMPLATES.map(template => (
                <PresetButton
                  key={template.id}
                  onClick={() => handleTemplateApply(template)}
                >
                  {template.name}
                </PresetButton>
              ))}
            </PresetGrid>
          </div>
        </Section>

        {/* 系统提示 */}
        <Section>
          <SectionTitle>系统提示</SectionTitle>
          <FormGroup>
            <Textarea
              value={config.systemPrompt}
              onChange={(e) => onChange({ ...config, systemPrompt: e.target.value })}
              placeholder="输入系统提示词..."
            />
          </FormGroup>
        </Section>

        {/* 操作按钮 */}
        <ActionButtons>
          <ActionButton onClick={resetConfig}>
            <RotateCcw size={12} />
            重置
          </ActionButton>
          <ActionButton $variant="primary">
            <Save size={12} />
            保存
          </ActionButton>
        </ActionButtons>
      </ConfigContent>
    </ConfigContainer>
  );
};

export default ModelConfigPanel;