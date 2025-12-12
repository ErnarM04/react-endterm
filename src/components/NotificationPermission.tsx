import React, { useState, useEffect } from 'react';
import { 
  isNotificationSupported, 
  getNotificationPermission, 
  requestNotificationPermission 
} from '../services/notificationService';
import { useTranslation } from 'react-i18next';

interface NotificationPermissionProps {
  showAsBanner?: boolean;
}

function NotificationPermission({ showAsBanner = false }: NotificationPermissionProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { t } = useTranslation();

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

        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          await registration.showNotification(t('notifications.toast.enabledTitle'), {
            body: t('notifications.toast.enabledBody'),
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
    return null;
  }

  if (permission === 'granted') {
    if (showAsBanner) {
      return (
        <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
          <svg className="bi flex-shrink-0 me-2" width="20" height="20" role="img" aria-label="Success:">
            <use href="#check-circle-fill"/>
          </svg>
          <div>
            <strong>{t('notifications.bannerEnabled.title')}</strong> {t('notifications.bannerEnabled.body')}
          </div>
        </div>
      );
    }
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h6 className="card-title">{t('notifications.enabled.title')}</h6>
          <p className="card-text text-success mb-0">
            <strong>{t('notifications.enabled.status')}</strong>
          </p>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="card mb-3 border-warning">
        <div className="card-body">
          <h6 className="card-title">{t('notifications.denied.title')}</h6>
          <p className="card-text text-muted mb-2">
            {t('notifications.denied.body')}
          </p>
          <small className="text-muted">
            {t('notifications.denied.hint')}
          </small>
        </div>
      </div>
    );
  }

  if (showAsBanner) {
    return (
      <div className="alert alert-info d-flex align-items-center justify-content-between mb-3" role="alert">
        <div>
          <strong>{t('notifications.prompt.title')}</strong> {t('notifications.prompt.body')}
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={handleRequestPermission}
          disabled={isRequesting}
        >
          {isRequesting ? t('notifications.prompt.requesting') : t('notifications.prompt.action')}
        </button>
      </div>
    );
  }

  return (
    <div className="card mb-3 border-primary">
      <div className="card-body">
        <h6 className="card-title">{t('notifications.card.title')}</h6>
        <p className="card-text mb-3">
          {t('notifications.card.body')}
        </p>
        <button
          className="btn btn-primary"
          onClick={handleRequestPermission}
          disabled={isRequesting}
        >
          {isRequesting ? t('notifications.card.requesting') : t('notifications.card.action')}
        </button>
      </div>
    </div>
  );
}

export default NotificationPermission;

