import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const InstallButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const TestPage: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const installers = [
    {
      name: 'Node.js v22.16.0',
      relativePath: 'apps/node-v22.16.0-x64.msi',
      description: 'Node.js 运行时环境'
    },
    {
      name: 'Clash Verge',
      relativePath: 'apps/Clash.Verge_2.4.0_x64-setup.exe',
      description: 'Clash 客户端'
    },
    {
      name: 'Zen Browser',
      relativePath: 'apps/zen.installer.exe',
      description: 'Zen 浏览器'
    },
    {
      name: 'Visual C++ Redistributable x64',
      relativePath: 'apps/vclib/VC_redist.x64.exe',
      description: 'VC++ 运行库 (64位)'
    },
    {
      name: 'Visual C++ Redistributable x86',
      relativePath: 'apps/vclib/vcredist_x86.exe',
      description: 'VC++ 运行库 (32位)'
    }
  ];

  const handleInstall = async (relativePath: string, installerName: string) => {
    try {
      setStatus(`正在启动 ${installerName} 安装程序...`);
      setError('');

      // 通过Electron IPC调用主进程执行安装程序
      const result = await (window as any).electronAPI.test.runInstaller(relativePath);

      if (result.success) {
        setStatus(`${installerName} 安装程序已启动`);
      } else {
        setError(`${installerName} 启动失败: ${result.error}`);
      }

    } catch (err) {
      setError(`启动 ${installerName} 失败: ${(err as Error).message}`);
    }
  };

  const handleInstallWinget = async () => {
    try {
      setStatus('正在检查并安装 Winget...');
      setError('');

      // 通过Electron IPC调用主进程安装 winget
      const result = await (window as any).electronAPI.test.installWinget();

      if (result.success) {
        setStatus(`Winget 安装完成: ${result.message}`);
      } else {
        setError(`Winget 安装失败: ${result.error}`);
      }

    } catch (err) {
      setError(`安装 Winget 失败: ${(err as Error).message}`);
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 800, 
      margin: '0 auto', 
      padding: 3,
      height: 'calc(100vh - 100px)',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'f1f1f1',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
        '&:hover': {
          background: '#555',
        },
      },
    }}>
      <Typography variant="h4" gutterBottom>
        测试页面 - 安装程序
      </Typography>
      
      <Typography variant="body1" paragraph>
        点击下方按钮启动相应的安装程序。请确保您有管理员权限。
      </Typography>

      {status && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {status}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Winget 安装卡片 */}
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Windows Package Manager (Winget)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Windows 包管理器，可用于安装和管理 Windows 应用程序
          </Typography>
          <InstallButton
            variant="contained"
            onClick={handleInstallWinget}
          >
            安装 Winget
          </InstallButton>
        </CardContent>
      </StyledCard>

      {installers.map((installer, index) => (
        <StyledCard key={index}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {installer.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {installer.description}
            </Typography>
            <InstallButton
              variant="contained"
              onClick={() => handleInstall(installer.relativePath, installer.name)}
            >
              启动安装
            </InstallButton>
          </CardContent>
        </StyledCard>
      ))}
    </Box>
  );
};

export default TestPage;