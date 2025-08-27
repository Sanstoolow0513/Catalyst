import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { PageContainer } from '../components/common/PageContainer';
import RestructuredProxyManager from '../components/RestructuredProxyManager';
import { Wifi, Shield, Moon, Sun } from 'lucide-react';

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

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${props => props.theme.surfaceVariant};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.textPrimary};
  transition: all ${props => props.theme.transition.fast} ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const WelcomeCard = styled(motion.div)<{ $isDarkMode?: boolean; $isGlassMode?: boolean }>`
  background: ${props => {
    if (props.$isGlassMode) {
      return 'linear-gradient(135deg, rgba(30, 41, 59, 0.08) 0%, rgba(51, 65, 85, 0.05) 100%)';
    }
    return props.$isDarkMode 
      ? 'linear-gradient(135deg, #1e293b, #334155)' 
      : 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
  }};
  border-radius: 20px;
  padding: 1.8rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: ${props => {
    if (props.$isGlassMode) {
      return '1px solid rgba(148, 163, 184, 0.15)';
    }
    return `1px solid ${props.theme.border}`;
  }};
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  align-items: center;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
  box-shadow: ${props => {
    if (props.$isGlassMode) {
      return '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)';
    }
    return '0 1px 2px rgba(0, 0, 0, 0.05)';
  }};
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${props => {
      if (props.$isGlassMode) {
        return 'radial-gradient(circle, rgba(96, 165, 250, 0.08) 0%, rgba(167, 139, 250, 0.05) 30%, transparent 60%)';
      }
      return props.$isDarkMode 
        ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' 
        : 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)';
    }};
    animation: float 12s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isGlassMode 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)' 
      : 'none'};
    pointer-events: none;
    border-radius: 20px;
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

const WelcomeTitle = styled.h2<{ $isGlassMode?: boolean }>`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.8rem 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

const WelcomeSubtitle = styled.p<{ $isGlassMode?: boolean }>`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

const ProxyStatusCard = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 12px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme.surfaceVariant};
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProxyPage: React.FC = () => {
  const { isDarkMode, toggleTheme, themeMode } = useTheme();
  const [isProxyRunning, setIsProxyRunning] = useState(false);
  const isGlassMode = themeMode.includes('Glass');

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
      <WelcomeCard
        $isDarkMode={isDarkMode}
        $isGlassMode={isGlassMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle $isGlassMode={isGlassMode}>
            <Shield size={32} />
            代理管理中心
          </WelcomeTitle>
          <WelcomeSubtitle $isGlassMode={isGlassMode}>
            配置和管理您的代理服务，享受安全、快速的网络体验
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeCard>
      
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