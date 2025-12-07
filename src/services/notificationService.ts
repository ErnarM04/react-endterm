// Notification Service for local push notifications

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

// Get current notification permission status
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

// Show a local notification
export async function showNotification(options: NotificationOptions): Promise<void> {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser');
    return;
  }

  const permission = await requestNotificationPermission();
  
  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  // Check if service worker is ready
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/logo192.png',
        badge: options.badge || '/logo192.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to browser notification if service worker fails
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/logo192.png',
        tag: options.tag,
        data: options.data,
      });
    }
  } else {
    // Fallback to browser notification
    new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/logo192.png',
      tag: options.tag,
      data: options.data,
    });
  }
}

// Show notification when item added to cart
export async function notifyItemAddedToCart(productName: string): Promise<void> {
  await showNotification({
    title: 'Item Added to Cart',
    body: `${productName} has been added to your cart`,
    tag: 'cart-add',
    icon: '/logo192.png',
    data: {
      type: 'cart-add',
      timestamp: Date.now(),
    },
  });
}

// Show notification when checkout is initiated
export async function notifyCheckout(cartTotal: number, itemCount: number): Promise<void> {
  await showNotification({
    title: 'Proceeding to Checkout',
    body: `Your order of ${itemCount} item${itemCount > 1 ? 's' : ''} ($${cartTotal.toFixed(2)}) is being processed`,
    tag: 'checkout',
    icon: '/logo192.png',
    requireInteraction: true,
    data: {
      type: 'checkout',
      total: cartTotal,
      itemCount: itemCount,
      timestamp: Date.now(),
    },
  });
}

// Show notification when cart is empty
export async function notifyCartEmpty(): Promise<void> {
  await showNotification({
    title: 'Cart is Empty',
    body: 'Add some items to your cart to get started!',
    tag: 'cart-empty',
    icon: '/logo192.png',
  });
}

