import styled from 'styled-components';

// 主页面容器
export const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme?.background || '#F9FAFB'};
  color: ${(props) => props.theme?.textPrimary || '#111827'};
  padding: 16px 24px 16px 24px;
  border-radius: 16px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme?.border || '#E5E7EB'};
    border-radius: 4px;
    
    &:hover {
      background: ${(props) => props.theme?.textTertiary || '#9CA3AF'};
    }
  }
`;

// 响应式网格布局容器
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
  
  @media (min-width: 1440px) {
    grid-template-columns: 3fr 1fr;
  }
`;

// 主要内容区域
export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// 侧边栏区域
export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 1023px) {
    grid-row: 2;
  }
`;

// 卡片网格布局
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// 全宽卡片容器
export const FullWidthCard = styled.div`
  grid-column: 1 / -1;
`;

// 统计卡片网格
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

// 活动时间线容器
export const ActivityTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme?.border || '#E5E7EB'};
    border-radius: 3px;
    
    &:hover {
      background: ${(props) => props.theme?.textTertiary || '#9CA3AF'};
    }
  }
`;