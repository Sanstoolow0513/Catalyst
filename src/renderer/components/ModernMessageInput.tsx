import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Send, Paperclip, Mic, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// 动画定义
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;


// 现代化输入容器
const ModernInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: ${props => props.theme.surfaceVariant};
  backdrop-filter: blur(20px);
  border-top: 1px solid ${props => props.theme.border};
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

// 输入区域包装器
const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: ${props => props.theme.surface};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.border};
  transition: all ${props => props.theme.transition.normal} ease;
  
  &:focus-within {
    border-color: ${props => props.theme.primary.main};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: ${props => props.theme.borderLight};
  }
`;

// 现代化文本区域
const ModernTextArea = styled.textarea<{ $isLoading?: boolean }>`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme.textPrimary};
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 12px 16px;
  border-radius: ${props => props.theme.borderRadius.medium};
  min-height: 20px;
  max-height: 120px;
  transition: all ${props => props.theme.transition.normal} ease;
  opacity: ${props => props.$isLoading ? 0.7 : 1};
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  &::placeholder {
    color: ${props => props.theme.textTertiary};
  }
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.borderLight};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 2px;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// 按钮容器
const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// 现代化按钮
const ModernButton = styled.button<{ 
  $variant?: 'primary' | 'secondary' | 'ghost'; 
  $size?: 'sm' | 'md' | 'lg';
  $isLoading?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => {
    const size = props.$size || 'md';
    const sizeMap = {
      sm: { width: '32px', height: '32px', iconSize: 14 },
      md: { width: '40px', height: '40px', iconSize: 18 },
      lg: { width: '48px', height: '48px', iconSize: 20 }
    };
    
    const { width, height, iconSize } = sizeMap[size];
    
    return css`
      width: ${width};
      height: ${height};
      
      svg {
        width: ${iconSize}px;
        height: ${iconSize}px;
      }
    `;
  }}
  
  ${props => {
    if (props.$variant === 'primary') {
      return css`
        background: ${props.theme.primary.main};
        color: ${props.theme.primary.contrastText};
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        
        &:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          background: ${props.theme.primary.light};
        }
        
        &:active:not(:disabled) {
          transform: translateY(0) scale(0.95);
        }
        
        &:disabled {
          background: ${props => props.theme.border};
          cursor: not-allowed;
          box-shadow: none;
          color: ${props => props.theme.textTertiary};
        }
      `;
    } else {
      return css`
        background: ${props.theme.surfaceVariant};
        color: ${props.theme.textPrimary};
        border: 1px solid ${props => props.theme.border};
        
        &:hover:not(:disabled) {
          background: ${props.theme.surface};
          transform: translateY(-1px);
          border-color: ${props => props.theme.borderLight};
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
        }
        
        &:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `;
    }
  }}
  
  ${props => props.$isLoading && css`
    pointer-events: none;
    opacity: 0.7;
  `}
`;

// 字符计数器
const CharCounter = styled.div<{ $isNearLimit?: boolean }>`
  font-size: 12px;
  color: ${props => props.$isNearLimit ? props.theme.error.main : props.theme.textSecondary};
  text-align: right;
  margin-top: 4px;
  transition: color ${props => props.theme.transition.normal} ease;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

// 快捷操作栏
const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
`;

// 快捷操作按钮
const QuickActionButton = styled.button`
  background: ${props => props.theme.surfaceVariant};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 6px 12px;
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  cursor: pointer;
  transition: all ${props => props.theme.transition.normal} ease;
  backdrop-filter: blur(10px);
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  &:hover {
    background: ${props => props.theme.surface};
    transform: translateY(-1px);
    border-color: ${props => props.theme.borderLight};
    color: ${props => props.theme.textPrimary};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// 错误提示
const ErrorMessage = styled.div`
  background: ${props => props.theme.error.main}20;
  border: 1px solid ${props => props.theme.error.main}40;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 8px 12px;
  color: ${props => props.theme.error.main};
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

// 提示信息
const HintMessage = styled.div`
  background: ${props => props.theme.primary.main}20;
  border: 1px solid ${props => props.theme.primary.main}40;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 8px 12px;
  color: ${props => props.theme.textPrimary};
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
`;

interface ModernMessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string | null;
  maxLength?: number;
  placeholder?: string;
  showQuickActions?: boolean;
  quickActions?: Array<{ label: string; action: () => void }>;
}

const ModernMessageInput: React.FC<ModernMessageInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
  error = null,
  maxLength = 4000,
  placeholder = "输入您的问题...",
  showQuickActions = true,
  quickActions = []
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // 处理发送消息
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理快捷操作
  const handleQuickAction = (action: () => void) => {
    action();
  };

  // 默认快捷操作
  const defaultQuickActions = [
    { label: "解释代码", action: () => setMessage("请解释以下代码的作用和原理：\n\n") },
    { label: "总结内容", action: () => setMessage("请总结以下内容：\n\n") },
    { label: "翻译", action: () => setMessage("请将以下内容翻译成英文：\n\n") },
    { label: "生成代码", action: () => setMessage("请生成一个实现以下功能的代码：\n\n") }
  ];

  const actions = quickActions.length > 0 ? quickActions : defaultQuickActions;

  const isNearLimit = message.length > maxLength * 0.9;
  const canSend = message.trim().length > 0 && !disabled && !isLoading;

  return (
    <ModernInputContainer>
      {/* 快捷操作栏 */}
      {showQuickActions && (
        <QuickActions>
          {actions.map((action, index) => (
            <QuickActionButton
              key={index}
              onClick={() => handleQuickAction(action.action)}
              disabled={disabled || isLoading}
            >
              {action.label}
            </QuickActionButton>
          ))}
        </QuickActions>
      )}

      {/* 主要输入区域 */}
      <InputWrapper>
        <ModernTextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          $isLoading={isLoading}
          rows={1}
          maxLength={maxLength}
        />
        
        <ButtonContainer>
          {/* 附件按钮 */}
          <ModernButton
            $variant="ghost"
            $size="md"
            disabled={disabled || isLoading}
            title="添加附件"
          >
            <Paperclip size={18} />
          </ModernButton>
          
          {/* 语音按钮 */}
          <ModernButton
            $variant="ghost"
            $size="md"
            disabled={disabled || isLoading}
            title="语音输入"
          >
            <Mic size={18} />
          </ModernButton>
          
          {/* 发送按钮 */}
          <ModernButton
            $variant="primary"
            $size="lg"
            onClick={handleSend}
            disabled={!canSend}
            $isLoading={isLoading}
            title={canSend ? "发送消息" : "请输入消息"}
          >
            {isLoading ? (
              <Loader2 size={20} style={{ animation: `${pulse} 1s ease-in-out infinite` }} />
            ) : (
              <Send size={20} />
            )}
          </ModernButton>
        </ButtonContainer>
      </InputWrapper>

      {/* 字符计数器 */}
      <CharCounter $isNearLimit={isNearLimit}>
        {message.length} / {maxLength}
      </CharCounter>

      {/* 错误提示 */}
      {error && (
        <ErrorMessage>
          ❌
          {error}
        </ErrorMessage>
      )}

      {/* 提示信息 */}
      {isFocused && !error && (
        <HintMessage>
          <span>💡</span>
          按 Enter 发送，Shift + Enter 换行
        </HintMessage>
      )}
    </ModernInputContainer>
  );
};

export default ModernMessageInput;