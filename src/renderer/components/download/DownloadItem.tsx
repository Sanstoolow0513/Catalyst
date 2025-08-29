import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaDownload, 
  FaPause, 
  FaPlay, 
  FaStop, 
  FaTrash, 
  FaFolderOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaEllipsisV
} from 'react-icons/fa';
import { getAnimationConfig } from '../../utils/animations';
import { DownloadStatus, DownloadItem } from '../pages/DownloadProgressPage';

interface DownloadItemComponentProps {
  item: DownloadItem;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
  onOpenFolder: (path: string) => void;
  isGlassMode?: boolean;
}

const DownloadItemContainer = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconContainer = styled.div<{ $status: DownloadStatus; $isGlassMode?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return props.$isGlassMode ? 'rgba(16, 185, 129, 0.2)' : '#10B98120';
      case 'downloading': return props.$isGlassMode ? 'rgba(59, 130, 246, 0.2)' : '#3B82F620';
      case 'paused': return props.$isGlassMode ? 'rgba(245, 158, 11, 0.2)' : '#F59E0B20';
      case 'failed': return props.$isGlassMode ? 'rgba(239, 68, 68, 0.2)' : '#EF444420';
      case 'cancelled': return props.$isGlassMode ? 'rgba(107, 114, 128, 0.2)' : '#6B728020';
      default: return props.$isGlassMode ? 'rgba(107, 114, 128, 0.2)' : '#6B728020';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'completed': return '#10B981';
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'failed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      default: return '#6B7280';
    }
  }};
`;

const InfoContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937'};
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDetails = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 0.9rem;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressBar = styled.div<{ $isGlassMode?: boolean }>`
  width: 100%;
  height: 8px;
  background: ${props => props.$isGlassMode ? 'rgba(64, 64, 64, 0.3)' : props.theme?.border || '#E5E7EB'};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.25rem;
`;

const ProgressFill = styled.div<{ $status: DownloadStatus; $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: ${props => {
    switch (props.$status) {
      case 'completed': return '#10B981';
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'failed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      default: return '#6B7280';
    }
  }};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressInfo = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
`;

const ProgressPercentage = styled.span`
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: DownloadStatus }>`
  font-weight: 500;
  color: ${props => {
    switch (props.$status) {
      case 'completed': return '#10B981';
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'failed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      default: return '#6B7280';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionButton = styled(motion.button)<{ $isGlassMode?: boolean }>`
  padding: 0.5rem;
  background: ${props => props.$isGlassMode ? 'rgba(51, 65, 85, 0.12)' : props.theme?.surfaceVariant || '#F3F4F6'};
  border: ${props => props.$isGlassMode ? '1px solid rgba(148, 163, 184, 0.15)' : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 6px;
  color: ${props => props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.$isGlassMode ? 'rgba(51, 65, 85, 0.2)' : props.theme?.primary?.main + '20'};
    border-color: ${props => props.theme?.primary?.main || '#3B82F6'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MoreButton = styled(ActionButton)`
  padding: 0.5rem;
`;

const ErrorMessage = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.$isGlassMode ? '#FCA5A5' : '#EF4444'};
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: ${props => props.$isGlassMode ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2'};
  border-radius: 4px;
  border: 1px solid ${props => props.$isGlassMode ? 'rgba(239, 68, 68, 0.2)' : '#FECACA'};
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
  if (seconds === 0) return '已完成';
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
  return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分`;
};

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

// 获取状态图标
const getStatusIcon = (status: DownloadStatus) => {
  switch (status) {
    case 'completed': return <FaCheckCircle />;
    case 'downloading': return <FaDownload />;
    case 'paused': return <FaPause />;
    case 'failed': return <FaExclamationTriangle />;
    case 'cancelled': return <FaStop />;
    case 'pending': return <FaClock />;
    default: return <FaClock />;
  }
};

const DownloadItemComponent: React.FC<DownloadItemComponentProps> = ({
  item,
  onPause,
  onResume,
  onCancel,
  onRemove,
  onOpenFolder,
  isGlassMode = false
}) => {
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

  const handlePause = () => onPause(item.id);
  const handleResume = () => onResume(item.id);
  const handleCancel = () => onCancel(item.id);
  const handleRemove = () => onRemove(item.id);
  const handleOpenFolder = () => onOpenFolder(item.savePath);

  return (
    <DownloadItemContainer
      $isGlassMode={isGlassMode}
      whileHover={animationConfig.disabled ? undefined : { scale: 1.02 }}
      whileTap={animationConfig.disabled ? undefined : { scale: 0.98 }}
      transition={{
        duration: animationConfig.disabled ? 0 : animationConfig.hoverDuration
      }}
    >
      <ItemContent>
        <IconContainer $status={item.status} $isGlassMode={isGlassMode}>
          {getStatusIcon(item.status)}
        </IconContainer>
        
        <InfoContainer>
          <ItemName $isGlassMode={isGlassMode}>
            {item.name}
          </ItemName>
          
          <ItemDetails $isGlassMode={isGlassMode}>
            {formatFileSize(item.downloadedSize)} / {formatFileSize(item.totalSize)}
            {item.speed > 0 && ` • ${formatFileSize(item.speed)}/s`}
            {item.eta > 0 && ` • 剩余 ${formatTime(item.eta)}`}
          </ItemDetails>
          
          <ProgressBar $isGlassMode={isGlassMode}>
            <ProgressFill $status={item.status} $progress={item.progress} />
          </ProgressBar>
          
          <ProgressInfo $isGlassMode={isGlassMode}>
            <ProgressPercentage>{item.progress.toFixed(1)}%</ProgressPercentage>
            <StatusBadge $status={item.status}>
              {getStatusText(item.status)}
            </StatusBadge>
          </ProgressInfo>
          
          {item.status === 'failed' && item.error && (
            <ErrorMessage $isGlassMode={isGlassMode}>
              错误: {item.error}
            </ErrorMessage>
          )}
        </InfoContainer>
        
        <ActionButtons>
          {item.status === 'downloading' && (
            <ActionButton
              $isGlassMode={isGlassMode}
              onClick={handlePause}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
              title="暂停"
            >
              <FaPause size={14} />
            </ActionButton>
          )}
          
          {item.status === 'paused' && (
            <ActionButton
              $isGlassMode={isGlassMode}
              onClick={handleResume}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
              title="继续"
            >
              <FaPlay size={14} />
            </ActionButton>
          )}
          
          {(item.status === 'downloading' || item.status === 'paused') && (
            <ActionButton
              $isGlassMode={isGlassMode}
              onClick={handleCancel}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
              title="取消"
            >
              <FaStop size={14} />
            </ActionButton>
          )}
          
          {item.status === 'completed' && (
            <ActionButton
              $isGlassMode={isGlassMode}
              onClick={handleOpenFolder}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
              title="打开文件夹"
            >
              <FaFolderOpen size={14} />
            </ActionButton>
          )}
          
          {(item.status === 'completed' || item.status === 'failed' || item.status === 'cancelled') && (
            <ActionButton
              $isGlassMode={isGlassMode}
              onClick={handleRemove}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
              title="移除"
            >
              <FaTrash size={14} />
            </ActionButton>
          )}
          
          <MoreButton
            $isGlassMode={isGlassMode}
            whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
            whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
            title="更多选项"
          >
            <FaEllipsisV size={14} />
          </MoreButton>
        </ActionButtons>
      </ItemContent>
    </DownloadItemContainer>
  );
};

export default DownloadItemComponent;