import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  User as UserIcon,
  Database as DatabaseIcon,
  Monitor as MonitorIcon,
  Search as SearchIcon,
  Settings as SettingsIcon
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

const SidebarContainer = styled(motion.div)`
  width: 300px;
  background: ${props => props.theme.name === 'dark' 
    ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.6))' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.6))'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.2)'};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  box-shadow: ${props => props.theme.name === 'dark' 
    ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.1)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => props.theme.name === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(37, 99, 235, 0.5)'}, 
      transparent
    );
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(37, 99, 235, 0.3)'};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.5)' 
      : 'rgba(37, 99, 235, 0.5)'};
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.1)' 
    : 'rgba(37, 99, 235, 0.1)'};
  background: ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.05)' 
    : 'rgba(37, 99, 235, 0.05)'};
`;

const SidebarTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
  
  span {
    background: ${props => props.theme.name === 'dark' 
      ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' 
      : 'linear-gradient(135deg, #2563EB, #7C3AED)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SidebarSearch = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${props => props.theme.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.1)' 
    : 'rgba(37, 99, 235, 0.1)'};
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid ${props => props.theme.border};
    border-radius: ${props => props.theme.borderRadius.medium};
    background: ${props => props.theme.name === 'dark' 
      ? 'rgba(30, 41, 59, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)'};
    color: ${props => props.theme.textPrimary};
    font-size: 0.9rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary.main};
      box-shadow: 0 0 0 3px ${props => props.theme.name === 'dark' 
        ? 'rgba(59, 130, 246, 0.2)' 
        : 'rgba(37, 99, 235, 0.2)'};
    }
    
    &::placeholder {
      color: ${props => props.theme.textTertiary};
    }
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textTertiary};
`;

const NavSection = styled.div`
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
`;


const NavItem = styled(motion.button)<{ $active: boolean; $hasChildren?: boolean }>`
  width: 100%;
  padding: 16px 24px;
  border: none;
  background: ${props => props.$active 
    ? props.theme.name === 'dark' 
      ? 'rgba(59, 130, 246, 0.2)' 
      : 'rgba(37, 99, 235, 0.1)'
    : 'transparent'};
  color: ${props => props.$active ? props.theme.primary.main : props.theme.textSecondary};
  text-align: left;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  margin: 0 0 8px 0;
  
  &:hover {
    background: ${props => props.$active 
      ? props.theme.name === 'dark' 
        ? 'rgba(59, 130, 246, 0.3)' 
        : 'rgba(37, 99, 235, 0.2)'
      : props.theme.name === 'dark' 
        ? 'rgba(51, 65, 85, 0.6)' 
        : 'rgba(248, 250, 252, 0.8)'};
    color: ${props => props.$active ? props.theme.primary.main : props.theme.textPrimary};
    transform: translateX(4px);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: ${props => props.theme.gradient.primary};
    border-radius: 0 2px 2px 0;
    opacity: ${props => props.$active ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
`;

const NavItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItemLabel = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavItemDescription = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textTertiary};
  font-weight: 400;
  line-height: 1.3;
`;

const NavItemBadge = styled.span`
  background: ${props => props.theme.gradient.primary};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const navItems: SidebarNavItem[] = [
  {
    id: 'user',
    label: '个人信息',
    icon: <UserIcon size={18} />,
    description: '查看您的个人资料'
  },
  {
    id: 'system',
    label: '系统行为',
    icon: <MonitorIcon size={18} />,
    description: '启动、关闭和通知'
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
    <SidebarContainer
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <SidebarHeader>
        <SidebarTitle>
          <SettingsIcon size={24} />
          <span>设置</span>
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
        {filteredItems.map((item, _index) => (
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