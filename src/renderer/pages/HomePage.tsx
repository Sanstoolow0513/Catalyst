import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Button } from '../components/common';
import { 
  Shield, 
  MessageSquare, 
  Settings, 
  Code, 
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const HomeContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  
  padding: 24px;
`;

const WelcomeSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 48px;
`;

const AppTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 16px;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const AppSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const StatCardContainer = styled(motion.div)`
  text-align: center;
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: 24px;
`;

const StatIcon = styled.div<{ variant?: 'primary' | 'success' | 'warning' | 'error' }>`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background-color: ${props.theme.success.main}20;
          color: ${props.theme.success.main};
        `;
      case 'warning':
        return `
          background-color: ${props.theme.warning.main}20;
          color: ${props.theme.warning.main};
        `;
      case 'error':
        return `
          background-color: ${props.theme.error.main}20;
          color: ${props.theme.error.main};
        `;
      default:
        return `
          background-color: ${props.theme.primary.main}20;
          color: ${props.theme.primary.main};
        `;
    }
  }}
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const FeatureCardContainer = styled(motion.div)`
  height: 100%;
`;

const FeatureCard = styled(Card)`
  padding: 24px;
  height: 100%;
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const QuickActions = styled(motion.div)`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ButtonContainer = styled(motion.div)`
  display: inline-block;
`;

const features = [
  {
    icon: Shield,
    title: '系统代理',
    description: '智能管理网络代理配置，支持多种代理协议，确保网络连接的安全性和稳定性。'
  },
  {
    icon: MessageSquare,
    title: 'AI 对话',
    description: '集成多种大语言模型，提供智能对话服务，支持上下文记忆和个性化配置。'
  },
  {
    icon: Code,
    title: '开发环境',
    description: '一键部署开发工具和环境，支持多种编程语言和框架的开发环境配置。'
  },
  {
    icon: Settings,
    title: '配置管理',
    description: '可视化的配置界面，支持导入导出配置文件，提供配置模板和验证功能。'
  }
];

const HomePage = () => {
  const { theme } = useTheme();

  return (
    <HomeContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <WelcomeSection
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <AppTitle>Catalyst</AppTitle>
        <AppSubtitle>
          集成系统代理、AI对话、开发环境部署的综合性桌面应用
        </AppSubtitle>
        <QuickActions>
          <ButtonContainer
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="large"
              startIcon={<Zap size={20} />}
            >
              快速开始
            </Button>
          </ButtonContainer>
          <ButtonContainer
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="large"
              startIcon={<Settings size={20} />}
            >
              设置向导
            </Button>
          </ButtonContainer>
        </QuickActions>
      </WelcomeSection>

      <StatsGrid
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <StatCardContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <StatCard $variant="elevated" $hoverable>
            <StatIcon variant="primary">
              <Activity size={24} />
            </StatIcon>
            <StatValue>5</StatValue>
            <StatLabel>活跃服务</StatLabel>
          </StatCard>
        </StatCardContainer>

        <StatCardContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <StatCard $variant="elevated" $hoverable>
            <StatIcon variant="success">
              <CheckCircle size={24} />
            </StatIcon>
            <StatValue>12</StatValue>
            <StatLabel>成功任务</StatLabel>
          </StatCard>
        </StatCardContainer>

        <StatCardContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <StatCard $variant="elevated" $hoverable>
            <StatIcon variant="warning">
              <Clock size={24} />
            </StatIcon>
            <StatValue>2</StatValue>
            <StatLabel>待处理任务</StatLabel>
          </StatCard>
        </StatCardContainer>

        <StatCardContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <StatCard $variant="elevated" $hoverable>
            <StatIcon variant="error">
              <AlertCircle size={24} />
            </StatIcon>
            <StatValue>0</StatValue>
            <StatLabel>错误报告</StatLabel>
          </StatCard>
        </StatCardContainer>
      </StatsGrid>

      <FeaturesGrid
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <FeatureCardContainer
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
          >
            <FeatureCard $variant="elevated" $hoverable>
              <FeatureHeader>
                <FeatureIcon>
                  <feature.icon size={24} />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
              </FeatureHeader>
              <FeatureDescription>
                {feature.description}
              </FeatureDescription>
            </FeatureCard>
          </FeatureCardContainer>
        ))}
      </FeaturesGrid>
    </HomeContainer>
  );
};

export default HomePage;
