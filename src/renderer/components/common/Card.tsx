import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  $variant?: 'elevated' | 'outlined' | 'filled';
  $padding?: 'none' | 'small' | 'medium' | 'large';
  $borderRadius?: 'none' | 'small' | 'medium' | 'large';
  $hoverable?: boolean;
  $clickable?: boolean;
  onClick?: () => void;
  className?: string;
  theme?: any;
}

const StyledCard = styled(motion.div)<CardProps>`
  background-color: ${props => props.theme.card.background};
  border: 1px solid ${props => props.theme.card.border};
  border-radius: ${props => {
    switch (props.$borderRadius) {
      case 'none': return '0';
      case 'small': return '4px';
      case 'large': return '16px';
      case 'medium':
      default: return '8px';
    }
  }};
  
  /* 变体样式 */
  ${props => {
    switch (props.$variant) {
      case 'elevated':
        return `
          box-shadow: ${props.theme.card.shadow};
          border: none;
        `;
      case 'outlined':
        return `
          border: 1px solid ${props.theme.card.border};
          background-color: ${props.theme.card.background};
        `;
      case 'filled':
        return `
          background-color: ${props.theme.surfaceVariant};
          border: none;
        `;
      default:
        return `
          box-shadow: ${props.theme.card.shadow};
          border: none;
        `;
    }
  }}
  
  /* 内边距样式 */
  ${props => {
    switch (props.$padding) {
      case 'none': return 'padding: 0;';
      case 'small': return 'padding: 12px;';
      case 'large': return 'padding: 24px;';
      case 'medium':
      default: return 'padding: 16px;';
    }
  }}
  
  /* 悬停效果 */
  ${props => props.$hoverable && `
    transition: all ${props.theme.transition.normal} ease;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.card.shadowHover};
      border-color: ${props.theme.primary.main}20;
    }
  `}
  
  /* 可点击效果 */
  ${props => props.$clickable && `
    cursor: pointer;
    transition: all ${props.theme.transition.fast} ease;
    
    &:active {
      transform: scale(0.98);
    }
  `}
  
  /* 动画性能优化 */
  will-change: transform, box-shadow;
`;

const Card: React.FC<CardProps> = ({
  children,
  $variant = 'elevated',
  $padding = 'medium',
  $borderRadius = 'medium',
  $hoverable = false,
  $clickable = false,
  onClick,
  className,
  theme,
  ...props
}) => {
  return (
    <StyledCard
      $variant={$variant}
      $padding={$padding}
      $borderRadius={$borderRadius}
      $hoverable={$hoverable}
      $clickable={$clickable}
      onClick={onClick}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={$hoverable ? {
        scale: 1.02,
        boxShadow: theme.card.shadowHover
      } : {}}
      whileTap={$clickable ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
