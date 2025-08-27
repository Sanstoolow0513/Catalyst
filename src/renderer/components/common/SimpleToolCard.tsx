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
  isGlassMode?: boolean;
}

const CardContainer = styled(motion.div)<{ $isGlassMode?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px 32px;
  background: ${props => {
    if (props.$isGlassMode) {
      return 'rgba(30, 41, 59, 0.15)';
    }
    return props.theme?.name === 'dark' 
      ? props.theme?.surface || '#1F2937' 
      : props.theme?.surface || '#FFFFFF'
  }};
  border: ${props => {
    if (props.$isGlassMode) {
      return '1px solid rgba(148, 163, 184, 0.2)';
    }
    return `1px solid ${props.theme?.border || '#E5E7EB'}`;
  }};
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  box-shadow: ${props => {
    if (props.$isGlassMode) {
      return '0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)';
    }
    return props.theme?.name === 'dark' 
      ? '0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
      : '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  }};
  transition: all ${props => props.theme?.transition?.normal || '0.2s'} ease;
  cursor: pointer;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(20px)' : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 100%);
    pointer-events: none;
    border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => {
      if (props.$isGlassMode) {
        return '0 12px 40px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)';
      }
      return props.theme?.name === 'dark' 
        ? '0 4px 12px 0 rgba(0, 0, 0, 0.15)' 
        : '0 4px 12px 0 rgba(0, 0, 0, 0.08)';
    }};
    border-color: ${props => props.theme?.primary?.main || '#2563EB'};
    background: ${props => {
      if (props.$isGlassMode) {
        return 'rgba(51, 65, 85, 0.2)';
      }
      return props.theme?.name === 'dark' 
        ? props.theme?.surfaceVariant || '#374151' 
        : props.theme?.surfaceVariant || '#F9FAFB';
    }};
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-right: 24px;
  color: ${props => props.theme?.primary?.main || '#2563EB'};
  background: ${props => props.theme?.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.15)' 
    : 'rgba(37, 99, 235, 0.12)'
  };
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const ToolName = styled.h3<{ $isGlassMode?: boolean }>`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
  line-height: 1.4;
  letter-spacing: -0.01em;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)' 
    : 'none'};
`;

const OfficialLink = styled.button<{ $isGlassMode?: boolean }>`
  font-size: 1rem;
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  text-decoration: none;
  transition: color ${props => props.theme?.transition?.fast || '0.15s'} ease;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)' 
    : 'none'};
  
  &:hover {
    color: ${props => props.theme?.primary?.main || '#2563EB'};
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }
`;

const DownloadButton = styled(motion.button)<{ $isGlassMode?: boolean }>`
  padding: 12px 24px;
  background: ${props => props.theme?.primary?.main || '#2563EB'};
  color: ${props => props.theme?.primary?.contrastText || '#FFFFFF'};
  border: none;
  border-radius: ${props => props.theme?.borderRadius?.small || '8px'};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme?.transition?.fast || '0.15s'} ease;
  line-height: 1.3;
  letter-spacing: -0.01em;
  text-shadow: ${props => props.$isGlassMode 
    ? '0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)' 
    : 'none'};
  flex-shrink: 0;
  
  &:hover {
    background: ${props => props.theme?.name === 'dark' 
      ? props.theme?.primary?.dark || '#1D4ED8' 
      : props.theme?.primary?.dark || '#1E40AF'
    };
    transform: scale(1.05);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 4px 12px rgba(37, 99, 235, 0.4)' 
      : '0 2px 8px rgba(37, 99, 235, 0.3)'};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const SimpleToolCard: React.FC<SimpleToolCardProps> = ({
  icon,
  name,
  officialUrl,
  downloadUrl,
  onDownload,
  className,
  isGlassMode = false
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
      $isGlassMode={isGlassMode}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      theme={theme}
    >
      <IconContainer theme={theme}>
        {icon}
      </IconContainer>
      
      <ContentContainer>
        <ToolName $isGlassMode={isGlassMode} theme={theme}>{name}</ToolName>
        <OfficialLink 
          onClick={handleOfficialLink}
          $isGlassMode={isGlassMode}
          theme={theme}
        >
          官网
        </OfficialLink>
      </ContentContainer>
      
      <DownloadButton
        onClick={handleDownload}
        $isGlassMode={isGlassMode}
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