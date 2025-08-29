import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaDownload, 
  FaChevronDown, 
  FaChevronUp,
  FaList,
  FaChartLine
} from 'react-icons/fa';
import SimpleDownloadItem from './SimpleDownloadItem';
import { SimpleDownloadItem as SimpleDownloadItemType, DownloadStatus } from './SimpleDownloadItem';
import { useTheme } from '../../contexts/ThemeContext';
import { getAnimationConfig } from '../../utils/animations';

interface DownloadSidebarProps {
  downloadItems: SimpleDownloadItemType[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
  isGlassMode?: boolean;
}

const SidebarContainer = styled(motion.div)<{ $isGlassMode?: boolean }>`
  width: 350px;
  min-width: 350px;
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  position: sticky;
  top: 80px;
  border-radius: 12px;
  margin: 0 0 0 1rem;
  
  &:hover {
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
  }
`;

const SidebarHeader = styled.div<{ $isGlassMode?: boolean }>`
  padding: 1.5rem;
  border-bottom: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  border-radius: 12px 12px 0 0;
`;

const HeaderTitle = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.$isGlassMode ? '#F0F0F0' : props.theme?.textPrimary || '#1F2937'};
  margin-bottom: 0.5rem;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
`;

const StatItem = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
`;

const StatValue = styled.span<{ $color?: string }>`
  font-weight: 600;
  color: ${props => props.$color || props.theme?.textPrimary || '#1F2937'};
`;

const ToggleButton = styled.button<{ $isGlassMode?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$isGlassMode ? '#C0C0C0' : props.theme?.textSecondary || '#6B7280'};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  
  &:hover {
    background: ${props => props.$isGlassMode 
      ? 'rgba(255, 255, 255, 0.1)' 
      : props.theme?.surfaceVariant || '#F3F4F6'};
  }
`;

const DownloadsList = styled.div<{ $isGlassMode?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isGlassMode ? 'rgba(255, 255, 255, 0.2)' : props.theme?.border || '#E5E7EB'};
    border-radius: 2px;
  }
`;

const EmptyState = styled.div<{ $isGlassMode?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.$isGlassMode ? '#808080' : props.theme?.textTertiary || '#9CA3AF'};
  font-size: 0.85rem;
  text-align: center;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const CollapsedContainer = styled(motion.div)<{ $isGlassMode?: boolean }>`
  width: 60px;
  min-width: 60px;
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  position: sticky;
  top: 80px;
  border-radius: 12px;
  margin: 0 0 0 1rem;
  
  &:hover {
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
  }
`;

const CollapsedHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const DownloadBadge = styled.div<{ $count: number; $isGlassMode?: boolean }>`
  background: ${props => props.$count > 0 ? '#3B82F6' : 'transparent'};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 0.25rem;
`;

const DownloadSidebar: React.FC<DownloadSidebarProps> = ({
  downloadItems,
  onPause,
  onResume,
  onCancel,
  onRemove,
  isGlassMode = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

  // 计算统计数据
  const stats = {
    total: downloadItems.length,
    downloading: downloadItems.filter(item => item.status === 'downloading').length,
    completed: downloadItems.filter(item => item.status === 'completed').length,
    paused: downloadItems.filter(item => item.status === 'paused').length,
    totalSpeed: downloadItems
      .filter(item => item.status === 'downloading')
      .reduce((sum, item) => sum + item.speed, 0)
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (isCollapsed) {
    return (
      <CollapsedContainer
        $isGlassMode={isGlassMode}
        initial={animationConfig.disabled ? false : { opacity: 0, x: 20 }}
        animate={animationConfig.disabled ? false : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CollapsedHeader>
          <FaDownload size={20} color={isGlassMode ? '#C0C0C0' : '#6B7280'} />
          <DownloadBadge $count={stats.downloading} $isGlassMode={isGlassMode}>
            {stats.downloading}
          </DownloadBadge>
        </CollapsedHeader>
        
        <ToggleButton
          $isGlassMode={isGlassMode}
          onClick={() => setIsCollapsed(false)}
          style={{ marginTop: 'auto' }}
        >
          <FaChevronUp size={12} />
        </ToggleButton>
      </CollapsedContainer>
    );
  }

  return (
    <SidebarContainer
      $isGlassMode={isGlassMode}
      initial={animationConfig.disabled ? false : { opacity: 0, x: 20 }}
      animate={animationConfig.disabled ? false : { opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SidebarHeader $isGlassMode={isGlassMode}>
        <HeaderTitle $isGlassMode={isGlassMode}>
          <FaDownload size={14} />
          下载队列
          <DownloadBadge $count={stats.downloading} $isGlassMode={isGlassMode}>
            {stats.downloading}
          </DownloadBadge>
          <ToggleButton
            $isGlassMode={isGlassMode}
            onClick={() => setIsCollapsed(true)}
          >
            <FaChevronDown size={12} />
          </ToggleButton>
        </HeaderTitle>
        
        <HeaderStats>
          <StatItem $isGlassMode={isGlassMode}>
            <FaList size={12} />
            <StatValue>{stats.total}</StatValue>
          </StatItem>
          <StatItem $isGlassMode={isGlassMode}>
            <FaChartLine size={12} />
            <StatValue $color="#3B82F6">
              {formatFileSize(stats.totalSpeed)}/s
            </StatValue>
          </StatItem>
        </HeaderStats>
      </SidebarHeader>
      
      <DownloadsList $isGlassMode={isGlassMode}>
        {downloadItems.length === 0 ? (
          <EmptyState $isGlassMode={isGlassMode}>
            <EmptyIcon>
              <FaDownload />
            </EmptyIcon>
            <div>暂无下载任务</div>
          </EmptyState>
        ) : (
          downloadItems.map((item, index) => (
            <SimpleDownloadItem
              key={item.id}
              item={item}
              onPause={onPause}
              onResume={onResume}
              onCancel={onCancel}
              onRemove={onRemove}
              isGlassMode={isGlassMode}
            />
          ))
        )}
      </DownloadsList>
    </SidebarContainer>
  );
};

export default DownloadSidebar;