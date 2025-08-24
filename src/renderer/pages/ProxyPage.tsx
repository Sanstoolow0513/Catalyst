import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { PageContainer } from '../components/common/PageContainer';
import RestructuredProxyManager from '../components/RestructuredProxyManager';
import { Wifi, Shield } from 'lucide-react';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const WelcomeCard = styled(motion.div)<{ $isDarkMode?: boolean }>`
  background: ${props => props.$isDarkMode 
    ? 'linear-gradient(135deg, #1e293b, #334155)' 
    : 'linear-gradient(135deg, #f8fafc, #e2e8f0)'};
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.border};
  position: relative;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.$isDarkMode 
      ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' 
      : 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)'};
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.8rem 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
`;

const ProxyStatusCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StatusIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const StatusDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const ContentSection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const ProxyPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isProxyRunning, setIsProxyRunning] = useState(false);

  // Check proxy status periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (window.electronAPI?.mihomo) {
          const status = await window.electronAPI.mihomo.status();
          setIsProxyRunning(status.isRunning);
        }
      } catch (error) {
        console.error('Error checking proxy status:', error);
      }
    };

    // Check status immediately
    checkStatus();

    // Set up interval to check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <Header>
        <Title>代理管理</Title>
      </Header>
      
      <WelcomeCard
        $isDarkMode={isDarkMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle>
            <Shield size={32} />
            代理管理中心
          </WelcomeTitle>
          <WelcomeSubtitle>
            配置和管理您的代理服务，享受安全、快速的网络体验
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeCard>

      <ProxyStatusCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatusIcon $color={isProxyRunning ? '#10B981' : '#EF4444'}>
          <Wifi size={24} />
        </StatusIcon>
        <StatusContent>
          <StatusTitle>代理状态</StatusTitle>
          <StatusDescription>
            {isProxyRunning ? '代理服务正在运行' : '代理服务已停止'}
          </StatusDescription>
        </StatusContent>
      </ProxyStatusCard>
      
      <ContentSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <RestructuredProxyManager />
      </ContentSection>
    </PageContainer>
  );
};

export default ProxyPage;