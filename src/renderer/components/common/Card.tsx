import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getAnimationConfig, cardVariants } from '../../utils/animations';

interface CardProps {
  children: React.ReactNode;
  $variant?: 'elevated' | 'outlined' | 'filled' | 'gradient' | 'glass' | 'floating' | 'neumorphic';
  $padding?: 'none' | 'small' | 'medium' | 'large';
  $borderRadius?: 'none' | 'small' | 'medium' | 'large';
  $hoverable?: boolean;
  $clickable?: boolean;
  $gradient?: string;
  $glassIntensity?: 'light' | 'medium' | 'heavy';
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled(motion.div)<CardProps>`
  background-color: ${props => props.theme.card.background};
  border: 1px solid ${props => props.theme.card.border};
    border-radius: ${props => {
    switch (props.$borderRadius) {
      case 'none': return '0';
      case 'small': return props.theme.borderRadius.small;
      case 'medium': return props.theme.borderRadius.medium;
      case 'large': return props.theme.borderRadius.large;
      default: return props.theme.borderRadius.medium;
    }
  }};
  
  /* 变体样式 */
  ${props => {
    switch (props.$variant) {
      case 'elevated':
        return `
          box-shadow: ${props.theme.card.shadow};
          border: none;
          background: ${props.theme.card.background};
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
      case 'gradient':
        return `
          background: ${props.$gradient || props.theme.gradient.primary};
          border: none;
          color: white;
          box-shadow: ${props.theme.shadow.cardHover};
        `;
      case 'glass': {
        const glassOpacity = props.$glassIntensity === 'light' ? '0.1' : 
                           props.$glassIntensity === 'medium' ? '0.2' : '0.3';
        return `
          background: rgba(255, 255, 255, ${glassOpacity});
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        `;
      }
      case 'floating':
        return `
          background: ${props.theme.card.background};
          border: none;
          box-shadow: ${props.theme.shadow.xl};
          transform: translateY(0);
          transition: all 0.3s ease;
        `;
      case 'neumorphic': {
        const isDark = props.theme.name === 'dark';
        return `
          background: ${props.theme.background};
          border: none;
          box-shadow: ${isDark ? 
            'inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 4px 8px rgba(0, 0, 0, 0.3)' :
            'inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(255, 255, 255, 0.8)'
          };
        `;
      }
      default:
        return `
          box-shadow: ${props.theme.card.shadow};
          border: none;
          background: ${props.theme.card.background};
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
      transform: translateY(-2px) scale(1.01);
      ${props.$variant === 'glass' ? `
        backdrop-filter: blur(15px);
        background: rgba(255, 255, 255, ${props.$glassIntensity === 'light' ? '0.15' : 
                                      props.$glassIntensity === 'medium' ? '0.25' : '0.35'});
      ` : `
        box-shadow: ${props => props.theme.name === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.2)'};
      `}
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
  
`;

const Card = React.memo<CardProps>(({
  children,
  $variant = 'elevated',
  $padding = 'medium',
  $borderRadius = 'medium',
  $hoverable = false,
  $clickable = false,
  $gradient,
  $glassIntensity = 'medium',
  onClick,
  className,
  ...props
}) => {
  // 使用统一的动画配置
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);
  
  return (
    <StyledCard
      $variant={$variant}
      $padding={$padding}
      $borderRadius={$borderRadius}
      $hoverable={$hoverable}
      $clickable={$clickable}
      $gradient={$gradient}
      $glassIntensity={$glassIntensity}
      onClick={onClick}
      className={className}
      initial={animationConfig.disabled ? undefined : 'hidden'}
      animate={animationConfig.disabled ? undefined : 'visible'}
      variants={cardVariants}
      transition={{
        duration: animationConfig.duration,
        ease: 'easeOut'
      }}
      whileHover={$hoverable && !animationConfig.disabled ? 'hover' : undefined}
      whileTap={$clickable && !animationConfig.disabled ? 'tap' : undefined}
      {...props}
    >
      {children}
    </StyledCard>
  );
});

export { Card as default };
export type { CardProps };
