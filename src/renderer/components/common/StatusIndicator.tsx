import styled from 'styled-components';

interface StatusIndicatorProps {
  $status: 'success' | 'error' | 'warning' | 'info';
  $size?: 'small' | 'medium' | 'large';
}

const getSize = ($size: StatusIndicatorProps['$size'] = 'medium') => {
  switch ($size) {
    case 'small':
      return '8px';
    case 'large':
      return '12px';
    case 'medium':
    default:
      return '10px';
  }
};

export const StatusIndicator = styled.span<StatusIndicatorProps>`
  display: inline-block;
  width: ${(props) => getSize(props.$size)};
  height: ${(props) => getSize(props.$size)};
  border-radius: 50%;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'success':
        return props.theme.success.main;
      case 'error':
        return props.theme.error.main;
      case 'warning':
        return props.theme.warning.main;
      case 'info':
        return props.theme.info.main;
      default:
        return props.theme.textSecondary;
    }
  }};
  margin-right: 8px;
`;
