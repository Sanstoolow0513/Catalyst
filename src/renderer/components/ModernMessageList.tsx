import React from 'react';
import { MessageSquare } from 'lucide-react';
import styled, { keyframes, css } from 'styled-components';
import { Bot, User, Copy, AlertCircle } from 'lucide-react';
import { ILLMMessage } from '../types/electron';

// 动画定义
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;


const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// 现代化消息容器
const ModernMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

// 消息项
const ModernMessageItem = styled.div<{ $role: 'user' | 'assistant' | 'system' }>`
  display: flex;
  ${props => props.$role === 'user' ? 'justify-content: flex-end' : 'justify-content: flex-start'};
  animation: ${fadeInUp} 0.6s ease-out;
  animation-fill-mode: both;
  
  ${css`
    animation-delay: ${Math.random() * 0.3}s;
  `}
`;

// 消息气泡容器
const ModernMessageBubbleContainer = styled.div<{ $role: 'user' | 'assistant' | 'system' }>`
  display: flex;
  flex-direction: column;
  ${props => props.$role === 'user' ? 'align-items: flex-end' : 'align-items: flex-start'};
  max-width: 70%;
  min-width: 200px;
`;

// 消息头部
const ModernMessageHeader = styled.div<{ $role: 'user' | 'assistant' | 'system' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    switch(props.$role) {
      case 'user': return props.theme.primary.main;
      case 'assistant': return props.theme.success.main;
      default: return props.theme.textSecondary;
    }
  }};
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

// 消息时间戳
const ModernMessageTimestamp = styled.span`
  font-size: 11px;
  opacity: 0.7;
  font-weight: normal;
`;

// 消息气泡
const ModernMessageBubble = styled.div<{ $role: 'user' | 'assistant' | 'system' }>`
  padding: 16px 20px;
  border-radius: 20px;
  position: relative;
  word-wrap: break-word;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  ${props => {
    if (props.$role === 'user') {
      return css`
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-bottom-right-radius: 4px;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
          border-radius: 20px;
          pointer-events: none;
        }
      `;
    } else if (props.$role === 'assistant') {
      return css`
        background: rgba(255, 255, 255, 0.95);
        color: #1f2937;
        border-bottom-left-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
      `;
    } else {
      return css`
        background: rgba(156, 163, 175, 0.1);
        color: #6b7280;
        border: 1px solid rgba(156, 163, 175, 0.2);
        font-style: italic;
        backdrop-filter: blur(5px);
      `;
    }
  }}
`;

// 消息内容
const ModernMessageContent = styled.div`
  line-height: 1.6;
  font-size: 15px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  /* 代码块样式 */
  pre {
    background: ${props => props.theme.surfaceVariant};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
    overflow-x: auto;
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.4;
  }
  
  /* 行内代码样式 */
  code {
    background: ${props => props.theme.surfaceVariant};
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    padding: 2px 6px;
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
    font-size: 13px;
  }
  
  /* 段落样式 */
  p {
    margin: 8px 0;
  }
  
  /* 列表样式 */
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin: 4px 0;
  }
  
  /* 引用样式 */
  blockquote {
    border-left: 3px solid ${props => props.theme.primary.main};
    margin: 8px 0;
    padding-left: 12px;
    color: ${props => props.theme.textSecondary};
    font-style: italic;
  }
  
  /* 链接样式 */
  a {
    color: ${props => props.theme.primary.main};
    text-decoration: none;
    transition: color ${props => props.theme.transition.normal} ease;
    
    &:hover {
      color: ${props => props.theme.primary.light};
      text-decoration: underline;
    }
  }
  
  /* 表格样式 */
  table {
    border-collapse: collapse;
    margin: 8px 0;
    width: 100%;
  }
  
  th, td {
    border: 1px solid ${props => props.theme.border};
    padding: 8px 12px;
    text-align: left;
  }
  
  th {
    background: ${props => props.theme.surfaceVariant};
    font-weight: 600;
  }
`;

// 消息操作按钮
const ModernMessageActions = styled.div<{ $role: 'user' | 'assistant' | 'system' }>`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ModernMessageBubbleContainer}:hover & {
    opacity: 1;
  }
`;

