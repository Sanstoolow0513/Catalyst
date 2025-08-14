import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Button } from './common';

const ProxyGroupContainer = styled.div`
  margin-bottom: 20px;
`;

const ProxyGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ProxyGroupName = styled.h3`
  margin: 0;
  color: ${props => props.theme.textPrimary};
`;

const ProxyGroupType = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  background-color: ${props => props.theme.surfaceVariant};
  padding: 2px 6px;
  border-radius: 4px;
`;

const ProxyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ProxyItem = styled(Button)<{ $selected?: boolean }>`
  padding: 6px 12px;
  font-size: 0.9rem;
  ${props => props.$selected && `
    background-color: ${props.theme.primary.main};
    color: white;
    border-color: ${props.theme.primary.main};
  `}
`;

const ProxyGroupManager: React.FC = () => {
  const [proxyGroups, setProxyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          // 只处理代理组（有 proxies 属性的）
          if (proxy.proxies && Array.isArray(proxy.proxies)) {
            groups.push({
              name,
              type: proxy.type,
              now: proxy.now,
              proxies: proxy.proxies
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

  if (loading) {
    return <div>Loading proxy groups...</div>;
  }

  return (
    <div>
      {proxyGroups.map(group => (
        <ProxyGroupContainer key={group.name}>
          <ProxyGroupHeader>
            <ProxyGroupName>{group.name}</ProxyGroupName>
            <ProxyGroupType>{group.type}</ProxyGroupType>
          </ProxyGroupHeader>
          <Card $padding="small">
            <div>
              <strong>Current:</strong> {group.now || 'None'}
            </div>
            <ProxyList>
              {group.proxies.map((proxy: string) => (
                <ProxyItem
                  key={proxy}
                  $selected={group.now === proxy}
                  onClick={() => handleSelectProxy(group.name, proxy)}
                  size="small"
                  variant={group.now === proxy ? "primary" : "outline"}
                >
                  {proxy}
                </ProxyItem>
              ))}
            </ProxyList>
          </Card>
        </ProxyGroupContainer>
      ))}
      {proxyGroups.length === 0 && (
        <div style={{ margin: '0 0 20px 0' }}>
          <Card $padding="medium">
            <div>No proxy groups found.</div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProxyGroupManager;