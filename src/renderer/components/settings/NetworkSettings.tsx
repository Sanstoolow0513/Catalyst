import React from 'react';
import styled from 'styled-components';
import { Input, Label, Switch } from '../common';

const NetworkSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} 0;
  border-radius: ${props => props.theme.borderRadius.small};
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 500;
`;

interface NetworkSettingsProps {
  vpnUrl: string;
  proxyAutoStart: boolean;
  onVpnUrlChange: (value: string) => void;
  onProxyAutoStartChange: (value: boolean) => void;
}

const NetworkSettings: React.FC<NetworkSettingsProps> = ({
  vpnUrl,
  proxyAutoStart,
  onVpnUrlChange,
  onProxyAutoStartChange
}) => {
  return (
    <NetworkSectionContainer>
      <FormGroup>
        <Label>VPN 提供商 URL</Label>
        <Input
          value={vpnUrl}
          onChange={(e) => onVpnUrlChange(e.target.value)}
          placeholder="输入 VPN 提供商的配置 URL"
        />
      </FormGroup>

      <SwitchContainer>
        <div>
          <Label>代理自动启动</Label>
          <Description>
            应用程序启动时自动开启代理服务
          </Description>
        </div>
        <Switch
          checked={proxyAutoStart}
          onChange={onProxyAutoStartChange}
        />
      </SwitchContainer>
    </NetworkSectionContainer>
  );
};

export default NetworkSettings;