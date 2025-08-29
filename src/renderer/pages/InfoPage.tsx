import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { Card } from '../components/common';
import { PageContainer } from '../components/common/PageContainer';
import {
  Github as GithubIcon,
  Globe as GlobeIcon,
  Mail as MailIcon,
  Code as CodeIcon,
  Zap as ZapIcon,
  Star as StarIcon,
  Users as UsersIcon,
  Rocket as RocketIcon,
  Heart as HeartIcon,
  Activity as ActivityIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  Terminal as TerminalIcon,
  Package as PackageIcon
} from 'lucide-react';

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
`;

const InfoContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const AnimatedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const FloatingParticle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${props => props.theme.primary};
  border-radius: 50%;
  opacity: 0.6;
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.theme.primary}20 0%, transparent 70%);
  filter: blur(40px);
  animation: ${pulseAnimation} 4s ease-in-out infinite;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xxl} 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.accent});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xxl} 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${props => props.theme.border};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${props => props.theme.primary}10, ${props => props.theme.accent}10);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: white;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  font-size: 0.95rem;
`;

const TimelineSection = styled.div`
  margin: ${({ theme }) => theme.spacing.xxl} 0;
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
`;

const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  position: relative;
  z-index: 2;
  
  &::after {
    content: '';
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + ${({ theme }) => theme.spacing.lg});
    background: ${props => props.theme.border};
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  background: ${props => props.theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const TimelineDate = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TimelineTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TimelineDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.5;
  font-size: 0.95rem;
`;

const WingetSection = styled(motion.section)`
  margin: ${({ theme }) => theme.spacing.xxl} 0;
`;

const WingetCard = styled(Card)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const WingetTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const WingetDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 0.95rem;
`;

const WingetCommands = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const WingetCommand = styled.div`
  background: ${props => props.theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: ${props => props.theme.textPrimary};
  border: 1px solid ${props => props.theme.border};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '>';
    position: absolute;
    left: ${({ theme }) => theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.primary};
    font-weight: bold;
  }
`;

const CommandText = styled.span`
  margin-left: ${({ theme }) => theme.spacing.lg};
  display: block;
  word-break: break-all;
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${props => {
    const primaryColor = typeof props.theme.primary === 'string' ? props.theme.primary : props.theme.primary.main;
    return `linear-gradient(135deg, ${primaryColor}, ${props.theme.accent})`;
  }};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const VersionBadge = styled(motion.span)`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${props => props.theme.surfaceVariant};
  color: ${props => props.theme.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  font-size: 0.9rem;
  font-weight: 500;
`;

const Section = styled(motion.section)`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PersonalInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${props => props.theme.textSecondary};
  font-size: 0.95rem;
`;

const ContactItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${props => props.theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  color: ${props => props.theme.textPrimary};
  transition: all ${props => props.theme.transition.fast} ease;
  
  &:hover {
    background: ${props => {
      const primaryColor = typeof props.theme.primary === 'string' ? props.theme.primary : props.theme.primary.main;
      return `${primaryColor}10`;
    }};
    transform: translateX(4px);
  }
`;

const InfoPage: React.FC = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(generatedParticles);
  }, []);

  const stats = [
    { number: "1.0", label: "当前版本", icon: <RocketIcon size={24} /> },
    { number: "100+", label: "代码提交", icon: <CodeIcon size={24} /> },
    { number: "5", label: "核心功能", icon: <StarIcon size={24} /> },
    { number: "24/7", label: "在线运行", icon: <ActivityIcon size={24} /> },
    { number: "3", label: "开发月数", icon: <AwardIcon size={24} /> },
    { number: "99%", label: "用户满意度", icon: <HeartIcon size={24} /> }
  ];

  const features = [
    {
      icon: <ZapIcon size={28} />,
      title: "高性能",
      description: "基于最新技术栈构建，提供流畅的用户体验和快速的响应速度。"
    },
    {
      icon: <HeartIcon size={28} />,
      title: "用户友好",
      description: "简洁直观的界面设计，让用户能够轻松上手并高效使用。"
    },
    {
      icon: <AwardIcon size={28} />,
      title: "开源精神",
      description: "完全开源的项目，欢迎社区贡献和共同改进。"
    },
    {
      icon: <UsersIcon size={28} />,
      title: "社区驱动",
      description: "活跃的开发者社区，持续的功能更新和技术支持。"
    }
  ];

  const timeline = [
    {
      date: "2024.08",
      title: "项目启动",
      description: "Catalyst 项目正式立项，开始架构设计和技术选型。"
    },
    {
      date: "2024.09",
      title: "核心功能开发",
      description: "完成主要功能模块的开发，包括用户界面和核心业务逻辑。"
    },
    {
      date: "2024.10",
      title: "优化迭代",
      description: "持续优化用户体验，修复bug，添加新功能，提升系统稳定性。"
    }
  ];

  const wingetCommands = [
    "winget install Microsoft.WindowsTerminal",
    "winget install 9N8G5RFZ9XK3", // NanaZip
    "winget install Microsoft.VisualStudioCode",
    "winget install Git.Git",
    "winget install Node.js",
    "winget install Python.Python.3.11",
    "winget install Docker.DockerDesktop",
    "winget install Mozilla.Firefox",
    "winget install Google.Chrome",
    "winget install 7zip.7zip"
  ];

  return (
    <PageContainer>
      <AnimatedBackground>
        {particles.map((particle) => (
          <FloatingParticle
            key={particle.id}
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        <GlowOrb
          style={{ top: '10%', left: '10%', width: '200px', height: '200px' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <GlowOrb
          style={{ bottom: '10%', right: '10%', width: '150px', height: '150px' }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </AnimatedBackground>

      <InfoContainer>
        <PageHeader
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PageTitle>Catalyst</PageTitle>
          <VersionBadge
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            版本 1.0.0
          </VersionBadge>
        </PageHeader>

        <StatsContainer>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsContainer>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <SectionTitle>
            <MailIcon size={24} />
            开发者信息
          </SectionTitle>
          <PersonalInfo>
            <InfoCard
              $padding="large"
              $variant="elevated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <InfoCardTitle>
                <ZapIcon size={20} />
                基本信息
              </InfoCardTitle>
              <InfoItem>presented by a cs huster</InfoItem>
            </InfoCard>
            
            <InfoCard
              $padding="large"
              $variant="elevated"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <InfoCardTitle>
                <MailIcon size={20} />
                联系方式
              </InfoCardTitle>
              <InfoItem>3021018823@qq.com</InfoItem>
              <InfoItem>sanstoolow@gmail.com</InfoItem>
            </InfoCard>
          </PersonalInfo>
          
          <Card $padding="large" $variant="elevated">
            <ContactInfo>
              <ContactItem
                href="https://github.com/Sanstoolow0513"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ x: 4 }}
              >
                <GithubIcon size={20} />
                <span>GitHub: Sanstoolow0513</span>
              </ContactItem>
              <ContactItem
                href="https://space.bilibili.com/438770872"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                whileHover={{ x: 4 }}
              >
                <GlobeIcon size={20} />
                <span>B站主页</span>
              </ContactItem>
              <ContactItem
                href="https://github.com/Sanstoolow0513/Catalyst"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ x: 4 }}
              >
                <CodeIcon size={20} />
                <span>Catalyst 项目</span>
              </ContactItem>
            </ContactInfo>
          </Card>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <SectionTitle>
            <TrendingUpIcon size={24} />
            项目特色
          </SectionTitle>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Section>

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <SectionTitle>
            <AwardIcon size={24} />
            项目历程
          </SectionTitle>
          <TimelineSection>
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <TimelineDot />
                <TimelineContent>
                  <TimelineDate>{item.date}</TimelineDate>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineDescription>{item.description}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineSection>
        </Section>

        <WingetSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <SectionTitle>
            <TerminalIcon size={24} />
            常用工具安装命令
          </SectionTitle>
          <WingetCard>
            <WingetTitle>
              <PackageIcon size={24} />
              Windows Package Manager (winget)
            </WingetTitle>
            <WingetDescription>
              使用 winget 快速安装常用的 Windows 应用程序。复制以下命令到 PowerShell 或命令提示符中执行。
            </WingetDescription>
            <WingetCommands>
              {wingetCommands.map((command, index) => (
                <WingetCommand
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                >
                  <CommandText>{command}</CommandText>
                </WingetCommand>
              ))}
            </WingetCommands>
          </WingetCard>
        </WingetSection>

      </InfoContainer>
    </PageContainer>
  );
};

export default InfoPage;
