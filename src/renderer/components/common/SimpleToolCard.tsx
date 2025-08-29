import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { getAnimationConfig } from '../../utils/animations';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

interface SimpleToolCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  officialUrl: string;
  downloadUrl: string;
  onDownload?: () => void;
  className?: string;
  isGlassMode?: boolean;
  iconColor?: string;
}

const CardContainer = styled(motion.div)<{ $isGlassMode?: boolean }>`
  background: ${props => props.$isGlassMode 
    ? 'rgba(30, 41, 59, 0.08)' 
    : props.theme?.surface || '#FFFFFF'};
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.$isGlassMode ? 'blur(16px)' : 'none'};
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isGlassMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 8px 25px rgba(0, 0, 0, 0.1)'};
    background: ${props => props.$isGlassMode 
      ? 'rgba(51, 65, 85, 0.12)' 
      : props.theme?.surfaceVariant || '#F9FAFB'};
  }
`;

const IconContainer = styled.div<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color ? `${props.$color}20` : props.theme?.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.15)' 
    : 'rgba(37, 99, 235, 0.12)'};
  color: ${props => props.$color || props.theme?.primary?.main || '#2563EB'};
  font-size: 1.2rem;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
`;

const ToolName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
  line-height: 1.3;
`;

const ToolDescription = styled.p`
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const IconButton = styled(motion.button)<{ $isGlassMode?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: ${props => props.$isGlassMode 
    ? '1px solid rgba(148, 163, 184, 0.15)' 
    : `1px solid ${props.theme?.border || '#E5E7EB'}`};
  background: ${props => props.$isGlassMode 
    ? 'rgba(51, 65, 85, 0.12)' 
    : props.theme?.surface || '#FFFFFF'};
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme?.primary?.main || '#2563EB'};
    color: ${props => props.theme?.primary?.contrastText || '#FFFFFF'};
    border-color: ${props => props.theme?.primary?.main || '#2563EB'};
  }
`;


const SimpleToolCard: React.FC<SimpleToolCardProps> = ({
  icon,
  name,
  description,
  officialUrl,
  downloadUrl,
  onDownload,
  className,
  isGlassMode = false,
  iconColor
}) => {
  
  // 使用统一的动画配置
  const animationConfig = React.useMemo(() => {
    return getAnimationConfig(window.location.pathname);
  }, []);

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
      whileHover={animationConfig.disabled ? undefined : { scale: 1.02 }}
      whileTap={animationConfig.disabled ? undefined : { scale: 0.98 }}
      transition={{
        duration: animationConfig.hoverDuration
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <IconContainer $color={iconColor}>
          {icon}
        </IconContainer>
        
        <ContentContainer>
          <ToolName>{name}</ToolName>
          <ToolDescription>{description}</ToolDescription>
        </ContentContainer>
      </div>
      
      <ActionButtons>
        <IconButton
          $isGlassMode={isGlassMode}
          onClick={handleOfficialLink}
          whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
          whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
          title="访问官网"
        >
          <FaExternalLinkAlt size={14} />
        </IconButton>
        
        <IconButton
          $isGlassMode={isGlassMode}
          onClick={handleDownload}
          whileHover={animationConfig.disabled ? undefined : { scale: 1.1 }}
          whileTap={animationConfig.disabled ? undefined : { scale: 0.9 }}
          title="下载"
        >
          <FaDownload size={14} />
        </IconButton>
      </ActionButtons>
    </CardContainer>
  );
};

export default SimpleToolCard;