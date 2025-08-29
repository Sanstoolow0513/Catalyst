import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Download as DownloadIcon,
  Package as PackageIcon,
  AlertCircle as AlertIcon,
  Loader as LoaderIcon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  PageContainer, 
  WelcomeCardComponent, 
  GlassPageContainer, 
  ContentSection, 
  SimpleCard, 
  ActionButton, 
  ContentContainer,
  TitleContainer,
  SubtitleContainer,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  SectionDescription,
  SimpleList,
  ListItem,
  SmallIconContainer
} from '../components/common';

// 安装程序数据
const installers = [
  {
    id: 'nodejs',
    name: 'Node.js v22.16.0',
    relativePath: 'apps/node-v22.16.0-x64.msi',
    description: 'Node.js 运行时环境',
    icon: PackageIcon,
    color: '#68A063'
  },
  {
    id: 'clash-verge',
    name: 'Clash Verge',
    relativePath: 'apps/Clash.Verge_2.4.0_x64-setup.exe',
    description: 'Clash 客户端',
    icon: DownloadIcon,
    color: '#3B82F6'
  },
  {
    id: 'zen-browser',
    name: 'Zen Browser',
    relativePath: 'apps/zen.installer.exe',
    description: 'Zen 浏览器',
    icon: DownloadIcon,
    color: '#8B5CF6'
  },
  {
    id: 'vc-redist-x64',
    name: 'Visual C++ Redistributable x64',
    relativePath: 'apps/vclib/VC_redist.x64.exe',
    description: 'VC++ 运行库 (64位)',
    icon: PackageIcon,
    color: '#EF4444'
  },
  {
    id: 'vc-redist-x86',
    name: 'Visual C++ Redistributable x86',
    relativePath: 'apps/vclib/vcredist_x86.exe',
    description: 'VC++ 运行库 (32位)',
    icon: PackageIcon,
    color: '#F59E0B'
  }
];

