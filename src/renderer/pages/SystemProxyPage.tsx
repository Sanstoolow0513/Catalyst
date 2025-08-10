import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 1rem;
`;

const StatusIndicator = styled.div<{ isRunning: boolean }>`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${({ isRunning }) => (isRunning ? '#4CAF50' : '#F44336')};
  color: white;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 1rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SystemProxyPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    const status = await window.electronAPI.mihomo.status();
    setIsRunning(status.isRunning);
    setIsLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleStart = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.mihomo.start();
    if (!result.success) {
      alert(`Failed to start Mihomo: ${result.error}`);
    }
    await checkStatus();
  };

  const handleStop = async () => {
    setIsLoading(true);
    const result = await window.electronAPI.mihomo.stop();
    if (!result.success) {
      alert(`Failed to stop Mihomo: ${result.error}`);
    }
    await checkStatus();
  };

  return (
    <PageContainer>
      <h2>System Proxy (Mihomo)</h2>
      {isLoading ? (
        <p>Loading status...</p>
      ) : (
        <>
          <StatusIndicator isRunning={isRunning}>
            {isRunning ? 'Mihomo is Running' : 'Mihomo is Stopped'}
          </StatusIndicator>
          <Button onClick={handleStart} disabled={isRunning || isLoading}>
            Start
          </Button>
          <Button onClick={handleStop} disabled={!isRunning || isLoading}>
            Stop
          </Button>
        </>
      )}
    </PageContainer>
  );
};

export default SystemProxyPage;