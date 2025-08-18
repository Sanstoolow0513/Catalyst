import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  MessageSquare,
  Code,
  Settings,
  Moon,
  Sun,
  Play,
  Wifi
} from 'lucide-react';
import { Button, Card } from '../components/common';
import { PageContainer } from '../components/common/PageContainer';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
`;

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

const HeroSection = styled(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
`;

const AppName = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  background: ${props => props.theme.name === 'dark'
    ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
    : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AppDescription = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const QuickActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const QuickActionCard = styled(Card)`
  text-align: center;
  width: 250px;
  cursor: pointer;
  $hoverable: true;
`;

const QuickActionIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const QuickActionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const QuickActionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: 0.9rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const FeatureCard = styled(Card)`
  text-align: center;
  $hoverable: true;
`;

const FeatureIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const Footer = styled.div`
  margin-top: auto;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  color: ${props => props.theme.textTertiary};
  font-size: 0.9rem;
`;

const HomePage: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [proxyStatus, setProxyStatus] = useState<{ isRunning: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  // Check proxy status on mount
  useEffect(() => {
    checkProxyStatus();
  }, []);

  const checkProxyStatus = async () => {
    try {
      if (window.electronAPI?.mihomo) {
        const status = await window.electronAPI.mihomo.status();
        setProxyStatus(status);
      }
    } catch (error) {
      console.error('Failed to check proxy status:', error);
    }
  };

  const toggleProxy = async () => {
    if (!window.electronAPI?.mihomo) return;
    
    setLoading(true);
    try {
      if (proxyStatus?.isRunning) {
        // Stop proxy
        const result = await window.electronAPI.mihomo.stop();
        if (result.success) {
          setProxyStatus({ isRunning: false });
        }
      } else {
        // Start proxy
        const result = await window.electronAPI.mihomo.start();
        if (result.success) {
          setProxyStatus({ isRunning: true });
        }
      }
    } catch (error) {
      console.error('Failed to toggle proxy:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: '系统代理',
      description: '智能管理网络代理配置，支持多种代理协议，确保网络安全稳定。',
      color: '#3B82F6'
    },
    {
      icon: MessageSquare,
      title: 'AI 对话',
      description: '集成多种大语言模型，提供智能对话服务，支持个性化配置。',
      color: '#8B5CF6'
    },
    {
      icon: Code,
      title: '开发环境',
      description: '一键部署开发工具和环境，支持多种编程语言和框架。',
      color: '#10B981'
    },
    {
      icon: Settings,
      title: '统一设置',
      description: '集中管理所有应用配置，提供导入导出和备份恢复功能。',
      color: '#F59E0B'
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>欢迎使用 Catalyst</Title>
        <ThemeToggle onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </ThemeToggle>
      </Header>
      
      <HeroSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AppName>Catalyst</AppName>
        <AppDescription>
          现代化综合性桌面应用平台，集成了系统代理、AI对话、开发环境部署和统一设置管理等功能。
        </AppDescription>
      </HeroSection>
      
      <QuickActions>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <QuickActionCard
            $padding="large"
            onClick={toggleProxy}
          >
          <QuickActionIcon $color="#3B82F6">
            <Wifi size={28} />
          </QuickActionIcon>
          <QuickActionTitle>代理服务</QuickActionTitle>
          <QuickActionDescription>
            {proxyStatus?.isRunning ? '代理正在运行' : '代理已停止'}
          </QuickActionDescription>
          <Button
            variant={proxyStatus?.isRunning ? "danger" : "primary"}
            disabled={loading}
            startIcon={<Play size={16} />}
          >
            {loading ? '处理中...' : proxyStatus?.isRunning ? '停止代理' : '启动代理'}
          </Button>
          </QuickActionCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <QuickActionCard
            $padding="large"
            onClick={() => navigate('/proxy-management')}
          >
          <QuickActionIcon $color="#10B981">
            <Shield size={28} />
          </QuickActionIcon>
          <QuickActionTitle>代理管理</QuickActionTitle>
          <QuickActionDescription>
            配置和管理您的代理设置
          </QuickActionDescription>
          <Button variant="outline">
            前往管理
          </Button>
          </QuickActionCard>
        </motion.div>
      </QuickActions>
      
      <FeaturesGrid>
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
          >
            <FeatureCard
              $padding="large"
            >
            <FeatureIcon $color={feature.color}>
              <feature.icon size={28} />
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          </motion.div>
        ))}
      </FeaturesGrid>
      
      <Footer>
        © {new Date().getFullYear()} Catalyst - All rights reserved
      </Footer>
    </PageContainer>
  );
};

export default HomePage;