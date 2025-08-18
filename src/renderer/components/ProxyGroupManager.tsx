import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Button } from '../components/common';
import { RotateCw, Wifi, Zap } from 'lucide-react';

const ProxyGroupContainer = styled.div`
  margin-bottom: 24px;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
`;

const ProxyGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${props => props.theme.surfaceVariant};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ProxyGroupName = styled.h3`
  margin: 0;
  color: ${props => props.theme.textPrimary};
  font-weight: 600;
`;

const ProxyGroupType = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  background-color: ${props => props.theme.background};
  padding: 4px 8px;
  border-radius: 4px;
`;

const ProxyGroupContent = styled.div`
  padding: 16px;
`;

const CurrentProxy = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background-color: ${props => props.theme.background};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.border};
`;

const ProxyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const ProxyItem = styled(Button)<{ $selected?: boolean; $delay?: number }>`
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: ${props => props.theme.borderRadius.small};
  position: relative;
  
  ${props => props.$selected && `
    background-color: ${props.theme.primary.main};
    color: white;
    border-color: ${props.theme.primary.main};
  `}
  
  ${props => props.$delay !== undefined && `
    &::after {
      content: '${props.$delay}ms';
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: ${props.$delay < 100 ? props.theme.success.main : 
                          props.$delay < 300 ? props.theme.warning.main : 
                          props.theme.error.main};
      color: white;
      font-size: 0.7rem;
      padding: 2px 4px;
      border-radius: 4px;
      font-weight: bold;
    }
  `}
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
`;

const TestLatencyButton = styled(Button)`
  font-size: 0.9rem;
  padding: 8px 16px;
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
`;

const NoProxiesMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.textSecondary};
  border: 1px dashed ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
`;

const LatencyIndicator = styled.span<{ $delay: number }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => 
    props.$delay < 100 ? props.theme.success.main : 
    props.$delay < 300 ? props.theme.warning.main : 
    props.theme.error.main};
  margin-right: 8px;
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
    return <div>Loading proxy groups...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: props => props.theme.textPrimary }}>Proxy Groups</h2>
        <TestLatencyButton
          onClick={testLatencyForAll}
          disabled={testingLatency}
          variant="outline"
          startIcon={<Zap size={16} />}
        >
          {testingLatency ? 'Testing Latency...' : 'Test All Latency'}
        </TestLatencyButton>
      </div>
      
      {proxyGroups.map(group => (
        <ProxyGroupContainer key={group.name}>
          <ProxyGroupHeader>
            <ProxyGroupName>{group.name}</ProxyGroupName>
            <ProxyGroupType>{group.type}</ProxyGroupType>
          </ProxyGroupHeader>
          <ProxyGroupContent>
            <CurrentProxy>
              <strong>Current Proxy:</strong> {group.now || 'None'}
            </CurrentProxy>
            <ProxyList>
              {group.proxies.map((proxy: string) => {
                const delay = getProxyDelay(proxy);
                return (
                  <ProxyItem
                    key={proxy}
                    $selected={group.now === proxy}
                    $delay={delay >= 0 ? delay : undefined}
                    onClick={() => handleSelectProxy(group.name, proxy)}
                    variant={group.now === proxy ? "primary" : "outline"}
                  >
                    {delay >= 0 && <LatencyIndicator $delay={delay} />}
                    {proxy}
                  </ProxyItem>
                );
              })}
            </ProxyList>
          </ProxyGroupContent>
        </ProxyGroupContainer>
      ))}
      {proxyGroups.length === 0 && (
        <NoProxiesMessage>
          <Wifi size={48} style={{ opacity: 0.3, marginBottom: 10 }} />
          <div>No proxy groups found.</div>
          <div style={{ fontSize: '0.9rem', marginTop: 5 }}>Start the proxy service and load a configuration to see proxy groups.</div>
        </NoProxiesMessage>
      )}
    </div>
  );
};

export default ProxyGroupManager;