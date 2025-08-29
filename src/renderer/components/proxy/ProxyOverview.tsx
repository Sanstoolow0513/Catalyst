import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Activity,
  Globe,
  Zap,
  Users,
  TrendingUp,
  Wifi,
  Clock,
  Gauge
} from 'lucide-react';
import { ProxyConnectionInfo, ProxyMetrics } from '../../services/ProxyService';

const OverviewContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const MetricCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MetricIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const MetricBadge = styled.span<{ $variant: 'success' | 'warning' | 'error' | 'info' }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 8px;
  background: ${props => {
    switch (props.$variant) {
      case 'success': return props.theme.success.main + '20';
      case 'warning': return props.theme.warning.main + '20';
      case 'error': return props.theme.error.main + '20';
      case 'info': return props.theme.primary.main + '20';
      default: return props.theme.surfaceVariant;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'success': return props.theme.success.main;
      case 'warning': return props.theme.warning.main;
      case 'error': return props.theme.error.main;
      case 'info': return props.theme.primary.main;
      default: return props.theme.textSecondary;
    }
  }};
`;

const MetricTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const MetricSubtext = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ConnectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PortInfo = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: ${props => props.theme.surfaceVariant};
  border-radius: 8px;
`;

const PortLabel = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  font-weight: 600;
`;

const PortValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.surfaceVariant};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.75rem;
`;

const ProgressFill = styled(motion.div)<{ $color: string; $value: number }>`
  height: 100%;
  background: ${props => props.$color};
  border-radius: 2px;
`;

const PulseIndicator = styled(motion.div)<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
  box-shadow: 0 0 12px ${props => props.$color}50;
`;

interface ProxyOverviewProps {
  isRunning: boolean;
  connectionInfo: ProxyConnectionInfo | null;
  metrics: ProxyMetrics | null;
  isLoading?: boolean;
}

const ProxyOverview: React.FC<ProxyOverviewProps> = ({
  isRunning,
  connectionInfo,
  metrics,
  isLoading = false
}) => {
  const getHealthScore = (): number => {
    if (!metrics) return 0;
    if (metrics.totalProxies === 0) return 0;
    return Math.round((metrics.healthyProxies / metrics.totalProxies) * 100);
  };

  const getHealthVariant = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getDelayVariant = (delay: number): 'success' | 'warning' | 'error' => {
    if (delay < 100) return 'success';
    if (delay < 300) return 'warning';
    return 'error';
  };

  const formatUptime = (uptime?: number): string => {
    if (!uptime) return '未知';
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <OverviewContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 连接状态卡片 */}
      <MetricCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <MetricHeader>
          <MetricIcon $color={isRunning ? '#10B981' : '#EF4444'}>
            {isRunning ? <Activity size={24} /> : <Wifi size={24} />}
          </MetricIcon>
          <MetricBadge $variant={isRunning ? 'success' : 'error'}>
            {isRunning ? '运行中' : '已停止'}
          </MetricBadge>
        </MetricHeader>
        
        <MetricTitle>连接状态</MetricTitle>
        <MetricValue>{isRunning ? '已连接' : '未连接'}</MetricValue>
        
        {isRunning && connectionInfo && (
          <MetricSubtext>
            <Clock size={14} />
            运行时间: {formatUptime(connectionInfo.uptime)}
          </MetricSubtext>
        )}

        {connectionInfo && (
          <ConnectionGrid>
            <PortInfo>
              <PortLabel>HTTP</PortLabel>
              <PortValue>{connectionInfo.httpPort}</PortValue>
            </PortInfo>
            <PortInfo>
              <PortLabel>SOCKS</PortLabel>
              <PortValue>{connectionInfo.socksPort}</PortValue>
            </PortInfo>
            <PortInfo>
              <PortLabel>MIXED</PortLabel>
              <PortValue>{connectionInfo.mixedPort}</PortValue>
            </PortInfo>
          </ConnectionGrid>
        )}
      </MetricCard>

      {/* 代理统计卡片 */}
      <MetricCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <MetricHeader>
          <MetricIcon $color="#3B82F6">
            <Globe size={24} />
          </MetricIcon>
          <PulseIndicator
            $color="#3B82F6"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </MetricHeader>
        
        <MetricTitle>代理节点</MetricTitle>
        <MetricValue>
          {isLoading ? '...' : metrics?.totalProxies || 0}
        </MetricValue>
        
        <MetricSubtext>
          <Users size={14} />
          活跃: {metrics?.activeProxies || 0} 个节点
        </MetricSubtext>
      </MetricCard>

      {/* 平均延迟卡片 */}
      <MetricCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <MetricHeader>
          <MetricIcon $color="#F59E0B">
            <Zap size={24} />
          </MetricIcon>
          {metrics?.avgDelay && (
            <MetricBadge $variant={getDelayVariant(metrics.avgDelay)}>
              {metrics.avgDelay < 100 ? '优秀' : 
               metrics.avgDelay < 300 ? '良好' : '较慢'}
            </MetricBadge>
          )}
        </MetricHeader>
        
        <MetricTitle>平均延迟</MetricTitle>
        <MetricValue>
          {isLoading ? '...' : 
           metrics?.avgDelay ? `${metrics.avgDelay}ms` : 'N/A'}
        </MetricValue>
        
        <MetricSubtext>
          <Gauge size={14} />
          基于 {metrics?.healthyProxies || 0} 个健康节点
        </MetricSubtext>

        {metrics?.avgDelay && (
          <ProgressBar>
            <ProgressFill
              $color={
                metrics.avgDelay < 100 ? '#10B981' : 
                metrics.avgDelay < 300 ? '#F59E0B' : '#EF4444'
              }
              $value={Math.min(metrics.avgDelay / 500 * 100, 100)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(metrics.avgDelay / 500 * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </ProgressBar>
        )}
      </MetricCard>

      {/* 健康度卡片 */}
      <MetricCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <MetricHeader>
          <MetricIcon $color="#10B981">
            <TrendingUp size={24} />
          </MetricIcon>
          <MetricBadge $variant={getHealthVariant(getHealthScore())}>
            {getHealthScore() >= 80 ? '健康' : 
             getHealthScore() >= 50 ? '一般' : '不良'}
          </MetricBadge>
        </MetricHeader>
        
        <MetricTitle>网络健康度</MetricTitle>
        <MetricValue>
          {isLoading ? '...' : `${getHealthScore()}%`}
        </MetricValue>
        
        <MetricSubtext>
          <Activity size={14} />
          {metrics?.healthyProxies || 0} / {metrics?.totalProxies || 0} 节点正常
        </MetricSubtext>

        <ProgressBar>
          <ProgressFill
            $color={
              getHealthScore() >= 80 ? '#10B981' : 
              getHealthScore() >= 50 ? '#F59E0B' : '#EF4444'
            }
            $value={getHealthScore()}
            initial={{ width: 0 }}
            animate={{ width: `${getHealthScore()}%` }}
            transition={{ duration: 1, delay: 0.6 }}
          />
        </ProgressBar>
      </MetricCard>
    </OverviewContainer>
  );
};

export default ProxyOverview;