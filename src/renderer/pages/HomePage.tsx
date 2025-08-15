import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Shield, 
  MessageSquare, 
  Code, 
  Settings,
  Moon,
  Sun
} from 'lucide-react';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.surfaceVariant};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.textPrimary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
  }
`;

const HeroSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
`;

const AppName = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin: 0 0 20px 0;
  background: ${props => props.theme.isDarkMode
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
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.foreground};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: ${props => props.theme.card.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.border};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.card.shadowHover};
  }
`;

const FeatureIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 12px 0;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const Footer = styled.div`
  margin-top: auto;
  text-align: center;
  padding: 20px 0;
  color: ${props => props.theme.textTertiary};
  font-size: 0.9rem;
`;

const HomePage: React.FC = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

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
    <HomePageContainer>
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
      
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <FeatureIcon $color={feature.color}>
              <feature.icon size={28} />
            </FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
      
      <Footer>
        © {new Date().getFullYear()} Catalyst - All rights reserved
      </Footer>
    </HomePageContainer>
  );
};

export default HomePage;