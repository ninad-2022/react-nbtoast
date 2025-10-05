import React, { useEffect, useRef, useState } from "react";
import type { NotificationAnimation, NotificationConfig } from "../types";
import "./NotificationToast.css";

interface NotificationToastProps {
  notification: NotificationConfig;
  animation: NotificationAnimation;
  animationDuration: number;
  onDismiss: (id: string) => void;
  stackIndex?: number;
  stackOffset?: number;
  isStacked?: boolean;
}

const DefaultIcons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
        fill="currentColor"
      />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
        fill="currentColor"
      />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M1 17H19L10 2L1 17ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z"
        fill="currentColor"
      />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
        fill="currentColor"
      />
    </svg>
  ),
  loading: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="rotate-animation"
    >
      <path
        d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10H16C16 13.31 13.31 16 10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4V2Z"
        fill="currentColor"
      />
    </svg>
  ),
};

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  animation,
  animationDuration,
  onDismiss,
  stackIndex = 0,
  stackOffset = 0,
  isStacked = false,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(notification.duration || 0);

  const handleClose = () => {
    setIsExiting(true);
    notification.onClose?.();
    setTimeout(() => {
      onDismiss(notification.id);
    }, animationDuration);
  };

  const startTimer = () => {
    if (notification.duration === 0) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      handleClose();
    }, remainingTimeRef.current);

    if (progressRef.current) {
      progressRef.current.style.transition = `width ${remainingTimeRef.current}ms linear`;
      progressRef.current.style.width = "0%";
    }
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(
        0,
        remainingTimeRef.current - elapsed
      );

      if (progressRef.current) {
        const currentWidth = parseFloat(
          window.getComputedStyle(progressRef.current).width
        );
        const containerWidth =
          progressRef.current.parentElement?.offsetWidth || 1;
        const percentage = (currentWidth / containerWidth) * 100;
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = `${percentage}%`;
      }
    }
  };

  useEffect(() => {
    if (!isPaused && notification.duration !== 0) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    if (notification.pauseOnHover) {
      setIsPaused(true);
      pauseTimer();
    }
  };

  const handleMouseLeave = () => {
    if (notification.pauseOnHover) {
      setIsPaused(false);
    }
  };

  const handleClick = () => {
    if (notification.onClick) {
      notification.onClick();
    }
  };

  const icon = notification.icon || DefaultIcons[notification.type];

  const stackTransform = isStacked
    ? {
        transform: `translateY(${stackIndex * stackOffset}px) scale(${
          1 - stackIndex * 0.05
        })`,
        opacity: 1 - stackIndex * 0.2,
        zIndex: 100 - stackIndex,
      }
    : {};

  return (
    <div
      className={`notification-toast notification-toast--${
        notification.type
      } notification-toast--${animation} ${
        isExiting ? "notification-toast--exit" : "notification-toast--enter"
      } ${notification.customClassName || ""}`}
      style={{
        animationDuration: `${animationDuration}ms`,
        cursor: notification.onClick ? "pointer" : "default",
        ...stackTransform,
        ...notification.customStyles?.container,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="alert"
      aria-live="polite"
    >
      <div className="notification-toast__icon">{icon}</div>

      <div className="notification-toast__content">
        {notification.title && (
          <div
            className="notification-toast__title"
            style={notification.customStyles?.title}
          >
            {notification.title}
          </div>
        )}
        <div
          className="notification-toast__message"
          style={notification.customStyles?.message}
        >
          {notification.message}
        </div>

        {notification.action && (
          <button
            className="notification-toast__action"
            onClick={(e) => {
              e.stopPropagation();
              notification.action?.onClick();
            }}
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {notification.closable && (
        <button
          className="notification-toast__close"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Close notification"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {notification.duration !== 0 && (
        <div className="notification-toast__progress">
          <div
            ref={progressRef}
            className="notification-toast__progress-bar"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationToast;
