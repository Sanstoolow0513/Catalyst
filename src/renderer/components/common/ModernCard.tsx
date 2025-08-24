import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'gradient' | 'glass' | 'floating' | 'neumorphic' | '3d';
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large' | 'extra-large';
  hoverable?: boolean;
  clickable?: boolean;
  gradient?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
}

const StyledModernCard = styled(motion.div)<ModernCardProps & { theme: any }>`
  position: relative;
  overflow: hidden;
  border-radius: ${props => {
    switch (props.borderRadius) {
      case 'small': return props.theme.borderRadius.small;
      case 'medium': return props.theme.borderRadius.medium;
      case 'large': return props.theme.borderRadius.large;
      case 'extra-large': return props.theme.borderRadius.extraLarge;
      default: return props.theme.borderRadius.medium;
    }
  }};
  
  /* 内边距样式 */
  ${props => {
    switch (props.padding) {
      case 'none': return 'padding: 0;';
      case 'small': return 'padding: 16px;';
      case 'large': return 'padding: 32px;';
      case 'medium':
      default: return 'padding: 24px;';
    }
  }}
  
  /* 变体样式 */
  ${props => {
    switch (props.variant) {
      case 'gradient':
        return `
          background: ${props.gradient || props.theme.gradient.primary};
          border: none;
          color: white;
          box-shadow: ${props.theme.cardShadow.important};
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            border-radius: inherit;
          }
        `;
      case 'glass':
        return `
          background: ${props.theme.name === 'dark' ? 
            `rgba(17, 24, 39, ${props.intensity === 'light' ? '0.08' : 
                                 props.intensity === 'medium' ? '0.12' : 
                                 props.intensity === 'heavy' ? '0.18' : '0.12'})` : 
            `rgba(255, 255, 255, ${props.intensity === 'light' ? '0.08' : 
                                 props.intensity === 'medium' ? '0.12' : 
                                 props.intensity === 'heavy' ? '0.18' : '0.12'})`
          };
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${props.theme.name === 'dark' ? 
            'rgba(255, 255, 255, 0.1)' : 
            'rgba(0, 0, 0, 0.1)'
          };
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        `;
      case 'floating':
        return `
          background: ${props.theme.card.background};
          border: none;
          box-shadow: ${props.theme.cardShadow.important};
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          
          &::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, ${props.theme.primary.main}, ${props.theme.accent}, ${props.theme.primary.main});
            border-radius: inherit;
            opacity: 0;
            z-index: -1;
            transition: opacity 0.3s ease;
          }
        `;
      case 'neumorphic':
        return `
          background: ${props.theme.background};
          border: none;
          box-shadow: ${props.theme.name === 'dark' ? 
            '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.05)' :
            '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.8)'
          };
          transition: all 0.3s ease;
        `;
      case '3d':
        return `
          background: ${props.theme.card.background};
          border: none;
          box-shadow: 
            0 10px 20px rgba(0, 0, 0, 0.1),
            0 6px 6px rgba(0, 0, 0, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.05);
          transform-style: preserve-3d;
          transition: all 0.3s ease;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
            border-radius: inherit;
          }
        `;
      default:
        return `
          background: ${props.theme.card.background};
          border: none;
          box-shadow: ${props.theme.cardShadow.default};
        `;
    }
  }}
  
  /* 悬停效果 */
  ${props => props.hoverable && `
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px) scale(1.02);
      
      ${props.variant === 'glass' ? `
        backdrop-filter: blur(25px);
        background: ${props.theme.name === 'dark' ? 
          `rgba(17, 24, 39, ${props.intensity === 'light' ? '0.12' : 
                                props.intensity === 'medium' ? '0.18' : 
                                props.intensity === 'heavy' ? '0.24' : '0.18'})` : 
          `rgba(255, 255, 255, ${props.intensity === 'light' ? '0.12' : 
                                props.intensity === 'medium' ? '0.18' : 
                                props.intensity === 'heavy' ? '0.24' : '0.18'})`
        };
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      ` : ''}
      
      ${props.variant === 'floating' ? `
        box-shadow: ${props.theme.cardShadow.importantHover};
        &::before {
          opacity: 0.3;
        }
      ` : ''}
      
      ${props.variant === 'neumorphic' ? `
        box-shadow: ${props.theme.name === 'dark' ? 
          '12px 12px 24px rgba(0, 0, 0, 0.5), -12px -12px 24px rgba(255, 255, 255, 0.08)' :
          '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
        };
      ` : ''}
      
      ${props.variant === '3d' ? `
        transform: translateY(-6px) scale(1.02) rotateX(2deg);
        box-shadow: 
          0 20px 40px rgba(0, 0, 0, 0.15),
          0 12px 12px rgba(0, 0, 0, 0.12),
          inset 0 -4px 8px rgba(0, 0, 0, 0.08);
      ` : ''}
    }
  `}
  
  /* 可点击效果 */
  ${props => props.clickable && `
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:active {
      transform: ${props.variant === 'neumorphic' ? 
        'translateY(2px) scale(0.98)' : 
        'translateY(-1px) scale(0.98)'
      };
      
      ${props.variant === 'neumorphic' ? `
        box-shadow: ${props.theme.name === 'dark' ? 
          '4px 4px 8px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.05)' :
          '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)'
        };
      ` : ''}
    }
  `}
`;

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  variant = 'gradient',
  padding = 'medium',
  borderRadius = 'medium',
  hoverable = false,
  clickable = false,
  gradient,
  intensity = 'medium',
  onClick,
  className,
  animationDelay = 0
}) => {
  const theme = useTheme();

  return (
    <StyledModernCard
      variant={variant}
      padding={padding}
      borderRadius={borderRadius}
      hoverable={hoverable}
      clickable={clickable}
      gradient={gradient}
      intensity={intensity}
      onClick={onClick}
      className={className}
      theme={theme}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: animationDelay,
        duration: 0.6,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={hoverable ? {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3 }
      } : undefined}
      whileTap={clickable ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
    >
      {children}
    </StyledModernCard>
  );
};

export default ModernCard;