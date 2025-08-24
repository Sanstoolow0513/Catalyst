import styled, { css } from 'styled-components';

// 响应式断点
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
  ultraWide: '1600px'
};

// 媒体查询帮助函数
export const media = {
  mobile: (styles: any) => css`
    @media (max-width: ${breakpoints.mobile}) {
      ${styles}
    }
  `,
  tablet: (styles: any) => css`
    @media (max-width: ${breakpoints.tablet}) {
      ${styles}
    }
  `,
  desktop: (styles: any) => css`
    @media (max-width: ${breakpoints.desktop}) {
      ${styles}
    }
  `,
  above: {
    mobile: (styles: any) => css`
      @media (min-width: ${breakpoints.mobile}) {
        ${styles}
      }
    `,
    tablet: (styles: any) => css`
      @media (min-width: ${breakpoints.tablet}) {
        ${styles}
      }
    `,
    desktop: (styles: any) => css`
      @media (min-width: ${breakpoints.desktop}) {
        ${styles}
      }
    `,
    wide: (styles: any) => css`
      @media (min-width: ${breakpoints.wide}) {
        ${styles}
      }
    `,
    ultraWide: (styles: any) => css`
      @media (min-width: ${breakpoints.ultraWide}) {
        ${styles}
      }
    `
  }
};

// 响应式网格系统
export const Grid = styled.div<{
  $columns?: number;
  $gap?: string;
  $minWidth?: string;
  $responsive?: boolean;
}>`
  display: grid;
  grid-template-columns: ${props => 
    props.$responsive 
      ? `repeat(auto-fit, minmax(${props.$minWidth || '280px'}, 1fr))`
      : `repeat(${props.$columns || 1}, 1fr)`
  };
  gap: ${props => props.$gap || '1rem'};
  
  ${media.tablet(css`
    grid-template-columns: ${props => 
      props.$responsive 
        ? `repeat(auto-fit, minmax(${props.$minWidth || '240px'}, 1fr))`
        : `repeat(${Math.min(props.$columns || 1, 2)}, 1fr)`
    };
  `)}
  
  ${media.mobile(css`
    grid-template-columns: 1fr;
    gap: ${props => props.$gap ? `calc(${props.$gap} * 0.75)` : '0.75rem'};
  `)}
`;

// 响应式容器
export const ResponsiveContainer = styled.div<{
  $maxWidth?: string;
  $padding?: string;
}>`
  width: 100%;
  max-width: ${props => props.$maxWidth || '1400px'};
  margin: 0 auto;
  padding: ${props => props.$padding || '1.5rem'};
  
  ${media.tablet(css`
    padding: 1rem;
  `)}
  
  ${media.mobile(css`
    padding: 0.75rem;
  `)}
`;

// 响应式文本
export const ResponsiveText = styled.div<{
  $size?: 'small' | 'medium' | 'large' | 'xlarge';
  $weight?: number;
}>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.25rem';
      case 'xlarge': return '1.5rem';
      default: return '1rem';
    }
  }};
  font-weight: ${props => props.$weight || 400};
  line-height: 1.5;
  
  ${media.tablet(css`
    font-size: ${props => {
      switch (props.$size) {
        case 'small': return '0.8125rem';
        case 'medium': return '0.9375rem';
        case 'large': return '1.125rem';
        case 'xlarge': return '1.375rem';
        default: return '0.9375rem';
      }
    }};
  `)}
  
  ${media.mobile(css`
    font-size: ${props => {
      switch (props.$size) {
        case 'small': return '0.75rem';
        case 'medium': return '0.875rem';
        case 'large': return '1rem';
        case 'xlarge': return '1.25rem';
        default: return '0.875rem';
      }
    }};
  `)}
