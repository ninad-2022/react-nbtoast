
import React, { createContext, useCallback, useState } from 'react';
import {
  NotificationConfig,
  NotificationContextType,
  NotificationOptions,
  NotificationProviderProps,
} from '../types';
import NotificationContainer from '../components/NotificationContainer';

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

let notificationId = 0;

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  position = 'top-right',
  maxNotifications = 5,
  animation = 'slide',
  animationDuration = 300,
  enableStacking = false,
  stackingOffset = 10,
  defaultDuration = 5000,
  defaultPauseOnHover = true,
  zIndex = 9999,
}) => {
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);

  const showNotification = useCallback(
    (message: string, options?: NotificationOptions): string => {
      const id = `notification-${++notificationId}`;
      
      const newNotification: NotificationConfig = {
        id,
        type: options?.type || 'info',
        message,
        title: options?.title,
        duration: options?.duration ?? defaultDuration,
        icon: options?.icon,
        closable: options?.closable ?? true,
        pauseOnHover: options?.pauseOnHover ?? defaultPauseOnHover,
        onClick: options?.onClick,
        onClose: options?.onClose,
        action: options?.action,
        customStyles: options?.customStyles,
        customClassName: options?.customClassName,
      };

      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        return updated.slice(-maxNotifications);
      });

      return id;
    },
    [defaultDuration, defaultPauseOnHover, maxNotifications]
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const update = useCallback((id: string, options: Partial<NotificationConfig>) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...options } : n))
    );
  }, []);

  const success = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      showNotification(message, { ...options, type: 'success' }),
    [showNotification]
  );

  const error = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      showNotification(message, { ...options, type: 'error' }),
    [showNotification]
  );

  const warning = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      showNotification(message, { ...options, type: 'warning' }),
    [showNotification]
  );

  const info = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      showNotification(message, { ...options, type: 'info' }),
    [showNotification]
  );

  const loading = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) =>
      showNotification(message, { ...options, type: 'loading', duration: 0 }),
    [showNotification]
  );

  const value: NotificationContextType = {
    notifications,
    showNotification,
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
    dismissAll,
    update,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        position={position}
        animation={animation}
        animationDuration={animationDuration}
        enableStacking={enableStacking}
        stackingOffset={stackingOffset}
        zIndex={zIndex}
        onDismiss={dismiss}
      />
    </NotificationContext.Provider>
  );
};