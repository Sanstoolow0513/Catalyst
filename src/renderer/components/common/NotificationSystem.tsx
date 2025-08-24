import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  AlertTriangle
} from 'lucide-react';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  pointer-events: none;
`;

const NotificationWrapper = styled(motion.div)`
  margin-bottom: 0.5rem;
  pointer-events: all;
`;

const NotificationCard = styled.div<{ 
  $variant: 'success' | 'error' | 'warning' | 'info' 
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'success': return props.theme.success.main;
      case 'error': return props.theme.error.main;
      case 'warning': return props.theme.warning.main;
      case 'info': return props.theme.primary.main;
      default: return props.theme.border;
    }
  }};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${slideIn} 0.3s ease-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &.closing {
    animation: ${slideOut} 0.3s ease-in;
  }
`;

const NotificationIcon = styled.div<{ 
  $variant: 'success' | 'error' | 'warning' | 'info' 
}>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.$variant) {
      case 'success': return props.theme.success.main;
      case 'error': return props.theme.error.main;
      case 'warning': return props.theme.warning.main;
      case 'info': return props.theme.primary.main;
      default: return props.theme.textSecondary;
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 0.25rem;
`;

const NotificationMessage = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.surfaceVariant};
    color: ${props => props.theme.textPrimary};
  }
`;

const ProgressBar = styled.div<{ $variant: 'success' | 'error' | 'warning' | 'info' }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => props.theme.surfaceVariant};
  border-radius: 0 0 12px 12px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: ${props => {
      switch (props.$variant) {
        case 'success': return props.theme.success.main;
        case 'error': return props.theme.error.main;
        case 'warning': return props.theme.warning.main;
        case 'info': return props.theme.primary.main;
        default: return props.theme.primary.main;
      }
    }};
    animation: progressShrink var(--duration, 5000ms) linear forwards;
  }

  @keyframes progressShrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

export interface NotificationOptions {
  id?: string;
  title?: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
  onClick?: () => void;
}

interface NotificationItem extends Required<NotificationOptions> {
  id: string;
  timestamp: number;
}

class NotificationManager {
  private static instance: NotificationManager;
  private notifications: NotificationItem[] = [];
  private listeners: Set<(notifications: NotificationItem[]) => void> = new Set();

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private generateId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  show(options: NotificationOptions): string {
    const notification: NotificationItem = {
      id: options.id || this.generateId(),
      title: options.title || this.getDefaultTitle(options.variant || 'info'),
      message: options.message,
      variant: options.variant || 'info',
      duration: options.duration || 5000,
      persistent: options.persistent || false,
      onClick: options.onClick || (() => {}),
      timestamp: Date.now()
    };

    // 移除相同ID的通知
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
    
    // 添加新通知
    this.notifications.push(notification);
    
    // 自动移除（如果不是持久通知）
    if (!notification.persistent) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }

    this.notify();
    return notification.id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  subscribe(listener: (notifications: NotificationItem[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private getDefaultTitle(variant: NotificationOptions['variant']): string {
    switch (variant) {
      case 'success': return '成功';
      case 'error': return '错误';
      case 'warning': return '警告';
      case 'info': return '信息';
      default: return '通知';
    }
  }

  // 便捷方法
  success(message: string, options?: Partial<NotificationOptions>) {
    return this.show({ ...options, message, variant: 'success' });
  }

  error(message: string, options?: Partial<NotificationOptions>) {
    return this.show({ ...options, message, variant: 'error' });
  }

  warning(message: string, options?: Partial<NotificationOptions>) {
    return this.show({ ...options, message, variant: 'warning' });
  }

  info(message: string, options?: Partial<NotificationOptions>) {
    return this.show({ ...options, message, variant: 'info' });
  }
}

export const notificationManager = NotificationManager.getInstance();

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  const getIcon = (variant: NotificationItem['variant']) => {
    switch (variant) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.onClick) {
      notification.onClick();
    }
    if (!notification.persistent) {
      notificationManager.remove(notification.id);
    }
  };

  const handleCloseClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    notificationManager.remove(id);
  };

  return (
    <NotificationContainer>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationWrapper
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <NotificationCard
              $variant={notification.variant}
              onClick={() => handleNotificationClick(notification)}
              style={{
                '--duration': `${notification.duration}ms`
              } as React.CSSProperties}
            >
              <NotificationIcon $variant={notification.variant}>
                {getIcon(notification.variant)}
              </NotificationIcon>
              
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
              </NotificationContent>
              
              <CloseButton
                onClick={(e) => handleCloseClick(e, notification.id)}
              >
                <X size={16} />
              </CloseButton>
              
              {!notification.persistent && (
                <ProgressBar $variant={notification.variant} />
              )}
            </NotificationCard>
          </NotificationWrapper>
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};

export default NotificationSystem;