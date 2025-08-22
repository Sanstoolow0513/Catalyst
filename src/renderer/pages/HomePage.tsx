import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  MessageSquare,
  Code,
  Settings,
  Moon,
  Sun,
  Play,
  Wifi,
  User,
  Clock,
  TrendingUp,
  Star,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Plus,
  Calendar
} from 'lucide-react';
import { Button, Card } from '../components/common';
import { PageContainer } from '../components/common/PageContainer';

// const HomePageContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   background-color: ${props => props.theme.background};
//   color: ${props => props.theme.textPrimary};
// `;

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

const WelcomeCard = styled(motion.div)`
  background: ${props => props.theme.name === 'dark' 
    ? 'linear-gradient(135deg, #1e293b, #334155)' 
    : 'linear-gradient(135deg, #f8fafc, #e2e8f0)'};
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.border};
  position: relative;
  overflow: hidden;
  min-height: 180px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: ${props => props.theme.name === 'dark' 
      ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' 
      : 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)'};
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    min-height: 160px;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickActionItem = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const QuickActionItemIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const QuickActionItemTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const QuickActionItemDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const ActivitySection = styled.div`
  margin-bottom: 2rem;
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ActivityTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
  }
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 0.25rem 0;
`;

const ActivityTime = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.textTertiary};
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
  const { isDarkMode, toggleTheme } = useTheme();
  const { nickname, avatar } = useUser();
  const navigate = useNavigate();
  const [proxyStatus, setProxyStatus] = useState<{ isRunning: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [activities, setActivities] = useState([
    { id: 1, text: '欢迎使用 Catalyst！', time: '刚刚', icon: Sparkles, color: '#8B5CF6' },
    { id: 2, text: '系统代理已准备就绪', time: '2分钟前', icon: Shield, color: '#3B82F6' },
    { id: 3, text: 'AI 对话功能已激活', time: '5分钟前', icon: MessageSquare, color: '#10B981' },
  ]);

  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      let greeting = '';
      
      if (hour < 6) greeting = '夜深了';
      else if (hour < 9) greeting = '早上好';
      else if (hour < 12) greeting = '上午好';
      else if (hour < 14) greeting = '中午好';
      else if (hour < 18) greeting = '下午好';
      else if (hour < 22) greeting = '晚上好';
      else greeting = '夜深了';
      
      setCurrentTime(`${greeting}，${nickname || '朋友'}！`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [nickname]);

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
          addActivity('代理服务已停止', Shield, '#3B82F6');
        }
      } else {
        // Start proxy
        const result = await window.electronAPI.mihomo.start();
        if (result.success) {
          setProxyStatus({ isRunning: true });
          addActivity('代理服务已启动', Shield, '#3B82F6');
        }
      }
    } catch (error) {
      console.error('Failed to toggle proxy:', error);
      addActivity('代理服务操作失败', Shield, '#EF4444');
    } finally {
      setLoading(false);
    }
  };

  const addActivity = (text: string, icon: any, color: string) => {
    const newActivity = {
      id: Date.now(),
      text,
      time: '刚刚',
      icon,
      color
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  };

  const quickActions = [
    {
      icon: MessageSquare,
      title: '开始对话',
      description: '与AI助手开始智能对话',
      color: '#8B5CF6',
      action: () => {
        addActivity('开始AI对话', MessageSquare, '#8B5CF6');
        navigate('/chat');
      }
    },
    {
      icon: Wifi,
      title: proxyStatus?.isRunning ? '停止代理' : '启动代理',
      description: proxyStatus?.isRunning ? '代理正在运行' : '代理已停止',
      color: proxyStatus?.isRunning ? '#EF4444' : '#10B981',
      action: toggleProxy
    },
    {
      icon: Shield,
      title: '代理管理',
      description: '配置和管理代理设置',
      color: '#3B82F6',
      action: () => {
        addActivity('进入代理管理', Shield, '#3B82F6');
        navigate('/proxy-management');
      }
    },
    {
      icon: Code,
      title: '开发环境',
      description: '部署开发工具和环境',
      color: '#10B981',
      action: () => {
        addActivity('进入开发环境', Code, '#10B981');
        navigate('/dev-environment');
      }
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>欢迎回来</Title>
        <ThemeToggle onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </ThemeToggle>
      </Header>
      
      <WelcomeCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle>
            {currentTime}
            <User size={32} />
          </WelcomeTitle>
          <WelcomeSubtitle>
            今天准备好探索新的可能性了吗？让我们一起用 Catalyst 提升您的工作效率。
          </WelcomeSubtitle>
        </WelcomeContent>
      </WelcomeCard>

  
      <QuickActionsGrid>
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
            onClick={action.action}
          >
            <QuickActionItem
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ opacity: loading && action.title.includes('代理') ? 0.7 : 1 }}
            >
              <QuickActionItemIcon $color={action.color}>
                {loading && action.title.includes('代理') ? (
                  <div style={{ animation: 'spin 1s linear infinite' }}>
                    <Wifi size={24} />
                  </div>
                ) : (
                  <action.icon size={24} />
                )}
              </QuickActionItemIcon>
              <QuickActionItemTitle>{action.title}</QuickActionItemTitle>
              <QuickActionItemDescription>{action.description}</QuickActionItemDescription>
            </QuickActionItem>
          </motion.div>
        ))}
      </QuickActionsGrid>

      <ActivitySection>
        <ActivityHeader>
          <ActivityTitle>最近活动</ActivityTitle>
        </ActivityHeader>
        <ActivityList>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.5, duration: 0.4 }}
            >
              <ActivityItem>
                <ActivityIcon $color={activity.color}>
                  <activity.icon size={20} />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            </motion.div>
          ))}
        </ActivityList>
      </ActivitySection>

      <Footer>
        © {new Date().getFullYear()} Catalyst - 为您的工作效率而生
      </Footer>
    </PageContainer>
  );
};

export default HomePage;