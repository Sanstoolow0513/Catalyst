import styled from 'styled-components';

export const PageContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.background}; /* 使用新的 background */
  color: ${(props) => props.theme.textPrimary}; /* 使用新的 textPrimary */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Enable scrolling for page content */
`;