`;

// 响应式间距
export const responsiveSpacing = {
  xs: css`
    ${media.mobile(css`margin: 0.25rem;`)}
    ${media.tablet(css`margin: 0.5rem;`)}
    ${media.above.tablet(css`margin: 0.75rem;`)}
  `,
  sm: css`
    ${media.mobile(css`margin: 0.5rem;`)}
    ${media.tablet(css`margin: 0.75rem;`)}
    ${media.above.tablet(css`margin: 1rem;`)}
  `,
  md: css`
    ${media.mobile(css`margin: 0.75rem;`)}
    ${media.tablet(css`margin: 1rem;`)}
    ${media.above.tablet(css`margin: 1.5rem;`)}
  `,
  lg: css`
    ${media.mobile(css`margin: 1rem;`)}
    ${media.tablet(css`margin: 1.5rem;`)}
    ${media.above.tablet(css`margin: 2rem;`)}
  `,
  xl: css`
    ${media.mobile(css`margin: 1.5rem;`)}
    ${media.tablet(css`margin: 2rem;`)}
    ${media.above.tablet(css`margin: 3rem;`)}
  `
};

// Flex 布局帮助器
export const FlexContainer = styled.div<{
  $direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  $justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  $align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  $wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  $gap?: string;
  $responsive?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  justify-content: ${props => props.$justify || 'flex-start'};
  align-items: ${props => props.$align || 'stretch'};
  flex-wrap: ${props => props.$wrap || 'nowrap'};
  gap: ${props => props.$gap || '0'};
  
  ${props => props.$responsive && media.tablet(css`
    flex-direction: ${props.$direction === 'row' ? 'column' : props.$direction};
    gap: ${props.$gap ? `calc(${props.$gap} * 0.75)` : '0'};
  `)}
  
  ${props => props.$responsive && media.mobile(css`
    flex-direction: column;
    gap: ${props.$gap ? `calc(${props.$gap} * 0.5)` : '0'};
  `)}
`;

// 响应式卡片
export const ResponsiveCard = styled.div<{
  $padding?: string;
  $borderRadius?: string;
}>`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.$borderRadius || '12px'};
  padding: ${props => props.$padding || '1.5rem'};
  transition: all 0.3s ease;
  
  ${media.tablet(css`
    padding: ${props => props.$padding ? `calc(${props.$padding} * 0.8)` : '1.2rem'};
    border-radius: ${props => props.$borderRadius || '10px'};
  `)}
  
  ${media.mobile(css`
    padding: ${props => props.$padding ? `calc(${props.$padding} * 0.6)` : '1rem'};
    border-radius: ${props => props.$borderRadius || '8px'};
  `)}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  ${media.mobile(css`
    &:hover {
      transform: none;
    }
  `)}
`;

// 响应式按钮
export const ResponsiveButton = styled.button<{
  $size?: 'small' | 'medium' | 'large';
  $variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  $fullWidth?: boolean;
  $responsive?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${props => {
    const size = props.$size || 'medium';
    switch (size) {
      case 'small':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          min-height: 32px;
        `;
      case 'large':
        return css`
          padding: 1rem 1.5rem;
          font-size: 1rem;
          min-height: 48px;
        `;
      default:
        return css`
          padding: 0.75rem 1.25rem;
          font-size: 0.9375rem;
          min-height: 40px;
        `;
    }
  }}
  
  ${props => {
    const variant = props.$variant || 'primary';
    switch (variant) {
      case 'secondary':
        return css`
          background: ${props.theme.surfaceVariant};
          color: ${props.theme.textPrimary};
          &:hover {
            background: ${props.theme.border};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          border: 1px solid ${props.theme.border};
          color: ${props.theme.textPrimary};
          &:hover {
            background: ${props.theme.surfaceVariant};
            border-color: ${props.theme.primary.main};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${props.theme.textSecondary};
          &:hover {
            background: ${props.theme.surfaceVariant};
            color: ${props.theme.textPrimary};
          }
        `;
      default:
        return css`
          background: ${props.theme.primary.main};
          color: white;
          &:hover {
            background: ${props.theme.primary.dark || props.theme.primary.main};
          }
        `;
    }
  }}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.$responsive && media.mobile(css`
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
  `)}
`;

export default {
  breakpoints,
  media,
  Grid,
  ResponsiveContainer,
  ResponsiveText,
  responsiveSpacing,
  FlexContainer,
  ResponsiveCard,
  ResponsiveButton
};