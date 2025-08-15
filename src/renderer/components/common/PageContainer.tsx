import styled from 'styled-components';

export const PageContainer = styled.div`
  flex-grow: 1;
  padding: 0;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;