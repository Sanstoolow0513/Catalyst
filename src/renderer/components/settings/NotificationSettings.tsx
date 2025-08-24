import React from 'react';
import styled from 'styled-components';
import { Switch, Label } from '../common';

const NotificationsSectionContainer = styled.div`
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

interface NotificationSettingsProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  onEmailNotificationsChange: (value: boolean) => void;
  onPushNotificationsChange: (value: boolean) => void;
  onSoundEnabledChange: (value: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  emailNotifications,
  pushNotifications,
  soundEnabled,
  onEmailNotificationsChange,
  onPushNotificationsChange,
  onSoundEnabledChange
}) => {
  return (
    <NotificationsSectionContainer>
      <SwitchContainer>
        <div>
          <Label>邮件通知</Label>
          <Description>
            接收重要的邮件通知
          </Description>
        </div>
        <Switch
          checked={emailNotifications}
          onChange={onEmailNotificationsChange}
        />
      </SwitchContainer>

      <SwitchContainer>
        <div>
          <Label>推送通知</Label>
          <Description>
            接收实时推送通知
          </Description>
        </div>
        <Switch
          checked={pushNotifications}
          onChange={onPushNotificationsChange}
        />
      </SwitchContainer>

      <SwitchContainer>
        <div>
          <Label>通知声音</Label>
          <Description>
            启用通知提示音
          </Description>
        </div>
        <Switch
          checked={soundEnabled}
          onChange={onSoundEnabledChange}
        />
      </SwitchContainer>
    </NotificationsSectionContainer>
  );
};

export default NotificationSettings;