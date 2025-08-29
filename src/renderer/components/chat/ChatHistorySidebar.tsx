import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  Trash2, 
  MoreVertical,
  Edit3,
  X
} from 'lucide-react';
import { IChatHistory } from '@types/electron';
import { useConfig } from '@contexts/ConfigContext';

// 侧边栏容器
const SidebarContainer = styled(motion.div)`
  width: 320px;
  background: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

// 头部区域
const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surface};
`;

// 标题
const SidebarTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 新建对话按钮
const NewChatButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: ${props => props.theme.primary.main};
  color: ${props => props.theme.primary.contrastText};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  box-shadow: ${props => props.theme.button.shadow};
  
  &:hover {
    background: ${props => props.theme.primary.dark};
    box-shadow: ${props => props.theme.button.shadowHover};
  }
`;

// 搜索区域
const SearchContainer = styled.div`
  position: relative;
  margin-top: ${props => props.theme.spacing.md};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: ${props => props.theme.surfaceVariant};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 14px;
  color: ${props => props.theme.textPrimary};
  outline: none;
  transition: all ${props => props.theme.transition.normal} ease;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  &:focus {
    border-color: ${props => props.theme.input.borderFocus};
    box-shadow: ${props => props.theme.button.shadowHover};
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: ${props => props.theme.textSecondary};
`;

// 历史记录列表
const HistoryListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.sm};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.borderLight};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.border};
  }
`;

// 历史记录项
const HistoryItemContainer = styled(motion.div)<{ $active?: boolean }>`
  padding: 12px;
  margin-bottom: 4px;
  background: ${props => props.$active ? props.theme.primary.main + '15' : props.theme.surfaceVariant};
  border: 1px solid ${props => props.$active ? props.theme.primary.main : 'transparent'};
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transition.normal} ease;
  position: relative;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary.main + '20' : props.theme.surface};
    border-color: ${props => props.$active ? props.theme.primary.main : props.theme.borderLight};
  }
`;

const HistoryItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const HistoryItemTitle = styled.div<{ $active?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? props.theme.primary.main : props.theme.textPrimary};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HistoryItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
`;

const HistoryItemMessage = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
`;

const HistoryItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity ${props => props.theme.transition.normal} ease;
  
  ${HistoryItemContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(motion.button)`
  width: 28px;
  height: 28px;
  border: none;
  background: ${props => props.theme.surface};
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textSecondary};
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
    color: ${props => props.theme.textPrimary};
  }
`;

// 下拉菜单
const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 8px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.card.shadow};
  z-index: 1000;
  min-width: 150px;
  overflow: hidden;
`;

const DropdownItem = styled(motion.button)`
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  color: ${props => props.theme.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
  }
  
  &:last-child {
    color: ${props => props.theme.error};
  }
`;

// 空状态
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.textSecondary};
  text-align: center;
`;

const EmptyStateIcon = styled(MessageSquare)`
  width: 48px;
  height: 48px;
  margin-bottom: ${props => props.theme.spacing.md};
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 14px;
  margin: 0;
`;

// 编辑输入框
const EditInput = styled.input`
  width: 100%;
  padding: 8px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.primary.main};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 14px;
  color: ${props => props.theme.textPrimary};
  outline: none;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

interface ChatHistorySidebarProps {
  activeChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  activeChatId,
  onChatSelect,
  onNewChat
}) => {
  const { chatHistories, deleteChatHistory, renameChatHistory, clearAllChatHistories } = useConfig();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistories, setFilteredHistories] = useState<IChatHistory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // 过滤历史记录
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHistories(chatHistories);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = chatHistories.filter(history =>
        history.title.toLowerCase().includes(query) ||
        history.lastMessage?.toLowerCase().includes(query)
      );
      setFilteredHistories(filtered);
    }
  }, [chatHistories, searchQuery]);

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInHours < 48) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 处理删除
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个对话吗？')) {
      await deleteChatHistory(id);
      setDropdownOpenId(null);
    }
  };

  // 开始编辑
  const startEdit = (history: IChatHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(history.id);
    setEditTitle(history.title);
    setDropdownOpenId(null);
  };

  // 保存编辑
  const saveEdit = async () => {
    if (editingId && editTitle.trim()) {
      await renameChatHistory(editingId, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <SidebarContainer
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SidebarHeader>
        <SidebarTitle>
          <MessageSquare size={20} />
          对话历史
        </SidebarTitle>
        <NewChatButton
          onClick={onNewChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={16} />
          新建对话
        </NewChatButton>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="搜索对话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </SidebarHeader>

      <HistoryListContainer>
        {filteredHistories.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon />
            <EmptyStateText>
              {searchQuery ? '没有找到匹配的对话' : '暂无对话历史'}
            </EmptyStateText>
          </EmptyState>
        ) : (
          filteredHistories.map((history) => (
            <HistoryItemContainer
              key={history.id}
              $active={history.id === activeChatId}
              onClick={() => onChatSelect(history.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <HistoryItemHeader>
                {editingId === history.id ? (
                  <EditInput
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <HistoryItemTitle $active={history.id === activeChatId}>
                    {history.title}
                  </HistoryItemTitle>
                )}
                
                {editingId !== history.id && (
                  <HistoryItemActions>
                    <ActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpenId(dropdownOpenId === history.id ? null : history.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical size={14} />
                    </ActionButton>
                  </HistoryItemActions>
                )}
              </HistoryItemHeader>

              {editingId !== history.id && (
                <>
                  <HistoryItemMeta>
                    <Clock size={12} />
                    <span>{formatTime(history.updatedAt)}</span>
                    <span>•</span>
                    <span>{history.messageCount} 条消息</span>
                  </HistoryItemMeta>
                  
                  {history.lastMessage && (
                    <HistoryItemMessage>
                      {history.lastMessage}
                    </HistoryItemMessage>
                  )}
                </>
              )}

              {dropdownOpenId === history.id && (
                <DropdownMenu
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <DropdownItem
                    onClick={(e) => startEdit(history, e)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Edit3 size={14} />
                    重命名
                  </DropdownItem>
                  <DropdownItem
                    onClick={(e) => handleDelete(history.id, e)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Trash2 size={14} />
                    删除
                  </DropdownItem>
                </DropdownMenu>
              )}
            </HistoryItemContainer>
          ))
        )}
      </HistoryListContainer>
    </SidebarContainer>
  );
};

export default ChatHistorySidebar;