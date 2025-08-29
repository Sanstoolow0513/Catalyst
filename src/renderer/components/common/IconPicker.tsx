import React from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import * as lucideIcons from 'lucide-react';

interface Icon {
  name: string;
  component: React.ComponentType<{ size?: number }>;
}

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  onClose: () => void;
}

const createIconComponent = (iconName: string): React.ComponentType<{ size?: number }> => {
  return (props: { size?: number }) => {
    try {
      const IconComponent = lucideIcons[iconName as keyof typeof lucideIcons] || lucideIcons.Star;
      return <IconComponent {...props} />;
    } catch {
      return <div style={{ 
        width: props.size || 24, 
        height: props.size || 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px'
      }}>⭐</div>;
    }
  };
};

const icons: Icon[] = [
  { name: 'MessageSquare', component: createIconComponent('MessageSquare') },
  { name: 'Settings', component: createIconComponent('Settings') },
  { name: 'Code', component: createIconComponent('Code') },
  { name: 'Terminal', component: createIconComponent('Terminal') },
  { name: 'Globe', component: createIconComponent('Globe') },
  { name: 'Download', component: createIconComponent('Download') },
  { name: 'Star', component: createIconComponent('Star') },
  { name: 'Heart', component: createIconComponent('Heart') },
  { name: 'Home', component: createIconComponent('Home') },
  { name: 'User', component: createIconComponent('User') },
  { name: 'Mail', component: createIconComponent('Mail') },
  { name: 'Phone', component: createIconComponent('Phone') },
  { name: 'Camera', component: createIconComponent('Camera') },
  { name: 'Music', component: createIconComponent('Music') },
  { name: 'Video', component: createIconComponent('Video') },
  { name: 'Image', component: createIconComponent('Image') },
  { name: 'File', component: createIconComponent('File') },
  { name: 'Folder', component: createIconComponent('Folder') },
  { name: 'Calendar', component: createIconComponent('Calendar') },
  { name: 'Clock', component: createIconComponent('Clock') },
  { name: 'Map', component: createIconComponent('Map') },
  { name: 'Bookmark', component: createIconComponent('Bookmark') },
  { name: 'Tag', component: createIconComponent('Tag') },
  { name: 'Filter', component: createIconComponent('Filter') },
  { name: 'Search', component: createIconComponent('Search') },
  { name: 'Bell', component: createIconComponent('Bell') },
  { name: 'Lock', component: createIconComponent('Lock') },
  { name: 'Unlock', component: createIconComponent('Unlock') },
  { name: 'Key', component: createIconComponent('Key') },
  { name: 'Shield', component: createIconComponent('Shield') },
  { name: 'Wifi', component: createIconComponent('Wifi') },
  { name: 'Bluetooth', component: createIconComponent('Bluetooth') },
  { name: 'Battery', component: createIconComponent('Battery') },
  { name: 'Cpu', component: createIconComponent('Cpu') },
  { name: 'HardDrive', component: createIconComponent('HardDrive') },
  { name: 'Monitor', component: createIconComponent('Monitor') },
  { name: 'Smartphone', component: createIconComponent('Smartphone') },
  { name: 'Tablet', component: createIconComponent('Tablet') },
  { name: 'Laptop', component: createIconComponent('Laptop') },
  { name: 'Printer', component: createIconComponent('Printer') },
  { name: 'Mouse', component: createIconComponent('Mouse') },
  { name: 'Keyboard', component: createIconComponent('Keyboard') },
  { name: 'Gamepad', component: createIconComponent('Gamepad') },
  { name: 'Headphones', component: createIconComponent('Headphones') },
  { name: 'Mic', component: createIconComponent('Mic') },
  { name: 'Volume', component: createIconComponent('Volume') },
  { name: 'Sun', component: createIconComponent('Sun') },
  { name: 'Moon', component: createIconComponent('Moon') },
  { name: 'Cloud', component: createIconComponent('Cloud') },
  { name: 'Rain', component: createIconComponent('CloudRain') },
  { name: 'Snow', component: createIconComponent('Snowflake') },
  { name: 'Wind', component: createIconComponent('Wind') },
  { name: 'Thermometer', component: createIconComponent('Thermometer') },
  { name: 'Zap', component: createIconComponent('Zap') },
  { name: 'Eye', component: createIconComponent('Eye') },
  { name: 'EyeOff', component: createIconComponent('EyeOff') },
  { name: 'Smile', component: createIconComponent('Smile') },
  { name: 'Frown', component: createIconComponent('Frown') },
  { name: 'Meh', component: createIconComponent('Meh') },
  { name: 'Laugh', component: createIconComponent('Laugh') },
  { name: 'TrendingUp', component: createIconComponent('TrendingUp') },
  { name: 'TrendingDown', component: createIconComponent('TrendingDown') },
  { name: 'BarChart', component: createIconComponent('BarChart') },
  { name: 'PieChart', component: createIconComponent('PieChart') },
  { name: 'LineChart', component: createIconComponent('LineChart') },
];

const IconPickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const IconPickerContent = styled.div`
  background-color: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  position: relative;
`;

const IconPickerHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const IconPickerTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.125rem;
  font-weight: 600;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
`;

const IconItem = styled.button<{ $selected: boolean }>`
  width: 60px;
  height: 60px;
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.primary.main : theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ $selected, theme }) => $selected ? theme.primary.main + '20' : theme.surface};
  color: ${({ $selected, theme }) => $selected ? theme.primary.main : theme.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.surfaceVariant};
    border-color: ${({ theme }) => theme.primary.main};
  }
`;

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onIconSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredIcons = icons.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconClick = (iconName: string) => {
    onIconSelect(iconName);
    onClose();
  };

  return (
    <IconPickerOverlay onClick={onClose}>
      <IconPickerContent onClick={(e) => e.stopPropagation()}>
        <IconPickerHeader>
          <IconPickerTitle>选择图标</IconPickerTitle>
          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="搜索图标..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </IconPickerHeader>
        <IconGrid>
          {filteredIcons.map((icon) => {
            const IconComponent = icon.component;
            return (
              <IconItem
                key={icon.name}
                $selected={selectedIcon === icon.name}
                onClick={() => handleIconClick(icon.name)}
                title={icon.name}
              >
                <IconComponent size={24} />
              </IconItem>
            );
          })}
        </IconGrid>
      </IconPickerContent>
    </IconPickerOverlay>
  );
};

export default IconPicker;