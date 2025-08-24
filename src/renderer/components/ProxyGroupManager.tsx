import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '../components/common';
import { Wifi, Zap, Layers, Activity, CheckCircle } from 'lucide-react';

const ModernSection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const ModernSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModernSectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModernSectionDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
`;

const ProxyGroupCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ProxyGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ProxyGroupInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProxyGroupIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const ProxyGroupDetails = styled.div`
  flex: 1;
`;

const ProxyGroupName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 0.25rem 0;
`;

const ProxyGroupType = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  background: ${props => props.theme.surfaceVariant};
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
`;

const ProxyGroupContent = styled.div`
  padding: 1.5rem;
`;

const CurrentProxyCard = styled.div`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CurrentProxyIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.primary.main}20;
  color: ${props => props.theme.primary.main};
`;

const CurrentProxyInfo = styled.div`
  flex: 1;
`;

const CurrentProxyLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.25rem;
`;

const CurrentProxyName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

const ProxyList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const ProxyItem = styled(motion.div)<{ $selected?: boolean; $delay?: number }>`
  background: ${props => props.$selected ? props.theme.primary.main : props.theme.surface};
  border: 1px solid ${props => props.$selected ? props.theme.primary.main : props.theme.border};
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.$selected && `
    color: white;
  `}
  
  ${props => props.$delay !== undefined && `
    &::after {
      content: '${props.$delay}ms';
      position: absolute;
      top: -6px;
      right: -6px;
      background: ${props.$delay < 100 ? '#10B981' : 
                    props.$delay < 300 ? '#F59E0B' : 
                    '#EF4444'};
      color: white;
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  `}
`;

const ProxyItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textPrimary};
`;

const ProxyItemIcon = styled.div<{ $selected?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.$selected ? 'rgba(255, 255, 255, 0.3)' : props.theme.surfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: ${props => props.$selected ? 'white' : props.theme.textSecondary};
`;

const ProxyItemText = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TestLatencyButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
`;

const NoProxiesMessage = styled(motion.div)`
  text-align: center;
  padding: 3rem 2rem;
  color: ${props => props.theme.textSecondary};
  background: ${props => props.theme.surface};
  border: 2px dashed ${props => props.theme.border};
  border-radius: 16px;
