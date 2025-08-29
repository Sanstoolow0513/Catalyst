import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getAnimationConfig, hoverAnimation, tapAnimation } from '../../utils/animations';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  $loading?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const StyledButton = styled(motion.button)<ButtonProps>`
  text-transform: none;
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.small};
  transition: all ${props => props.theme.transition.fast} ease;
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  /* 变体样式 */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.primary.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: ${props.theme.secondary.main};
          color: ${props.theme.secondary.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.secondary.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
      case 'danger':
        return `
          background-color: ${props.theme.error.main};
          color: ${props.theme.error.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.error.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${props.theme.textPrimary};
          border: 1px solid ${props.theme.border};
          &:hover:not(:disabled) {
            background-color: ${props.theme.surfaceVariant};
            border-color: ${props.theme.primary.main};
            color: ${props.theme.primary.main};
          }
          &:disabled {
            background-color: transparent;
            color: ${props.theme.textTertiary};
            border-color: ${props.theme.borderLight};
            cursor: not-allowed;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.primary.main};
          &:hover:not(:disabled) {
            background-color: ${props.theme.primary.main};
            color: ${props.theme.primary.contrastText};
          }
          &:disabled {
            background-color: transparent;
            color: ${props.theme.textTertiary};
            border-color: ${props.theme.border};
            cursor: not-allowed;
          }
        `;
      default:
        return `
          background-color: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background-color: ${props.theme.primary.dark};
          }
          &:disabled {
            background-color: ${props.theme.border};
            color: ${props.theme.textTertiary};
            cursor: not-allowed;
          }
        `;
    }
  }}
  
  /* 尺寸样式 */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 6px 12px;
          font-size: 0.875rem;
          min-height: 32px;
        `;
      case 'medium':
        return `
          padding: 8px 16px;
          font-size: 1rem;
          min-height: 40px;
        `;
      case 'large':
        return `
          padding: 12px 24px;
          font-size: 1.125rem;
          min-height: 48px;
        `;
      default:
        return `
          padding: 8px 16px;
          font-size: 1rem;
          min-height: 40px;
        `;
    }
  }}
  
  /* 全宽样式 */
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  /* 加载状态 */
  ${props => props.$loading && `
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid ${props.theme.primary.contrastText};
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
    }
  `}
  
  /* 加载动画 */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = React.memo<ButtonProps>(({ 
  children, 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  $loading = false,
  disabled = false,
  startIcon,
  endIcon,
  type = 'button',
  onClick,
  className,
  ...props 
}) => {
  // 使用统一的动画配置
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);
  
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      $loading={$loading}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={className}
      whileHover={animationConfig.disabled || $loading || disabled ? undefined : hoverAnimation}
      whileTap={animationConfig.disabled || $loading || disabled ? undefined : tapAnimation}
      transition={{ duration: animationConfig.hoverDuration }}
      {...props}
    >
      {$loading ? null : startIcon}
      {children}
      {$loading ? null : endIcon}
    </StyledButton>
  );
});

export default Button;
