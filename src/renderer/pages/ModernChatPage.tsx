import React, { useState, useEffect } from 'react';
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
  Settings, 
  MessageSquare, 
  Sparkles, 
  Bot, 
  User,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ILLMMessage } from '../types/electron';



// 现代化聊天容器 - 无界化设计
const ModernChatContainer = styled.div`
  height: 100%;
  background: ${props => props.theme.name === 'dark' 
    ? 'linear-gradient(135deg, #030712 0%, #111827 50%, #1f2937 100%)' 
    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'};
  position: relative;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.theme.name === 'dark' 
      ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' 
      : 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)'};
    animation: float 8s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
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

// 现代化配置面板 - 浮动卡片设计
const ConfigPanel = styled(motion.div)<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '80px' : '400px'};
  height: fit-content;
  max-height: calc(100vh - 48px);
  background: ${props => props.theme.name === 'dark' 
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.8))' 
    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(226, 232, 240, 0.8))'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.2)'};
  border-radius: 20px;
  box-shadow: ${props => props.theme.name === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.1)'};
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => props.theme.name === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(37, 99, 235, 0.5)'}, 
      transparent
    );
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

// 配置面板头部
const ConfigHeader = styled.div<{ $collapsed: boolean }>`
  padding: ${props => props.$collapsed ? '16px 12px' : '20px 24px'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.1)' 
    : 'rgba(37, 99, 235, 0.1)'};
  background: ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.05)' 
    : 'rgba(37, 99, 235, 0.05)'};
  border-radius: 20px 20px 0 0;
  transition: padding 0.4s ease;
`;

// 配置面板标题
const ConfigTitle = styled.h2<{ $collapsed: boolean }>`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.textPrimary};
  
  ${props => props.$collapsed && `
    display: none;
  `}
`;

// 折叠按钮
const CollapseButton = styled.button`
  padding: 4px;
  border: none;
  background: transparent;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
    color: ${props => props.theme.textPrimary};
  }
`;

// 配置面板内容
const ConfigContent = styled.div<{ $collapsed: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.$collapsed ? '16px 8px' : '24px'};
  opacity: ${props => props.$collapsed ? 0 : 1};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${props => props.$collapsed ? 'none' : 'auto'};
  
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

// 配置卡片 - 现代化设计

// 现代化输入框
const ModernInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 13px;
  transition: all ${props => props.theme.transition.fast} ease;
  background: ${props => props.theme.input.background};
  color: ${props => props.theme.input.text};
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.input.borderFocus};
    background: ${props => props.theme.surfaceVariant};
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.input.placeholder};
  }
`;

// 现代化选择框
const ModernSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 13px;
  transition: all ${props => props.theme.transition.fast} ease;
  background: ${props => props.theme.input.background};
  color: ${props => props.theme.input.text};
  cursor: pointer;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.input.borderFocus};
    background: ${props => props.theme.surfaceVariant};
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  option {
    background: ${props => props.theme.input.background};
    color: ${props => props.theme.input.text};
  }
`;

// 现代化滑块
const ModernSlider = styled.input`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.border};
  outline: none;
  transition: all ${props => props.theme.transition.fast} ease;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.primary.main};
    cursor: pointer;
    transition: all ${props => props.theme.transition.fast} ease;
  }
  
  &::-webkit-slider-thumb:hover {
    background: ${props => props.theme.primary.light};
    transform: scale(1.1);
  }
`;

// 现代化文本域
const ModernTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 13px;
  transition: all ${props => props.theme.transition.fast} ease;
  background: ${props => props.theme.input.background};
  color: ${props => props.theme.input.text};
  resize: vertical;
  min-height: 60px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.input.borderFocus};
    background: ${props => props.theme.surfaceVariant};
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

// 标签
const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.textTertiary};
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// 主聊天区域 - 现代化设计
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.name === 'dark' 
    ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6))'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.2)'};
  border-radius: 20px;
  box-shadow: ${props => props.theme.name === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.1)'};
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => props.theme.name === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(37, 99, 235, 0.5)'}, 
      transparent
    );
    animation: shimmer 3s ease-in-out infinite;
  }
`;

// 聊天头部 - 现代化设计
const ChatHeader = styled.div`
  padding: 20px 24px;
  background: ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.05)' 
    : 'rgba(37, 99, 235, 0.05)'};
  border-bottom: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.1)' 
    : 'rgba(37, 99, 235, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 聊天标题 - 现代化设计
const ChatTitle = styled.h1`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
  
  span {
    background: ${props => props.theme.name === 'dark' 
      ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' 
      : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

// 聊天操作按钮 - 现代化设计
const ChatActions = styled.div`
  display: flex;
  gap: 12px;
`;

// 现代化按钮 - 无界设计
const ModernButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'ghost'; $size?: 'sm' | 'md' | 'lg' }>`
  padding: ${props => {
    switch(props.$size) {
      case 'sm': return '8px 16px';
      case 'lg': return '12px 24px';
      default: return '10px 20px';
    }
  }};
  border-radius: 12px;
  font-size: ${props => {
    switch(props.$size) {
      case 'sm': return '12px';
      case 'lg': return '14px';
      default: return '13px';
    }
  }};
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  backdrop-filter: blur(10px);
  
  ${props => {
    switch(props.$variant) {
      case 'primary':
        return css`
          background: ${props => props.theme.name === 'dark' 
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.8))' 
            : 'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(124, 58, 237, 0.8))'};
          color: ${props.theme.primary.contrastText};
          border: 1px solid ${props => props.theme.name === 'dark' 
            ? 'rgba(139, 92, 246, 0.3)' 
            : 'rgba(124, 58, 237, 0.3)'};
          box-shadow: ${props => props.theme.name === 'dark' 
            ? '0 4px 16px rgba(59, 130, 246, 0.3)' 
            : '0 4px 16px rgba(37, 99, 235, 0.3)'};
        `;
      case 'secondary':
        return css`
          background: ${props => props.theme.name === 'dark' 
            ? 'linear-gradient(135deg, rgba(100, 116, 139, 0.9), rgba(148, 163, 184, 0.8))' 
            : 'linear-gradient(135deg, rgba(203, 213, 225, 0.9), rgba(226, 232, 240, 0.8))'};
          color: ${props => props.theme.secondary.contrastText};
          border: 1px solid ${props => props.theme.name === 'dark' 
            ? 'rgba(148, 163, 184, 0.3)' 
            : 'rgba(203, 213, 225, 0.3)'};
          box-shadow: ${props => props.theme.name === 'dark' 
            ? '0 4px 16px rgba(100, 116, 139, 0.3)' 
            : '0 4px 16px rgba(100, 116, 139, 0.2)'};
        `;
      default:
        return css`
          background: ${props => props.theme.name === 'dark' 
            ? 'rgba(30, 41, 59, 0.6)' 
            : 'rgba(255, 255, 255, 0.6)'};
          color: ${props.theme.textSecondary};
          border: 1px solid ${props => props.theme.name === 'dark' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(37, 99, 235, 0.2)'};
          backdrop-filter: blur(10px);
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
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

// 消息气泡 - 现代化无界设计
const MessageBubble = styled(motion.div)<{ $role: 'user' | 'assistant' | 'system' }>`
  max-width: 70%;
  padding: 16px 20px;
  border-radius: 20px;
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  backdrop-filter: blur(10px);
  
  ${props => {
    if (props.$role === 'user') {
      return css`
        background: ${props => props.theme.name === 'dark' 
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.8))' 
          : 'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(124, 58, 237, 0.8))'};
        color: ${props.theme.primary.contrastText};
        border: 1px solid ${props => props.theme.name === 'dark' 
          ? 'rgba(139, 92, 246, 0.3)' 
          : 'rgba(124, 58, 237, 0.3)'};
        box-shadow: ${props => props.theme.name === 'dark' 
          ? '0 4px 16px rgba(59, 130, 246, 0.3)' 
          : '0 4px 16px rgba(37, 99, 235, 0.3)'};
        border-bottom-right-radius: 8px;
      `;
    } else if (props.$role === 'assistant') {
      return css`
        background: ${props => props.theme.name === 'dark' 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.8))' 
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8))'};
        color: ${props.theme.textPrimary};
        border: 1px solid ${props => props.theme.name === 'dark' 
          ? 'rgba(59, 130, 246, 0.2)' 
          : 'rgba(37, 99, 235, 0.2)'};
        box-shadow: ${props => props.theme.name === 'dark' 
          ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
          : '0 4px 16px rgba(0, 0, 0, 0.1)'};
        border-bottom-left-radius: 8px;
      `;
    } else {
      return css`
        background: ${props => props.theme.name === 'dark' 
          ? 'rgba(75, 85, 99, 0.3)' 
          : 'rgba(156, 163, 175, 0.2)'};
        color: ${props.theme.textSecondary};
        border: 1px solid ${props => props.theme.name === 'dark' 
          ? 'rgba(75, 85, 99, 0.4)' 
          : 'rgba(156, 163, 175, 0.3)'};
        font-style: italic;
        border-radius: 16px;
      `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.name === 'dark' 
      ? '0 6px 20px rgba(59, 130, 246, 0.4)' 
      : '0 6px 20px rgba(37, 99, 235, 0.4)'};
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

// 输入区域 - 现代化卡片设计
const InputArea = styled.div`
  padding: 20px 24px;
  background: ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.05)' 
    : 'rgba(37, 99, 235, 0.05)'};
  border-top: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.1)' 
    : 'rgba(37, 99, 235, 0.1)'};
  flex-shrink: 0;
