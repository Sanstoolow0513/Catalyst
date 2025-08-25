import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

// 定义 pulse 动画
const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;
import { motion } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  Bot, 
  User,
  Trash2,
  Loader2,
  Download,
} from 'lucide-react';
import { ILLMMessage, ILLMParams } from '../types/electron';
import { useConfig } from '../contexts/ConfigContext';



// 简洁聊天容器
const ModernChatContainer = styled.div`
  height: 100%;
  background: ${props => props.theme.background};
  position: relative;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  overflow: hidden;
`;

// 主布局容器 - 全屏沉浸式布局
const MainLayout = styled.div`
  display: flex;
  height: 100%;
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 24px;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
`;


// 主聊天区域 - 简洁设计
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.card.shadow};
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
`;

// 聊天头部 - 简洁设计
const ChatHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 聊天标题 - 简洁设计
const ChatTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 聊天操作按钮 - 现代化设计
const ChatActions = styled.div`
  display: flex;
  gap: 12px;
`;

// 简洁按钮设计
const ModernButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'ghost'; $size?: 'sm' | 'md' | 'lg' }>`
  padding: ${props => {
    switch(props.$size) {
      case 'sm': return '8px 16px';
      case 'lg': return '12px 24px';
      default: return '10px 20px';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => {
    switch(props.$size) {
      case 'sm': return '12px';
      case 'lg': return '14px';
      default: return '13px';
    }
  }};
  font-weight: 500;
  transition: all ${props => props.theme.transition.normal} ease;
  cursor: pointer;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  ${props => {
    switch(props.$variant) {
      case 'primary':
        return css`
          background: ${props => props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          border-color: ${props => props.theme.primary.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.primary.dark};
            border-color: ${props => props.theme.primary.dark};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      case 'secondary':
        return css`
          background: ${props => props.theme.secondary.main};
          color: ${props => props.theme.secondary.contrastText};
          border-color: ${props => props.theme.secondary.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.secondary.dark};
            border-color: ${props => props.theme.secondary.dark};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      default:
        return css`
          background: ${props => props.theme.surface};
          color: ${props => props.theme.textSecondary};
          border-color: ${props => props.theme.border};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.surfaceVariant};
            border-color: ${props => props.theme.borderLight};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
`;

// 消息区域 - 现代化设计
const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(37, 99, 235, 0.3)'};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.5)' 
      : 'rgba(37, 99, 235, 0.5)'};
  }
  
  -ms-overflow-style: none;
  scrollbar-width: thin;
`;

// 消息容器 - 现代化设计
const MessageContainer = styled(motion.div)<{ $role: 'user' | 'assistant' | 'system' }>`
  display: flex;
  ${props => props.$role === 'user' ? 'justify-content: flex-end' : 'justify-content: flex-start'};
  scroll-behavior: smooth;
  max-width: 100%;
`;

// 消息气泡 - 简洁设计
const MessageBubble = styled(motion.div)<{ $role: 'user' | 'assistant' | 'system' }>`
  max-width: 70%;
  padding: 16px 20px;
  border-radius: ${props => props.theme.borderRadius.large};
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  border: 1px solid ${props => props.theme.border};
  
  ${props => {
    if (props.$role === 'user') {
      return css`
        background: ${props => props.theme.primary.main};
        color: ${props => props.theme.primary.contrastText};
        border-color: ${props => props.theme.primary.main};
        box-shadow: ${props => props.theme.button.shadow};
        border-bottom-right-radius: ${props => props.theme.borderRadius.small};
      `;
    } else if (props.$role === 'assistant') {
      return css`
        background: ${props => props.theme.surfaceVariant};
        color: ${props => props.theme.textPrimary};
        border-color: ${props => props.theme.border};
        box-shadow: ${props => props.theme.button.shadow};
        border-bottom-left-radius: ${props => props.theme.borderRadius.small};
      `;
    } else {
      return css`
        background: ${props => props.theme.surfaceVariant};
        color: ${props => props.theme.textSecondary};
        border-color: ${props => props.theme.borderLight};
        font-style: italic;
        border-radius: ${props => props.theme.borderRadius.medium};
      `;
    }
  }}
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.button.shadowHover};
  }
`;

// 消息头部
const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
`;

// 消息内容
const MessageContent = styled.div`
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  /* 优化长文本和代码块 */
  white-space: pre-wrap;
  word-break: break-word;
  
  code {
    background: ${props => props.theme.surfaceVariant};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
    color: ${props => props.theme.textPrimary};
  }
  
  pre {
    background: ${props => props.theme.surfaceVariant};
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;
    border: 1px solid ${props => props.theme.border};
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
    
    /* 隐藏代码块的滚动条 */
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${props => props.theme.border};
      border-radius: 2px;
    }
  }
  
  /* 优化链接样式 */
  a {
    color: ${props => props.theme.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* 优化列表样式 */
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 4px 0;
  }
`;

// 输入区域 - 简洁设计
const InputArea = styled.div`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.surface};
  border-top: 1px solid ${props => props.theme.border};
  flex-shrink: 0;
`;

// 输入容器 - 简洁设计
const InputContainer = styled(motion.div)`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: ${props => props.theme.surfaceVariant};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.input.shadow};
  
  &:focus-within {
    border-color: ${props => props.theme.input.borderFocus};
    box-shadow: ${props => props.theme.button.shadowHover};
  }
`;

// 简洁输入框（聊天用）
const ChatInput = styled.textarea`
  flex: 1;
  border: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.input.background};
  color: ${props => props.theme.input.text};
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.medium};
  max-height: 120px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  transition: all ${props => props.theme.transition.normal} ease;
  
  scroll-behavior: smooth;
  
  &::placeholder {
    color: ${props => props.theme.input.placeholder};
  }
  
  &:focus {
    border-color: ${props => props.theme.input.borderFocus};
    box-shadow: ${props => props.theme.button.shadowHover};
  }
  
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.borderLight};
    border-radius: 3px;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: thin;
`;

// 发送按钮 - 简洁设计
const SendButton = styled(motion.button)<{ $disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 1px solid ${props => props.$disabled ? props.theme.borderLight : props.theme.primary.main};
  background: ${props => props.$disabled ? props.theme.surfaceVariant : props.theme.primary.main};
  color: ${props => props.$disabled ? props.theme.textTertiary : props.theme.primary.contrastText};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transition.normal} ease;
  box-shadow: ${props => props.$disabled ? 'none' : props.theme.button.shadow};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primary.dark};
    border-color: ${props => props.theme.primary.dark};
    box-shadow: ${props => props.theme.button.shadowHover};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

