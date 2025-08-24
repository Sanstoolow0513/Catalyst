import React from 'react';
import styled from 'styled-components';
import { Button, Input, Label, Select, SelectWrapper, FormGroup } from '../common';
import { 
  MessageSquare as MessageIcon,
  Plus as PlusIcon,
  Trash2 as DeleteIcon,
  Edit as EditIcon,
  Radio as RadioIcon
} from 'lucide-react';

const LlmSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const NewConfigForm = styled.div`
  background: ${props => props.theme.surface};
  border: 2px dashed ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ConfigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ConfigName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ConfigActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const LlmConfigForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const LlmConfigItem = styled.div<{ $isActive: boolean }>`
  background: ${props => props.$isActive ? props.theme.primary.light + '10' : props.theme.surface};
  border: 2px solid ${props => props.$isActive ? props.theme.primary.main : props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  transition: background-color ${props => props.theme.transition.normal} ease, border-color ${props => props.theme.transition.normal} ease;
`;

interface LlmConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  isActive: boolean;
}

interface NewConfig {
  name: string;
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
}

interface LlmSettingsProps {
  llmConfigs: LlmConfig[];
  newConfig: NewConfig;
  editingConfig: string | null;
  onAddConfig: () => void;
  onUpdateConfig: (id: string, updates: Partial<NewConfig>) => void;
  onDeleteConfig: (id: string) => void;
  onSetActiveConfig: (id: string) => void;
  onSetEditingConfig: (id: string | null) => void;
  onNewConfigChange: (config: NewConfig) => void;
}

const LlmSettings: React.FC<LlmSettingsProps> = ({
  llmConfigs,
  newConfig,
  editingConfig,
  onAddConfig,
  onUpdateConfig,
  onDeleteConfig,
  onSetActiveConfig,
  onSetEditingConfig,
  onNewConfigChange
}) => {
  return (
    <LlmSectionContainer>
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
              onChange={(e) => onNewConfigChange({ ...newConfig, name: e.target.value })}
              placeholder="例如：OpenAI GPT-4"
            />
          </FormGroup>

          <FormGroup>
            <Label>提供商</Label>
            <SelectWrapper>
              <Select 
                value={newConfig.provider} 
                onChange={(e) => onNewConfigChange({ ...newConfig, provider: e.target.value })}
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
              onChange={(e) => onNewConfigChange({ ...newConfig, model: e.target.value })}
              placeholder="gpt-4, gemini-pro 等"
            />
          </FormGroup>

          <FormGroup>
            <Label>Base URL</Label>
            <Input
              value={newConfig.baseUrl}
              onChange={(e) => onNewConfigChange({ ...newConfig, baseUrl: e.target.value })}
              placeholder="API 地址"
            />
          </FormGroup>

          <FormGroup>
            <Label>API 密钥</Label>
            <Input
              type="password"
              value={newConfig.apiKey}
              onChange={(e) => onNewConfigChange({ ...newConfig, apiKey: e.target.value })}
              placeholder="输入 API 密钥"
            />
          </FormGroup>
        </LlmConfigForm>

        <Button onClick={onAddConfig} variant="primary" startIcon={<PlusIcon size={16} />}>
          添加配置
        </Button>
      </NewConfigForm>

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
                  onClick={() => onSetActiveConfig(config.id)}
                  variant="outline"
                  size="small"
                  startIcon={<RadioIcon size={14} />}
                >
                  设为激活
                </Button>
              )}
              <Button
                onClick={() => onSetEditingConfig(editingConfig === config.id ? null : config.id)}
                variant="outline"
                size="small"
                startIcon={<EditIcon size={14} />}
              >
                {editingConfig === config.id ? '取消' : '编辑'}
              </Button>
              {llmConfigs.length > 1 && (
                <Button
                  onClick={() => onDeleteConfig(config.id)}
                  variant="danger"
                  size="small"
                  startIcon={<DeleteIcon size={14} />}
                >
                  删除
                </Button>
              )}
            </ConfigActions>
          </ConfigHeader>

          {editingConfig === config.id && (
            <LlmConfigForm>
              <FormGroup>
                <Label>配置名称</Label>
                <Input
                  value={config.name}
                  onChange={(e) => onUpdateConfig(config.id, { name: e.target.value })}
                  placeholder="配置名称"
                />
              </FormGroup>

              <FormGroup>
                <Label>提供商</Label>
                <SelectWrapper>
                  <Select 
                    value={config.provider} 
                    onChange={(e) => onUpdateConfig(config.id, { provider: e.target.value })}
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
                  onChange={(e) => onUpdateConfig(config.id, { model: e.target.value })}
                  placeholder="模型名称"
                />
              </FormGroup>

              <FormGroup>
                <Label>Base URL</Label>
                <Input
                  value={config.baseUrl}
                  onChange={(e) => onUpdateConfig(config.id, { baseUrl: e.target.value })}
                  placeholder="API 地址"
                />
              </FormGroup>

              <FormGroup>
                <Label>API 密钥</Label>
                <Input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => onUpdateConfig(config.id, { apiKey: e.target.value })}
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
    </LlmSectionContainer>
  );
};

export default LlmSettings;