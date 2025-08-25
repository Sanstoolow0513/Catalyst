import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  CheckCircle, 
  Search, 
  Filter,
  ArrowUpDown,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Globe,
  } from 'lucide-react';
import { ProxyGroup } from '../../types';
import { Button } from '../common';

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  min-width: 200px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.textPrimary};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
    box-shadow: 0 0 0 3px ${props => props.theme.primary.main}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
`;

const FilterDropdown = styled.div`
  position: relative;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.$active ? props.theme.primary.main : props.theme.border};
  border-radius: 12px;
  background: ${props => props.$active ? props.theme.primary.main + '20' : props.theme.surface};
  color: ${props => props.$active ? props.theme.primary.main : props.theme.textPrimary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.surfaceVariant};
  }
`;

const SortButton = styled(FilterButton)``;

const GroupsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GroupCard = styled(motion.div)<{ $isExpanded?: boolean }>`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  cursor: pointer;
`;

const GroupInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const GroupIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color}20;
  color: ${props => props.$color};
`;

const GroupDetails = styled.div`
  flex: 1;
`;

const GroupName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const GroupMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const GroupType = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  background: ${props => props.theme.surfaceVariant};
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
`;

const GroupStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CurrentProxy = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary.main}10;
  border: 1px solid ${props => props.theme.primary.main}30;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.primary.main};
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${props => props.theme.surfaceVariant};
  border-radius: 8px;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.border};
    transform: scale(1.05);
  }
`;

const GroupContent = styled(motion.div)`
  padding: 1.5rem;
  background: ${props => props.theme.background};
`;

const ProxiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
`;

const ProxyCard = styled(motion.div)<{ 
  $selected?: boolean; 
  $delay?: number;
  $isHealthy?: boolean;
}>`
  background: ${props => props.$selected ? props.theme.primary.main : props.theme.surface};
  border: 1px solid ${props => {
    if (props.$selected) return props.theme.primary.main;
    if (props.$isHealthy === false) return props.theme.error.main;
    return props.theme.border;
  }};
  border-radius: 12px;
  padding: 1rem;
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
      top: 8px;
      right: 8px;
      background: ${props.$delay < 100 ? '#10B981' : 
                    props.$delay < 300 ? '#F59E0B' : 
                    '#EF4444'};
      color: white;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: 600;
    }
  `}
`;

const ProxyContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProxyIndicator = styled.div<{ $selected?: boolean; $isHealthy?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    if (props.$selected) return 'rgba(255, 255, 255, 0.8)';
    if (props.$isHealthy === false) return props.theme.error.main;
    if (props.$isHealthy === true) return props.theme.success.main;
    return props.theme.surfaceVariant;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.$selected && `
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `}
`;

const ProxyName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const NoResults = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

const SpinIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type SortOption = 'name' | 'type' | 'proxies' | 'current';
type FilterOption = 'all' | 'active' | 'healthy' | 'unhealthy';

interface EnhancedProxyGroupManagerProps {
  groups: ProxyGroup[];
  latencyData: Record<string, number>;
  isLoading?: boolean;
  isTestingLatency?: boolean;
  onSelectProxy: (groupName: string, proxyName: string) => void;
  onTestLatency: () => void;
  onRefreshGroups: () => void;
}

const EnhancedProxyGroupManager: React.FC<EnhancedProxyGroupManagerProps> = ({
  groups,
  latencyData,
  isLoading = false,
  isTestingLatency = false,
  onSelectProxy,
  onTestLatency,
  onRefreshGroups
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy] = useState<SortOption>('name');
  const [filterBy] = useState<FilterOption>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 过滤和排序逻辑
  const filteredAndSortedGroups = useMemo(() => {
    const filtered = groups.filter(group => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = group.name.toLowerCase().includes(query);
        const matchesProxy = group.proxies.some(proxy => 
          proxy.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesProxy) return false;
      }

      // 状态过滤
      switch (filterBy) {
        case 'active':
          return !!group.now;
        case 'healthy':
          return group.proxies.some(proxy => {
            const delay = latencyData[proxy];
            return delay && delay > 0;
          });
        case 'unhealthy':
          return group.proxies.some(proxy => {
            const delay = latencyData[proxy];
            return delay === -1 || delay === undefined;
          });
        default:
          return true;
      }
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'proxies':
          return b.proxies.length - a.proxies.length;
        case 'current':
          if (a.now && !b.now) return -1;
          if (!a.now && b.now) return 1;
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [groups, searchQuery, sortBy, filterBy, latencyData]);

  const toggleGroupExpansion = useCallback((groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  }, [expandedGroups]);

  const getProxyHealthStatus = useCallback((proxyName: string): boolean | undefined => {
    const delay = latencyData[proxyName];
    if (delay === undefined) return undefined;
    return delay > 0;
  }, [latencyData]);

  const getSortLabel = useCallback((sort: SortOption): string => {
    switch (sort) {
      case 'name': return '名称';
      case 'type': return '类型';
      case 'proxies': return '节点数';
      case 'current': return '当前选择';
      default: return '名称';
    }
  }, []);

  const getFilterLabel = useCallback((filter: FilterOption): string => {
    switch (filter) {
      case 'all': return '全部';
      case 'active': return '活跃';
      case 'healthy': return '健康';
      case 'unhealthy': return '异常';
      default: return '全部';
    }
  }, []);

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <HeaderLeft>
          <Title>
            <Layers size={24} />
            代理组管理
          </Title>
          <Subtitle>
            管理和配置您的代理服务器组，选择最优节点
          </Subtitle>
        </HeaderLeft>
        
        <HeaderRight>
          <Button
            variant="outline"
            size="small"
            onClick={onRefreshGroups}
            disabled={isLoading}
            startIcon={<RefreshCw size={16} />}
          >
            刷新
          </Button>
          
          <Button
            variant="outline"
            size="small"
            onClick={onTestLatency}
            disabled={isTestingLatency || groups.length === 0}
            startIcon={<Zap size={16} />}
          >
            {isTestingLatency ? '测试中...' : '测试延迟'}
          </Button>
        </HeaderRight>
      </Header>

      <Controls>
        <SearchBox>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            placeholder="搜索代理组或节点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        <FilterDropdown>
          <FilterButton $active={filterBy !== 'all'}>
            <Filter size={16} />
            {getFilterLabel(filterBy)}
            <ChevronDown size={16} />
          </FilterButton>
        </FilterDropdown>

        <SortButton>
          <ArrowUpDown size={16} />
          {getSortLabel(sortBy)}
          <ChevronDown size={16} />
        </SortButton>
      </Controls>

      {isLoading ? (
        <LoadingIndicator>
          <SpinIcon
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw size={20} />
          </SpinIcon>
          加载代理组...
        </LoadingIndicator>
      ) : filteredAndSortedGroups.length === 0 ? (
        <NoResults
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Globe size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {searchQuery || filterBy !== 'all' ? '未找到匹配的代理组' : '未找到代理组'}
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            {searchQuery || filterBy !== 'all' 
              ? '尝试调整搜索条件或过滤器' 
              : '启动代理服务并加载配置以查看代理组'}
          </div>
        </NoResults>
      ) : (
        <GroupsList>
          {filteredAndSortedGroups.map((group, index) => {
            const isExpanded = expandedGroups.has(group.name);
            
            return (
              <GroupCard
                key={group.name}
                $isExpanded={isExpanded}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GroupHeader onClick={() => toggleGroupExpansion(group.name)}>
                  <GroupInfo>
                    <GroupIcon $color="#3B82F6">
                      <Layers size={20} />
                    </GroupIcon>
                    
                    <GroupDetails>
                      <GroupName>{group.name}</GroupName>
                      <GroupMeta>
                        <GroupType>{group.type}</GroupType>
                        <GroupStats>
                          <StatItem>
                            <Globe size={14} />
                            {group.proxies.length} 节点
                          </StatItem>
                          {group.now && (
                            <StatItem>
                              <CheckCircle size={14} />
                              {group.now}
                            </StatItem>
                          )}
                        </GroupStats>
                      </GroupMeta>
                    </GroupDetails>
                  </GroupInfo>

                  {group.now && (
                    <CurrentProxy>
                      <CheckCircle size={16} />
                      {group.now}
                    </CurrentProxy>
                  )}

                  <ExpandButton>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </ExpandButton>
                </GroupHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <GroupContent
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProxiesGrid>
                        {useMemo(() => group.proxies.map((proxyName) => {
                          const delay = latencyData[proxyName];
                          const isSelected = group.now === proxyName;
                          const isHealthy = getProxyHealthStatus(proxyName);
                          
                          return (
                            <ProxyCard
                              key={proxyName}
                              $selected={isSelected}
                              $delay={delay > 0 ? delay : undefined}
                              $isHealthy={isHealthy}
                              onClick={() => onSelectProxy(group.name, proxyName)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ProxyContent>
                                <ProxyIndicator
                                  $selected={isSelected}
                                  $isHealthy={isHealthy}
                                />
                                <ProxyName>{proxyName}</ProxyName>
                              </ProxyContent>
                            </ProxyCard>
                          );
                        }), [group.proxies, latencyData, group.now, getProxyHealthStatus, onSelectProxy])}
                      </ProxiesGrid>
                    </GroupContent>
                  )}
                </AnimatePresence>
              </GroupCard>
            );
          })}
        </GroupsList>
      )}
    </Container>
  );
};

export default EnhancedProxyGroupManager;