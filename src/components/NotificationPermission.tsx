import React, { useState, useEffect } from 'react';
import { 
  isNotificationSupported, 
  getNotificationPermission, 
  requestNotificationPermission 
} from '../services/notificationService';

interface NotificationPermissionProps {
  showAsBanner?: boolean;
}

function NotificationPermission({ showAsBanner = false }: NotificationPermissionProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
  }, []);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        // Show a test notification
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification('Notifications Enabled!', {
            body: 'You will now receive notifications for cart updates.',
            icon: '/logo192.png',
            tag: 'permission-granted',
          });
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  if (!isSupported) {
    return null; // Don't show anything if notifications aren't supported
  }

  if (permission === 'granted') {
    if (showAsBanner) {
      return (
        <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
          <svg className="bi flex-shrink-0 me-2" width="20" height="20" role="img" aria-label="Success:">
            <use href="#check-circle-fill"/>
          </svg>
          <div>
            <strong>Notifications enabled!</strong> You'll receive updates about your cart.
          </div>
        </div>
      );
    }
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h6 className="card-title">🔔 Notifications</h6>
          <p className="card-text text-success mb-0">
            <strong>Enabled</strong> - You'll receive notifications for cart updates.
          </p>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="card mb-3 border-warning">
        <div className="card-body">
          <h6 className="card-title">🔔 Notifications</h6>
          <p className="card-text text-muted mb-2">
            Notifications are blocked. Please enable them in your browser settings to receive cart updates.
          </p>
          <small className="text-muted">
            Go to your browser settings → Site settings → Notifications → Allow
          </small>
        </div>
      </div>
    );
  }

  // Permission is 'default' - show request button
  if (showAsBanner) {
    return (
      <div className="alert alert-info d-flex align-items-center justify-content-between mb-3" role="alert">
        <div>
          <strong>Enable notifications</strong> to get updates when items are added to your cart.
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleRequestPermission}
          disabled={isRequesting}
        >
          {isRequesting ? 'Requesting...' : 'Enable'}
        </button>
      </div>
    );
  }

  return (
    <div className="card mb-3 border-primary">
      <div className="card-body">
        <h6 className="card-title">🔔 Enable Notifications</h6>
        <p className="card-text mb-3">
          Get notified when items are added to your cart or when you proceed to checkout.
        </p>
        <button
          className="btn btn-primary"
          onClick={handleRequestPermission}
          disabled={isRequesting}
        >
          {isRequesting ? 'Requesting Permission...' : 'Enable Notifications'}
        </button>
      </div>
    </div>
  );
}

export default NotificationPermission;

