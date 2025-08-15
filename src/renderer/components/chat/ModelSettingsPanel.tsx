import React from 'react';
import styled from 'styled-components';

const ModelSettingsPanelContainer = styled.div`
  width: 350px;
  flex-shrink: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  overflow-y: auto;
  border-left: 1px solid transparent;
  background-color: ${({ theme }) => theme.foreground};
  height: 100%;
`;

const PlaceholderText = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-style: italic;
  text-align: center;
  padding: 20px;
`;

const ModelSettingsPanel = () => {
  return (
    <ModelSettingsPanelContainer>
      <PlaceholderText>
        模型设置已移至左侧配置面板
      </PlaceholderText>
    </ModelSettingsPanelContainer>
  );
};

export default ModelSettingsPanel;