`;

// 输入容器 - 现代化卡片设计
const InputContainer = styled(motion.div)`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: ${props => props.theme.name === 'dark' 
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6))'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.2)'};
  border-radius: 20px;
  padding: 16px;
  box-shadow: ${props => props.theme.name === 'dark' 
    ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
    : '0 4px 16px rgba(0, 0, 0, 0.1)'};
  
  &:focus-within {
    border-color: ${props => props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.4)' 
      : 'rgba(37, 99, 235, 0.4)'};
    box-shadow: ${props => props.theme.name === 'dark' 
      ? '0 6px 20px rgba(59, 130, 246, 0.3)' 
      : '0 6px 20px rgba(37, 99, 235, 0.3)'};
  }
`;

// 现代化输入框（聊天用）- 无界设计
const ChatInput = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme.textPrimary};
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 12px 16px;
  border-radius: 12px;
  max-height: 120px;
  font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif;
  transition: all 0.3s ease;
  
  scroll-behavior: smooth;
  
  &::placeholder {
    color: ${props => props.theme.textTertiary};
  }
  
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
  
  -ms-overflow-style: none;
  scrollbar-width: thin;
`;

// 发送按钮 - 现代化设计
const SendButton = styled(motion.button)<{ $disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: ${props => props.$disabled 
    ? (props.theme.name === 'dark' ? 'rgba(75, 85, 99, 0.3)' : 'rgba(156, 163, 175, 0.3)') 
    : (props.theme.name === 'dark' 
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.8))' 
      : 'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(124, 58, 237, 0.8))')};
  color: ${props => props.$disabled ? props.theme.textTertiary : props.theme.primary.contrastText};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$disabled ? 'none' : (props.theme.name === 'dark' 
    ? '0 4px 16px rgba(59, 130, 246, 0.3)' 
    : '0 4px 16px rgba(37, 99, 235, 0.3)')};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    box-shadow: ${props => props.theme.name === 'dark' 
      ? '0 6px 20px rgba(59, 130, 246, 0.4)' 
      : '0 6px 20px rgba(37, 99, 235, 0.4)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.95);
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

// 状态指示器 - 现代化设计
const StatusIndicator = styled(motion.div)<{ $status: 'success' | 'error' | 'loading' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  
  ${props => {
    switch(props.$status) {
      case 'success':
        return css`
          background: ${props.theme.name === 'dark' 
            ? 'rgba(16, 185, 129, 0.2)' 
            : 'rgba(16, 185, 129, 0.1)'};
          color: ${props.theme.success.main};
          border: 1px solid ${props.theme.name === 'dark' 
            ? 'rgba(16, 185, 129, 0.3)' 
            : 'rgba(16, 185, 129, 0.2)'};
        `;
      case 'error':
        return css`
          background: ${props.theme.name === 'dark' 
            ? 'rgba(239, 68, 68, 0.2)' 
            : 'rgba(239, 68, 68, 0.1)'};
          color: ${props.theme.error.main};
          border: 1px solid ${props.theme.name === 'dark' 
            ? 'rgba(239, 68, 68, 0.3)' 
            : 'rgba(239, 68, 68, 0.2)'};
        `;
      default:
        return css`
          background: ${props.theme.name === 'dark' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(37, 99, 235, 0.1)'};
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.name === 'dark' 
            ? 'rgba(59, 130, 246, 0.3)' 
            : 'rgba(37, 99, 235, 0.2)'};
        `;
    }
  }}
  
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
`;

// 配置区域
const ModernChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ILLMMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 配置状态
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(1);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  
  // 折叠状态
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isConfigValid, setIsConfigValid] = useState(false);

  // 检查配置有效性
  useEffect(() => {
    const valid = !!(
      apiKey.trim() && 
      baseUrl.trim() && 
      provider.trim() && 
      model.trim()
    );
    setIsConfigValid(valid);
  }, [apiKey, baseUrl, provider, model]);

  // 从本地存储加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setProvider(config.provider || '');
        setModel(config.model || '');
        setApiKey(config.apiKey || '');
        setBaseUrl(config.baseUrl || '');
        setTemperature(config.temperature || 0.7);
        setMaxTokens(config.maxTokens || 2048);
        setTopP(config.topP || 1);
        setSystemPrompt(config.systemPrompt || 'You are a helpful assistant.');
        setIsConfigCollapsed(config.isConfigCollapsed || false);
      } catch (e) {
        console.error('Failed to parse saved config', e);
      }
    }
  }, []);

  // 保存配置
  const saveConfig = () => {
    const config = {
      provider,
      model,
      apiKey,
      baseUrl,
      temperature,
      maxTokens,
      topP,
      systemPrompt,
      isConfigCollapsed
    };
    localStorage.setItem('llmConfig', JSON.stringify(config));
  };

  // 切换配置面板折叠状态
  const toggleConfigPanel = () => {
    const newState = !isConfigCollapsed;
    setIsConfigCollapsed(newState);
    
    // 立即保存折叠状态
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        config.isConfigCollapsed = newState;
        localStorage.setItem('llmConfig', JSON.stringify(config));
      } catch (e) {
        console.error('Failed to update config collapse state', e);
      }
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isConfigValid || isLoading) return;
    
    saveConfig();
    
    const userMessage: ILLMMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // 设置提供商配置
      const configResult = await window.electronAPI.llm.setProviderConfig({
        provider,
        baseUrl,
        apiKey
      });

      if (!configResult.success) {
        throw new Error(configResult.error || 'Failed to set provider config');
      }
      
      // 同时保存API密钥
      await window.electronAPI.llm.setApiKey(provider, apiKey);

      // 发送消息
      const params = {
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
      };

      const request = {
        provider,
        model,
        messages: [{ role: 'system' as const, content: systemPrompt }, ...messages, userMessage],
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
  };

  // 清空消息
  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 提供商URL映射
  const providerUrls = {
    openai: 'https://api.openai.com/v1',
    gemini: 'https://generativelanguage.googleapis.com/v1beta',
    openrouter: 'https://openrouter.ai/api/v1',
  };

  // 处理提供商变更
  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    if (providerUrls[newProvider as keyof typeof providerUrls]) {
      setBaseUrl(providerUrls[newProvider as keyof typeof providerUrls]);
    }
  };

  return (
    <ModernChatContainer>
      <MainLayout>
        {/* 配置面板 */}
        <ConfigPanel 
          $collapsed={isConfigCollapsed}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ConfigHeader $collapsed={isConfigCollapsed}>
            <ConfigTitle $collapsed={isConfigCollapsed}>
              <Settings size={20} />
              模型配置
            </ConfigTitle>
            <CollapseButton onClick={toggleConfigPanel}>
              {isConfigCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </CollapseButton>
          </ConfigHeader>
          
          <ConfigContent $collapsed={isConfigCollapsed}>
            {/* 基本配置 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Label>提供商</Label>
                <ModernSelect value={provider} onChange={(e) => handleProviderChange(e.target.value)}>
                  <option value="">选择提供商</option>
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="custom">自定义</option>
                </ModernSelect>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <Label>API Key</Label>
                <ModernInput
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入您的 API 密钥"
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <Label>模型</Label>
                <ModernInput
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="输入模型名称"
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <Label>Base URL</Label>
                <ModernInput
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="输入 API 基础 URL"
                />
              </div>
            </div>

            {/* 高级配置 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Label>Temperature: {temperature}</Label>
                <ModernSlider
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <Label>Max Tokens: {maxTokens}</Label>
                <ModernSlider
                  type="range"
                  min="1"
                  max="8192"
                  step="1"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                />
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <Label>Top P: {topP}</Label>
                <ModernSlider
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* 系统提示词 */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <Label>系统提示词</Label>
                <ModernTextarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="输入系统提示词..."
                />
              </div>
            </div>

            {/* 状态指示器 */}
            <div>
              <StatusIndicator $status={isConfigValid ? 'success' : 'error'}>
                {isConfigValid ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {isConfigValid ? '配置完成' : '配置未完成'}
              </StatusIndicator>
            </div>
          </ConfigContent>
        </ConfigPanel>

        {/* 聊天区域 */}
        <ChatArea
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ChatHeader>
            <ChatTitle>
              <MessageSquare size={24} />
              <span>AI对话</span>
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
            {messages.map((message, index) => (
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
            ))}
            
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
                disabled={isLoading || !isConfigValid}
                rows={1}
              />
              <SendButton 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !isConfigValid}
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