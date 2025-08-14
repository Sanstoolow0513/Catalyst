import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PageContainer, Button, Card, StatusIndicator } from '../components/common';
import ProxyGroupManager from '../components/ProxyGroupManager';

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-size: 1.8rem;
`;

const StatusCardContent = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const SystemProxyPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.mihomo) {
      setApiAvailable(true);
      checkStatus();
    } else {
      console.error('Electron API for Mihomo is not available.');
      setIsLoading(false);
    }
  }, []);

  const checkStatus = async () => {
    if (!apiAvailable) return;
    setIsLoading(true);
    try {
      const status = await window.electronAPI.mihomo.status();
      setIsRunning(status.isRunning);
    } catch (error) {
      console.error('Error checking Mihomo status:', error);
      // Optionally set an error message for the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = async () => {
    if (!apiAvailable) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.mihomo.start();
      if (!result.success) {
        alert(`Failed to start Mihomo: ${result.error}`);
      }
    } catch (error) {
      console.error('Error starting Mihomo:', error);
      alert('An error occurred while trying to start Mihomo.');
    } finally {
      await checkStatus();
    }
  };

  const handleStop = async () => {
    if (!apiAvailable) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.mihomo.stop();
      if (!result.success) {
        alert(`Failed to stop Mihomo: ${result.error}`);
      }
    } catch (error) {
      console.error('Error stopping Mihomo:', error);
      alert('An error occurred while trying to stop Mihomo.');
    } finally {
      await checkStatus();
    }
  };

  return (
    <PageContainer>
      <Title>System Proxy (Mihomo)</Title>
      {!apiAvailable ? (
        <Card $padding="medium">
          <StatusCardContent>
            <StatusIndicator $status="error" />
            Electron API for Mihomo is not available. Please restart the application.
          </StatusCardContent>
        </Card>
      ) : (
        isLoading ? (
          <Card $padding="medium">
            <StatusCardContent>
              <StatusIndicator $status="info" />
              Loading status...
            </StatusCardContent>
          </Card>
        ) : (
          <>
            <Card $padding="medium">
              <StatusCardContent>
                <StatusIndicator $status={isRunning ? 'success' : 'error'} />
                {isRunning ? 'Mihomo is Running' : 'Mihomo is Stopped'}
              </StatusCardContent>
            </Card>
            <ButtonGroup>
              <Button onClick={handleStart} disabled={isRunning || isLoading} variant="primary">
                Start
              </Button>
              <Button onClick={handleStop} disabled={!isRunning || isLoading} variant="danger">
                Stop
              </Button>
            </ButtonGroup>
          </>
        )
      )}
      
      {/* 代理组管理 */}
      {isRunning && (
        <div style={{ marginTop: '30px' }}>
          <h3>代理组管理</h3>
          <ProxyGroupManager />
        </div>
      )}
    </PageContainer>
  );
};

export default SystemProxyPage;
