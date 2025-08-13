import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { ILLMMessage } from '../types/electron';

// 容器高度自适应，自动滚动到底部
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* 调整间距 */
  padding: 20px; /* 调整 padding */
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  background: transparent;
`;

// 气泡样式优化，宽度适配大屏，角色区分更明显
const MessageBubble = styled.div<{ role: 'user' | 'assistant' | 'system' }>`
  max-width: 900px;
  width: fit-content;
  padding: 15px 20px; /* 调整 padding */
  border-radius: 16px;
  align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  background-color: ${({ role, theme }) =>
    role === 'user' ? theme.accent :
    theme.foreground /* 助手和系统消息使用 foreground */
  };
  color: ${({ role, theme }) =>
    role === 'user' ? '#FFFFFF' :
    theme.textPrimary /* 助手和系统消息使用 textPrimary */
  };
  box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* 更柔和的阴影 */
  font-size: 1rem;
  line-height: 1.7;
  word-break: break-word;
  position: relative;
  ${({ role }) => role === 'system' && css`
    font-style: italic;
    opacity: 0.7;
  `}
`;

// 角色标签更紧凑
const MessageRole = styled.div<{ role: 'user' | 'assistant' | 'system' }>`
  font-size: 0.8rem; /* 调整字体大小 */
  font-weight: bold;
  margin-bottom: 5px; /* 调整间距 */
  opacity: 0.7;
  color: ${({ role, theme }) =>
    role === 'user' ? '#FFFFFF' :
    theme.textSecondary /* 助手和系统消息使用 textSecondary */
  };
`;

// 支持代码块和多行文本
const MessageContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  code, pre {
    font-family: 'Fira Code', 'Consolas', 'Menlo', monospace; /* 使用 Fira Code */
    background: ${({ theme }) => theme.background}; /* 使用 theme.background */
    color: ${({ theme }) => theme.textPrimary}; /* 使用 theme.textPrimary */
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.97em;
  }
  pre {
    background: ${({ theme }) => theme.background}; /* 使用 theme.background */
    color: ${({ theme }) => theme.textPrimary}; /* 使用 theme.textPrimary */
    padding: 0.8em 1em;
    border-radius: 6px;
    margin: 0.5em 0;
    overflow-x: auto;
  }
`;

// 自动滚动到底部
interface MessageListProps {
  messages: ILLMMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
        <MessageBubble key={index} role={message.role}>
          <MessageRole role={message.role}>
            {message.role === 'user' ? 'You' :
             message.role === 'assistant' ? 'Assistant' : 'System'}
          </MessageRole>
          <MessageContent>{renderContent(message.content)}</MessageContent>
        </MessageBubble>
      ))}
    </MessageContainer>
  );
};

export default MessageList;
