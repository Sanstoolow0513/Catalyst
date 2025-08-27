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
  Moon,
  Sun,
  Wifi,
  User,
  Sparkles
} from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';

const GlassPageContainer = styled.div<{ $isGlassMode?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${props => props.$isGlassMode 
    ? 'transparent' 
    : (props.theme?.background || '#F9FAFB')};
  color: ${props => props.theme?.textPrimary || '#111827'};
  padding: ${props => props.theme?.spacing?.xl || '32px'};
  position: relative;
  
  ${props => props.$isGlassMode && `
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(244, 114, 182, 0.04) 0%, transparent 50%),
        linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%);
      z-index: -2;
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 60% 40%, rgba(34, 197, 94, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.03) 0%, transparent 40%);
      z-index: -1;
      pointer-events: none;
      animation: ambient 20s ease-in-out infinite;
    }
  `}
  
  @keyframes ambient {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.7; }
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.$isGlassMode ? 'rgba(51, 65, 85, 0.2)' : 'transparent'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isGlassMode ? 'rgba(148, 163, 184, 0.3)' : (props.theme?.border || '#E5E7EB')};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.$isGlassMode ? 'rgba(203, 213, 225, 0.5)' : (props.theme?.textTertiary || '#9CA3AF')};
    }
  }
`;

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
  padding: 2rem;
  margin-bottom: 2rem;
  border: ${props => {
    if (props.$isGlassMode) {
      return '1px solid rgba(148, 163, 184, 0.15)';
    }
    return `1px solid ${props.theme.border}`;
  }};
  position: relative;
  overflow: hidden;
  min-height: 160px;
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
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
    
  @keyframes glow {
    0% { opacity: 0.3; }
    100% { opacity: 0.7; }
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 1;
`;

const WelcomeTitle = styled.h1<{ $isGlassMode?: boolean }>`
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
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(96, 165, 250, 0.1)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

const WelcomeSubtitle = styled.p<{ $isGlassMode?: boolean }>`
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 15px rgba(167, 139, 250, 0.08)' 
    : 'none'};
  position: relative;
  z-index: 2;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickActionItem = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
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
    border-radius: 16px;
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

const ActivityItem = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.12)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  transition: all 0.2s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(12px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 12px;
  }
  
    
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme.surfaceVariant};
    box-shadow: ${props => props.$isGlassMode 
      ? '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    
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
  const { isDarkMode, toggleTheme, themeMode } = useTheme();
  const { nickname } = useUser();
  const navigate = useNavigate();
  const isGlassMode = themeMode.includes('Glass');
  const [proxyStatus, setProxyStatus] = useState<{ isRunning: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [activities, setActivities] = useState([
    { id: 1, text: '欢迎使用 Catalyst！', time: '刚刚', icon: Sparkles, color: '#8B5CF6' },
    { id: 2, text: '系统代理已准备就绪', time: '2分钟前', icon: Shield, color: '#3B82F6' },
    { id: 3, text: 'AI 对话功能已激活', time: '5分钟前', icon: MessageSquare, color: '#10B981' },
  ]);

  // 创建动态背景元素
  useEffect(() => {
    if (!isGlassMode) return;

    // 创建玻璃背景
    const glassBackground = document.createElement('div');
    glassBackground.className = 'glass-background active';
    document.body.appendChild(glassBackground);

    // 创建粒子效果
    const particles = document.createElement('div');
    particles.className = 'glass-particles active';
    
    // 创建多个粒子
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
      particles.appendChild(particle);
    }
    
    document.body.appendChild(particles);

    return () => {
      // 清理背景元素
      if (glassBackground.parentNode) {
        glassBackground.parentNode.removeChild(glassBackground);
      }
      if (particles.parentNode) {
        particles.parentNode.removeChild(particles);
      }
    };
  }, [isGlassMode]);

  
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

  const addActivity = (text: string, icon: React.ComponentType<{ size?: number }>, color: string) => {
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
    <GlassPageContainer $isGlassMode={isGlassMode}>
      <WelcomeCard
        $isDarkMode={isDarkMode}
        $isGlassMode={isGlassMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WelcomeContent>
          <WelcomeTitle $isGlassMode={isGlassMode}>
            {currentTime}
            <User size={32} />
          </WelcomeTitle>
          <WelcomeSubtitle $isGlassMode={isGlassMode}>
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
              $isGlassMode={isGlassMode}
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
              <ActivityItem $isGlassMode={isGlassMode}>
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
    </GlassPageContainer>
  );
};

export default HomePage;