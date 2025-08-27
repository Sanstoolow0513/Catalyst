import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  Minimize as MinimizeIcon, 
  Maximize as MaximizeIcon, 
  X as CloseIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  Sun as SunIcon,
  Moon as MoonIcon
} from 'lucide-react';

const TitleBarContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: ${props => props.theme.titleBar.background};
  -webkit-app-region: drag;
  border-bottom: 1px solid ${props => props.theme.titleBar.border};
  transition: all ${props => props.theme.transition.normal} ease;
  backdrop-filter: blur(20px);
  z-index: 1000;
  
  `;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  -webkit-app-region: drag;
`;

const AppLogo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.theme.titleBar.text};
`;

const LogoIcon = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent});
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  
  `;

const SearchContainer = styled(motion.div)`
  position: relative;
  -webkit-app-region: no-drag;
`;

const SearchInput = styled.input`
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.input.border};
  background-color: ${props => props.theme.input.background};
  color: ${props => props.theme.input.text};
  width: 240px;
  font-size: 14px;
  transition: all ${props => props.theme.transition.normal} ease;
  backdrop-filter: blur(12px);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.input.borderFocus};
    box-shadow: 0 0 0 3px ${props => props.theme.primary.main}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.input.placeholder};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.titleBar.icon};
  pointer-events: none;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  -webkit-app-region: no-drag;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.theme.surfaceVariant};
  border: 1px solid transparent;
  color: ${props => props.theme.titleBar.icon};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.transition.fast} ease;
  backdrop-filter: blur(8px);
  
  &:hover {
    background-color: ${props => props.theme.surface};
    color: ${props => props.theme.titleBar.iconHover};
    border-color: ${props => props.theme.border};
  }
`;

const ThemeToggleButton = styled(ActionButton)`
  background-color: ${props => props.theme.surfaceVariant};
  color: ${props => props.theme.titleBar.icon};
  
  &:hover {
    background-color: ${props => props.theme.surface};
    color: ${props => props.theme.titleBar.iconHover};
  }
`;

const UserProfileContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 20px;
  background-color: ${props => props.theme.surfaceVariant};
  border: 1px solid ${props => props.theme.border};
  cursor: pointer;
  -webkit-app-region: no-drag;
  backdrop-filter: blur(8px);
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.titleBar.text};
  padding-right: 8px;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 4px;
  -webkit-app-region: no-drag;
`;

const WindowButton = styled(motion.button)<{ variant: 'minimize' | 'maximize' | 'close' }>`
  width: 32px;
  height: 32px;
  border: 1px solid ${props => props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.3)' : props.theme.border};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  transition: all ${props => props.theme.transition.fast} ease;
  background-color: ${props => props.theme.name === 'darkGlass' ? 'rgba(24, 24, 24, 0.6)' : 'transparent'};
  backdrop-filter: blur(8px);
  
  ${props => {
    switch (props.variant) {
      case 'minimize':
        return `
          color: ${props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.8)' : props.theme.titleBar.icon};
          &:hover {
            background-color: ${props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.1)' : props.theme.surfaceVariant};
            color: ${props.theme.titleBar.iconHover};
            border-color: ${props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.5)' : props.theme.border};
          }
        `;
      case 'maximize':
        return `
          color: ${props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.8)' : props.theme.titleBar.icon};
          &:hover {
            background-color: ${props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.1)' : props.theme.surfaceVariant};
            color: ${props.theme.titleBar.iconHover};
            border-color: ${props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.5)' : props.theme.border};
          }
        `;
      case 'close':
        return `
          color: ${props.theme.name === 'darkGlass' ? 'rgba(255, 255, 255, 0.8)' : props.theme.titleBar.icon};
          &:hover {
            background-color: ${props.theme.error.main};
            color: white;
            border-color: ${props.theme.error.main};
          }
        `;
      default:
        return '';
    }
  }}
`;

const TitleBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { nickname, avatar } = useUser();
  const navigate = useNavigate();

  const handleMinimize = () => {
    console.log('Minimize button clicked');
    if (window.electronAPI?.windowControl) {
      console.log('Calling windowControl.minimize()');
      window.electronAPI.windowControl.minimize();
    } else {
      console.error('electronAPI.windowControl is not available');
    }
  };

  const handleMaximize = () => {
    console.log('Maximize button clicked');
    if (window.electronAPI?.windowControl) {
      console.log('Calling windowControl.maximize()');
      window.electronAPI.windowControl.maximize();
    } else {
      console.error('electronAPI.windowControl is not available');
    }
  };

  const handleClose = () => {
    console.log('Close button clicked');
    if (window.electronAPI?.windowControl) {
      console.log('Calling windowControl.close()');
      window.electronAPI.windowControl.close();
    } else {
      console.error('electronAPI.windowControl is not available');
    }
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <TitleBarContainer
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      theme={theme}
    >
      <LeftSection>
        <AppLogo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogoIcon theme={theme}>C</LogoIcon>
          <span>Catalyst</span>
        </AppLogo>
        
        <SearchContainer
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          style={{ zIndex: 1 }}
        >
          <SearchIconWrapper theme={theme}>
            <SearchIcon size={16} />
          </SearchIconWrapper>
          <SearchInput 
            placeholder="搜索功能、设置..." 
            theme={theme}
          />
        </SearchContainer>
      </LeftSection>
      
      <RightSection>
        <ThemeToggleButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          title="切换主题"
          theme={theme}
        >
          {theme.name === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </ThemeToggleButton>
        
        <ActionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSettings}
          title="设置"
          theme={theme}
        >
          <SettingsIcon size={18} />
        </ActionButton>
        
        <UserProfileContainer
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/settings')}
          title="用户设置"
        >
          <UserAvatar>
            {avatar ? <img src={avatar} alt="User Avatar" /> : <UserIcon size={16} />}
          </UserAvatar>
          <UserName>{nickname}</UserName>
        </UserProfileContainer>
        
        <WindowControls>
          <WindowButton
            variant="minimize"
            onClick={handleMinimize}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="最小化"
            theme={theme}
          >
            <MinimizeIcon size={16} />
          </WindowButton>
          
          <WindowButton
            variant="maximize"
            onClick={handleMaximize}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="最大化"
            theme={theme}
          >
            <MaximizeIcon size={16} />
          </WindowButton>
          
          <WindowButton
            variant="close"
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="关闭"
            theme={theme}
          >
            <CloseIcon size={16} />
          </WindowButton>
        </WindowControls>
      </RightSection>
    </TitleBarContainer>
  );
};

export default TitleBar;