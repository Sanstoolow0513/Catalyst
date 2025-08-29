import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Plus, 
  Star, 
  Download,
  Trash2,
  Edit,
  Settings
} from 'lucide-react';
import Card from '../common/Card';
import { CardGrid } from '../common/PageContainer';
import { getAnimationConfig } from '../../utils/animations';
import { useConfig } from '../../contexts/ConfigContext';
import { useNavigate } from 'react-router-dom';
import AddToolModal from '../common/AddToolModal';

interface QuickTool {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  category: 'frequent' | 'recent' | 'recommended' | 'custom';
  action: {
    type: 'navigate' | 'command' | 'link' | 'function';
    value: string;
    params?: Record<string, any>;
  };
  isCustom?: boolean;
}

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionAction = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme?.primary?.main || '#3B82F6'};
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: ${props => props.theme?.primary?.main + '20' || 'rgba(59, 130, 246, 0.2)'};
  }
`;

const ToolCard = styled(motion.div)<{ $isDragging?: boolean }>`
  background: ${props => props.theme?.surface || '#F9FAFB'};
  border: 1px solid ${props => props.$isDragging ? props.theme?.primary?.main : (props.theme?.border || '#E5E7EB')};
  border-radius: 12px;
  padding: 16px;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  transition: all 0.3s ease;
  position: relative;
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  
  &:hover {
    background: ${props => props.theme?.surfaceVariant || '#F3F4F6'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ToolIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  flex-shrink: 0;
`;

const ToolActions = styled.div`
  display: flex;
  gap: 4px;
`;

const ToolAction = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme?.textTertiary || '#9CA3AF'};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme?.surfaceVariant || '#F3F4F6'};
    color: ${props => props.theme?.textPrimary || '#111827'};
  }
`;

const ToolContent = styled.div`
  flex: 1;
`;

const ToolName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
  margin-bottom: 4px;
`;

const ToolDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  line-height: 1.4;
`;

const ToolBadge = styled.div<{ $variant: 'frequent' | 'recent' | 'recommended' | 'custom' }>`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$variant) {
      case 'frequent':
        return `
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
        `;
      case 'recent':
        return `
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
        `;
      case 'recommended':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: #F59E0B;
        `;
      case 'custom':
        return `
          background: rgba(139, 92, 246, 0.1);
          color: #8B5CF6;
        `;
    }
  }}
`;

const AddToolButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  border: 2px dashed ${props => props.theme?.border || '#E5E7EB'};
  border-radius: 12px;
  background: transparent;
  color: ${props => props.theme?.textTertiary || '#9CA3AF'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    border-color: ${props => props.theme?.primary?.main || '#3B82F6'};
    color: ${props => props.theme?.primary?.main || '#3B82F6'};
    background: ${props => props.theme?.primary?.main + '10' || 'rgba(59, 130, 246, 0.1)'};
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 48px 24px;
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    opacity: 0.5;
  }
  
  .empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${props => props.theme?.textPrimary || '#111827'};
  }
  
  .empty-description {
    font-size: 0.875rem;
    margin-bottom: 24px;
    line-height: 1.5;
  }
`;

