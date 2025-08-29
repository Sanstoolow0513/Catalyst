import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// 欢迎卡片样式
export const WelcomeCard = styled(motion.div)<{ $isDarkMode?: boolean; $isGlassMode?: boolean }>`
  background: ${props => {
    if (props.$isGlassMode) {
      return 'linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)';
    }
    return props.$isDarkMode 
      ? 'linear-gradient(135deg, #1e293b, #334155)' 
      : 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
  }};
  border-radius: 20px;
  padding: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: ${props => {
    if (props.$isGlassMode) {
      return '1px solid rgba(148, 163, 184, 0.15)';
    }
    return `1px solid ${props.theme.border}`;
  }};
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  align-items: center;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
  box-shadow: ${props => {
    if (props.$isGlassMode) {
      return '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)';
    }
    return '0 1px 2px rgba(0, 0, 0, 0.05)';
  }};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${props => {
      if (props.$isGlassMode) {
        return 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(167, 139, 250, 0.05) 30%, transparent 60%)';
      }
      return props.$isDarkMode 
        ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' 
        : 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)';
    }};
    animation: float 12s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isGlassMode 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)' 
      : 'none'};
    pointer-events: none;
    border-radius: 20px;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

export const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
`;

export const WelcomeTitle = styled.h2<{ $isGlassMode?: boolean }>`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.8rem 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

export const WelcomeSubtitle = styled.p<{ $isGlassMode?: boolean }>`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

// 内容区域样式
export const ContentSection = styled(motion.div)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// 玻璃页面容器
export const GlassPageContainer = styled.div<{ $isGlassMode?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${props => props.$isGlassMode 
    ? 'transparent' 
    : (props.theme?.background || '#F9FAFB')};
  color: ${props => props.theme?.textPrimary || '#111827'};
  padding: 0;
  position: relative;
  
  ${props => props.$isGlassMode && `
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(244, 114, 182, 0.04) 0%, transparent 50%),
        linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%);
      z-index: -2;
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 60% 40%, rgba(34, 197, 94, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.03) 0%, transparent 40%);
      z-index: -1;
      pointer-events: none;
      animation: ambient 20s ease-in-out infinite;
    }
  `}
  
  @keyframes ambient {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.$isGlassMode ? 'rgba(51, 65, 85, 0.2)' : 'transparent'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isGlassMode ? 'rgba(148, 163, 184, 0.3)' : (props.theme?.border || '#E5E7EB')};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.$isGlassMode ? 'rgba(203, 213, 225, 0.5)' : (props.theme?.textTertiary || '#9CA3AF')};
    }
  }
`;

// 简单的卡片样式
export const SimpleCard = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 12px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme.surfaceVariant};
  }
`;

// 网格布局样式
export const GridContainer = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 1}, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 列表样式
export const SimpleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ListItem = styled(motion.div)<{ $isGlassMode?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.12)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  transition: all 0.2s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 12px;
  }
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme.surfaceVariant};
    box-shadow: ${props => props.$isGlassMode 
      ? '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  }
`;

// 图标容器
export const IconContainer = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

export const SmallIconContainer = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

// 内容容器
export const ContentContainer = styled.div`
  flex: 1;
`;

export const TitleContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SubtitleContainer = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

// 页面布局
export const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
`;

// 区块标题
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  background: ${props => props.theme?.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.1)'
  };
  color: ${props => props.theme?.primary?.main || '#2563EB'};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme?.textPrimary || '#111827'};
  font-size: 1.3rem;
  font-weight: 600;
`;

export const SectionDescription = styled.p`
  margin: 0;
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  font-size: 0.95rem;
  line-height: 1.5;
`;

// 按钮样式
export const ActionButton = styled(motion.button)<{ 
  $variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  $isGlassMode?: boolean;
  size?: string;
}>`
  padding: 12px 24px;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.95rem;
  font-weight: 500;
  transition: all ${props => props.theme.transition.normal} ease;
  cursor: pointer;
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(10px)' : 'none'};
  
  ${props => {
    switch(props.$variant) {
      case 'primary':
        return `
          background: ${props => props.theme.primary.main};
          color: ${props => props.theme.primary.contrastText};
          border-color: ${props => props.theme.primary.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.primary.dark};
            border-color: ${props => props.theme.primary.dark};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      case 'danger':
        return `
          background: ${props => props.theme.error.main};
          color: ${props => props.theme.error.contrastText};
          border-color: ${props => props.theme.error.main};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.theme.error.dark};
            border-color: ${props => props.theme.error.dark};
            box-shadow: ${props => props.theme.button.shadowHover};
          }
        `;
      default:
        return `
          background: ${props => props.$isGlassMode 
            ? 'rgba(30, 41, 59, 0.1)' 
            : props.theme.surface};
          color: ${props => props.theme.textPrimary};
          border-color: ${props => props.theme.border};
          box-shadow: ${props => props.theme.button.shadow};
          
          &:hover {
            background: ${props => props.$isGlassMode 
              ? 'rgba(51, 65, 85, 0.15)' 
              : props.theme.surfaceVariant};
            border-color: ${props => props.theme.primary.main};
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

// 通用组件接口
export interface CommonPageProps {
  isDarkMode?: boolean;
  isGlassMode?: boolean;
  children: React.ReactNode;
}

export interface WelcomeCardProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  isDarkMode?: boolean;
  isGlassMode?: boolean;
}

export const WelcomeCardComponent: React.FC<WelcomeCardProps> = ({
  title,
  subtitle,
  icon,
  isDarkMode = false,
  isGlassMode = false,
}) => {
  return (
    <WelcomeCard
      $isDarkMode={isDarkMode}
      $isGlassMode={isGlassMode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <WelcomeContent>
        <WelcomeTitle $isGlassMode={isGlassMode}>
          {icon}
          {title}
        </WelcomeTitle>
        <WelcomeSubtitle $isGlassMode={isGlassMode}>
          {subtitle}
        </WelcomeSubtitle>
      </WelcomeContent>
    </WelcomeCard>
  );
};