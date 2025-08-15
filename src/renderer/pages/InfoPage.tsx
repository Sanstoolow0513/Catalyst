import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Card } from '../components/common';
import { 
  Github as GithubIcon,
  Globe as GlobeIcon,
  Mail as MailIcon,
  Code as CodeIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  MessageSquare as MessageIcon,
  Settings as SettingsIcon
} from 'lucide-react';

const InfoContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 48px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 16px;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 32px;
`;

const VersionBadge = styled(motion.span)`
  display: inline-block;
  padding: 8px 16px;
  background: ${props => props.theme.surfaceVariant};
  color: ${props => props.theme.textPrimary};
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Section = styled(motion.section)`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  flex: 1;
`;

const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const TechItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.surfaceVariant};
  border-radius: 12px;
  transition: all ${props => props.theme.transition.fast} ease;
`;

const TechIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.primary.main}20;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.primary.main};
`;

const TechName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.textPrimary};
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContactItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.surfaceVariant};
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.theme.textPrimary};
  transition: all ${props => props.theme.transition.fast} ease;
  
  &:hover {
    background: ${props => props.theme.primary.main}10;
    transform: translateX(4px);
  }
`;

const InfoPage: React.FC = () => {
  const features = [
    {
      icon: ShieldIcon,
      title: '系统代理',
      description: '基于 Mihomo 的强大代理功能，支持多种代理协议和智能路由。'
    },
    {
      icon: MessageIcon,
      title: 'AI 对话',
      description: '集成主流 LLM 提供商，提供智能对话和代码生成功能。'
    },
    {
      icon: CodeIcon,
      title: '开发环境',
      description: '一键部署开发环境，支持多种 IDE 和工具链的自动配置。'
    },
    {
      icon: SettingsIcon,
      title: '高度定制',
      description: '丰富的个性化设置选项，支持主题切换和配置导入导出。'
    }
  ];

  const techStack = [
    { name: 'Electron', icon: ZapIcon },
    { name: 'React', icon: CodeIcon },
    { name: 'TypeScript', icon: CodeIcon },
    { name: 'Styled Components', icon: CodeIcon },
    { name: 'MUI', icon: SettingsIcon },
    { name: 'Framer Motion', icon: ZapIcon }
  ];

  return (
    <InfoContainer>
      <PageHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PageTitle>Catalyst</PageTitle>
        <PageSubtitle>现代化的综合性桌面应用程序</PageSubtitle>
        <VersionBadge
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          版本 1.0.0
        </VersionBadge>
      </PageHeader>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SectionTitle>
          <ZapIcon size={24} />
          核心功能
        </SectionTitle>
        <CardGrid>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <FeatureCard
                $padding="large"
                $variant="elevated"
              >
              <FeatureIcon>
                <feature.icon size={24} />
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            </motion.div>
          ))}
        </CardGrid>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <SectionTitle>
          <CodeIcon size={24} />
          技术栈
        </SectionTitle>
        <TechStackGrid>
          {techStack.map((tech, index) => (
            <TechItem
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <TechIcon>
                <tech.icon size={20} />
              </TechIcon>
              <TechName>{tech.name}</TechName>
            </TechItem>
          ))}
        </TechStackGrid>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <SectionTitle>
          <MailIcon size={24} />
          开发者信息
        </SectionTitle>
        <Card $padding="large" $variant="elevated">
          <ContactInfo>
            <ContactItem
              href="https://github.com/Sanstoolow0513/Catalyst"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              whileHover={{ x: 4 }}
            >
              <GithubIcon size={20} />
              <span>GitHub 仓库</span>
            </ContactItem>
            <ContactItem
              href="mailto:sanstoolow@example.com"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileHover={{ x: 4 }}
            >
              <MailIcon size={20} />
              <span>联系邮箱</span>
            </ContactItem>
            <ContactItem
              href="#"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              whileHover={{ x: 4 }}
            >
              <GlobeIcon size={20} />
              <span>个人网站</span>
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
          <SettingsIcon size={24} />
          许可证
        </SectionTitle>
        <Card $padding="large" $variant="elevated">
          <p style={{ color: '#888', lineHeight: '1.6' }}>
            本项目采用 ISC 许可证开源。您可以自由使用、修改和分发本项目的代码，
            但需要遵守许可证的相关条款。详细信息请查看项目根目录的 LICENSE 文件。
          </p>
        </Card>
      </Section>
    </InfoContainer>
  );
};

export default InfoPage;
