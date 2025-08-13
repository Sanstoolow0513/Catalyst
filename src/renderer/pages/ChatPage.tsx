import React, { useState } from 'react';
import styled from 'styled-components';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import SettingsPanel from '../components/SettingsPanel';
import Modal from '../components/Modal';
import useChat from '../hooks/useChat';
import { ILLMParams } from '../types/electron';
import { PageContainer, Button, Card } from '../components/common'; // 导入通用组件

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px; /* 调整 padding */
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.foreground}; /* 使用 foreground 作为头部背景 */
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.textPrimary}; /* 使用 textPrimary */
  font-size: 1.8rem;
`;

const ChatWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.background}; /* 使用 background 作为聊天区域背景 */
`;

const MessagesWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px; /* 调整 padding */
`;

const ChatPage: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    updateSettings,
    settings
  } = useChat();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSendMessage = (content: string, params: ILLMParams) => {
    sendMessage(content, params);
  };

  const handleSettingsChange = (newSettings: {
    provider: string;
    model: string;
    apiKey: string;
  }) => {
    updateSettings(newSettings);
    setIsSettingsOpen(false); // Close modal after saving settings
  };

  return (
    <PageContainer>
      <Header>
        <Title>LLM Chat</Title>
        <Button onClick={() => setIsSettingsOpen(true)} variant="secondary" size="medium">
          Settings
        </Button>
      </Header>
      <ChatWrapper>
        <MessagesWrapper>
          <MessageList messages={messages} />
        </MessagesWrapper>
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || !settings.apiKey}
        />
      </ChatWrapper>
      
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <SettingsPanel onSettingsChange={handleSettingsChange} />
      </Modal>
    </PageContainer>
  );
};

export default ChatPage;