// 加载动画
const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme.primary.main};
    animation: ${pulse} 1.4s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

const ModernChatPage: React.FC = () => {
  const { isConfigValid, getLLMRequestConfig, isLoading: configLoading } = useConfig();
  const [messages, setMessages] = useState<ILLMMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  // 发送消息
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // 检查配置是否有效
    if (!isConfigValid) {
      setError('请先在 LLM 配置页面设置有效的配置');
      return;
    }

    const userMessage: ILLMMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // 获取配置
      const config = getLLMRequestConfig();
      if (!config) {
        throw new Error('无法获取有效的LLM配置');
      }

      // 设置提供商配置
      const configResult = await window.electronAPI.llm.setProviderConfig({
        provider: config.provider,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey
      });

      if (!configResult.success) {
        throw new Error(configResult.error || 'Failed to set provider config');
      }

      // 发送消息
      const params: ILLMParams = {
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
      };

      const request = {
        provider: config.provider,
        model: config.model,
        messages: [{ role: 'system' as const, content: config.systemPrompt }, ...messages, userMessage],
        params,
      };

      const result = await window.electronAPI.llm.generateCompletion(request);

      if (result.success && result.data) {
        const assistantMessage: ILLMMessage = { role: 'assistant', content: result.data };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(result.error || 'Failed to get response from LLM');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`An unexpected error occurred: ${errorMessage}`);
      // 移除用户消息
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, isConfigValid, messages]);

  // 清空消息
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // 处理键盘事件
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <ModernChatContainer>
      <MainLayout>
        {/* 聊天区域 */}
        <ChatArea
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ChatHeader>
            <ChatTitle>
              <MessageSquare size={24} />
              AI 助手
              <Sparkles size={20} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            </ChatTitle>
            <ChatActions>
              <ModernButton $variant="ghost" $size="sm" onClick={clearMessages}>
                <Trash2 size={16} />
                清空
              </ModernButton>
              <ModernButton $variant="secondary" $size="sm">
                <Download size={16} />
                导出
              </ModernButton>
            </ChatActions>
          </ChatHeader>

          <MessageArea>
            {useMemo(() => messages.map((message, index) => (
              <MessageContainer 
                key={index} 
                $role={message.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <MessageBubble 
                  $role={message.role}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageHeader>
                    {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    {message.role === 'user' ? '您' : 'AI助手'}
                  </MessageHeader>
                  <MessageContent>{message.content}</MessageContent>
                </MessageBubble>
              </MessageContainer>
            )), [messages])}
            
            {isLoading && (
              <MessageContainer 
                $role="assistant"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <MessageBubble $role="assistant">
                  <MessageHeader>
                    <Bot size={14} />
                    AI助手
                  </MessageHeader>
                  <LoadingDots>
                    <span></span>
                    <span></span>
                    <span></span>
                  </LoadingDots>
                </MessageBubble>
              </MessageContainer>
            )}
          </MessageArea>

          <InputArea>
            <InputContainer
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <ChatInput
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                disabled={isLoading}
                rows={1}
              />
              <SendButton 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isLoading ? <Loader2 size={20} style={{ animation: 'pulse 1s ease-in-out infinite' }} /> : <Send size={20} />}
              </SendButton>
            </InputContainer>
            
            {error && (
              <div style={{ 
                marginTop: '12px', 
                color: '#ef4444', 
                fontSize: '14px', 
                fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                {error}
              </div>
            )}
          </InputArea>
        </ChatArea>
      </MainLayout>
    </ModernChatContainer>
  );
};

export default ModernChatPage;