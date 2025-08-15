import React, { useState } from 'react';
import styled from 'styled-components';
import { PageContainer, Button, Card, StatusIndicator } from '../components/common';
import { 
  Code as CodeIcon,
  Terminal as TerminalIcon,
  Database as DatabaseIcon,
  Globe as GlobeIcon,
  Zap as ZapIcon
} from 'lucide-react';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.8rem;
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div``;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const SectionIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${props => props.theme.primary.main}, ${props => props.theme.accent.main});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ToolCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ToolIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.theme.surfaceVariant};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.primary.main};
`;

const ToolInfo = styled.div`
  flex: 1;
`;

const ToolName = styled.h4`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
`;

const ToolDescription = styled.p`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ToolFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToolCategory = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textTertiary};
  background-color: ${({ theme }) => theme.surfaceVariant};
  padding: 4px 8px;
  border-radius: 4px;
`;

const StatusMessageContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surfaceVariant};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary};
`;

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'IDE' | 'Runtime' | 'Database' | 'Tool' | 'Framework';
  status: 'not-installed' | 'installing' | 'installed' | 'error';
}

const DevEnvironmentPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([
    // IDEs
    { id: 'vscode', name: 'Visual Studio Code', description: '免费、开源的代码编辑器，支持多种编程语言', category: 'IDE', status: 'not-installed' },
    { id: 'intellij', name: 'IntelliJ IDEA', description: '强大的Java IDE，也支持其他语言', category: 'IDE', status: 'not-installed' },
    { id: 'pycharm', name: 'PyCharm', description: '专业的Python IDE', category: 'IDE', status: 'not-installed' },
    { id: 'webstorm', name: 'WebStorm', description: '专业的JavaScript和Web开发IDE', category: 'IDE', status: 'not-installed' },
    
    // Runtimes
    { id: 'nodejs', name: 'Node.js', description: 'JavaScript 运行时环境', category: 'Runtime', status: 'not-installed' },
    { id: 'python', name: 'Python', description: '通用编程语言', category: 'Runtime', status: 'not-installed' },
    { id: 'java', name: 'Java JDK', description: 'Java开发工具包', category: 'Runtime', status: 'not-installed' },
    { id: 'dotnet', name: '.NET SDK', description: '微软的开发平台', category: 'Runtime', status: 'not-installed' },
    
    // Databases
    { id: 'mysql', name: 'MySQL', description: '流行的开源关系型数据库', category: 'Database', status: 'not-installed' },
    { id: 'postgresql', name: 'PostgreSQL', description: '强大的开源对象关系型数据库', category: 'Database', status: 'not-installed' },
    { id: 'mongodb', name: 'MongoDB', description: '流行的NoSQL文档数据库', category: 'Database', status: 'not-installed' },
    
    // Tools
    { id: 'docker', name: 'Docker', description: '容器化平台，用于构建、部署和运行应用', category: 'Tool', status: 'not-installed' },
    { id: 'git', name: 'Git', description: '分布式版本控制系统', category: 'Tool', status: 'not-installed' },
    { id: 'npm', name: 'npm', description: 'Node.js的包管理器', category: 'Tool', status: 'not-installed' },
    
    // Frameworks
    { id: 'react', name: 'React', description: '用于构建用户界面的JavaScript库', category: 'Framework', status: 'not-installed' },
    { id: 'vue', name: 'Vue.js', description: '渐进式JavaScript框架', category: 'Framework', status: 'not-installed' },
    { id: 'angular', name: 'Angular', description: '平台和框架，用于构建单页应用', category: 'Framework', status: 'not-installed' },
  ]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const installTool = async (toolId: string) => {
    setStatusMessage(`Installing ${toolId}...`);
    setIsSuccess(false);
    
    // 更新工具状态为 "installing"
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === toolId ? { ...tool, status: 'installing' } : tool
      )
    );
    
    try {
      let result: { success: boolean; error?: string };
      
      switch (toolId) {
        case 'vscode':
          result = await window.electronAPI.devEnvironment.installVSCode();
          break;
        case 'nodejs':
          result = await window.electronAPI.devEnvironment.installNodeJS();
          break;
        case 'python':
          result = await window.electronAPI.devEnvironment.installPython();
          break;
        // 其他工具的安装逻辑可以在这里添加
        default:
          // 模拟安装过程
          await new Promise(resolve => setTimeout(resolve, 2000));
          result = { success: true };
      }
      
      if (result.success) {
        setTools(prevTools =>
          prevTools.map(tool =>
            tool.id === toolId ? { ...tool, status: 'installed' } : tool
          )
        );
        setStatusMessage(`${toolId} installed successfully`);
        setIsSuccess(true);
      } else {
        setTools(prevTools =>
          prevTools.map(tool =>
            tool.id === toolId ? { ...tool, status: 'error' } : tool
          )
        );
        setStatusMessage(`Failed to install ${toolId}: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setTools(prevTools =>
        prevTools.map(tool =>
          tool.id === toolId ? { ...tool, status: 'error' } : tool
        )
      );
      setStatusMessage(`Failed to install ${toolId}: ${error}`);
      setIsSuccess(false);
      console.error(`Error installing ${toolId}:`, error);
    }
  };

  // 按类别分组工具
  const ideTools = tools.filter(tool => tool.category === 'IDE');
  const runtimeTools = tools.filter(tool => tool.category === 'Runtime');
  const databaseTools = tools.filter(tool => tool.category === 'Database');
  const otherTools = tools.filter(tool => tool.category === 'Tool' || tool.category === 'Framework');

  return (
    <PageContainer>
      <Header>
        <Title>开发环境部署</Title>
      </Header>
      
      <SectionsContainer>
        <Section>
          <SectionHeader>
            <SectionIcon>
              <CodeIcon size={20} />
            </SectionIcon>
            <SectionTitle>集成开发环境 (IDE)</SectionTitle>
          </SectionHeader>
          <ToolsGrid>
            {ideTools.map(tool => (
              <ToolCard key={tool.id} $padding="20px">
                <ToolHeader>
                  <ToolIcon>
                    <CodeIcon size={20} />
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolCategory>{tool.category}</ToolCategory>
                  </ToolInfo>
                </ToolHeader>
                <ToolDescription>{tool.description}</ToolDescription>
                <ToolFooter>
                  <Button
                    onClick={() => installTool(tool.id)}
                    disabled={tool.status === 'installing' || tool.status === 'installed'}
                    variant={tool.status === 'error' ? 'danger' : 'primary'}
                    size="small"
                  >
                    {tool.status === 'installing' ? '安装中...' :
                     tool.status === 'installed' ? '已安装' :
                     tool.status === 'error' ? '错误' : '安装'}
                  </Button>
                </ToolFooter>
              </ToolCard>
            ))}
          </ToolsGrid>
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionIcon>
              <TerminalIcon size={20} />
            </SectionIcon>
            <SectionTitle>运行时环境</SectionTitle>
          </SectionHeader>
          <ToolsGrid>
            {runtimeTools.map(tool => (
              <ToolCard key={tool.id} $padding="20px">
                <ToolHeader>
                  <ToolIcon>
                    <TerminalIcon size={20} />
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolCategory>{tool.category}</ToolCategory>
                  </ToolInfo>
                </ToolHeader>
                <ToolDescription>{tool.description}</ToolDescription>
                <ToolFooter>
                  <Button
                    onClick={() => installTool(tool.id)}
                    disabled={tool.status === 'installing' || tool.status === 'installed'}
                    variant={tool.status === 'error' ? 'danger' : 'primary'}
                    size="small"
                  >
                    {tool.status === 'installing' ? '安装中...' :
                     tool.status === 'installed' ? '已安装' :
                     tool.status === 'error' ? '错误' : '安装'}
                  </Button>
                </ToolFooter>
              </ToolCard>
            ))}
          </ToolsGrid>
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionIcon>
              <DatabaseIcon size={20} />
            </SectionIcon>
            <SectionTitle>数据库</SectionTitle>
          </SectionHeader>
          <ToolsGrid>
            {databaseTools.map(tool => (
              <ToolCard key={tool.id} $padding="20px">
                <ToolHeader>
                  <ToolIcon>
                    <DatabaseIcon size={20} />
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolCategory>{tool.category}</ToolCategory>
                  </ToolInfo>
                </ToolHeader>
                <ToolDescription>{tool.description}</ToolDescription>
                <ToolFooter>
                  <Button
                    onClick={() => installTool(tool.id)}
                    disabled={tool.status === 'installing' || tool.status === 'installed'}
                    variant={tool.status === 'error' ? 'danger' : 'primary'}
                    size="small"
                  >
                    {tool.status === 'installing' ? '安装中...' :
                     tool.status === 'installed' ? '已安装' :
                     tool.status === 'error' ? '错误' : '安装'}
                  </Button>
                </ToolFooter>
              </ToolCard>
            ))}
          </ToolsGrid>
        </Section>
        
        <Section>
          <SectionHeader>
            <SectionIcon>
              <ZapIcon size={20} />
            </SectionIcon>
            <SectionTitle>工具和框架</SectionTitle>
          </SectionHeader>
          <ToolsGrid>
            {otherTools.map(tool => (
              <ToolCard key={tool.id} $padding="20px">
                <ToolHeader>
                  <ToolIcon>
                    <GlobeIcon size={20} />
                  </ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolCategory>{tool.category}</ToolCategory>
                  </ToolInfo>
                </ToolHeader>
                <ToolDescription>{tool.description}</ToolDescription>
                <ToolFooter>
                  <Button
                    onClick={() => installTool(tool.id)}
                    disabled={tool.status === 'installing' || tool.status === 'installed'}
                    variant={tool.status === 'error' ? 'danger' : 'primary'}
                    size="small"
                  >
                    {tool.status === 'installing' ? '安装中...' :
                     tool.status === 'installed' ? '已安装' :
                     tool.status === 'error' ? '错误' : '安装'}
                  </Button>
                </ToolFooter>
              </ToolCard>
            ))}
          </ToolsGrid>
        </Section>
      </SectionsContainer>
      
      {statusMessage && (
        <StatusMessageContainer>
          <StatusIndicator $status={isSuccess ? 'success' : 'error'} />
          {statusMessage}
        </StatusMessageContainer>
      )}
    </PageContainer>
  );
};

export default DevEnvironmentPage;