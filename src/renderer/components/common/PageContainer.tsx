import styled from 'styled-components';

export const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme?.background || '#F9FAFB'};
  color: ${(props) => props.theme?.textPrimary || '#111827'};
  padding: ${(props) => props.theme?.spacing?.xl || '32px'};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme?.border || '#E5E7EB'};
    border-radius: 4px;
    
    &:hover {
      background: ${(props) => props.theme?.textTertiary || '#9CA3AF'};
    }
  }
`;