`;

const LatencyIndicator = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.$delay < 100 ? '#10B981' : 
    props.$delay < 300 ? '#F59E0B' : 
    '#EF4444'};
  box-shadow: 0 0 8px ${props => 
    props.$delay < 100 ? 'rgba(16, 185, 129, 0.3)' : 
    props.$delay < 300 ? 'rgba(245, 158, 11, 0.3)' : 
    'rgba(239, 68, 68, 0.3)'};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ProxyGroupManager: React.FC = () => {
  const [proxyGroups, setProxyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingLatency, setTestingLatency] = useState(false);
  const [latencyData, setLatencyData] = useState<Record<string, number>>({});

  useEffect(() => {
    loadProxyGroups();
  }, []);

  const loadProxyGroups = async () => {
    if (!window.electronAPI?.mihomo) return;
    
    setLoading(true);
    try {
      const result = await window.electronAPI.mihomo.getProxies();
      if (result.success && result.data) {
        // 提取代理组信息
        const groups: any[] = [];
        Object.entries(result.data.proxies).forEach(([name, proxy]: [string, any]) => {
          // 只处理代理组（有 all 或 proxies 属性的）
          if ((proxy.all && Array.isArray(proxy.all)) || (proxy.proxies && Array.isArray(proxy.proxies))) {
            groups.push({
              name,
              type: proxy.type,
              now: proxy.now,
              proxies: proxy.all || proxy.proxies,
              providers: proxy.providers || [],
              latencyHistory: proxy.history || []
            });
          }
        });
        setProxyGroups(groups);
      }
    } catch (error) {
      console.error('Failed to load proxy groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProxy = async (groupName: string, proxyName: string) => {
    if (!window.electronAPI?.mihomo) return;
    
    try {
      const result = await window.electronAPI.mihomo.selectProxy(groupName, proxyName);
      if (result.success) {
        // 更新本地状态
        setProxyGroups(prev => prev.map(group => {
          if (group.name === groupName) {
            return { ...group, now: proxyName };
          }
          return group;
        }));
      } else {
        console.error('Failed to select proxy:', result.error);
      }
    } catch (error) {
      console.error('Error selecting proxy:', error);
    }
  };

  const testLatencyForAll = async () => {
    if (!window.electronAPI?.mihomo || testingLatency) return;
    
    setTestingLatency(true);
    try {
      // 获取所有代理信息
      const result = await window.electronAPI.mihomo.getProxies();
      if (result.success && result.data) {
        const newLatencyData: Record<string, number> = {};
        
        // 为每个代理测试延迟
        const proxies = result.data.proxies;
        for (const [name, proxy] of Object.entries(proxies)) {
          // 只测试非直连和非拒绝类型的代理
          if (proxy.type !== 'Direct' && proxy.type !== 'Reject') {
            try {
              // 调用实际的延迟测试API
              const delayResult = await window.electronAPI.mihomo.testProxyDelay(name);
              if (delayResult.success && delayResult.data !== undefined) {
                newLatencyData[name] = delayResult.data;
              } else {
                newLatencyData[name] = -1; // 表示测试失败
              }
            } catch (error) {
              console.error(`Failed to test latency for ${name}:`, error);
              newLatencyData[name] = -1; // 表示测试失败
            }
          }
        }
        
        setLatencyData(newLatencyData);
      }
    } catch (error) {
      console.error('Error testing latency:', error);
    } finally {
      setTestingLatency(false);
    }
  };

  const getProxyDelay = (proxyName: string) => {
    return latencyData[proxyName];
  };

  if (loading) {
    return (
      <ModernSection>
        <div style={{ textAlign: 'center', padding: '2rem', color: props => props.theme.textSecondary }}>
          <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>
            <Activity size={24} />
          </div>
          <div style={{ marginTop: '1rem' }}>加载代理组...</div>
        </div>
      </ModernSection>
    );
  }

  return (
    <ModernSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ModernSectionHeader>
        <div>
          <ModernSectionTitle>
            <Layers size={20} />
            代理组管理
          </ModernSectionTitle>
          <ModernSectionDescription>
            管理和选择您的代理服务器，测试延迟以确保最佳连接质量
          </ModernSectionDescription>
        </div>
        <TestLatencyButton
          onClick={testLatencyForAll}
          disabled={testingLatency}
          variant="outline"
          startIcon={<Zap size={16} />}
        >
          {testingLatency ? '测试延迟...' : '测试所有延迟'}
        </TestLatencyButton>
      </ModernSectionHeader>
      
      {proxyGroups.map((group, index) => (
        <ProxyGroupCard
          key={group.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <ProxyGroupHeader>
            <ProxyGroupInfo>
              <ProxyGroupIcon $color="#3B82F6">
                <Layers size={20} />
              </ProxyGroupIcon>
              <ProxyGroupDetails>
                <ProxyGroupName>{group.name}</ProxyGroupName>
                <ProxyGroupType>{group.type}</ProxyGroupType>
              </ProxyGroupDetails>
            </ProxyGroupInfo>
          </ProxyGroupHeader>
          <ProxyGroupContent>
            <CurrentProxyCard>
              <CurrentProxyIcon>
                <CheckCircle size={16} />
              </CurrentProxyIcon>
              <CurrentProxyInfo>
                <CurrentProxyLabel>当前代理</CurrentProxyLabel>
                <CurrentProxyName>{group.now || '无'}</CurrentProxyName>
              </CurrentProxyInfo>
            </CurrentProxyCard>
            <ProxyList>
              {group.proxies.map((proxy: string) => {
                const delay = getProxyDelay(proxy);
                return (
                  <ProxyItem
                    key={proxy}
                    $selected={group.now === proxy}
                    $delay={delay >= 0 ? delay : undefined}
                    onClick={() => handleSelectProxy(group.name, proxy)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ProxyItemContent>
                      <ProxyItemIcon $selected={group.now === proxy}>
                        {group.now === proxy && <CheckCircle size={8} />}
                      </ProxyItemIcon>
                      <ProxyItemText>{proxy}</ProxyItemText>
                      {delay >= 0 && <LatencyIndicator $delay={delay} />}
                    </ProxyItemContent>
                  </ProxyItem>
                );
              })}
            </ProxyList>
          </ProxyGroupContent>
        </ProxyGroupCard>
      ))}
      {proxyGroups.length === 0 && (
        <NoProxiesMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Wifi size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            未找到代理组
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            启动代理服务并加载配置文件以查看代理组
          </div>
        </NoProxiesMessage>
      )}
    </ModernSection>
  );
};

export default ProxyGroupManager;