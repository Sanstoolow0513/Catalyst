import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  FaCode,
  FaLaptopCode,
  FaTerminal,
  FaUser,
  FaTools,
  FaRocket,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaPause,
  FaPlay,
  FaStop,
  FaTrash,
  FaRedo,
  FaInfoCircle
} from 'react-icons/fa';
import { 
  PageContainer, 
  GridContainer, 
  MainContent,
  Sidebar
} from '../components/common/PageContainer';
import SimpleToolCard from '../components/common/SimpleToolCard';
import Card from '../components/common/Card';
import { devEnvironmentAPI, DownloadTask, ToolInfo, DownloadStats } from '../api/dev-environment-api';
import { DownloadStatus } from '../components/download/SimpleDownloadItem';

const HiddenScrollPageContainer = styled(PageContainer)`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatsCard = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  
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

const StatsIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  margin: 0 auto 1rem;
`;

const StatsValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 0.5rem;
`;

const StatsLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const CategorySection = styled.div<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme.surface};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme.border}`};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CategoryIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const CategoryTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const CategoryDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  line-height: 1.4;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

// 简化的下载项目样式
const DownloadItemContainer = styled.div`
  padding: 12px;
  background: ${props => props.theme?.surface || '#F9FAFB'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.border || '#E5E7EB'};
  margin-bottom: 8px;
`;

const DownloadItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const DownloadItemIcon = styled.div<{ $status: DownloadStatus }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return '#10B98120';
      case 'downloading': return '#3B82F620';
      case 'paused': return '#F59E0B20';
      case 'failed': return '#EF444420';
      default: return '#6B728020';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed': return '#10B981';
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  }};
  font-size: 12px;
`;

const DownloadItemInfo = styled.div`
  flex: 1;
`;

const DownloadItemName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
`;

const DownloadItemStats = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  margin-top: 2px;
`;

const DownloadItemError = styled.div`
  font-size: 0.75rem;
  color: #EF4444;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DownloadItemRetryInfo = styled.div`
  font-size: 0.75rem;
  color: #F59E0B;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DownloadItemProgress = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme?.border || '#E5E7EB'};
  border-radius: 2px;
  overflow: hidden;
  margin: 8px 0;
`;

const DownloadItemProgressBar = styled.div<{ $progress: number; $status: DownloadStatus }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return '#10B981';
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  }};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const DownloadItemControls = styled.div`
  display: flex;
  gap: 4px;
  justify-content: flex-end;
`;

const DownloadControlButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme?.border || '#E5E7EB'};
  background: ${props => props.theme?.surface || '#FFFFFF'};
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme?.primary?.main || '#3B82F6'};
    color: white;
    border-color: ${props => props.theme?.primary?.main || '#3B82F6'};
  }
`;

const EmptyDownloads = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
`;

const ScrollableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.border || '#E5E7EB'};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme?.textTertiary || '#9CA3AF'};
    }
  }
`;

// 分类配置
const categories = [
  {
    id: '开发环境',
    name: '开发环境',
    description: '必需的开发运行时环境和工具',
    icon: FaCode,
    color: '#10B981'
  },
  {
    id: 'IDE工具',
    name: 'IDE工具',
    description: '集成开发环境和代码编辑器',
    icon: FaLaptopCode,
    color: '#8B5CF6'
  },
  {
    id: '命令行工具',
    name: '命令行工具',
    description: '提高开发效率的命令行工具',
    icon: FaTerminal,
    color: '#F59E0B'
  },
  {
    id: '个人软件',
    name: '个人软件',
    description: '日常开发和工作中常用的软件',
    icon: FaUser,
    color: '#3B82F6'
  }
];


