import React, { useState } from 'react';
import styled from 'styled-components';
import { PageContainer, ContentArea } from '../components/common';
import SimpleToolCard from '../components/common/SimpleToolCard';
import { devToolsSimple } from '../data/devToolsSimple';
import { 
  FaCode, 
  FaLaptopCode, 
  FaTerminal, 
  FaUser 
} from 'react-icons/fa';

// 页面容器
const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

// 分类标题
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme?.borderRadius?.medium || '12px'};
  background: ${props => props.theme?.name === 'dark' 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(37, 99, 235, 0.1)'
  };
  color: ${props => props.theme?.primary?.main || '#2563EB'};
`;

const CategoryTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme?.textPrimary || '#111827'};
  font-size: 1.5rem;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  margin: 0;
  color: ${props => props.theme?.textSecondary || '#4B5563'};
  font-size: 0.9rem;
  line-height: 1.5;
`;

// 工具网格
const ToolsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (min-width: 768px) {
    gap: 16px;
  }
`;

// 分类配置
const categories = [
  {
    id: '开发环境',
    name: '开发环境',
    description: '必需的开发运行时环境和工具',
    icon: FaCode
  },
  {
    id: 'IDE工具',
    name: 'IDE工具',
    description: '集成开发环境和代码编辑器',
    icon: FaLaptopCode
  },
  {
    id: '命令行工具',
    name: '命令行工具',
    description: '提高开发效率的命令行工具',
    icon: FaTerminal
  },
  {
    id: '个人软件',
    name: '个人软件',
    description: '日常开发和工作中常用的软件',
    icon: FaUser
  }
];

const DevEnvironmentPage: React.FC = () => {
  const [installingTools, setInstallingTools] = useState<Set<string>>(new Set());

  const handleDownload = (toolId: string) => {
    setInstallingTools(prev => new Set(prev).add(toolId));
    
    // 模拟下载过程
    setTimeout(() => {
      setInstallingTools(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }, 2000);
  };

  return (
    <PageContainer>
      <ContentArea>
        <PageLayout>
          {/* 页面标题 */}
          <div>
            <h1 style={{ 
              margin: 0, 
              color: 'var(--text-primary)', 
              fontSize: '2rem', 
              fontWeight: 700,
              marginBottom: '8px'
            }}>
              开发环境工具
            </h1>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)', 
              fontSize: '1rem',
              lineHeight: 1.5
            }}>
              这里收录了开发所需的各类工具，包括开发环境、IDE、命令行工具和个人常用软件
            </p>
          </div>

          {/* 按分类展示工具 */}
          {categories.map((category) => {
            const categoryTools = devToolsSimple.filter(tool => tool.category === category.id);
            
            return (
              <CategorySection key={category.id}>
                <CategoryHeader>
                  <CategoryIcon>
                    <category.icon size={20} />
                  </CategoryIcon>
                  <div>
                    <CategoryTitle>{category.name}</CategoryTitle>
                    <CategoryDescription>{category.description}</CategoryDescription>
                  </div>
                </CategoryHeader>
                
                <ToolsGrid>
                  {categoryTools.map((tool) => (
                    <SimpleToolCard
                      key={tool.id}
                      icon={<tool.icon size={24} />}
                      name={tool.name}
                      officialUrl={tool.website}
                      downloadUrl={tool.downloadUrl}
                      onDownload={() => handleDownload(tool.id)}
                      className={installingTools.has(tool.id) ? 'installing' : ''}
                    />
                  ))}
                </ToolsGrid>
              </CategorySection>
            );
          })}
        </PageLayout>
      </ContentArea>
    </PageContainer>
  );
};

export default DevEnvironmentPage;