const SuccessMessage = styled.div`
  background-color: ${props => props.theme?.success?.main + '20' || 'rgba(16, 185, 129, 0.1)'};
  color: ${props => props.theme?.success?.main || '#10B981'};
  border: 1px solid ${props => props.theme?.success?.main || '#10B981'};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  background-color: ${props => props.theme?.error?.main + '20' || 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.theme?.error?.main || '#EF4444'};
  border: 1px solid ${props => props.theme?.error?.main || '#EF4444'};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuickTools: React.FC = () => {
  const { quickTools, addQuickTool, updateQuickTool, deleteQuickTool, incrementToolUsage, reorderQuickTools } = useConfig();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTool, setEditingTool] = useState<QuickTool | null>(null);
  const [draggedTool, setDraggedTool] = useState<QuickTool | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

  const getIconComponent = (iconName: string) => {
    try {
      // 动态导入 lucide-react 图标
      const icons = require('lucide-react');
      const Icon = icons[iconName] || icons.Star;
      return Icon;
    } catch {
      // 如果加载失败，返回一个默认的星号图标
      return () => React.createElement('span', null, '⭐');
    }
  };

  const executeToolAction = async (tool: QuickTool) => {
    try {
      // 增加使用次数
      await incrementToolUsage(tool.id);

      switch (tool.action.type) {
        case 'navigate':
          navigate(tool.action.value);
          break;
        case 'link':
          window.open(tool.action.value, '_blank');
          break;
        case 'command':
          if (window.electronAPI) {
            switch (tool.action.value) {
              case 'terminal':
                // 使用系统命令打开终端
                try {
                  const { exec } = require('child_process');
                  exec('start cmd');
                } catch (error) {
                  console.error('Failed to open terminal:', error);
                }
                break;
              case 'browser':
                // 打开默认浏览器
                try {
                  const { exec } = require('child_process');
                  exec('start https://www.google.com');
                } catch (error) {
                  console.error('Failed to open browser:', error);
                }
                break;
              case 'settings':
                navigate('/settings');
                break;
              case 'custom':
                if (tool.action.params?.command) {
                  try {
                    const { exec } = require('child_process');
                    exec(tool.action.params.command);
                  } catch (error) {
                    console.error('Failed to execute custom command:', error);
                  }
                }
                break;
            }
          }
          break;
        case 'function':
          // 这里可以实现自定义函数调用
          console.log('Executing function:', tool.action.value, tool.action.params);
          break;
        default:
          console.warn('Unknown action type:', tool.action.type);
      }
    } catch (error) {
      console.error('Failed to execute tool action:', error);
    }
  };

  const handleAddTool = async (toolData: Omit<QuickTool, 'id'>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await addQuickTool({
        ...toolData,
        order: quickTools.length,
      });
      setShowAddModal(false);
      setSuccess('工具添加成功！');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加工具失败';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTool = async (toolData: Omit<QuickTool, 'id'>) => {
    if (!editingTool) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateQuickTool(editingTool.id, toolData);
      setEditingTool(null);
      setSuccess('工具更新成功！');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新工具失败';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    if (window.confirm('确定要删除这个快捷工具吗？')) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const result = await deleteQuickTool(toolId);
        if (!result) {
          setError('删除工具失败：只能删除自定义工具');
          setTimeout(() => setError(null), 3000);
        } else {
          setSuccess('工具删除成功！');
          setTimeout(() => setSuccess(null), 3000);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '删除工具失败';
        setError(errorMessage);
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToolClick = (tool: QuickTool) => {
    executeToolAction(tool);
  };

  const handleAddCustomTool = () => {
    setShowAddModal(true);
  };

  // 拖拽相关方法
  const handleDragStart = (tool: QuickTool) => {
    setDraggedTool(tool);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetTool: QuickTool) => {
    if (!draggedTool || draggedTool.id === targetTool.id) return;

    const draggedIndex = quickTools.findIndex(t => t.id === draggedTool.id);
    const targetIndex = quickTools.findIndex(t => t.id === targetTool.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...quickTools];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedTool);

    const toolIds = newOrder.map(tool => tool.id);
    reorderQuickTools(toolIds);
    setDraggedTool(null);
  };

  const handleDragEnd = () => {
    setDraggedTool(null);
  };

  return (
    <>
      <Card $variant="elevated">
        <SectionHeader>
          <SectionTitle>
            <Star size={20} />
            快捷工具
          </SectionTitle>
          <SectionAction
            onClick={handleAddCustomTool}
            whileHover={animationConfig.disabled ? undefined : { scale: 1.05 }}
            whileTap={animationConfig.disabled ? undefined : { scale: 0.95 }}
          >
            <Plus size={16} />
            添加
          </SectionAction>
        </SectionHeader>

        {success && (
          <SuccessMessage>
            <span>✅</span>
            {success}
          </SuccessMessage>
        )}
        
        {error && (
          <ErrorMessage>
            <span>⚠️</span>
            {error}
          </ErrorMessage>
        )}

        <CardGrid>
          {quickTools.length === 0 ? (
            <EmptyState
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-icon">🔧</div>
              <div className="empty-title">暂无快捷工具</div>
              <div className="empty-description">
                添加快捷工具可以让你快速访问常用功能，提高工作效率
              </div>
              <AddToolButton
                onClick={handleAddCustomTool}
                whileHover={animationConfig.disabled ? undefined : { scale: 1.02 }}
                whileTap={animationConfig.disabled ? undefined : { scale: 0.98 }}
                style={{ width: 'auto', margin: '0 auto' }}
              >
                <Plus size={20} />
                添加第一个工具
              </AddToolButton>
            </EmptyState>
          ) : (
            <>
              {quickTools.map((tool, index) => {
                const IconComponent = getIconComponent(tool.iconName);
                const isDragging = draggedTool?.id === tool.id;
                return (
                  <ToolCard
                    key={tool.id}
                    $isDragging={isDragging}
                    onClick={() => handleToolClick(tool)}
                    draggable
                    onDragStart={() => handleDragStart(tool)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(tool)}
                    onDragEnd={handleDragEnd}
                    whileHover={animationConfig.disabled || isDragging ? undefined : { scale: 1.02 }}
                    whileTap={animationConfig.disabled || isDragging ? undefined : { scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <ToolBadge $variant={tool.category}>
                      {tool.category === 'frequent' && '常用'}
                      {tool.category === 'recent' && '最近'}
                      {tool.category === 'recommended' && '推荐'}
                      {tool.category === 'custom' && '自定义'}
                    </ToolBadge>

                    <ToolHeader>
                      <ToolIcon $color={tool.color}>
                        <IconComponent size={20} />
                      </ToolIcon>
                      {tool.isCustom && (
                        <ToolActions>
                          <ToolAction
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTool(tool);
                            }}
                            whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
                            whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
                          >
                            <Edit size={14} />
                          </ToolAction>
                          <ToolAction
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTool(tool.id);
                            }}
                            whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
                            whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
                          >
                            <Trash2 size={14} />
                          </ToolAction>
                        </ToolActions>
                      )}
                    </ToolHeader>

                    <ToolContent>
                      <ToolName>{tool.name}</ToolName>
                      <ToolDescription>{tool.description}</ToolDescription>
                    </ToolContent>
                  </ToolCard>
                );
              })}
              <AddToolButton
                onClick={handleAddCustomTool}
                whileHover={animationConfig.disabled ? undefined : { scale: 1.02 }}
                whileTap={animationConfig.disabled ? undefined : { scale: 0.98 }}
              >
                <Plus size={20} />
                添加自定义工具
              </AddToolButton>
            </>
          )}
        </CardGrid>
      </Card>

      {showAddModal && (
        <AddToolModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTool}
        />
      )}

      {editingTool && (
        <AddToolModal
          isOpen={!!editingTool}
          onClose={() => setEditingTool(null)}
          tool={editingTool}
          onSave={handleEditTool}
        />
      )}
    </>
  );
};

export default QuickTools;