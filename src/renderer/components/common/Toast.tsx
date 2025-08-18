import React from 'react';
import styled from 'styled-components';
import { 
  CheckCircle as CheckIcon,
  XCircle as ErrorIcon,
  Info as InfoIcon,
  X as CloseIcon
} from 'lucide-react';

interface ToastProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: number) => void;
  exiting?: boolean;
}

const ToastContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.xl};
  right: ${props => props.theme.spacing.xl};
  z-index: 9999;
`;

const StyledToast = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => {
    switch (props.$type) {
      case 'success': return props.theme.success.main;
      case 'error': return props.theme.error.main;
      case 'info': return props.theme.info.main;
      default: return props.theme.surfaceVariant;
    }
  }};
  color: white;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn ${props => props.theme.transition.normal} ease forwards;
  min-width: 300px;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  &.exiting {
    animation: slideOut ${props => props.theme.transition.normal} ease forwards;
  }
`;

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
  font-weight: 500;
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
  }
`;

const Toast: React.FC<ToastProps> = ({ 
  id, 
  message, 
  type, 
  onClose, 
  exiting = false 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckIcon size={20} />;
      case 'error':
        return <ErrorIcon size={20} />;
      case 'info':
        return <InfoIcon size={20} />;
      default:
        return <InfoIcon size={20} />;
    }
  };

  return (
    <StyledToast $type={type} className={exiting ? 'exiting' : ''}>
      <ToastIcon>
        {getIcon()}
      </ToastIcon>
      <ToastContent>{message}</ToastContent>
      <ToastClose onClick={() => onClose(id)}>
        <CloseIcon size={16} />
      </ToastClose>
    </StyledToast>
  );
};

export { Toast, ToastContainer };
export default Toast;