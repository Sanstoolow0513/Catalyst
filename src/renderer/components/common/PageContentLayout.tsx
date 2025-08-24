import styled from 'styled-components';

/**
 * PageContentLayout is a wrapper component that provides a consistent
 * centered layout for the main content of a page.
 * It sets a max-width and handles horizontal padding.
 */
export const PageContentLayout = styled.div`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
`;

export const ContentHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${props => props.theme?.border || '#E5E7EB'};
  background: ${props => props.theme?.surface || '#FFFFFF'};
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme?.textPrimary || '#111827'};
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  margin: 8px 0 0 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const HeaderWithActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;
