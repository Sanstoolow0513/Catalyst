import React from 'react';
import styled from 'styled-components';
import { Button } from '../common';
import { Upload as UploadIcon, RefreshCw as RefreshIcon } from 'lucide-react';

const BackupSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

interface BackupSettingsProps {
  onExportConfig: () => void;
  onImportConfig: () => void;
  onResetConfig: () => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({
  onExportConfig,
  onImportConfig,
  onResetConfig
}) => {
  return (
    <BackupSectionContainer>
      <ButtonGroup>
        <Button
          onClick={onExportConfig}
          variant="outline"
          startIcon={<UploadIcon size={16} />}
        >
          导出配置
        </Button>
        <Button
          onClick={onImportConfig}
          variant="outline"
          startIcon={<UploadIcon size={16} />}
        >
          导入配置
        </Button>
        <Button
          onClick={onResetConfig}
          variant="danger"
          startIcon={<RefreshIcon size={16} />}
        >
          重置配置
        </Button>
      </ButtonGroup>
    </BackupSectionContainer>
  );
};

export default BackupSettings;