import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + .slider {
    background-color: ${props => props.theme.primary.main};
  }
  
  &:checked + .slider:before {
    transform: translateX(24px);
  }
  
  &:disabled + .slider {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.border};
  transition: ${props => props.theme.transition.fast} ease;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: ${props => props.theme.transition.fast} ease;
    border-radius: 50%;
  }
`;

const Switch = React.memo<SwitchProps>(({ 
  checked, 
  onChange, 
  disabled = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <SwitchContainer>
      <SwitchInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <Slider className="slider" />
    </SwitchContainer>
  );
});

export default Switch;