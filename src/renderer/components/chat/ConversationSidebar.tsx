import React from 'react';
import styled from 'styled-components';
import { Button } from '../common';
import { Plus, MessageSquare } from 'lucide-react';

const SidebarContainer = styled.aside`
  width: 280px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.sidebar.background};
  border-right: 1px solid transparent;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

const NewChatButton = styled(Button)`
  width: 100%;
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ConversationItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ $isActive, theme }) => $isActive ? theme.sidebar.itemActive : 'transparent'};
  color: ${({ $isActive, theme }) => $isActive ? theme.sidebar.textActive : theme.sidebar.text};
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.sidebar.itemHover};
  }
`;

const ConversationTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Dummy data for now
const conversations = [
  { id: '1', title: 'React component refactoring' },
  { id: '2', title: 'Electron build process issue' },
  { id: '3', title: 'New feature brainstorming' },
];

const ConversationSidebar = () => {
  const activeConversationId = '2';

  return (
    <SidebarContainer>
      <NewChatButton variant="outline" startIcon={<Plus size={16} />}>
        New Chat
      </NewChatButton>
      <ConversationList>
        {conversations.map(conv => (
          <ConversationItem key={conv.id} $isActive={conv.id === activeConversationId}>
            <MessageSquare size={18} />
            <ConversationTitle>{conv.title}</ConversationTitle>
          </ConversationItem>
        ))}
      </ConversationList>
    </SidebarContainer>
  );
};

export default ConversationSidebar;
