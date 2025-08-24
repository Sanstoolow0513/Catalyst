import React from 'react';
import styled from 'styled-components';
import { 
  User as UserIcon,
  Settings as SettingsIcon,
  MessageSquare as MessageIcon,
  Database as DatabaseIcon,
  Palette as PaletteIcon,
  Monitor as MonitorIcon,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Bell as BellIcon,
  Search as SearchIcon
} from 'lucide-react';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  children?: SidebarNavItem[];
  badge?: string;
}

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const SidebarContainer = styled.div`
  width: 280px;
  background: ${props => props.theme.surface};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.borderLight};
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SidebarSearch = styled.div`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.sm} ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    border: 1px solid ${props => props.theme.border};
    border-radius: ${props => props.theme.borderRadius.small};
    background: ${props => props.theme.surface};
    color: ${props => props.theme.textPrimary};
    font-size: 0.875rem;
    transition: border-color ${props => props.theme.transition.fast} ease;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary.main};
    }
    
    &::placeholder {
      color: ${props => props.theme.textTertiary};
    }
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textTertiary};
`;

const NavSection = styled.div`
  padding: ${props => props.theme.spacing.sm} 0;
`;


const NavItem = styled.button<{ $active: boolean; $hasChildren?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border: none;
  background: ${props => props.$active ? props.theme.primary.light + '20' : 'transparent'};
  color: ${props => props.$active ? props.theme.primary.main : props.theme.textSecondary};
  text-align: left;
  cursor: pointer;
  border-radius: 0;
  transition: all ${props => props.theme.transition.fast} ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  position: relative;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary.light + '30' : props.theme.surfaceVariant};
    color: ${props => props.$active ? props.theme.primary.main : props.theme.textPrimary};
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.theme.primary.main};
    border-radius: 0 3px 3px 0;
    transform: ${props => props.$active ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform ${props => props.theme.transition.fast} ease;
  }
`;

const NavItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavItemLabel = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const NavItemDescription = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textTertiary};
  font-weight: 400;
`;

const NavItemBadge = styled.span`
  background: ${props => props.theme.error.main};
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  text-transform: uppercase;
`;

const navItems: SidebarNavItem[] = [
  {
    id: 'user',
    label: '个人信息',
    icon: <UserIcon size={18} />,
    description: '管理您的个人资料'
  },
  {
    id: 'appearance',
    label: '外观设置',
    icon: <PaletteIcon size={18} />,
    description: '主题、语言和显示'
  },
  {
    id: 'system',
    label: '系统行为',
    icon: <MonitorIcon size={18} />,
    description: '启动、关闭和通知'
  },
  {
    id: 'network',
    label: '网络设置',
    icon: <GlobeIcon size={18} />,
    description: '代理和连接配置'
  },
  {
    id: 'privacy',
    label: '隐私安全',
    icon: <ShieldIcon size={18} />,
    description: '数据和隐私设置'
  },
  {
    id: 'notifications',
    label: '通知设置',
    icon: <BellIcon size={18} />,
    description: '通知和提醒'
  },
  {
    id: 'llm',
    label: '语言模型',
    icon: <MessageIcon size={18} />,
    description: 'AI模型配置'
  },
  {
    id: 'backup',
    label: '数据管理',
    icon: <DatabaseIcon size={18} />,
    description: '备份和恢复'
  }
];

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredItems = navItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>
          <SettingsIcon size={20} />
          设置
        </SidebarTitle>
      </SidebarHeader>

      <SidebarSearch>
        <SearchInput>
          <SearchIconWrapper>
            <SearchIcon size={16} />
          </SearchIconWrapper>
          <input
            type="text"
            placeholder="搜索设置..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchInput>
      </SidebarSearch>

      <NavSection>
        <NavItem
          key="general"
          $active={activeSection === 'general'}
          onClick={() => onSectionChange('general')}
        >
          <SettingsIcon size={18} />
          <NavItemContent>
            <NavItemLabel>通用设置</NavItemLabel>
            <NavItemDescription>基本配置和偏好</NavItemDescription>
          </NavItemContent>
        </NavItem>

        {filteredItems.map((item) => (
          <NavItem
            key={item.id}
            $active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
            <NavItemContent>
              <NavItemLabel>
                {item.label}
                {item.badge && <NavItemBadge>{item.badge}</NavItemBadge>}
              </NavItemLabel>
              {item.description && (
                <NavItemDescription>{item.description}</NavItemDescription>
              )}
            </NavItemContent>
          </NavItem>
        ))}
      </NavSection>
    </SidebarContainer>
  );
};

export default SettingsSidebar;