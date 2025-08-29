import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import TitleBar from '../components/common/TitleBar';
import { getAnimationConfig, pageTransitionVariants } from '../utils/animations';

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
  // 使用统一的动画配置
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);
  
  return (
    <LayoutContainer
      initial={animationConfig.disabled ? false : 'hidden'}
      animate={animationConfig.disabled ? false : 'visible'}
      variants={pageTransitionVariants}
      transition={{
        duration: animationConfig.disabled ? 0 : animationConfig.duration
      }}
    >
      <TitleBar />
      <MainContent>
        <Sidebar />
        <Content
          initial={animationConfig.disabled ? false : { opacity: 0, y: 20 }}
          animate={animationConfig.disabled ? false : { opacity: 1, y: 0 }}
          transition={{
            duration: animationConfig.disabled ? 0 : animationConfig.duration,
            delay: animationConfig.disabled ? 0 : 0.2
          }}
        >
          {children}
        </Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;