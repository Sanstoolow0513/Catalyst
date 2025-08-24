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
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${props => props.theme.background};
  height: 100%;
`;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  // 在具体服务页面减少动画效果
  const isServicePage = window.location.pathname.includes('/proxy-management') || 
                        window.location.pathname.includes('/chat') || 
                        window.location.pathname.includes('/dev-environment');
  
  return (
    <LayoutContainer
      initial={isServicePage ? false : { opacity: 0 }}
      animate={isServicePage ? false : { opacity: 1 }}
      transition={isServicePage ? false : { duration: 0.3 }}
    >
      <TitleBar />
      <MainContent>
        <Sidebar />
        <Content
          initial={isServicePage ? false : { opacity: 0, y: 20 }}
          animate={isServicePage ? false : { opacity: 1, y: 0 }}
          transition={isServicePage ? false : { delay: 0.2, duration: 0.4 }}
        >
          {children}
        </Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;