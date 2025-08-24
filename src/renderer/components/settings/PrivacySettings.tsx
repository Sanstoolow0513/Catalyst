import React from 'react';
import styled from 'styled-components';
import { Switch, Label } from '../common';

const PrivacySectionContainer = styled.div`
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

interface PrivacySettingsProps {
  dataCollection: boolean;
  analyticsEnabled: boolean;
  crashReports: boolean;
  onDataCollectionChange: (value: boolean) => void;
  onAnalyticsEnabledChange: (value: boolean) => void;
  onCrashReportsChange: (value: boolean) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  dataCollection,
  analyticsEnabled,
  crashReports,
  onDataCollectionChange,
  onAnalyticsEnabledChange,
  onCrashReportsChange
}) => {
  return (
    <PrivacySectionContainer>
      <SwitchContainer>
        <div>
          <Label>数据收集</Label>
          <Description>
            允许收集匿名使用数据以改善产品
          </Description>
        </div>
        <Switch
          checked={dataCollection}
          onChange={onDataCollectionChange}
        />
      </SwitchContainer>

      <SwitchContainer>
        <div>
          <Label>使用分析</Label>
          <Description>
            启用功能使用分析以帮助我们了解用户需求
          </Description>
        </div>
        <Switch
          checked={analyticsEnabled}
          onChange={onAnalyticsEnabledChange}
        />
      </SwitchContainer>

      <SwitchContainer>
        <div>
          <Label>崩溃报告</Label>
          <Description>
            自动发送崩溃报告以帮助修复问题
          </Description>
        </div>
        <Switch
          checked={crashReports}
          onChange={onCrashReportsChange}
        />
      </SwitchContainer>
    </PrivacySectionContainer>
  );
};

export default PrivacySettings;