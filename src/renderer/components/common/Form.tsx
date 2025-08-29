import styled from 'styled-components';

export const Input = styled.input<{ $isGlassMode?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.$isGlassMode ? props.theme?.inputBorder : props.theme?.border || '#E5E7EB'};
  border-radius: ${props => props.$isGlassMode ? props.theme?.borderRadius.medium : props.theme?.borderRadius.small};
  font-size: 14px;
  background-color: ${props => props.$isGlassMode ? props.theme?.inputBackground : props.theme?.surface || '#FFFFFF'};
  color: ${props => props.theme?.textPrimary || '#111827'};
  transition: all ${props => props.theme?.transition.normal || '0.2s'} ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(8px)' : 'none'};

  &:focus {
    outline: none;
    border-color: ${props => props.$isGlassMode ? props.theme?.inputFocusBorder : props.theme?.primary?.main || '#3B82F6'};
    box-shadow: 0 0 0 3px ${props => props.theme?.primary?.main + '20' || 'rgba(59, 130, 246, 0.2)'};
  }

  &::placeholder {
    color: ${props => props.theme?.textTertiary || '#9CA3AF'};
  }
`;

export const Textarea = styled.textarea<{ $isGlassMode?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.$isGlassMode ? props.theme?.inputBorder : props.theme?.border || '#E5E7EB'};
  border-radius: ${props => props.$isGlassMode ? props.theme?.borderRadius.medium : props.theme?.borderRadius.small};
  font-size: 14px;
  background-color: ${props => props.$isGlassMode ? props.theme?.inputBackground : props.theme?.surface || '#FFFFFF'};
  color: ${props => props.theme?.textPrimary || '#111827'};
  transition: all ${props => props.theme?.transition.normal || '0.2s'} ease;
  resize: vertical;
  min-height: 80px;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(8px)' : 'none'};

  &:focus {
    outline: none;
    border-color: ${props => props.$isGlassMode ? props.theme?.inputFocusBorder : props.theme?.primary?.main || '#3B82F6'};
    box-shadow: 0 0 0 3px ${props => props.theme?.primary?.main + '20' || 'rgba(59, 130, 246, 0.2)'};
  }

  &::placeholder {
    color: ${props => props.theme?.textTertiary || '#9CA3AF'};
  }
`;

export const Select = styled.select<{ $isGlassMode?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.$isGlassMode ? props.theme?.inputBorder : props.theme?.border || '#E5E7EB'};
  border-radius: ${props => props.$isGlassMode ? props.theme?.borderRadius.medium : props.theme?.borderRadius.small};
  font-size: 14px;
  background-color: ${props => props.$isGlassMode ? props.theme?.inputBackground : props.theme?.surface || '#FFFFFF'};
  color: ${props => props.theme?.textPrimary || '#111827'};
  transition: all ${props => props.theme?.transition.normal || '0.2s'} ease;
  cursor: pointer;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(8px)' : 'none'};

  &:focus {
    outline: none;
    border-color: ${props => props.$isGlassMode ? props.theme?.inputFocusBorder : props.theme?.primary?.main || '#3B82F6'};
    box-shadow: 0 0 0 3px ${props => props.theme?.primary?.main + '20' || 'rgba(59, 130, 246, 0.2)'};
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme?.textPrimary || '#111827'};
  margin-bottom: 4px;
`;

export default {
  Input,
  Textarea,
  Select,
  SelectWrapper,
  FormGroup,
  FormRow,
  Label,
};