const UnifiedDevEnvironmentPage: React.FC = () => {
  const { isDarkMode, themeMode } = useTheme();
  const isGlassMode = themeMode.includes('Glass');
  const [installingTools, setInstallingTools] = useState<Set<string>>(new Set());
  const [downloadItems, setDownloadItems] = useState<DownloadTask[]>([]);
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [downloadStats, setDownloadStats] = useState<DownloadStats>({
    total: 0,
    downloading: 0,
    completed: 0,
    paused: 0,
    failed: 0,
    totalSpeed: 0
  });

  useEffect(() => {
    loadData();
    
    // 设置事件监听器
    const unsubscribeDownload = devEnvironmentAPI.onDownloadUpdate((downloadId, task) => {
      console.log(`[UnifiedDevEnvironmentPage] Received download update for ${downloadId}: ${task.status}`);
      
      setDownloadItems(prev => {
        // 如果任务被删除或取消，从列表中移除
        if (task.status === 'cancelled' || task.status === 'removed') {
          console.log(`[UnifiedDevEnvironmentPage] Removing download item: ${downloadId}`);
          return prev.filter(item => item.id !== downloadId);
        }
        
        const index = prev.findIndex(item => item.id === downloadId);
        if (index >= 0) {
          const newItems = [...prev];
          newItems[index] = task;
          console.log(`[UnifiedDevEnvironmentPage] Updated download item: ${downloadId}`);
          return newItems;
        }
        console.log(`[UnifiedDevEnvironmentPage] Added new download item: ${downloadId}`);
        return [...prev, task];
      });
      
      // 更新统计信息
      updateDownloadStats();
    });

    const unsubscribeTool = devEnvironmentAPI.onToolStatusUpdate((toolId, tool) => {
      setTools(prev => {
        const index = prev.findIndex(t => t.id === toolId);
        if (index >= 0) {
          const newTools = [...prev];
          newTools[index] = tool;
          return newTools;
        }
        return prev;
      });
    });

    return () => {
      unsubscribeDownload();
      unsubscribeTool();
    };
  }, []);

  const loadData = async () => {
    try {
      
      // 并行加载数据
      const [downloads, toolsList, stats] = await Promise.all([
        devEnvironmentAPI.getDownloads(),
        devEnvironmentAPI.getTools(),
        devEnvironmentAPI.getDownloadStats()
      ]);
      
      setDownloadItems(downloads);
      setTools(toolsList);
      setDownloadStats(stats);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const updateDownloadStats = async () => {
    try {
      const stats = await devEnvironmentAPI.getDownloadStats();
      setDownloadStats(stats);
    } catch (error) {
      console.error('Failed to update download stats:', error);
    }
  };

  const handleDownload = async (toolId: string) => {
    try {
      const tool = tools.find(t => t.id === toolId);
      if (!tool) return;
      
      setInstallingTools(prev => new Set(prev).add(toolId));
      
      const result = await devEnvironmentAPI.installTool(toolId, tool.name, tool.downloadUrl, tool.category);
      
      if (!result.success) {
        console.error('Failed to install tool:', result.error);
        // 可以在这里显示错误提示
      }
    } catch (error) {
      console.error('Failed to handle download:', error);
    } finally {
      setInstallingTools(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }
  };

  const handlePauseDownload = async (id: string) => {
    try {
      await devEnvironmentAPI.pauseDownload(id);
    } catch (error) {
      console.error('Failed to pause download:', error);
    }
  };

  const handleResumeDownload = async (id: string) => {
    try {
      await devEnvironmentAPI.resumeDownload(id);
    } catch (error) {
      console.error('Failed to resume download:', error);
    }
  };

  const handleCancelDownload = async (id: string) => {
    try {
      const download = downloadItems.find(item => item.id === id);
      if (!download) return;

      // 如果正在下载，需要确认
      if (download.status === 'downloading') {
        const confirmMessage = `确定要取消下载"${download.name}"吗？\n\n` +
          `这将删除已下载的部分文件。`;
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      }

      console.log(`[UnifiedDevEnvironmentPage] Cancelling download: ${id}`);
      const result = await devEnvironmentAPI.cancelDownload(id);
      
      if (result) {
        console.log(`[UnifiedDevEnvironmentPage] Successfully cancelled download: ${id}`);
        // 强制刷新统计数据
        setTimeout(() => {
          updateDownloadStats();
        }, 100);
      } else {
        console.error(`[UnifiedDevEnvironmentPage] Failed to cancel download: ${id}`);
        alert('取消下载失败，请稍后重试。');
      }
    } catch (error) {
      console.error('Failed to cancel download:', error);
      alert('取消下载时发生错误：' + (error as Error).message);
    }
  };

  const handleRemoveDownload = async (id: string) => {
    try {
      const download = downloadItems.find(item => item.id === id);
      if (!download) return;

      // 创建确认对话框
      const confirmMessage = `确定要删除下载任务"${download.name}"吗？\n\n` +
        `这将同时删除所有相关文件，且此操作不可撤销。`;

      if (window.confirm(confirmMessage)) {
        console.log(`[UnifiedDevEnvironmentPage] Removing download: ${id}`);
        const result = await devEnvironmentAPI.removeDownload(id);
        
        if (result) {
          // 立即从本地状态中移除
          setDownloadItems(prev => prev.filter(item => item.id !== id));
          console.log(`[UnifiedDevEnvironmentPage] Successfully removed download: ${id}`);
          
          // 强制刷新统计数据
          setTimeout(() => {
            updateDownloadStats();
          }, 100);
        } else {
          console.error(`[UnifiedDevEnvironmentPage] Failed to remove download: ${id}`);
          alert('删除下载任务失败，请稍后重试。');
        }
      }
    } catch (error) {
      console.error('Failed to remove download:', error);
      alert('删除下载任务时发生错误：' + (error as Error).message);
    }
  };

  const handleRetryDownload = async (id: string) => {
    try {
      await devEnvironmentAPI.retryDownload(id);
    } catch (error) {
      console.error('Failed to retry download:', error);
    }
  };

  // 计算统计数据
  const totalTools = tools.length;
  const environmentTools = tools.filter(tool => tool.category === '开发环境').length;
  const ideTools = tools.filter(tool => tool.category === 'IDE工具').length;
  const cliTools = tools.filter(tool => tool.category === '命令行工具').length;

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return '已完成';
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
    return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分`;
  };


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
                <FaRocket size={32} />
                开发环境工具
              </WelcomeTitle>
              <WelcomeSubtitle $isGlassMode={isGlassMode}>
                这里收录了开发所需的各类工具，包括开发环境、IDE、命令行工具和个人常用软件。一站式解决您的开发环境配置需求。
              </WelcomeSubtitle>
            </WelcomeContent>
          </WelcomeCard>

          {/* 统计卡片 */}
          <StatsGrid>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              >
                <StatsCard
                  $isGlassMode={isGlassMode}
                  whileHover={{ scale: 1.02 }}
                >
                  <StatsIcon $color={stat.color}>
                    <stat.icon size={24} />
                  </StatsIcon>
                  <StatsValue>{stat.value}</StatsValue>
                  <StatsLabel>{stat.label}</StatsLabel>
                </StatsCard>
              </motion.div>
            ))}
          </StatsGrid>

          {/* 按分类展示工具 */}
          {categories.map((category) => {
            const categoryTools = tools.filter(tool => tool.category === category.id);
            
            return (
              <CategorySection
                key={category.id}
                $isGlassMode={isGlassMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <CategoryHeader>
                  <CategoryIcon $color={category.color}>
                    <category.icon size={24} />
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
                        icon={tool.icon ? <tool.icon size={24} /> : <FaTools size={24} />}
                        name={tool.name}
                        description={tool.description}
                        officialUrl={tool.website}
                        downloadUrl={tool.downloadUrl}
                        onDownload={() => handleDownload(tool.id)}
                        installed={tool.installed}
                        version={tool.version}
                        className={installingTools.has(tool.id) ? 'installing' : ''}
                        isGlassMode={isGlassMode}
                        iconColor={category.color}
                      />
                    </motion.div>
                  ))}
                </ToolsGrid>
              </CategorySection>
            );
          })}
        </MainContent>

        {/* 下载管理侧边栏 */}
        <Sidebar>
          {/* 下载管理卡片 */}
          <Card $variant="elevated">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <FaDownload size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                下载队列
                {downloadStats.downloading > 0 && (
                  <span style={{
                    background: '#3B82F6',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    marginLeft: '8px',
                    verticalAlign: 'middle'
                  }}>
                    {downloadStats.downloading}
                  </span>
                )}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                管理您的下载任务
              </p>
            </div>

            {/* 下载统计 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                padding: '12px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3B82F6', marginBottom: '4px' }}>
                  {downloadStats.total}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  总任务数
                </div>
              </div>

              <div style={{ 
                padding: '12px', 
                background: 'rgba(16, 185, 129, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>
                  {downloadStats.completed}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  已完成
                </div>
              </div>

              <div style={{ 
                padding: '12px', 
                background: 'rgba(245, 158, 11, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F59E0B', marginBottom: '4px' }}>
                  {downloadStats.downloading}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  下载中
                </div>
              </div>

              <div style={{ 
                padding: '12px', 
                background: 'rgba(139, 92, 246, 0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8B5CF6', marginBottom: '4px' }}>
                  {formatFileSize(downloadStats.totalSpeed)}/s
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  总速度
                </div>
              </div>
            </div>

            {/* 下载列表 */}
            <ScrollableContainer>
              {downloadItems.length === 0 ? (
                <EmptyDownloads>
                  <EmptyIcon>
                    <FaDownload />
                  </EmptyIcon>
                  <div>暂无下载任务</div>
                </EmptyDownloads>
              ) : (
                downloadItems.map((item) => (
                  <DownloadItemContainer key={item.id}>
                    <DownloadItemHeader>
                      <DownloadItemIcon $status={item.status}>
                        {item.status === 'completed' ? <FaCheckCircle /> :
                         item.status === 'downloading' ? <FaDownload /> :
                         item.status === 'paused' ? <FaPause /> :
                         item.status === 'failed' ? <FaExclamationTriangle /> :
                         <FaClock />}
                      </DownloadItemIcon>
                      <DownloadItemInfo>
                        <DownloadItemName>{item.name}</DownloadItemName>
                        <DownloadItemStats>
                          {item.status === 'installing' ? '安装中...' :
                           item.status === 'downloading' ? `${item.progress.toFixed(1)}% • ${formatFileSize(item.speed)}/s` :
                           item.status === 'paused' ? '已暂停' :
                           item.status === 'completed' ? '已完成' :
                           item.status === 'failed' ? '下载失败' :
                           item.status === 'cancelled' ? '已取消' :
                           item.status === 'pending' ? '等待中...' : '未知状态'}
                          {item.status === 'downloading' && item.eta > 0 && ` • 剩余 ${formatTime(item.eta)}`}
                        </DownloadItemStats>
                        
                        {/* 显示重试信息 */}
                        {item.retryCount && item.retryCount > 0 && item.status !== 'completed' && (
                          <DownloadItemRetryInfo>
                            <FaInfoCircle size={10} />
                            重试次数: {item.retryCount}/{item.maxRetries || 3}
                          </DownloadItemRetryInfo>
                        )}
                        
                        {/* 显示错误信息 */}
                        {item.lastError && (item.status === 'failed' || item.status === 'completed') && (
                          <DownloadItemError>
                            <FaExclamationTriangle size={10} />
                            {item.lastError.length > 50 ? item.lastError.substring(0, 50) + '...' : item.lastError}
                          </DownloadItemError>
                        )}
                        
                        {/* 显示断点续传支持 */}
                        {item.supportsResume && item.status === 'paused' && (
                          <DownloadItemRetryInfo>
                            <FaInfoCircle size={10} />
                            支持断点续传
                          </DownloadItemRetryInfo>
                        )}
                      </DownloadItemInfo>
                    </DownloadItemHeader>
                    
                    <DownloadItemProgress>
                      <DownloadItemProgressBar 
                        $progress={item.progress} 
                        $status={item.status}
                      />
                    </DownloadItemProgress>
                    
                    <DownloadItemControls>
                      {item.status === 'downloading' && (
                        <DownloadControlButton
                          onClick={() => handlePauseDownload(item.id)}
                          title="暂停"
                        >
                          <FaPause />
                        </DownloadControlButton>
                      )}
                      
                      {item.status === 'paused' && (
                        <DownloadControlButton
                          onClick={() => handleResumeDownload(item.id)}
                          title="继续"
                        >
                          <FaPlay />
                        </DownloadControlButton>
                      )}
                      
                      {(item.status === 'failed' || item.status === 'cancelled') && (
                        <DownloadControlButton
                          onClick={() => handleRetryDownload(item.id)}
                          title="重试"
                          style={{ color: '#F59E0B' }}
                        >
                          <FaRedo />
                        </DownloadControlButton>
                      )}
                      
                      {item.status !== 'failed' && item.status !== 'cancelled' && (
                        <DownloadControlButton
                          onClick={() => handleCancelDownload(item.id)}
                          title="取消"
                        >
                          <FaStop />
                        </DownloadControlButton>
                      )}
                      
                      <DownloadControlButton
                        onClick={() => handleRemoveDownload(item.id)}
                        title="删除"
                      >
                        <FaTrash />
                      </DownloadControlButton>
                    </DownloadItemControls>
                  </DownloadItemContainer>
                ))
              )}
            </ScrollableContainer>
          </Card>
        </Sidebar>
      </GridContainer>
    </HiddenScrollPageContainer>
  );
};

export default UnifiedDevEnvironmentPage;