// 操作按钮
const ActionButton = styled.button`
  background: ${props => props.theme.surfaceVariant};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 4px 8px;
  font-size: 11px;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all ${props => props.theme.transition.normal} ease;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  &:hover {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.textPrimary};
  }
`;

// 加载状态
const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: ${props => props.theme.surface};
  border-radius: ${props => props.theme.borderRadius.large};
  border-bottom-left-radius: 4px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.primary.main};
    animation: ${pulse} 1.4s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

// 错误状态
const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.theme.error.main}20;
  border: 1px solid ${props => props.theme.error.main}40;
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.error.main};
  font-size: 14px;
  margin: 16px 0;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

// 空状态
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: ${props => props.theme.textSecondary};
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

const EmptyStateIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  animation: ${float} 3s ease-in-out infinite;
`;

const EmptyStateText = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.textPrimary};
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

const EmptyStateSubtext = styled.div`
  font-size: 14px;
  opacity: 0.7;
  color: ${props => props.theme.textSecondary};
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

interface ModernMessageListProps {
  messages: ILLMMessage[];
  isLoading?: boolean;
  error?: string | null;
}

const ModernMessageList: React.FC<ModernMessageListProps> = ({ 
  messages, 
  isLoading = false, 
  error = null 
}) => {
  // 格式化时间戳
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      if (typeof window !== 'undefined' && window.navigator) {
        await (window.navigator as any).clipboard.writeText(text);
      }
      // 这里可以添加一个提示
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // 渲染消息内容（支持简单的 Markdown）
  const renderMessageContent = (content: string) => {
    // 简单的代码块处理
    const codeBlockRegex = /```([\\s\\S]*?)```/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    
    let processedContent = content;
    
    // 处理代码块
    processedContent = processedContent.replace(codeBlockRegex, (match, code) => {
      return `<pre><code>${code}</code></pre>`;
    });
    
    // 处理行内代码
    processedContent = processedContent.replace(inlineCodeRegex, (match, code) => {
      return `<code>${code}</code>`;
    });
    
    return processedContent;
  };

  return (
    <ModernMessageContainer>
      {error && (
        <ErrorMessage>
          <AlertCircle size={16} />
          {error}
        </ErrorMessage>
      )}
      
      {messages.length === 0 && !isLoading && (
        <EmptyState>
          <EmptyStateIcon>
            <MessageSquare size={40} color="white" />
          </EmptyStateIcon>
          <EmptyStateText>开始对话</EmptyStateText>
          <EmptyStateSubtext>
            输入您的问题，AI助手将为您提供帮助
          </EmptyStateSubtext>
        </EmptyState>
      )}
      
      {messages.map((message, index) => (
        <ModernMessageItem key={index} $role={message.role}>
          <ModernMessageBubbleContainer $role={message.role}>
            <ModernMessageHeader $role={message.role}>
              {message.role === 'user' ? (
                <User size={14} />
              ) : (
                <Bot size={14} />
              )}
              {message.role === 'user' ? '您' : 
               message.role === 'assistant' ? 'AI助手' : '系统'}
              <ModernMessageTimestamp>
                {formatTimestamp(new Date())}
              </ModernMessageTimestamp>
            </ModernMessageHeader>
            
            <ModernMessageBubble $role={message.role}>
              <ModernMessageContent 
                dangerouslySetInnerHTML={{ 
                  __html: renderMessageContent(message.content) 
                }}
              />
            </ModernMessageBubble>
            
            <ModernMessageActions $role={message.role}>
              <ActionButton onClick={() => copyToClipboard(message.content)}>
                <Copy size={12} />
                复制
              </ActionButton>
            </ModernMessageActions>
          </ModernMessageBubbleContainer>
        </ModernMessageItem>
      ))}
      
      {isLoading && (
        <ModernMessageItem $role="assistant">
          <ModernMessageBubbleContainer $role="assistant">
            <ModernMessageHeader $role="assistant">
              <Bot size={14} />
              AI助手
            </ModernMessageHeader>
            <LoadingIndicator>
              <LoadingDots>
                <span></span>
                <span></span>
                <span></span>
              </LoadingDots>
              <span>正在思考...</span>
            </LoadingIndicator>
          </ModernMessageBubbleContainer>
        </ModernMessageItem>
      )}
    </ModernMessageContainer>
  );
};

export default ModernMessageList;