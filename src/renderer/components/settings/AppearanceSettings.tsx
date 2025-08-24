import React from 'react';
import styled from 'styled-components';
import { Label, Select, SelectWrapper, FormGroup } from '../common';

const AppearanceSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

interface AppearanceSettingsProps {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  onThemeChange: (value: 'light' | 'dark' | 'auto') => void;
  onLanguageChange: (value: string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  theme,
  language,
  onThemeChange,
  onLanguageChange
}) => {
  return (
    <AppearanceSectionContainer>
      <FormGrid>
        <FormGroup>
          <Label>主题</Label>
          <SelectWrapper>
            <Select value={theme} onChange={(e) => onThemeChange(e.target.value as 'light' | 'dark' | 'auto')}>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
              <option value="auto">跟随系统</option>
            </Select>
          </SelectWrapper>
        </FormGroup>

        <FormGroup>
          <Label>语言</Label>
          <SelectWrapper>
            <Select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
              <option value="zh-CN">简体中文</option>
              <option value="en">English</option>
            </Select>
          </SelectWrapper>
        </FormGroup>
      </FormGrid>
    </AppearanceSectionContainer>
  );
};

export default AppearanceSettings;