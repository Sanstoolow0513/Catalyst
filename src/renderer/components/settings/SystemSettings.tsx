import React from 'react';
import styled from 'styled-components';
import { Switch, Label } from '../common';

const SystemSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

interface SystemSettingsProps {
  startup: boolean;
  minimizeToTray: boolean;
  notifications: boolean;
  onStartupChange: (value: boolean) => void;
  onMinimizeToTrayChange: (value: boolean) => void;
  onNotificationsChange: (value: boolean) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({
  startup,
  minimizeToTray,
  notifications,
  onStartupChange,
  onMinimizeToTrayChange,
  onNotificationsChange
}) => {
  return (
    <SystemSectionContainer>
      <SwitchContainer>
        <div>
          <Label>开机启动</Label>
          <Description>
            应用程序将在系统启动时自动运行
          </Description>
        </div>
        <Switch
          checked={startup}
          onChange={onStartupChange}
        />
      </SwitchContainer>

      <SwitchContainer>
        <div>
          <Label>最小化到托盘</Label>
          <Description>
            关闭窗口时将应用程序最小化到系统托盘
          </Description>
        </div>
        <Switch
          checked={minimizeToTray}
          onChange={onMinimizeToTrayChange}
        />
      </SwitchContainer>

      <SwitchContainer>
        <div>
          <Label>通知</Label>
          <Description>
            启用应用程序的通知功能
          </Description>
        </div>
        <Switch
          checked={notifications}
          onChange={onNotificationsChange}
        />
      </SwitchContainer>
    </SystemSectionContainer>
  );
};

export default SystemSettings;