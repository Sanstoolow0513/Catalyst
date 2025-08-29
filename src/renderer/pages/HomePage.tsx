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
  Wifi,
  User,
  Sparkles
} from 'lucide-react';
import { 
  PageContainer, 
  GridContainer, 
  MainContent, 
  Sidebar,
  CardGrid
} from '../components/common/PageContainer';

const HiddenScrollPageContainer = styled(PageContainer)`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import QuickTools from '../components/dashboard/QuickTools';
import Card from '../components/common/Card';

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
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  @media (max-width: 768px) {
    .welcome-card {
      padding: 1.2rem;
      min-height: 120px;
    }
    
    .welcome-title {
      font-size: 1.4rem;
    }
    
    .welcome-subtitle {
      font-size: 0.9rem;
    }
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


const QuickActionItem = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  display: flex;
  align-items: center;
  gap: 1rem;
  
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

const IconContainer = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const QuickActionContent = styled.div`
  flex: 1;
`;

const QuickActionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 0.3rem 0;
`;

const QuickActionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;


const HomePage: React.FC = () => {
  const { isDarkMode, themeMode } = useTheme();
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
    <HiddenScrollPageContainer>
      <GridContainer>
        <MainContent>
          {/* 欢迎卡片 */}
          <WelcomeCard
            $isDarkMode={isDarkMode}
            $isGlassMode={isGlassMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WelcomeContent>
              <WelcomeTitle $isGlassMode={isGlassMode}>
                <User size={32} />
                {currentTime}
              </WelcomeTitle>
              <WelcomeSubtitle $isGlassMode={isGlassMode}>
                今天准备好探索新的可能性了吗？让我们一起用 Catalyst 提升您的工作效率。
              </WelcomeSubtitle>
            </WelcomeContent>
          </WelcomeCard>

          {/* 快速操作 */}
          <CardGrid>
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
                  <IconContainer $color={action.color}>
                    {loading && action.title.includes('代理') ? (
                      <div style={{ animation: 'spin 1s linear infinite' }}>
                        <Wifi size={24} />
                      </div>
                    ) : (
                      <action.icon size={24} />
                    )}
                  </IconContainer>
                  <QuickActionContent>
                    <QuickActionTitle>{action.title}</QuickActionTitle>
                    <QuickActionDescription>{action.description}</QuickActionDescription>
                  </QuickActionContent>
                </QuickActionItem>
              </motion.div>
            ))}
          </CardGrid>


          {/* 快捷工具 */}
          <QuickTools />
        </MainContent>

        <Sidebar>
          {/* 系统状态 */}
          <SystemStatusCard />

          {/* 使用统计 */}
          <Card $variant="elevated">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                系统概览
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                核心功能状态和统计
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ 
                padding: '12px', 
                background: 'rgba(139, 92, 246, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8B5CF6', marginBottom: '4px' }}>
                  {proxyStatus?.isRunning ? '运行中' : '已停止'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  代理状态
                </div>
              </div>

              <div style={{ 
                padding: '12px', 
                background: 'rgba(16, 185, 129, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>
                  {activities.length}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  活动记录
                </div>
              </div>
            </div>
          </Card>

          </Sidebar>
      </GridContainer>
    </HiddenScrollPageContainer>
  );
};

export default HomePage;