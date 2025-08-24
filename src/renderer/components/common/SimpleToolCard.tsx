import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

interface SimpleToolCardProps {
  icon: React.ReactNode;
  name: string;
  officialUrl: string;
  downloadUrl: string;
  onDownload?: () => void;
  className?: string;
}

const CardContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: ${props => props.theme?.name === 'dark' 
    ? props.theme?.card?.background || '#111827' 
    : props.theme?.card?.background || '#FFFFFF'
  };
  border: 1px solid ${props => props.theme?.name === 'dark' 
    ? props.theme?.card?.border || '#374151' 
    : props.theme?.card?.border || '#E5E7EB'
  };
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  box-shadow: ${props => props.theme?.name === 'dark' 
    ? props.theme?.card?.shadow || '0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
    : props.theme?.card?.shadow || '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  };
  transition: all ${props => props.theme?.transition?.normal || '0.2s'} ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme?.name === 'dark' 
      ? props.theme?.card?.shadowHover || '0 4px 12px 0 rgba(0, 0, 0, 0.15)' 
      : props.theme?.card?.shadowHover || '0 4px 12px 0 rgba(0, 0, 0, 0.08)'
    };
    border-color: ${props => props.theme?.primary?.main || '#2563EB'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: 16px;
  color: ${props => props.theme?.primary?.main || '#2563EB'};
  background: ${props => props.theme?.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.1)' 
    : 'rgba(37, 99, 235, 0.08)'
  };
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToolName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
`;

const OfficialLink = styled.button`
  font-size: 14px;
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  text-decoration: none;
  transition: color ${props => props.theme?.transition?.fast || '0.15s'} ease;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  
  &:hover {
    color: ${props => props.theme?.primary?.main || '#2563EB'};
  }
`;

const DownloadButton = styled(motion.button)`
  padding: 8px 16px;
  background: ${props => props.theme?.primary?.main || '#2563EB'};
  color: ${props => props.theme?.primary?.contrastText || '#FFFFFF'};
  border: none;
  border-radius: ${props => props.theme?.borderRadius?.small || '8px'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme?.transition?.fast || '0.15s'} ease;
  
  &:hover {
    background: ${props => props.theme?.name === 'dark' 
      ? props.theme?.primary?.dark || '#1D4ED8' 
      : props.theme?.primary?.dark || '#1E40AF'
    };
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SimpleToolCard: React.FC<SimpleToolCardProps> = ({
  icon,
  name,
  officialUrl,
  downloadUrl,
  onDownload,
  className
}) => {
  const theme = useTheme();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    } else {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleOfficialLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(officialUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <CardContainer
      className={className}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      theme={theme}
    >
      <IconContainer theme={theme}>
        {icon}
      </IconContainer>
      
      <ContentContainer>
        <ToolName theme={theme}>{name}</ToolName>
        <OfficialLink 
          onClick={handleOfficialLink}
          theme={theme}
        >
          官网
        </OfficialLink>
      </ContentContainer>
      
      <DownloadButton
        onClick={handleDownload}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        theme={theme}
      >
        下载
      </DownloadButton>
    </CardContainer>
  );
};

export default SimpleToolCard;