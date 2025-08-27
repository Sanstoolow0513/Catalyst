import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SimpleToolCard from '../components/common/SimpleToolCard';
import { devToolsSimple } from '../data/devToolsSimple';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaCode, 
  FaLaptopCode, 
  FaTerminal, 
  FaUser,
  FaDownload,
  FaTools,
  FaRocket,
  FaStar
} from 'react-icons/fa';

// 页面容器
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
    display: none;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

// 动画头部容器
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

// 统计卡片
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.15)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.2)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
    pointer-events: none;
    border-radius: 16px;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 12px 40px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 12px 30px rgba(0, 0, 0, 0.15)'};
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.2)' 
      : props.theme.surfaceVariant};
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

// 页面布局
const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
`;

// 分类标题
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  background: ${props => props.theme?.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.1)'
  };
  color: ${props => props.theme?.primary?.main || '#2563EB'};
`;

const CategoryTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme?.textPrimary || '#111827'};
  font-size: 1.5rem;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  margin: 0;
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  font-size: 0.9rem;
  line-height: 1.5;
`;

// 工具网格
const ToolsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    gap: 2rem;
  }
  
  @media (min-width: 1024px) {
    gap: 2.5rem;
  }
`;

// 分类配置
const categories = [
  {
    id: '开发环境',
    name: '开发环境',
    description: '必需的开发运行时环境和工具',
    icon: FaCode
  },
  {
    id: 'IDE工具',
    name: 'IDE工具',
    description: '集成开发环境和代码编辑器',
    icon: FaLaptopCode
  },
  {
    id: '命令行工具',
    name: '命令行工具',
    description: '提高开发效率的命令行工具',
    icon: FaTerminal
  },
  {
    id: '个人软件',
    name: '个人软件',
    description: '日常开发和工作中常用的软件',
    icon: FaUser
  }
];

const DevEnvironmentPage: React.FC = () => {
  const { isDarkMode, themeMode } = useTheme();
  const isGlassMode = themeMode.includes('Glass');
  const [installingTools, setInstallingTools] = useState<Set<string>>(new Set());

  const handleDownload = (toolId: string) => {
    setInstallingTools(prev => new Set(prev).add(toolId));
    
    // 模拟下载过程
    setTimeout(() => {
      setInstallingTools(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }, 2000);
  };

  // 计算统计数据
  const totalTools = devToolsSimple.length;
  const environmentTools = devToolsSimple.filter(tool => tool.category === '开发环境').length;
  const ideTools = devToolsSimple.filter(tool => tool.category === 'IDE工具').length;
  const cliTools = devToolsSimple.filter(tool => tool.category === '命令行工具').length;

  const stats = [
    {
      icon: FaTools,
      value: totalTools,
      label: '总工具数',
      color: '#3B82F6'
    },
    {
      icon: FaCode,
      value: environmentTools,
      label: '开发环境',
      color: '#10B981'
    },
    {
      icon: FaLaptopCode,
      value: ideTools,
      label: 'IDE工具',
      color: '#8B5CF6'
    },
    {
      icon: FaTerminal,
      value: cliTools,
      label: '命令行工具',
      color: '#F59E0B'
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
                开发环境工具
                <FaRocket size={32} />
              </WelcomeTitle>
              <WelcomeSubtitle $isGlassMode={isGlassMode}>
                这里收录了开发所需的各类工具，包括开发环境、IDE、命令行工具和个人常用软件。一站式解决您的开发环境配置需求。
              </WelcomeSubtitle>
            </WelcomeContent>
          </WelcomeCard>

          <StatsGrid>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              >
                <StatCard
                  $isGlassMode={isGlassMode}
                  whileHover={{ scale: 1.02 }}
                >
                  <StatIcon $color={stat.color}>
                    <stat.icon size={24} />
                  </StatIcon>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                </StatCard>
              </motion.div>
            ))}
          </StatsGrid>

          <PageLayout>
            {/* 按分类展示工具 */}
            {categories.map((category) => {
              const categoryTools = devToolsSimple.filter(tool => tool.category === category.id);
              
              return (
                <CategorySection key={category.id}>
                  <CategoryHeader>
                    <CategoryIcon>
                      <category.icon size={20} />
                    </CategoryIcon>
                    <div>
                      <CategoryTitle>{category.name}</CategoryTitle>
                      <CategoryDescription>{category.description}</CategoryDescription>
                    </div>
                  </CategoryHeader>
                  
                  <ToolsGrid>
                    {categoryTools.map((tool, index) => (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <SimpleToolCard
                          icon={<tool.icon size={24} />}
                          name={tool.name}
                          officialUrl={tool.website}
                          downloadUrl={tool.downloadUrl}
                          onDownload={() => handleDownload(tool.id)}
                          className={installingTools.has(tool.id) ? 'installing' : ''}
                          isGlassMode={isGlassMode}
                        />
                      </motion.div>
                    ))}
                  </ToolsGrid>
                </CategorySection>
              );
            })}
          </PageLayout>
        </GlassPageContainer>
  );
};

export default DevEnvironmentPage;