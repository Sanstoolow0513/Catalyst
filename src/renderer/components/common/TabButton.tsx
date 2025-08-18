import React from 'react';
import styled from 'styled-components';

interface TabButtonProps {
  $active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const StyledTabButton = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  border: none;
  background: none;
  color: ${props => props.$active ? props.theme.primary.main : props.theme.textSecondary};
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? props.theme.primary.main : 'transparent'};
  transition: all ${props => props.theme.transition.fast} ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: ${props => props.theme.primary.main};
  }
`;

const TabButton: React.FC<TabButtonProps> = ({ 
  $active, 
  onClick, 
  children, 
  icon 
}) => {
  return (
    <StyledTabButton $active={$active} onClick={onClick}>
      {icon}
      {children}
    </StyledTabButton>
  );
};

export default TabButton;