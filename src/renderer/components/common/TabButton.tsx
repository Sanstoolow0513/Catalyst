import React from 'react';
import styled from 'styled-components';

interface TabButtonProps {
  $active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'card' | 'segment';
}

const StyledTabButton = styled.button<{ $active: boolean; $variant?: string }>`
  padding: ${props => {
    switch (props.$variant) {
      case 'card': return '16px 24px';
      case 'segment': return '12px 20px';
      default: return '12px 24px';
    }
  }};
  border: ${props => {
    switch (props.$variant) {
      case 'card': return props.$active ? `2px solid ${props.theme.primary.main}` : '2px solid transparent';
      case 'segment': return props.$active ? 'none' : '1px solid transparent';
      default: return 'none';
    }
  }};
  background: ${props => {
    switch (props.$variant) {
      case 'card': return props.$active ? props.theme.surface : 'transparent';
      case 'segment': return props.$active ? props.theme.primary.main : 'transparent';
      default: return 'none';
    }
  }};
  color: ${props => {
    if (props.$variant === 'segment') {
      return props.$active ? '#FFFFFF' : props.theme.textSecondary;
    }
    return props.$active ? props.theme.primary.main : props.theme.textSecondary;
  }};
  font-weight: 600;
  cursor: pointer;
  border-radius: ${props => {
    switch (props.$variant) {
      case 'card': return props.theme.borderRadius.medium;
      case 'segment': return props.theme.borderRadius.small;
      default: return '0';
    }
  }};
  transition: all ${props => props.theme.transition.fast} ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  box-shadow: ${props => props.$variant === 'card' && props.$active ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    color: ${props => props.$variant === 'segment' ? (props.$active ? '#FFFFFF' : props.theme.primary.main) : props.theme.primary.main};
    background: ${props => {
      if (props.$variant === 'segment') {
        return props.$active ? props.theme.primary.main : props.theme.primary.light + '20';
      }
      return props.$variant === 'card' ? props.theme.surface : 'transparent';
    }};
    transform: ${props => props.$variant === 'card' ? 'translateY(-1px)' : 'none'};
    box-shadow: ${props => props.$variant === 'card' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  }
  
  &:active {
    transform: ${props => props.$variant === 'card' ? 'translateY(0)' : 'none'};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: ${props => props.$variant === 'default' ? '-2px' : '0'};
    left: 0;
    right: 0;
    height: ${props => props.$variant === 'default' ? '3px' : '0'};
    background: ${props => props.theme.primary.main};
    border-radius: ${props => props.$variant === 'default' ? '2px 2px 0 0' : '0'};
    transform: ${props => props.$variant === 'default' && props.$active ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform ${props => props.theme.transition.fast} ease;
  }
`;

const TabButton: React.FC<TabButtonProps> = ({ 
  $active, 
  onClick, 
  children, 
  icon,
  variant = 'default'
}) => {
  return (
    <StyledTabButton $active={$active} onClick={onClick} $variant={variant}>
      {icon}
      {children}
    </StyledTabButton>
  );
};

export default TabButton;