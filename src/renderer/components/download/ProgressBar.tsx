import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { DownloadStatus } from '../pages/DownloadProgressPage';

interface ProgressBarProps {
  progress: number; // 0-100
  status: DownloadStatus;
  size?: 'small' | 'medium' | 'large';
  showPercentage?: boolean;
  animated?: boolean;
  isGlassMode?: boolean;
  className?: string;
}

const ProgressBarContainer = styled.div<{ $size: 'small' | 'medium' | 'large' }>`
  width: 100%;
  height: ${props => {
    switch (props.$size) {
      case 'small': return '4px';
      case 'medium': return '8px';
      case 'large': return '12px';
      default: return '8px';
    }
  }};
  background: ${props => props.$isGlassMode ? 'rgba(64, 64, 64, 0.3)' : props.theme?.border || '#E5E7EB'};
  border-radius: ${props => {
    switch (props.$size) {
      case 'small': return '2px';
      case 'medium': return '4px';
      case 'large': return '6px';
      default: return '4px';
    }
  }};
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled(motion.div)<{ $status: DownloadStatus; $progress: number }>`
  height: 100%;
  background: ${props => {
    switch (props.$status) {
      case 'completed': 
        return 'linear-gradient(90deg, #10B981 0%, #34D399 100%)';
      case 'downloading': 
        return 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)';
      case 'paused': 
        return 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)';
      case 'failed': 
        return 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)';
      case 'cancelled': 
        return 'linear-gradient(90deg, #6B7280 0%, #9CA3AF 100%)';
      case 'pending': 
        return 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)';
      default: 
        return 'linear-gradient(90deg, #6B7280 0%, #9CA3AF 100%)';
    }
  }};
  border-radius: inherit;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ProgressPercentage = styled.div<{ $size: 'small' | 'medium' | 'large'; $isGlassMode?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.7rem';
      case 'medium': return '0.8rem';
      case 'large': return '0.9rem';
      default: return '0.8rem';
    }
  }};
  font-weight: 600;
  color: ${props => props.$isGlassMode ? '#F0F0F0' : '#FFFFFF'};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  z-index: 1;
`;

const ProgressLabel = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
`;

const ProgressText = styled.span`
  font-weight: 500;
`;

const ProgressStatus = styled.span<{ $status: DownloadStatus }>`
  font-weight: 500;
  color: ${props => {
    switch (props.$status) {
      case 'completed': return '#10B981';
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'failed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      case 'pending': return '#8B5CF6';
      default: return '#6B7280';
    }
  }};
`;

// 获取状态文本
const getStatusText = (status: DownloadStatus): string => {
  switch (status) {
    case 'completed': return '已完成';
    case 'downloading': return '下载中';
    case 'paused': return '已暂停';
    case 'failed': return '失败';
    case 'cancelled': return '已取消';
    case 'pending': return '等待中';
    default: return '未知';
  }
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  size = 'medium',
  showPercentage = false,
  animated = true,
  isGlassMode = false,
  className
}) => {
  // 确保进度在0-100范围内
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // 动画配置
  const animationProps = animated ? {
    initial: { width: 0 },
    animate: { width: `${clampedProgress}%` },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {
    style: { width: `${clampedProgress}%` }
  };

  return (
    <div className={className}>
      <ProgressBarContainer $size={size} $isGlassMode={isGlassMode}>
        {showPercentage && (
          <ProgressPercentage $size={size} $isGlassMode={isGlassMode}>
            {clampedProgress.toFixed(1)}%
          </ProgressPercentage>
        )}
        <ProgressFill $status={status} $progress={clampedProgress} {...animationProps} />
      </ProgressBarContainer>
      
      <ProgressLabel $isGlassMode={isGlassMode}>
        <ProgressText>{clampedProgress.toFixed(1)}%</ProgressText>
        <ProgressStatus $status={status}>
          {getStatusText(status)}
        </ProgressStatus>
      </ProgressLabel>
    </div>
  );
};

export default ProgressBar;