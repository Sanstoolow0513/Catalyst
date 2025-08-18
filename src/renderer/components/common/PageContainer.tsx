import styled from 'styled-components';

export const PageContainer = styled.div`
  flex-grow: 1;
  padding: ${(props) => props.theme.spacing.xl};
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.textPrimary};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: ${(props) => props.theme.spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${(props) => props.theme.spacing.md};
  }
`;