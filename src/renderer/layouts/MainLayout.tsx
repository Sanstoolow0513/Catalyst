import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.25s linear;
`;

const Content = styled.main`
  flex-grow: 1;
  padding: 2rem;
`;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <Content>{children}</Content>
    </LayoutContainer>
  );
};

export default MainLayout;