import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  MessageCircle, 
  Trash2, 
  Download, 
  Copy,
  MoreHorizontal,
  User,
  Bot,
  Loader2
} from 'lucide-react';
import { ChatMessage, ChatConfig, ChatSession } from '../types/chat';
import { ILLMMessage } from '../types/electron';

interface ChatAreaProps {
  messages: ChatMessage[];
  config: ChatConfig;
  isLoading: boolean;
  error: string | null;
  onSendMessage: (content: string) => void;
  onClearMessages: () => void;
  onExportChat: () => void;
}

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  overflow: hidden;
  min-width: 0;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surfaceVariant};
`;

const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleText = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

const ModelBadge = styled.span`
  background: ${props => props.theme.primary.main};
  color: ${props => props.theme.primary.contrastText};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
`;

const ChatActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.textSecondary};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
    color: ${props => props.theme.textPrimary};
    border-color: ${props => props.theme.primary.main};
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.textTertiary};
  }
`;

const MessageContainer = styled(motion.div)<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 12px;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  word-wrap: break-word;
  
  ${props => props.$isUser ? `
    background: ${props.theme.primary.main};
    color: ${props.theme.primary.contrastText};
    border-bottom-right-radius: 4px;
  ` : `
    background: ${props.theme.surfaceVariant};
    color: ${props.theme.textPrimary};
    border-bottom-left-radius: 4px;
    border: 1px solid ${props.theme.border};
  `}
  
  /* 处理长文本和代码块 */
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ${props => props.$isUser ? 'inherit' : '"Inter", system-ui, sans-serif'};
  font-size: 14px;
  line-height: 1.5;
`;

const MessageMeta = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.$isUser ? 'rgba(255,255,255,0.8)' : props.theme.textTertiary};
`;

const MessageContent = styled.div`
  /* 代码块样式 */
  pre {
    background: rgba(0,0,0,0.1);
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
    margin: 8px 0;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 12px;
  }
  
  code {
    background: rgba(0,0,0,0.1);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 13px;
  }
  
  /* 列表样式 */
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 2px 0;
  }
  
  /* 链接样式 */
  a {
    color: inherit;
    text-decoration: underline;
    opacity: 0.9;
  }
`;

const MessageActions = styled.div`
  position: absolute;
  top: -12px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  gap: 4px;
`;

const MessageActionButton = styled.button`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.textSecondary};
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
    color: ${props => props.theme.textPrimary};
  }
`;

const MessageWrapper = styled.div`
  &:hover ${MessageActions} {
    opacity: 1;
  }
`;

const InputArea = styled.div`
  padding: 20px;
  border-top: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surfaceVariant};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: ${props => props.theme.surface};
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.2s ease;
  
  &:focus-within {
    border-color: ${props => props.theme.primary.main};
  }
`;

const TextInput = styled.textarea`
  flex: 1;
  border: none;
  background: none;
  color: ${props => props.theme.textPrimary};
  font-size: 14px;
  resize: none;
  outline: none;
  min-height: 20px;
  max-height: 120px;
  font-family: inherit;
  line-height: 1.4;
  
  &::placeholder {
    color: ${props => props.theme.textTertiary};
  }
`;

const SendButton = styled.button<{ $disabled?: boolean }>`
  background: ${props => props.$disabled ? props.theme.textTertiary : props.theme.primary.main};
  border: none;
  color: ${props => props.$disabled ? props.theme.textSecondary : props.theme.primary.contrastText};
  padding: 8px;
  border-radius: 6px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primary.dark};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.textTertiary};
  gap: 12px;
`;

const EmptyStateIcon = styled.div`
  color: ${props => props.theme.textTertiary};
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 14px;
  text-align: center;
`;

const LoadingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  color: ${props => props.theme.textSecondary};
  font-size: 13px;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: ${props => props.theme.error.main};
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 20px 0;
  font-size: 13px;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  config,
  isLoading,
  error,
  onSendMessage,
  onClearMessages,
  onExportChat
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // TODO: 显示复制成功提示
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>
          <MessageCircle size={20} />
          <TitleText>AI 对话</TitleText>
          {config.model && (
            <ModelBadge>{config.model}</ModelBadge>
          )}
        </ChatTitle>
        <ChatActions>
          <ActionButton onClick={onClearMessages} disabled={messages.length === 0}>
            <Trash2 size={14} />
            清空
          </ActionButton>
          <ActionButton onClick={onExportChat} disabled={messages.length === 0}>
            <Download size={14} />
            导出
          </ActionButton>
        </ChatActions>
      </ChatHeader>

      <MessagesArea>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <MessageCircle size={48} />
            </EmptyStateIcon>
            <EmptyStateText>
              开始您的第一个对话吧！<br />
              输入问题或想法，AI 将为您提供帮助。
            </EmptyStateText>
          </EmptyState>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message) => (
                <MessageWrapper key={message.id}>
                  <MessageContainer
                    $isUser={message.role === 'user'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MessageBubble $isUser={message.role === 'user'}>
                      <MessageMeta $isUser={message.role === 'user'}>
                        {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                        {message.role === 'user' ? '您' : 'AI'}
                        <span>•</span>
                        <span>{formatTimestamp(message.timestamp)}</span>
                        {message.tokens && (
                          <>
                            <span>•</span>
                            <span>{message.tokens} tokens</span>
                          </>
                        )}
                      </MessageMeta>
                      <MessageContent>{message.content}</MessageContent>
                      <MessageActions>
                        <MessageActionButton onClick={() => copyMessage(message.content)}>
                          <Copy size={12} />
                        </MessageActionButton>
                        <MessageActionButton>
                          <MoreHorizontal size={12} />
                        </MessageActionButton>
                      </MessageActions>
                    </MessageBubble>
                  </MessageContainer>
                </MessageWrapper>
              ))}
            </AnimatePresence>

            {isLoading && (
              <LoadingIndicator
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 size={16} className="animate-spin" />
                AI 正在思考...
              </LoadingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesArea>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      <InputArea>
        <InputContainer>
          <TextInput
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={config.provider ? "输入消息..." : "请先配置模型"}
            disabled={!config.provider || isLoading}
          />
          <SendButton 
            $disabled={!inputValue.trim() || !config.provider || isLoading}
            onClick={handleSend}
          >
            {isLoading ? <Loader2 size={16} /> : <Send size={16} />}
          </SendButton>
        </InputContainer>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatArea;