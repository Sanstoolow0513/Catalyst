import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaPause, 
  FaPlay, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaTimes
} from 'react-icons/fa';
import { getAnimationConfig } from '../../utils/animations';

export type DownloadStatus = 'downloading' | 'paused' | 'completed' | 'failed' | 'pending' | 'cancelled';

export interface SimpleDownloadItem {
  id: string;
  name: string;
  status: DownloadStatus;
  progress: number;
  speed: number;
  eta: number;
}

interface SimpleDownloadItemProps {
  item: SimpleDownloadItem;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
  isGlassMode?: boolean;
}

const ItemContainer = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme?.surfaceVariant || '#F3F4F6'};
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div<{ $isGlassMode?: boolean }>`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937'};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBar = styled.div<{ $progress: number; $status: DownloadStatus }>`
  flex: 1;
  height: 4px;
  background: ${props => props.theme?.border || '#E5E7EB'};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled(motion.div)<{ $status: DownloadStatus }>`
  height: 100%;
  background: ${props => {
    switch (props.$status) {
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'completed': return '#10B981';
      case 'failed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      default: return '#8B5CF6';
    }
  }};
  border-radius: 2px;
`;

const ProgressText = styled.span<{ $isGlassMode?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
  min-width: 35px;
  text-align: right;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

const StatusIcon = styled.div<{ $status: DownloadStatus }>`
  font-size: 0.75rem;
  color: ${props => {
    switch (props.$status) {
      case 'downloading': return '#3B82F6';
      case 'paused': return '#F59E0B';
      case 'completed': return '#10B981';
      case 'failed': return '#EF4444';
      case 'cancelled': return '#6B7280';
      default: return '#8B5CF6';
    }
  }};
`;

const StatusText = styled.span<{ $isGlassMode?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isGlassMode ? '#808080' : props.theme?.textTertiary || '#9CA3AF'};
`;

const SpeedText = styled.span<{ $isGlassMode?: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isGlassMode ? '#808080' : props.theme?.textTertiary || '#9CA3AF'};
  margin-left: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ActionButton = styled(motion.button)<{ $isGlassMode?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : props.theme?.surfaceVariant || '#F3F4F6'};
    color: ${props => props.theme?.textPrimary || '#1F2937'};
  }
`;

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const SimpleDownloadItemComponent: React.FC<SimpleDownloadItemProps> = ({
  item,
  onPause,
  onResume,
  _onCancel,
  onRemove,
  isGlassMode = false
}) => {
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

  const getStatusIcon = () => {
    switch (item.status) {
      case 'downloading': return <FaClock />;
      case 'paused': return <FaPause />;
      case 'completed': return <FaCheckCircle />;
      case 'failed': return <FaExclamationTriangle />;
      case 'cancelled': return <FaTimes />;
      default: return <FaClock />;
    }
  };

  const getStatusText = () => {
    switch (item.status) {
      case 'downloading': return '下载中';
      case 'paused': return '已暂停';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      case 'cancelled': return '已取消';
      default: return '等待中';
    }
  };

  const handleAction = () => {
    switch (item.status) {
      case 'downloading':
        onPause(item.id);
        break;
      case 'paused':
        onResume(item.id);
        break;
      case 'pending':
      case 'failed':
      case 'cancelled':
        onRemove(item.id);
        break;
    }
  };

  const getActionIcon = () => {
    switch (item.status) {
      case 'downloading': return <FaPause />;
      case 'paused': return <FaPlay />;
      case 'completed':
      case 'failed':
      case 'cancelled':
        return <FaTimes />;
      default: return <FaTimes />;
    }
  };

  return (
    <ItemContainer
      $isGlassMode={isGlassMode}
      initial={animationConfig.disabled ? false : { opacity: 0, x: 20 }}
      animate={animationConfig.disabled ? false : { opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ItemContent>
        <ItemInfo>
          <ItemName $isGlassMode={isGlassMode}>
            {item.name}
          </ItemName>
          
          <ProgressContainer>
            <ProgressBar $progress={item.progress} $status={item.status}>
              <ProgressFill
                $status={item.status}
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </ProgressBar>
            <ProgressText $isGlassMode={isGlassMode}>
              {Math.round(item.progress)}%
            </ProgressText>
          </ProgressContainer>
          
          <StatusInfo>
            <StatusIcon $status={item.status}>
              {getStatusIcon()}
            </StatusIcon>
            <StatusText $isGlassMode={isGlassMode}>
              {getStatusText()}
            </StatusText>
            {item.speed > 0 && (
              <SpeedText $isGlassMode={isGlassMode}>
                {formatFileSize(item.speed)}/s
              </SpeedText>
            )}
          </StatusInfo>
        </ItemInfo>
        
        <ActionButtons>
          {(item.status === 'downloading' || item.status === 'paused' || 
            item.status === 'pending' || item.status === 'failed' || 
            item.status === 'cancelled') && (
            <ActionButton
              $isGlassMode={isGlassMode}
              onClick={handleAction}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {getActionIcon()}
            </ActionButton>
          )}
        </ActionButtons>
      </ItemContent>
    </ItemContainer>
  );
};

export default SimpleDownloadItemComponent;