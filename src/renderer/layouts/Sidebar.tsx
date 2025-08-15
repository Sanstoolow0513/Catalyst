import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Home as HomeIcon,
  Shield as ShieldIcon,
  MessageSquare as MessageIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Info as InfoIcon
} from 'lucide-react';

const SidebarContainer = styled(motion.aside)`
  width: 260px;
  flex-shrink: 0;
  background-color: ${props => props.theme.sidebar.background};
  border-right: 1px solid transparent;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  overflow-y: auto;
  
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

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid ${props => props.theme.sidebar.border};
  margin-bottom: 16px;
`;

const LogoSection = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
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
`;

const AppName = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.sidebar.text};
  margin: 0;
`;

const AppVersion = styled.p`
  font-size: 12px;
  color: ${props => props.theme.textTertiary};
  margin: 0;
`;

const NavSection = styled.nav`
  flex: 1;
  padding: 0 12px;
`;

const NavGroup = styled.div`
  margin-bottom: 24px;
`;

const NavGroupTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 12px;
`;

const NavItemContainer = styled(motion.div)`
  display: block;
  margin-bottom: 8px; /* 增加功能项之间的间距 */
`;

const NavItem = styled(Link)<{ $isActive: boolean }>`
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
  }
  
  &:hover .nav-icon {
    color: ${props => props.theme.primary.main};
  }
`;

const navigationItems = [
  {
    group: '主要功能',
    items: [
      { path: '/', label: '首页', icon: HomeIcon },
      { path: '/proxy-management', label: '代理管理', icon: ShieldIcon },
      { path: '/chat', label: 'AI 对话', icon: MessageIcon },
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

  return (
    <SidebarContainer
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <SidebarHeader>
        <LogoSection
          whileHover={{ scale: 1.05, zIndex: 1 }}
          whileTap={{ scale: 0.95, zIndex: 1 }}
        >
          <Logo>C</Logo>
          <div>
            <AppName>Catalyst</AppName>
            <AppVersion>v1.0.0</AppVersion>
          </div>
        </LogoSection>
      </SidebarHeader>
      
      <NavSection>
        {navigationItems.map((group, groupIndex) => (
          <NavGroup key={groupIndex}>
            <NavGroupTitle>{group.group}</NavGroupTitle>
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
                  <NavItem to={item.path} $isActive={isActive}>
                    <item.icon className="nav-icon" size={20} />
                    {item.label}
                  </NavItem>
                </NavItemContainer>
              );
            })}
          </NavGroup>
        ))}
      </NavSection>
    </SidebarContainer>
  );
};

export default Sidebar;
