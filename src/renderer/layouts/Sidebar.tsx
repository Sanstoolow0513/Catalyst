import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home as HomeIcon,
  Shield as ShieldIcon,
  Bot as BotIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Info as InfoIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

const SidebarContainer = styled(motion.aside)<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '80px' : '220px'};
  max-width: ${props => props.$collapsed ? '80px' : '18vw'};
  min-width: ${props => props.$collapsed ? '80px' : '200px'};
  position: relative;
  background-color: ${props => props.theme.sidebar.background};
  border: none;
  border-radius: 16px;
  margin: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  overflow-y: auto;
  transition: width 0.3s ease;
  flex-shrink: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
  
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
  
  @media (min-width: 1920px) {
    width: ${props => props.$collapsed ? '80px' : '240px'};
  }
  
  @media (max-width: 1200px) {
    width: ${props => props.$collapsed ? '80px' : '200px'};
  }
`;

const LogoButton = styled(motion.button)<{ $collapsed: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 16px;
  transition: all ${props => props.theme.transition.fast} ease;
  color: ${props => props.theme.sidebar.text};
  
  &:hover {
    background-color: ${props => props.theme.sidebar.itemHover};
    color: ${props => props.theme.sidebar.textActive};
  }
  
  ${props => props.$collapsed && `
    justify-content: center;
    padding: 12px 16px;
    gap: 0;
  `}
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.theme.name === 'light' 
    ? 'linear-gradient(135deg, #2563EB, #7C3AED)' 
    : 'linear-gradient(135deg, #60A5FA, #A78BFA)'};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const LogoText = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  ${props => props.$collapsed && `
    display: none;
  `}
`;

const AppName = styled.h1`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
`;

const AppVersion = styled.p`
  font-size: 12px;
  color: ${props => props.theme.textTertiary};
  margin: 0;
  line-height: 1;
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
  margin-bottom: 8px;
  ${props => props.$collapsed && `
    margin-bottom: 8px;
  `}
`;


const NavItemContainer = styled(motion.div)`
  display: block;
  margin-bottom: 8px;
`;

const NavItem = styled(Link)<{ $isActive: boolean; $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.$isActive ? props.theme.sidebar.textActive : props.theme.sidebar.text};
  background-color: ${props => props.$isActive ? props.theme.sidebar.itemActive : 'transparent'};
  transition: all ${props => props.theme.transition.fast} ease;
  font-weight: 500;
  font-size: 15px;
  overflow: hidden;
  border: 1px solid transparent;
  position: relative;
  
  &:hover {
    background-color: ${props => props.$isActive ? props.theme.sidebar.itemActive : props.theme.sidebar.itemHover};
    color: ${props => props.$isActive ? props.theme.sidebar.textActive : props.theme.sidebar.textActive};
    border-color: ${props => props.theme.border};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  & .nav-icon {
    width: 22px;
    height: 22px;
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
    items: [
      { path: '/', label: '首页', icon: HomeIcon },
      { path: '/proxy-management', label: '代理管理', icon: ShieldIcon },
      { path: '/chat', label: 'AI 对话', icon: BotIcon },
      { path: '/dev-environment', label: '开发环境', icon: CodeIcon },
      { path: '/settings', label: '设置', icon: SettingsIcon },
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
        <NavSection $collapsed={isSidebarCollapsed}>
          <LogoButton
            $collapsed={isSidebarCollapsed}
            onClick={toggleSidebar}
            whileHover={{ scale: 1.02, zIndex: 1 }}
            whileTap={{ scale: 0.98, zIndex: 1 }}
          >
            <Logo>C</Logo>
            {!isSidebarCollapsed && (
              <LogoText $collapsed={isSidebarCollapsed}>
                <AppName>Catalyst</AppName>
                <AppVersion>v1.0.0</AppVersion>
              </LogoText>
            )}
            {!isSidebarCollapsed && (
              <ChevronLeftIcon size={16} style={{ marginLeft: 'auto' }} />
            )}
          </LogoButton>
          {navigationItems.map((group, groupIndex) => (
            <NavGroup key={groupIndex} $collapsed={isSidebarCollapsed}>
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
                      <item.icon className="nav-icon" size={22} />
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
