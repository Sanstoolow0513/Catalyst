import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home as HomeIcon,
  Shield as ShieldIcon,
  Bot as BotIcon,
  Settings as SettingsIcon,
  Settings as GearIcon,
  Code as CodeIcon,
  Info as InfoIcon,
  TestTube as TestIcon,
  Download as DownloadIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '80px' : '220px'};
  min-width: ${props => props.$collapsed ? '80px' : '220px'};
  height: 100vh;
  background-color: ${props => props.theme.sidebar.background};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  overflow-y: auto;
  transition: width 0.3s ease;
  flex-shrink: 0;
  
  /* 自定义滚动条 */
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
`;


const CollapseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.sidebar.text};
  
  &:hover {
    background-color: ${props => props.theme.sidebar.itemHover};
  }
`;

const NavSection = styled.nav<{ $collapsed: boolean }>`
  flex: 1;
  padding: 0 16px;
  ${props => props.$collapsed && `
    padding: 0 8px;
  `}
`;

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;


const NavItem = styled(Link)<{ $isActive: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  gap: ${props => props.$collapsed ? '0' : '12px'};
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.$isActive ? props.theme.sidebar.textActive : props.theme.sidebar.text};
  background-color: ${props => props.$isActive ? props.theme.sidebar.itemActive : 'transparent'};
  transition: background-color 0.2s ease;
  font-weight: 500;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.theme.sidebar.itemHover};
    color: ${props => props.theme.sidebar.textActive};
  }
  
  & .nav-icon {
    width: 20px;
    height: 20px;
    color: ${props => props.$isActive ? props.theme.primary.main : props.theme.textTertiary};
    flex-shrink: 0;
  }
  
  ${props => props.$collapsed && `
    & span {
      display: none;
    }
  `}
`;

const Tooltip = styled.div`
  position: fixed;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
  border: 1px solid ${props => props.theme.border};
`;

const navigationItems = [
  {
    items: [
      { path: '/', label: '首页', icon: HomeIcon },
      { path: '/proxy-management', label: '代理管理', icon: ShieldIcon },
      { path: '/chat', label: 'AI 对话', icon: BotIcon },
      { path: '/test', label: '测试页面', icon: TestIcon },
      { path: '/llm-config', label: 'LLM 配置', icon: SettingsIcon },
      { path: '/dev-environment', label: '开发环境', icon: CodeIcon },
        { path: '/settings', label: '设置', icon: GearIcon },
      { path: '/info', label: '关于', icon: InfoIcon },
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar } = useTheme();
  const [tooltip, setTooltip] = React.useState<{ text: string; x: number; y: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, label: string) => {
    if (isSidebarCollapsed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        text: label,
        x: rect.right + 10,
        y: rect.top + rect.height / 2
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <>
      <SidebarContainer $collapsed={isSidebarCollapsed}>
        <NavSection $collapsed={isSidebarCollapsed}>
          <CollapseButton onClick={toggleSidebar}>
            {isSidebarCollapsed ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
          </CollapseButton>
          {navigationItems.map((group, groupIndex) => (
            <NavGroup key={groupIndex}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavItem 
                    key={item.path}
                    to={item.path} 
                    $isActive={isActive} 
                    $collapsed={isSidebarCollapsed}
                    onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <item.icon className="nav-icon" size={20} />
                    <span>{item.label}</span>
                  </NavItem>
                );
              })}
            </NavGroup>
          ))}
        </NavSection>
      </SidebarContainer>
      
      {tooltip && (
        <div style={{ 
          position: 'fixed',
          top: tooltip.y, 
          left: tooltip.x,
          zIndex: 1000
        }}>
          <Tooltip>
            {tooltip.text}
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default Sidebar;
