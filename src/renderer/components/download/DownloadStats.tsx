import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaDownload, 
  FaPause, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTachometerAlt,
  FaHdd,
  FaClock,
  FaTimes,
  FaChartLine
} from 'react-icons/fa';
import { DownloadStatus, DownloadItem } from '../pages/DownloadProgressPage';
import { getAnimationConfig } from '../../utils/animations';

interface DownloadStatsProps {
  downloadItems: DownloadItem[];
  isGlassMode?: boolean;
}

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$color || '#3B82F6'};
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
  }
`;

const StatIcon = styled.div<{ $color: string; $isGlassMode?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
  margin: 0 auto 1rem;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  ${StatCard}:hover & {
    transform: scale(1.1);
    background: ${props => props.$color}30;
  }
`;

const StatValue = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937'};
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  ${StatCard}:hover & {
    transform: scale(1.05);
  }
`;

const StatLabel = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
  font-weight: 500;
`;

const StatDetail = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.$isGlassMode ? '#808080' : props.theme?.textTertiary || '#9CA3AF'};
  margin-top: 0.25rem;
`;

const ProgressRing = styled.svg<{ $progress: number; $color: string }>`
  width: 60px;
  height: 60px;
  transform: rotate(-90deg);
  margin: 0 auto 1rem;
`;

const ProgressRingBackground = styled.circle<{ $isGlassMode?: boolean }>`
  fill: none;
  stroke: ${props => props.$isGlassMode ? 'rgba(64, 64, 64, 0.3)' : '#E5E7EB'};
  stroke-width: 4;
`;

const ProgressRingFill = styled.circle<{ $color: string }>`
  fill: none;
  stroke: ${props => props.$color};
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// 格式化时间
const formatTime = (seconds: number): string => {
  if (seconds === 0) return '0秒';
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分`;
};

// 计算圆环进度
const calculateProgressRing = (progress: number) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return { radius, circumference, strokeDasharray, strokeDashoffset };
};

const DownloadStats: React.FC<DownloadStatsProps> = ({
  downloadItems,
  isGlassMode = false
}) => {
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

  // 计算统计数据
  const stats = {
    total: downloadItems.length,
    downloading: downloadItems.filter(item => item.status === 'downloading').length,
    paused: downloadItems.filter(item => item.status === 'paused').length,
    completed: downloadItems.filter(item => item.status === 'completed').length,
    failed: downloadItems.filter(item => item.status === 'failed').length,
    cancelled: downloadItems.filter(item => item.status === 'cancelled').length,
    pending: downloadItems.filter(item => item.status === 'pending').length,
    totalSpeed: downloadItems
      .filter(item => item.status === 'downloading')
      .reduce((sum, item) => sum + item.speed, 0),
    totalDownloaded: downloadItems
      .reduce((sum, item) => sum + item.downloadedSize, 0),
    totalSize: downloadItems
      .reduce((sum, item) => sum + item.totalSize, 0),
    averageProgress: downloadItems.length > 0
      ? downloadItems.reduce((sum, item) => sum + item.progress, 0) / downloadItems.length
      : 0
  };

  // 计算活跃下载的平均速度
  const activeDownloads = downloadItems.filter(item => item.status === 'downloading');
  const averageSpeed = activeDownloads.length > 0
    ? activeDownloads.reduce((sum, item) => sum + item.speed, 0) / activeDownloads.length
    : 0;

  // 计算总进度
  const totalProgress = stats.totalSize > 0
    ? (stats.totalDownloaded / stats.totalSize) * 100
    : 0;

  const statsData = [
    {
      id: 'total',
      icon: FaDownload,
      value: stats.total,
      label: '总任务数',
      detail: `${stats.completed} 已完成`,
      color: '#3B82F6',
      ringColor: '#60A5FA'
    },
    {
      id: 'progress',
      icon: FaChartLine,
      value: `${stats.averageProgress.toFixed(1)}%`,
      label: '总进度',
      detail: `${formatFileSize(stats.totalDownloaded)} / ${formatFileSize(stats.totalSize)}`,
      color: '#8B5CF6',
      ringColor: '#A78BFA',
      showRing: true,
      progress: totalProgress
    },
    {
      id: 'active',
      icon: FaTachometerAlt,
      value: stats.downloading,
      label: '下载中',
      detail: `${activeDownloads.length} 个活跃`,
      color: '#10B981',
      ringColor: '#34D399'
    },
    {
      id: 'speed',
      icon: FaHdd,
      value: formatFileSize(stats.totalSpeed),
      label: '总速度',
      detail: averageSpeed > 0 ? `平均 ${formatFileSize(averageSpeed)}/s` : '无活动下载',
      color: '#F59E0B',
      ringColor: '#FBBF24'
    },
    {
      id: 'paused',
      icon: FaPause,
      value: stats.paused,
      label: '已暂停',
      detail: `${stats.pending} 等待中`,
      color: '#6B7280',
      ringColor: '#9CA3AF'
    },
    {
      id: 'issues',
      icon: FaExclamationTriangle,
      value: stats.failed,
      label: '失败',
      detail: `${stats.cancelled} 已取消`,
      color: '#EF4444',
      ringColor: '#F87171'
    }
  ];

  return (
    <StatsGrid>
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={animationConfig.disabled ? false : { opacity: 0, y: 20 }}
          animate={animationConfig.disabled ? false : { opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <StatCard
            $isGlassMode={isGlassMode}
            $color={stat.color}
            whileHover={animationConfig.disabled ? undefined : { scale: 1.02 }}
            whileTap={animationConfig.disabled ? undefined : { scale: 0.98 }}
          >
            {stat.showRing ? (
              <>
                <ProgressRing $progress={stat.progress || 0} $color={stat.ringColor}>
                  <ProgressRingBackground
                    $isGlassMode={isGlassMode}
                    cx="30"
                    cy="30"
                    r="26"
                  />
                  <ProgressRingFill
                    $color={stat.ringColor}
                    cx="30"
                    cy="30"
                    r="26"
                    strokeDasharray={calculateProgressRing(stat.progress || 0).strokeDasharray}
                    strokeDashoffset={calculateProgressRing(stat.progress || 0).strokeDashoffset}
                  />
                </ProgressRing>
                <StatIcon $color={stat.color} $isGlassMode={isGlassMode}>
                  <stat.icon />
                </StatIcon>
              </>
            ) : (
              <StatIcon $color={stat.color} $isGlassMode={isGlassMode}>
                <stat.icon />
              </StatIcon>
            )}
            
            <StatValue $isGlassMode={isGlassMode}>
              {stat.value}
            </StatValue>
            <StatLabel $isGlassMode={isGlassMode}>
              {stat.label}
            </StatLabel>
            {stat.detail && (
              <StatDetail $isGlassMode={isGlassMode}>
                {stat.detail}
              </StatDetail>
            )}
          </StatCard>
        </motion.div>
      ))}
    </StatsGrid>
  );
};

export default DownloadStats;