import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  RefreshCw
} from 'lucide-react';
import Card from '../common/Card';
import { getAnimationConfig } from '../../utils/animations';

interface SystemMetric {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    upload: number;
    download: number;
  };
}

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`;

const MetricItem = styled.div`
  padding: 12px;
  background: ${props => props.theme?.surface || '#F9FAFB'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.border || '#E5E7EB'};
`;

const MetricInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  margin-bottom: 4px;
`;

const MetricValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
`;

const ProgressBar = styled.div<{ $width: number; $color: string }>`
  width: 100%;
  height: 4px;
  background: ${props => props.theme?.border || '#E5E7EB'};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$width}%;
    height: 100%;
    background: ${props => props.$color};
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;


const NetworkStats = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme?.surface || '#F9FAFB'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.border || '#E5E7EB'};
`;

const NetworkItem = styled.div`
  text-align: center;
  flex: 1;
`;

const NetworkLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  margin-bottom: 4px;
`;

const NetworkValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
`;

const RefreshButton = styled(motion.button)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${props => props.theme?.surface || '#F9FAFB'};
  border: 1px solid ${props => props.theme?.border || '#E5E7EB'};
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props => props.theme?.textSecondary || '#6B7280'};
  
  &:hover {
    background: ${props => props.theme?.surfaceVariant || '#F3F4F6'};
    color: ${props => props.theme?.textPrimary || '#111827'};
  }
`;


const FrequencyButtons = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 8px;
`;

const FrequencyButton = styled(motion.button)<{ $active: boolean }>`
  background: ${props => props.$active ? props.theme?.primary?.main || '#3B82F6' : props.theme?.surface || '#F9FAFB'};
  border: 1px solid ${props => props.$active ? props.theme?.primary?.main || '#3B82F6' : props.theme?.border || '#E5E7EB'};
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.75rem;
  color: ${props => props.$active ? 'white' : props.theme?.textSecondary || '#6B7280'};
  cursor: pointer;
  min-width: 40px;
  
  &:hover {
    background: ${props => props.$active ? props.theme?.primary?.dark || '#2563EB' : props.theme?.surfaceVariant || '#F3F4F6'};
    color: ${props => props.$active ? 'white' : props.theme?.textPrimary || '#111827'};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const SystemStatusCard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: {
      upload: 0,
      download: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [updateFrequency, setUpdateFrequency] = useState(1); // 默认1秒

  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

  const fetchSystemMetrics = async () => {
    setLoading(true);
    try {
      // 模拟系统指标数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: SystemMetric = {
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        network: {
          upload: Math.floor(Math.random() * 1000),
          download: Math.floor(Math.random() * 1000)
        }
      };
      
      setMetrics(mockMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemMetrics();
    
    const interval = setInterval(fetchSystemMetrics, updateFrequency * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [updateFrequency]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  
  const handleFrequencyChange = (frequency: number) => {
    setUpdateFrequency(frequency);
  };

  return (
    <Card $variant="elevated" style={{ position: 'relative' }}>
      <RefreshButton
        onClick={fetchSystemMetrics}
        whileHover={animationConfig.disabled ? undefined : { scale: 1.05 }}
        whileTap={animationConfig.disabled ? undefined : { scale: 0.95 }}
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        刷新
      </RefreshButton>
      
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          系统状态
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          最后更新: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>

      <ControlsContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            更新频率:
          </span>
          <FrequencyButtons>
            <FrequencyButton
              $active={updateFrequency === 0.5}
              onClick={() => handleFrequencyChange(0.5)}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.05 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.95 }}
            >
              快
            </FrequencyButton>
            <FrequencyButton
              $active={updateFrequency === 1}
              onClick={() => handleFrequencyChange(1)}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.05 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.95 }}
            >
              适中
            </FrequencyButton>
            <FrequencyButton
              $active={updateFrequency === 2}
              onClick={() => handleFrequencyChange(2)}
              whileHover={animationConfig.disabled ? undefined : { scale: 1.05 }}
              whileTap={animationConfig.disabled ? undefined : { scale: 0.95 }}
            >
              慢
            </FrequencyButton>
          </FrequencyButtons>
        </div>
      </ControlsContainer>

      <MetricGrid>
        <MetricItem>
          <MetricInfo>
            <MetricLabel>CPU 使用率</MetricLabel>
            <MetricValue>{metrics.cpu}%</MetricValue>
            <ProgressBar $width={metrics.cpu} $color="#3B82F6" />
          </MetricInfo>
        </MetricItem>

        <MetricItem>
          <MetricInfo>
            <MetricLabel>内存使用率</MetricLabel>
            <MetricValue>{metrics.memory}%</MetricValue>
            <ProgressBar $width={metrics.memory} $color="#8B5CF6" />
          </MetricInfo>
        </MetricItem>

        <MetricItem>
          <MetricInfo>
            <MetricLabel>磁盘使用率</MetricLabel>
            <MetricValue>{metrics.disk}%</MetricValue>
            <ProgressBar $width={metrics.disk} $color="#10B981" />
          </MetricInfo>
        </MetricItem>

        <MetricItem>
          <MetricInfo>
            <MetricLabel>系统负载</MetricLabel>
            <MetricValue>{Math.floor(Math.random() * 10)}/10</MetricValue>
            <ProgressBar $width={Math.floor(Math.random() * 100)} $color="#F59E0B" />
          </MetricInfo>
        </MetricItem>
      </MetricGrid>

      <NetworkStats>
        <NetworkItem>
          <NetworkLabel>上传</NetworkLabel>
          <NetworkValue>{formatBytes(metrics.network.upload)}</NetworkValue>
        </NetworkItem>
        <NetworkItem>
          <NetworkLabel>下载</NetworkLabel>
          <NetworkValue>{formatBytes(metrics.network.download)}</NetworkValue>
        </NetworkItem>
        <NetworkItem>
          <NetworkLabel>延迟</NetworkLabel>
          <NetworkValue>{Math.floor(Math.random() * 100)}ms</NetworkValue>
        </NetworkItem>
      </NetworkStats>
    </Card>
  );
};

export default SystemStatusCard;