import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Globe, Download, Save, RefreshCw, FolderOpen } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ConfigCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
`;

const ConfigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ConfigTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const URLInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: end;
`;

const URLInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  color: ${props => props.theme.textPrimary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfigTextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  color: ${props => props.theme.textPrimary};
  font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 300px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfigActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)<{ $variant: 'primary' | 'outline' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.dark};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.primary.main};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.main};
            color: ${props.theme.primary.contrastText};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.error.main};
          color: ${props.theme.error.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.error.dark};
          }
        `;
      default:
        return '';
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfigPathDisplay = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  font-size: 0.9rem;
  color: ${props => props.theme.textPrimary};
  margin-top: 1rem;
`;

const ValidationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  margin-top: 1rem;
  
  ${props => props.isValid ? `
    border: 1px solid ${props.theme.success.main};
    color: ${props.theme.success.main};
  ` : `
    border: 1px solid ${props.theme.error.main};
    color: ${props.theme.error.main};
  `}
`;

const ConfigInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const ConfigFormatHint = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.5rem;
  font-style: italic;
`;

interface ConfigManagerProps {
  configURL: string;
  config: string;
  configPath: string;
  isValidConfig: boolean;
  isConfigLoading: boolean;
  isConfigSaving: boolean;
  onConfigURLChange: (url: string) => void;
  onConfigChange: (config: string) => void;
  onFetchConfig: () => void;
  onSaveConfig: () => void;
  onLoadConfig: () => void;
  onOpenConfigDir: () => void;
}

const ConfigManager: React.FC<ConfigManagerProps> = memo(({
  configURL,
  config,
  configPath,
  isValidConfig,
  isConfigLoading,
  isConfigSaving,
  onConfigURLChange,
  onConfigChange,
  onFetchConfig,
  onSaveConfig,
  onLoadConfig,
  onOpenConfigDir
}) => {
  useTheme();

  const handleConfigURLChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigURLChange(e.target.value);
  }, [onConfigURLChange]);

  const handleConfigChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onConfigChange(e.target.value);
  }, [onConfigChange]);

  const isFetchDisabled = useMemo(() => isConfigLoading || isConfigSaving || !configURL.trim(), [isConfigLoading, isConfigSaving, configURL]);
  const isSaveDisabled = useMemo(() => isConfigLoading || isConfigSaving || !config.trim(), [isConfigLoading, isConfigSaving, config]);
  const isLoadDisabled = useMemo(() => isConfigLoading || isConfigSaving, [isConfigLoading, isConfigSaving]);

  const validationMessage = useMemo(() => {
    if (isConfigLoading) {
      return '📥 正在获取配置...';
    }
    if (isConfigSaving) {
      return '💾 正在保存配置...';
    }
    if (!config.trim()) {
      return '⚠️ 配置为空，请获取或输入配置';
    }
    return isValidConfig ? '✓ 配置有效，可以使用' : '✗ 配置格式无效，请检查 YAML 语法';
  }, [isValidConfig, config, isConfigLoading, isConfigSaving]);

  return (
    <ConfigCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ConfigHeader>
        <ConfigTitle>
          <Globe size={20} />
          配置管理
        </ConfigTitle>
      </ConfigHeader>
      
      <URLInputContainer>
        <URLInput
          type="text"
          value={configURL}
          onChange={handleConfigURLChange}
          placeholder="输入 VPN 提供者配置 URL..."
          disabled={isConfigLoading || isConfigSaving}
        />
        <ActionButton
          $variant="primary"
          onClick={onFetchConfig}
          disabled={isFetchDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isConfigLoading ? <RefreshCw size={16} /> : <Download size={16} />}
          {isConfigLoading ? '获取中...' : '获取配置'}
        </ActionButton>
      </URLInputContainer>
      
      <ConfigTextArea
        value={config}
        onChange={handleConfigChange}
        placeholder="在此输入您的 Mihomo 配置（YAML 格式）..."
        disabled={isConfigLoading || isConfigSaving}
      />
      
      <ConfigInfo>
        <span>字符数: {config.length}</span>
        <span>行数: {config.split('\n').length}</span>
      </ConfigInfo>
      
      <ConfigFormatHint>
        💡 提示：配置文件应为 YAML 格式，包含端口、代理规则等设置
      </ConfigFormatHint>
      
      <ConfigActions>
        <ActionButton
          $variant="outline"
          onClick={onLoadConfig}
          disabled={isLoadDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={16} />
          重新加载
        </ActionButton>
        
        <ActionButton
          $variant="primary"
          onClick={onSaveConfig}
          disabled={isSaveDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save size={16} />
          {isConfigSaving ? '保存中...' : '保存配置'}
        </ActionButton>
        
        {configPath && (
          <ActionButton
            $variant="outline"
            onClick={onOpenConfigDir}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FolderOpen size={16} />
            打开目录
          </ActionButton>
        )}
      </ConfigActions>
      
      {configPath && (
        <ConfigPathDisplay>
          <strong>配置路径:</strong> {configPath}
        </ConfigPathDisplay>
      )}
      
      <ValidationStatus isValid={isValidConfig}>
        {validationMessage}
      </ValidationStatus>
    </ConfigCard>
  );
});

ConfigManager.displayName = 'ConfigManager';

export default ConfigManager;