import styled from 'styled-components';

interface StatusIndicatorProps {
  $status: 'success' | 'error' | 'warning' | 'info';
}

const getColor = ($status: StatusIndicatorProps['$status']) => {
  switch ($status) {
    case 'success':
      return '#28A745';
    case 'error':
      return '#DC3545';
    case 'warning':
      return '#FFC107';
    case 'info':
      return '#17A2B8';
    default:
      return '#6C757D';
  }
};

export const StatusIndicator = styled.span<StatusIndicatorProps>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => getColor(props.$status)};
  margin-right: 8px;
`;
