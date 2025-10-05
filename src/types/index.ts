import React from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type NotificationPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

export type NotificationAnimation = 'slide' | 'fade' | 'bounce' | 'zoom';

export interface NotificationConfig {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
  icon?: React.ReactNode;
  closable?: boolean;
  pauseOnHover?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  customStyles?: {
    container?: React.CSSProperties;
    title?: React.CSSProperties;
    message?: React.CSSProperties;
  };
  customClassName?: string;
}

export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  duration?: number;
  icon?: React.ReactNode;
  closable?: boolean;
  pauseOnHover?: boolean;
  onClick?: () => void;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  customStyles?: {
    container?: React.CSSProperties;
    title?: React.CSSProperties;
    message?: React.CSSProperties;
  };
  customClassName?: string;
}

export interface NotificationProviderProps {
  children: React.ReactNode;
  position?: NotificationPosition;
  maxNotifications?: number;
  animation?: NotificationAnimation;
  animationDuration?: number;
  enableStacking?: boolean;
  stackingOffset?: number;
  defaultDuration?: number;
  defaultPauseOnHover?: boolean;
  zIndex?: number;
}

export interface NotificationContextType {
  notifications: NotificationConfig[];
  showNotification: (message: string, options?: NotificationOptions) => string;
  success: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  error: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  info: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  loading: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  update: (id: string, options: Partial<NotificationConfig>) => void;
}