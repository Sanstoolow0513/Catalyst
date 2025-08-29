import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Button from '../common/Button';
import { Input, Textarea, Select, SelectWrapper, FormGroup, FormRow, Label } from '../common/Form';
import IconPicker from '../common/IconPicker';
import ColorPicker from '../common/ColorPicker';
import { IQuickTool } from '../../utils/configManager';
import { useConfig } from '../../contexts/ConfigContext';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool?: IQuickTool;
  onSave: (tool: Omit<IQuickTool, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<void>;
}

const ModalContent = styled.div`
  padding: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.125rem;
  font-weight: 600;
`;

const ColorPreview = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${({ theme }) => theme.primary.main};
  }
`;

const IconPreview = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.border};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: ${({ theme }) => theme.primary.main};
  }
`;

const ActionConfig = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.surfaceVariant};
  border-radius: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const AddToolModal: React.FC<AddToolModalProps> = ({ isOpen, onClose, tool, onSave }) => {
  const { quickTools } = useConfig();
  
  const [formData, setFormData] = useState({
    name: tool?.name || '',
    description: tool?.description || '',
    iconName: tool?.iconName || 'Star',
    color: tool?.color || '#8B5CF6',
    category: tool?.category || 'custom' as const,
    action: {
      type: tool?.action.type || 'navigate' as const,
      value: tool?.action.value || '',
      params: tool?.action.params || {},
    },
    isCustom: tool?.isCustom ?? true,
    order: tool?.order ?? quickTools.length,
  });

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadIconComponent = async () => {
      try {
        const icons = await import('lucide-react');
        const Icon = icons[formData.iconName] || icons.Star;
        setIconComponent(() => Icon);
      } catch {
        // 如果加载失败，返回一个默认的星号图标
        setIconComponent(() => () => React.createElement('span', null, '⭐'));
      }
    };
    
    loadIconComponent();
  }, [formData.iconName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim() || !formData.action.value.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save tool:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleActionChange = (field: string, value: string | Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      action: {
        ...prev.action,
        [field]: value,
      },
    }));
  };

  
  const renderActionConfig = () => {
    switch (formData.action.type) {
      case 'navigate':
        return (
          <ActionConfig>
            <Label>目标路径</Label>
            <Input
              type="text"
              placeholder="/example-path"
              value={formData.action.value}
              onChange={(e) => handleActionChange('value', e.target.value)}
            />
          </ActionConfig>
        );
      case 'link':
        return (
          <ActionConfig>
            <Label>URL 地址</Label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={formData.action.value}
              onChange={(e) => handleActionChange('value', e.target.value)}
            />
          </ActionConfig>
        );
      case 'command':
        return (
          <ActionConfig>
            <Label>命令类型</Label>
            <SelectWrapper>
              <Select
                value={formData.action.value}
                onChange={(e) => handleActionChange('value', e.target.value)}
              >
                <option value="">选择命令类型</option>
                <option value="terminal">打开终端</option>
                <option value="browser">打开浏览器</option>
                <option value="settings">打开设置</option>
                <option value="custom">自定义命令</option>
              </Select>
            </SelectWrapper>
            {formData.action.value === 'custom' && (
              <div style={{ marginTop: '12px' }}>
                <Label>自定义命令</Label>
                <Input
                  type="text"
                  placeholder="输入自定义命令"
                  value={formData.action.params?.command || ''}
                  onChange={(e) => handleActionChange('params', { ...formData.action.params, command: e.target.value })}
                />
              </div>
            )}
          </ActionConfig>
        );
      case 'function':
        return (
          <ActionConfig>
            <Label>函数名称</Label>
            <Input
              type="text"
              placeholder="functionName"
              value={formData.action.value}
              onChange={(e) => handleActionChange('value', e.target.value)}
            />
          </ActionConfig>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalTitle>{tool ? '编辑快捷工具' : '添加快捷工具'}</ModalTitle>
          
          <form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>基本信息</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>工具名称 *</Label>
                  <Input
                    type="text"
                    placeholder="输入工具名称"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>分类</Label>
                  <SelectWrapper>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="frequent">常用</option>
                      <option value="recent">最近</option>
                      <option value="recommended">推荐</option>
                      <option value="custom">自定义</option>
                    </Select>
                  </SelectWrapper>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label>工具描述 *</Label>
                <Textarea
                  placeholder="输入工具描述"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>外观设置</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>图标</Label>
                  <IconPreview 
                    $color={formData.color}
                    onClick={() => setShowIconPicker(true)}
                  >
                    {IconComponent && <IconComponent size={24} />}
                  </IconPreview>
                </FormGroup>
                <FormGroup>
                  <Label>颜色</Label>
                  <ColorPreview 
                    $color={formData.color}
                    onClick={() => setShowColorPicker(true)}
                  />
                </FormGroup>
              </FormRow>
            </FormSection>

            <FormSection>
              <SectionTitle>动作配置</SectionTitle>
              <FormGroup>
                <Label>动作类型</Label>
                <SelectWrapper>
                  <Select
                    value={formData.action.type}
                    onChange={(e) => handleActionChange('type', e.target.value)}
                  >
                    <option value="navigate">页面导航</option>
                    <option value="link">打开链接</option>
                    <option value="command">执行命令</option>
                    <option value="function">调用函数</option>
                  </Select>
                </SelectWrapper>
              </FormGroup>
              {renderActionConfig()}
            </FormSection>

            <ButtonGroup>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                取消
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={!formData.name.trim() || !formData.description.trim() || !formData.action.value.trim()}
              >
                {tool ? '更新' : '添加'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>

      {showIconPicker && (
        <IconPicker
          selectedIcon={formData.iconName}
          onIconSelect={(iconName) => handleInputChange('iconName', iconName)}
          onClose={() => setShowIconPicker(false)}
        />
      )}

      {showColorPicker && (
        <ColorPicker
          selectedColor={formData.color}
          onColorSelect={(color) => handleInputChange('color', color)}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </>
  );
};

export default AddToolModal;