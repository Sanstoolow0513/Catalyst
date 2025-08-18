import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PageContainer } from '../components/common';
import EnhancedProxyManager from '../components/EnhancedProxyManager';
import ProxyGroupManager from '../components/ProxyGroupManager';
import { Wifi, Layers } from 'lucide-react';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const ProxyPage: React.FC = () => {
  const [isProxyRunning, setIsProxyRunning] = useState(false);

  // Check proxy status periodically
  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (window.electronAPI?.mihomo) {
          const status = await window.electronAPI.mihomo.status();
          setIsProxyRunning(status.isRunning);
        }
      } catch (error) {
        console.error('Error checking proxy status:', error);
      }
    };

    // Check status immediately
    checkStatus();

    // Set up interval to check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <PageHeader>
        <Wifi size={32} />
        <PageTitle>Proxy Management</PageTitle>
      </PageHeader>
      
      <EnhancedProxyManager />
      
      {/* Proxy Group Management - only show when proxy is running */}
      {isProxyRunning && (
        <Section>
          <SectionHeader>
            <Layers size={24} />
            <SectionTitle>Proxy Group Management</SectionTitle>
          </SectionHeader>
          <ProxyGroupManager />
        </Section>
      )}
    </PageContainer>
  );
};

export default ProxyPage;