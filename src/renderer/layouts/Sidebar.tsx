import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home as HomeIcon,
  Shield as ShieldIcon,
  MessageSquare as MessageIcon,
  Bot as BotIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Info as InfoIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

const SidebarContainer = styled(motion.aside)<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '80px' : '260px'};
  position: relative;
  background-color: ${props => props.theme.sidebar.background};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  overflow-y: auto;
  transition: width 0.3s ease;
  flex-shrink: 0;
  z-index: 100; /* Ensure sidebar and its children are on top */
  
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
    
    &:hover {
      background: ${props => props.theme.textTertiary};
    }
  }
`;

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 20px;
  border-bottom: 1px solid ${props => props.theme.sidebar.border};
  margin-bottom: 16px;
  ${props => props.$collapsed && `
    padding: 0 10px 20px;
    justify-content: center;
  `}
`;

const LogoSection = styled(motion.div)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  ${props => props.$collapsed && `
    justify-content: center;
    gap: 0;
  `}
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
`;

const AppName = styled.h1<{ $collapsed: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.sidebar.text};
  margin: 0;
  ${props => props.$collapsed && `
    display: none;
  `}
`;

const AppVersion = styled.p<{ $collapsed: boolean }>`
  font-size: 12px;
  color: ${props => props.theme.textTertiary};
  margin: 0;
  ${props => props.$collapsed && `
    display: none;
  `}
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textTertiary};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transition.fast} ease;
  
  &:hover {
    color: ${props => props.theme.textPrimary};
    background-color: ${props => props.theme.sidebar.itemHover};
  }
`;

const NavSection = styled.nav<{ $collapsed: boolean }>`
  flex: 1;
  padding: 0 12px;
  ${props => props.$collapsed && `
    padding: 0 6px;
  `}
`;

const NavGroup = styled.div<{ $collapsed: boolean }>`
  margin-bottom: 24px;
  ${props => props.$collapsed && `
    margin-bottom: 16px;
  `}
`;

const NavGroupTitle = styled.h3<{ $collapsed: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 12px;
  ${props => props.$collapsed && `
    display: none;
  `}
`;

const NavItemContainer = styled(motion.div)`
  display: block;
  margin-bottom: 8px; /* 增加功能项之间的间距 */
`;

const NavItem = styled(Link)<{ $isActive: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.$isActive ? props.theme.sidebar.textActive : props.theme.sidebar.text};
  background-color: ${props => props.$isActive ? props.theme.sidebar.itemActive : 'transparent'};
  transition: all ${props => props.theme.transition.fast} ease;
  font-weight: 500;
  font-size: 14px;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.$isActive ? props.theme.sidebar.itemActive : props.theme.sidebar.itemHover};
    color: ${props => props.$isActive ? props.theme.sidebar.textActive : props.theme.sidebar.textActive};
    transform: translateX(2px);
  }
  
  & .nav-icon {
    width: 20px;
    height: 20px;
    color: ${props => props.$isActive ? props.theme.primary.main : props.theme.textTertiary};
    transition: color ${props => props.theme.transition.fast} ease;
    flex-shrink: 0;
  }
  
  &:hover .nav-icon {
    color: ${props => props.theme.primary.main};
  }
  
  ${props => props.$collapsed && `
    justify-content: center;
    padding: 12px 16px;
    
    & span {
      display: none;
    }
  `}
`;

const Tooltip = styled.div`
  position: fixed;
  background-color: ${props => props.theme.sidebar.background};
  color: ${props => props.theme.sidebar.text};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
  border: 1px solid ${props => props.theme.border};
`;

const navigationItems = [
  {
    group: '主要功能',
    items: [
      { path: '/', label: '首页', icon: HomeIcon },
      { path: '/proxy-management', label: '代理管理', icon: ShieldIcon },
      { path: '/chat', label: 'AI 对话', icon: BotIcon },
    ]
  },
  {
    group: '高级设置',
    items: [
      { path: '/dev-environment', label: '开发环境', icon: CodeIcon },
    ]
  },
  {
    group: '设置',
    items: [
      { path: '/settings', label: '设置', icon: SettingsIcon },
    ]
  },
  {
    group: '关于',
    items: [
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
      <SidebarContainer
        $collapsed={isSidebarCollapsed}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <SidebarHeader $collapsed={isSidebarCollapsed}>
          <LogoSection
            $collapsed={isSidebarCollapsed}
            whileHover={{ scale: 1.05, zIndex: 1 }}
            whileTap={{ scale: 0.95, zIndex: 1 }}
          >
            <Logo>C</Logo>
            {!isSidebarCollapsed && (
              <div>
                <AppName $collapsed={isSidebarCollapsed}>Catalyst</AppName>
                <AppVersion $collapsed={isSidebarCollapsed}>v1.0.0</AppVersion>
              </div>
            )}
          </LogoSection>
          {!isSidebarCollapsed && (
            <CollapseButton onClick={toggleSidebar}>
              <ChevronLeftIcon size={16} />
            </CollapseButton>
          )}
        </SidebarHeader>
        
        <NavSection $collapsed={isSidebarCollapsed}>
          {navigationItems.map((group, groupIndex) => (
            <NavGroup key={groupIndex} $collapsed={isSidebarCollapsed}>
              {!isSidebarCollapsed && <NavGroupTitle $collapsed={isSidebarCollapsed}>{group.group}</NavGroupTitle>}
              {group.items.map((item, itemIndex) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavItemContainer
                    key={item.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * itemIndex, duration: 0.3 }}
                    whileHover={{ scale: 1.02, zIndex: 1 }}
                    whileTap={{ scale: 0.98, zIndex: 1 }}
                  >
                    <NavItem 
                      to={item.path} 
                      $isActive={isActive} 
                      $collapsed={isSidebarCollapsed}
                      onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <item.icon className="nav-icon" size={20} />
                      <span>{item.label}</span>
                    </NavItem>
                  </NavItemContainer>
                );
              })}
            </NavGroup>
          ))}
        </NavSection>
        
        {isSidebarCollapsed && (
          <div style={{ padding: '0 10px', marginTop: 'auto' }}>
            <CollapseButton onClick={toggleSidebar} style={{ position: 'static', width: '100%', borderRadius: '8px' }}>
              <ChevronRightIcon size={16} />
            </CollapseButton>
          </div>
        )}
      </SidebarContainer>
      
      {tooltip && (
        <Tooltip style={{ top: tooltip.y, left: tooltip.x }}>
          {tooltip.text}
        </Tooltip>
      )}
    </>
  );
};

export default Sidebar;