// 状态消息样式
const StatusMessage = styled(motion.div)<{ $type: 'info' | 'error' | 'success' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  font-weight: 500;
  
  ${props => {
    switch(props.$type) {
      case 'error':
        return `
          background: ${props.theme.name === 'dark' 
            ? 'rgba(239, 68, 68, 0.2)' 
            : 'rgba(239, 68, 68, 0.1)'};
          color: ${props.theme.error.main};
          border: 1px solid ${props.theme.name === 'dark' 
            ? 'rgba(239, 68, 68, 0.3)' 
            : 'rgba(239, 68, 68, 0.2)'};
        `;
      case 'success':
        return `
          background: ${props.theme.name === 'dark' 
            ? 'rgba(16, 185, 129, 0.2)' 
            : 'rgba(16, 185, 129, 0.1)'};
          color: ${props.theme.success.main};
          border: 1px solid ${props.theme.name === 'dark' 
            ? 'rgba(16, 185, 129, 0.3)' 
            : 'rgba(16, 185, 129, 0.2)'};
        `;
      default:
        return `
          background: ${props.theme.name === 'dark' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(37, 99, 235, 0.1)'};
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.name === 'dark' 
            ? 'rgba(59, 130, 246, 0.3)' 
            : 'rgba(37, 99, 235, 0.2)'};
        `;
    }
  }}
`;

// 安装状态指示器
const InstallStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const TestPage: React.FC = () => {
  const { isDarkMode, themeMode } = useTheme();
  const isGlassMode = themeMode.includes('Glass');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [installing, setInstalling] = useState<string>('');

  const handleInstall = async (relativePath: string, installerName: string) => {
    try {
      setStatus(`正在启动 ${installerName} 安装程序...`);
      setError('');
      setInstalling(installerName);

      // 通过Electron IPC调用主进程执行安装程序
      const result = await (window as any).electronAPI.test.runInstaller(relativePath);

      if (result.success) {
        setStatus(`${installerName} 安装程序已启动`);
      } else {
        setError(`${installerName} 启动失败: ${result.error}`);
      }

    } catch (err) {
      setError(`启动 ${installerName} 失败: ${(err as Error).message}`);
    } finally {
      setInstalling('');
    }
  };

  const handleInstallWinget = async () => {
    try {
      setStatus('正在检查并安装 Winget...');
      setError('');
      setInstalling('Winget');

      // 通过Electron IPC调用主进程安装 winget
      const result = await (window as any).electronAPI.test.installWinget();

      if (result.success) {
        setStatus(`Winget 安装完成: ${result.message}`);
      } else {
        setError(`Winget 安装失败: ${result.error}`);
      }

    } catch (err) {
      setError(`安装 Winget 失败: ${(err as Error).message}`);
    } finally {
      setInstalling('');
    }
  };

  const clearStatus = () => {
    setStatus('');
    setError('');
  };

  return (
    <PageContainer>
      <GlassPageContainer $isGlassMode={isGlassMode}>
        <WelcomeCardComponent
          title="测试页面 - 安装程序"
          subtitle="点击下方按钮启动相应的安装程序。请确保您有管理员权限。"
          icon={<PackageIcon size={32} />}
          isDarkMode={isDarkMode}
          isGlassMode={isGlassMode}
        />

        <ContentSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 状态消息 */}
          {status && (
            <StatusMessage
              $type="info"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <LoaderIcon size={20} />
              {status}
              {installing && (
                <LoadingSpinner>
                  <LoaderIcon size={16} />
                </LoadingSpinner>
              )}
            </StatusMessage>
          )}

          {error && (
            <StatusMessage
              $type="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertIcon size={20} />
              {error}
            </StatusMessage>
          )}

          {/* Winget 安装卡片 */}
          <SimpleCard
            $isGlassMode={isGlassMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <SectionHeader>
              <SectionIcon>
                <PackageIcon size={24} />
              </SectionIcon>
              <div>
                <SectionTitle>Windows Package Manager (Winget)</SectionTitle>
                <SectionDescription>
                  Windows 包管理器，可用于安装和管理 Windows 应用程序
                </SectionDescription>
              </div>
            </SectionHeader>
            
            <ActionButton
              onClick={handleInstallWinget}
              $variant="primary"
              $isGlassMode={isGlassMode}
              disabled={installing === 'Winget'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {installing === 'Winget' ? (
                <>
                  <LoadingSpinner>
                    <LoaderIcon size={16} />
                  </LoadingSpinner>
                  安装中...
                </>
              ) : (
                <>
                  <DownloadIcon size={16} />
                  安装 Winget
                </>
              )}
            </ActionButton>
          </SimpleCard>

          {/* 安装程序列表 */}
          <SectionHeader>
            <SectionIcon>
              <PackageIcon size={24} />
            </SectionIcon>
            <div>
              <SectionTitle>可用安装程序</SectionTitle>
              <SectionDescription>
                以下安装程序可以直接启动，请根据需要选择安装
              </SectionDescription>
            </div>
          </SectionHeader>

          <SimpleList>
            {installers.map((installer, index) => (
              <ListItem
                key={installer.id}
                $isGlassMode={isGlassMode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
              >
                <SmallIconContainer $color={installer.color}>
                  <installer.icon size={20} />
                </SmallIconContainer>
                
                <ContentContainer>
                  <TitleContainer>
                    <SectionTitle style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                      {installer.name}
                    </SectionTitle>
                  </TitleContainer>
                  <SubtitleContainer>
                    {installer.description}
                  </SubtitleContainer>
                </ContentContainer>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {installing === installer.name && (
                    <InstallStatus>
                      <LoadingSpinner>
                        <LoaderIcon size={14} />
                      </LoadingSpinner>
                      启动中...
                    </InstallStatus>
                  )}
                  
                  <ActionButton
                    onClick={() => handleInstall(installer.relativePath, installer.name)}
                    $variant="outline"
                    $isGlassMode={isGlassMode}
                    disabled={installing === installer.name}
                    size="small"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {installing === installer.name ? (
                      <LoaderIcon size={16} />
                    ) : (
                      <DownloadIcon size={16} />
                    )}
                    {installing === installer.name ? '启动中...' : '启动安装'}
                  </ActionButton>
                </div>
              </ListItem>
            ))}
          </SimpleList>

          {/* 清除状态按钮 */}
          {(status || error) && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <ActionButton
                onClick={clearStatus}
                $variant="outline"
                $isGlassMode={isGlassMode}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                清除状态
              </ActionButton>
            </div>
          )}
        </ContentSection>
      </GlassPageContainer>
    </PageContainer>
  );
};

export default TestPage;