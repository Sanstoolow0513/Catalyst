import React, { useState } from 'react';
import styled from 'styled-components';
import { PageContainer, Button, Card, StatusIndicator } from '../components/common';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-size: 1.8rem;
`;

const ToolsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ToolItemContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ToolInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ToolName = styled.h3`
  margin: 0 0 5px 0;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-size: 1.2rem;
`;

const ToolDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSecondary}; /* 使用新的 textSecondary */
  opacity: 0.7;
  font-size: 0.9rem;
`;

const StatusMessageContainer = styled.div`
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.sidebarBackground}; /* 使用新的 sidebarBackground */
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
`;

interface Tool {
  id: string;
  name: string;
  description: string;
  status: 'not-installed' | 'installing' | 'installed' | 'error';
}

const DevEnvironmentPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([
    { id: 'vscode', name: 'Visual Studio Code', description: '免费、开源的代码编辑器', status: 'not-installed' },
    { id: 'nodejs', name: 'Node.js', description: 'JavaScript 运行时环境', status: 'not-installed' },
    { id: 'python', name: 'Python', description: '通用编程语言', status: 'not-installed' },
    // 可以添加更多工具
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
        default:
          result = { success: false, error: 'Unknown tool' };
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

  return (
    <PageContainer>
      <Header>
        <Title>Development Environment Setup</Title>
      </Header>
      
      <ToolsList>
        {tools.map(tool => (
          <Card key={tool.id} $padding="15px">
            <ToolItemContent>
              <ToolInfo>
                <ToolName>{tool.name}</ToolName>
                <ToolDescription>{tool.description}</ToolDescription>
              </ToolInfo>
              <Button
                onClick={() => installTool(tool.id)}
                disabled={tool.status === 'installing' || tool.status === 'installed'}
                variant={tool.status === 'error' ? 'danger' : 'primary'}
                size="medium"
              >
                {tool.status === 'installing' ? 'Installing...' :
                 tool.status === 'installed' ? 'Installed' :
                 tool.status === 'error' ? 'Error' : 'Install'}
              </Button>
            </ToolItemContent>
          </Card>
        ))}
      </ToolsList>
      
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
