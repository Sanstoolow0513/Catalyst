import styled from 'styled-components';

export const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme?.background || '#F9FAFB'};
  color: ${(props) => props.theme?.textPrimary || '#111827'};
  padding: ${(props) => props.theme?.spacing?.xl || '32px'};
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
`;