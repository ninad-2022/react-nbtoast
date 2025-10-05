import React from "react";
import type {
  NotificationAnimation,
  NotificationConfig,
  NotificationPosition,
} from "../types";
import NotificationToast from "./NotificationToast";
import "./NotificationContainer.css";

interface NotificationContainerProps {
  notifications: NotificationConfig[];
  position: NotificationPosition;
  animation: NotificationAnimation;
  animationDuration: number;
  enableStacking: boolean;
  stackingOffset: number;
  zIndex: number;
  onDismiss: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  position,
  animation,
  animationDuration,
  enableStacking,
  stackingOffset,
  zIndex,
  onDismiss,
}) => {
  if (notifications.length === 0) return null;

  const positionClass = `notification-container--${position}`;

  const visibleNotifications = enableStacking
    ? notifications.slice(0, 1)
    : notifications;

  const stackedNotifications = enableStacking ? notifications.slice(1, 4) : [];

  return (
    <div
      className={`notification-container ${positionClass}`}
      style={{ zIndex }}
      role="region"
      aria-label="Notifications"
    >
      {visibleNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          animation={animation}
          animationDuration={animationDuration}
          onDismiss={onDismiss}
          isStacked={false}
        />
      ))}

      {enableStacking && stackedNotifications.length > 0 && (
        <div className="notification-stack">
          {stackedNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className="notification-stack__item"
              style={{
                transform: `translateY(${
                  (index + 1) * stackingOffset
                }px) scale(${1 - (index + 1) * 0.05})`,
                opacity: 1 - (index + 1) * 0.25,
                zIndex: 100 - (index + 1),
              }}
            >
              <div className="notification-stack__placeholder" />
            </div>
          ))}
        </div>
      )}

      {enableStacking && notifications.length > 4 && (
        <div
          className="notification-stack__count"
          style={{
            transform: `translateY(${4 * stackingOffset}px)`,
          }}
        >
          +{notifications.length - 4} more
        </div>
      )}
    </div>
  );
};

export default NotificationContainer;
