import React from 'react';
import styled from 'styled-components';

// Label 组件
export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 500;
  font-size: 0.9rem;
`;

// 基础输入框样式
const baseInputStyles = `
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transition.fast} ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`;

// Input 组件
export const Input = styled.input`
  ${baseInputStyles}
`;

// Textarea 组件
export const Textarea = styled.textarea`
  ${baseInputStyles}
  min-height: 100px;
  resize: vertical;
`;

// Select 组件容器
const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

// Select 组件
export const Select = styled.select`
  ${baseInputStyles}
  appearance: none; /* 移除默认箭头 */
  padding-right: 36px; /* 为自定义箭头留出空间 */
`;

// Select 箭头图标
const SelectArrow = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.textSecondary};
`;

// Select 组件包装器，用于添加自定义箭头
export const SelectWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SelectContainer>
      {children}
      <SelectArrow>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </SelectArrow>
    </SelectContainer>
  );
};

// FormGroup 组件
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

// FormRow 组件 (用于水平排列表单元素)
export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
  
  & > ${FormGroup} {
    flex: 1;
    margin-bottom: 0;
  }
`;