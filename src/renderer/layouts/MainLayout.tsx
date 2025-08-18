import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import TitleBar from '../components/common/TitleBar';

const LayoutContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  transition: all ${props => props.theme.transition.normal} ease-in-out;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  margin-top: ${props => props.theme.titleBar.height};
`;

const Content = styled(motion.main)`
  flex-grow: 1;
  overflow-y: auto;
  background-color: ${props => props.theme.background};
  
  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.surfaceVariant};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.textTertiary};
    }
  }
`;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <TitleBar />
      <MainContent>
        <Sidebar />
        <Content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {children}
        </Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;
