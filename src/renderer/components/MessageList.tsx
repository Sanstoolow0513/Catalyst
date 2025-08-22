import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ILLMMessage } from '../types/electron';

// 容器高度自适应，自动滚动到底部
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  background: transparent;
`;

// 消息项容器
const MessageItem = styled.div<{ role: 'user' | 'assistant' | 'system' }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
  width: 100%;
`;

// 消息气泡
const MessageBubble = styled.div<{ role: 'user' | 'assistant' | 'system' }>`
  max-width: 85%;
  width: fit-content;
  padding: 20px 24px;
  border-radius: ${props => props.theme.borderRadius.xlarge};
  background-color: ${props => 
    props.role === 'user' ? 
    props.theme.accent : 
    props.theme.foreground
  };
  color: ${props => 
    props.role === 'user' ? 
    '#FFFFFF' : 
    props.theme.textPrimary
  };
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-size: 1rem;
  line-height: 1.6;
  word-break: break-word;
  position: relative;
  
  // 用户消息右对齐，圆角在左下角
  ${props => props.role === 'user' && `
    border-bottom-left-radius: 8px;
  `}
  
  // 助手消息左对齐，圆角在右下角
  ${props => props.role === 'assistant' && `
    border-bottom-right-radius: 8px;
  `}
  
  ${props => props.role === 'system' && `
    font-style: italic;
    opacity: 0.7;
    max-width: 100%;
    background-color: ${props.theme.surfaceVariant};
  `}
`;

// 角色标签
const MessageRole = styled.div<{ role: 'user' | 'assistant' | 'system' }>`
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  opacity: 0.8;
  color: ${props => 
    props.role === 'user' ? 
    props.theme.accent : 
    props.theme.textSecondary
  };
`;

// 消息内容
const MessageContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  
  code, pre {
    font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
    background: ${({ theme }) => theme.surfaceVariant};
    color: ${({ theme }) => theme.textPrimary};
    padding: 0.3em 0.5em;
    border-radius: 8px;
    font-size: 0.95em;
  }
  
  pre {
    background: ${({ theme }) => theme.surfaceVariant};
    color: ${({ theme }) => theme.textPrimary};
    padding: 1.2em;
    border-radius: 12px;
    margin: 0.8em 0;
    overflow-x: auto;
    border: none;
  }
  
  p {
    margin: 0.8em 0;
  }
  
  ul, ol {
    margin: 0.8em 0;
    padding-left: 1.5em;
  }
  
  li {
    margin: 0.3em 0;
  }
  
  blockquote {
    border-left: 3px solid ${({ theme }) => theme.accent};
    margin: 0.8em 0;
    padding-left: 1em;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

// 自动滚动到底部
interface MessageListProps {
  messages: ILLMMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // 简单的代码块高亮（支持markdown风格的```代码块```）
  function renderContent(content: string) {
    // 支持markdown代码块
    const codeBlockRegex = /```([\s\S]*?)```/g;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        elements.push(
          <span key={key++}>{content.slice(lastIndex, match.index)}</span>
        );
      }
      elements.push(
        <pre key={key++}><code>{match[1]}</code></pre>
      );
      lastIndex = codeBlockRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      elements.push(<span key={key++}>{content.slice(lastIndex)}</span>);
    }
    return elements;
  }

  return (
    <MessageContainer ref={containerRef}>
      {messages.map((message, index) => (
        <MessageItem key={index} role={message.role}>
          <MessageRole role={message.role}>
            {message.role === 'user' ? 'You' :
             message.role === 'assistant' ? 'Assistant' : 'System'}
          </MessageRole>
          <MessageBubble role={message.role}>
            <MessageContent>{renderContent(message.content)}</MessageContent>
          </MessageBubble>
        </MessageItem>
      ))}
    </MessageContainer>
  );
};

export default MessageList;