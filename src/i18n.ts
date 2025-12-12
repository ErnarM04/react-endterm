import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      brand: 'FakeStore',
      offline: {
        banner: {
          message: 'You are offline. Some features may be limited.',
          viewPage: 'View Offline Page'
        },
        page: {
          title: 'You\'re Offline',
          subtitle: 'No internet connection detected',
          whatYouCanDo: 'What you can do offline:',
          feature1: {
            title: 'Browse Cached Products',
            description: 'View previously loaded products and product details from cache.'
          },
          feature2: {
            title: 'View Favorites',
            description: 'Access your saved favorites that are stored locally.'
          },
          feature3: {
            title: 'Review Cart',
            description: 'Check your cart items. Changes will sync when you\'re back online.'
          },
          retry: 'Check Connection',
          checking: 'Checking...',
          goHome: 'Go to Home',
          tip: 'Your data is safe and will sync automatically when connection is restored.'
        }
      },
      nav: {
        home: 'Home',
        products: 'Products',
        cart: 'Cart',
        cartLoginRequired: 'Login Required',
        favorites: 'Favorites',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Login',
        signup: 'Signup',
        language: 'Language',
      },
      home: {
        title: 'Fake Store',
        tagline: 'Welcome to Fake Store — your place to find quality products at great prices.',
        description: 'Browse our items and discover something new.',
      },
      search: {
        placeholder: 'Search products...',
        clear: 'Clear',
      },
      pagination: {
        previous: 'Previous',
        next: 'Next',
        showing: 'Showing {{from}} to {{to}} of {{total}} products',
      },
      products: {
        empty: 'No products found.',
        failedImage: 'Failed to load image',
        notFound: 'Product not found',
        back: '<- Back',
        category: 'Category',
        brand: 'Brand',
        stock: 'Stock',
        rating: 'Rating',
        loginToAdd: 'Log in to Add to Cart',
        adding: 'Adding...',
        addToCart: 'Add to Cart',
        addFavorite: 'Add to favorites',
        removeFavorite: 'Remove from favorites',
        thumbnails: 'Thumbnail {{index}}',
      },
      cart: {
        loginTitle: 'Please Log In',
        loginSubtitle: 'You must be logged in to view your cart.',
        login: 'Log In',
        signup: 'Sign Up',
        emptyTitle: 'Your cart is empty',
        emptySubtitle: 'Add some products to get started!',
        browse: 'Browse Products',
        title: 'Shopping Cart',
        summary: 'Order Summary',
        subtotal: 'Subtotal:',
        tax: 'Tax (10%):',
        total: 'Total:',
        checkout: 'Proceed to Checkout',
        continue: 'Continue Shopping',
        checkoutAlert: 'Proceeding to checkout with {{count}} item{{plural}} (Total: ${{total}})',
      },
      favorites: {
        title: 'My Favorites',
        syncHint: 'Your favorites are saved locally. Login to sync them across devices.',
        emptyTitle: 'No favorites yet',
        emptySubtitle: 'Start adding products to your favorites!',
        browse: 'Browse Products',
        removeTitle: 'Remove from favorites',
      },
      profile: {
        title: 'Profile',
        validation: {
          imageType: 'Please select an image file',
          imageSize: 'Image size must be less than 5MB',
          processFailed: 'Failed to process image. Please try again.',
        },
        changePhoto: 'Change Photo',
        uploadPhoto: 'Upload Photo',
        removePhoto: 'Remove Photo',
        email: 'Email',
        userId: 'User ID',
        logout: 'Log Out',
      },
      notifications: {
        bannerEnabled: {
          title: 'Notifications enabled!',
          body: "You'll receive updates about your cart.",
        },
        enabled: {
          title: 'Notifications',
          status: 'Enabled - You will receive notifications for cart updates.',
        },
        denied: {
          title: 'Notifications',
          body: 'Notifications are blocked. Please enable them in your browser settings to receive cart updates.',
          hint: 'Go to your browser settings → Site settings → Notifications → Allow',
        },
        prompt: {
          title: 'Enable notifications',
          body: 'Enable notifications to get updates when items are added to your cart.',
          action: 'Enable',
          requesting: 'Requesting...',
        },
        card: {
          title: 'Enable Notifications',
          body: 'Get notified when items are added to your cart or when you proceed to checkout.',
          action: 'Enable Notifications',
          requesting: 'Requesting Permission...',
        },
        toast: {
          enabledTitle: 'Notifications Enabled!',
          enabledBody: 'You will now receive notifications for cart updates.',
        },
        service: {
          itemAddedTitle: 'Item Added to Cart',
          itemAddedBody: '{{name}} has been added to your cart',
          checkoutTitle: 'Proceeding to Checkout',
          checkoutBody: 'Your order of {{count}} item{{plural}} (${{total}}) is being processed',
          emptyTitle: 'Cart is Empty',
          emptyBody: 'Add some items to your cart to get started!',
        },
      },
      login: {
        title: 'Log in',
        placeholders: {
          email: 'Email',
          password: 'Password',
        },
        errors: {
          fillFields: 'Please fill out the fields',
        },
        loading: 'Logging in...',
        button: 'Log In',
        pleaseWait: 'Please wait...',
        switch: 'Want to sign up?',
      },
      signup: {
        title: 'Sign Up',
        placeholders: {
          email: 'Email',
          password: 'Password',
          confirm: 'Confirm Password',
        },
        errors: {
          passwordRequired: 'Please enter a password',
          emailRequired: 'Please enter an email',
          fillFields: 'Please fill out the fields',
          passwordMismatch: "Passwords don't match",
          invalidPassword: 'Invalid password',
          invalidEmail: 'Invalid email',
        },
        loading: 'Creating account...',
        button: 'Sign Up',
        pleaseWait: 'Please wait...',
        switch: 'Already have an account?',
      },
      cartCard: {
        noDescription: 'No description available',
        remove: 'Remove',
        each: 'each',
        productName: 'Product Name',
        product: 'Product',
      },
      spinner: {
        loading: 'Loading...',
      },
    },
  },
  ru: {
    translation: {
      brand: 'FakeStore',
      offline: {
        banner: {
          message: 'Вы офлайн. Некоторые функции могут быть ограничены.',
          viewPage: 'Открыть страницу офлайн'
        },
        page: {
          title: 'Вы офлайн',
          subtitle: 'Интернет-соединение не обнаружено',
          whatYouCanDo: 'Что можно делать офлайн:',
          feature1: {
            title: 'Просмотр кэшированных товаров',
            description: 'Просматривайте ранее загруженные товары и их детали из кэша.'
          },
          feature2: {
            title: 'Просмотр избранного',
            description: 'Доступ к сохранённым избранным товарам, хранящимся локально.'
          },
          feature3: {
            title: 'Просмотр корзины',
            description: 'Проверьте товары в корзине. Изменения синхронизируются при восстановлении соединения.'
          },
          retry: 'Проверить соединение',
          checking: 'Проверка...',
          goHome: 'На главную',
          tip: 'Ваши данные в безопасности и автоматически синхронизируются при восстановлении соединения.'
        }
      },
      nav: {
        home: 'Главная',
        products: 'Товары',
        cart: 'Корзина',
        cartLoginRequired: 'Нужен вход',
        favorites: 'Избранное',
        profile: 'Профиль',
        logout: 'Выйти',
        login: 'Войти',
        signup: 'Регистрация',
        language: 'Язык',
      },
      home: {
        title: 'Fake Store',
        tagline: 'Добро пожаловать в Fake Store — здесь вы найдёте качественные товары по хорошим ценам.',
        description: 'Изучайте наш каталог и открывайте новое.',
      },
      search: {
        placeholder: 'Поиск товаров...',
        clear: 'Сброс',
      },
      pagination: {
        previous: 'Назад',
        next: 'Далее',
        showing: 'Показано {{from}}–{{to}} из {{total}} товаров',
      },
      products: {
        empty: 'Товары не найдены.',
        failedImage: 'Не удалось загрузить изображение',
        notFound: 'Товар не найден',
        back: '<- Назад',
        category: 'Категория',
        brand: 'Бренд',
        stock: 'В наличии',
        rating: 'Рейтинг',
        loginToAdd: 'Войдите, чтобы добавить в корзину',
        adding: 'Добавляем...',
        addToCart: 'Добавить в корзину',
        addFavorite: 'В избранное',
        removeFavorite: 'Убрать из избранного',
        thumbnails: 'Миниатюра {{index}}',
      },
      cart: {
        loginTitle: 'Пожалуйста, войдите',
        loginSubtitle: 'Нужно войти, чтобы увидеть корзину.',
        login: 'Войти',
        signup: 'Регистрация',
        emptyTitle: 'Ваша корзина пуста',
        emptySubtitle: 'Добавьте товары, чтобы начать!',
        browse: 'Смотреть товары',
        title: 'Корзина',
        summary: 'Сводка заказа',
        subtotal: 'Промежуточный итог:',
        tax: 'Налог (10%):',
        total: 'Итого:',
        checkout: 'Оформить заказ',
        continue: 'Продолжить покупки',
        checkoutAlert: 'Переход к оплате {{count}} товар{{plural}} (Итого: ${{total}})',
      },
      favorites: {
        title: 'Моё избранное',
        syncHint: 'Избранное сохранено локально. Войдите, чтобы синхронизировать.',
        emptyTitle: 'Пока нет избранного',
        emptySubtitle: 'Начните добавлять товары!',
        browse: 'Смотреть товары',
        removeTitle: 'Убрать из избранного',
      },
      profile: {
        title: 'Профиль',
        validation: {
          imageType: 'Выберите файл изображения',
          imageSize: 'Размер изображения должен быть меньше 5 МБ',
          processFailed: 'Не удалось обработать изображение. Попробуйте снова.',
        },
        changePhoto: 'Сменить фото',
        uploadPhoto: 'Загрузить фото',
        removePhoto: 'Удалить фото',
        email: 'Email',
        userId: 'ID пользователя',
        logout: 'Выйти',
      },
      notifications: {
        bannerEnabled: {
          title: 'Уведомления включены!',
          body: 'Теперь вы получаете обновления корзины.',
        },
        enabled: {
          title: 'Уведомления',
          status: 'Включены — будете получать уведомления о корзине.',
        },
        denied: {
          title: 'Уведомления',
          body: 'Уведомления заблокированы. Включите их в настройках браузера.',
          hint: 'Настройки браузера → Настройки сайта → Уведомления → Разрешить',
        },
        prompt: {
          title: 'Включите уведомления',
          body: 'Получайте уведомления, когда товары добавляются в корзину.',
          action: 'Включить',
          requesting: 'Запрашиваем...',
        },
        card: {
          title: 'Включить уведомления',
          body: 'Получайте уведомления о добавлении товаров и оформлении заказа.',
          action: 'Включить уведомления',
          requesting: 'Запрос разрешения...',
        },
        toast: {
          enabledTitle: 'Уведомления включены!',
          enabledBody: 'Теперь вы будете получать уведомления о корзине.',
        },
        service: {
          itemAddedTitle: 'Товар добавлен в корзину',
          itemAddedBody: '{{name}} добавлен в вашу корзину',
          checkoutTitle: 'Переход к оплате',
          checkoutBody: 'Ваш заказ: {{count}} товар{{plural}} (${{total}}) оформляется',
          emptyTitle: 'Корзина пуста',
          emptyBody: 'Добавьте товары в корзину, чтобы начать!',
        },
      },
      login: {
        title: 'Вход',
        placeholders: {
          email: 'Email',
          password: 'Пароль',
        },
        errors: {
          fillFields: 'Пожалуйста, заполните поля',
        },
        loading: 'Выполняется вход...',
        button: 'Войти',
        pleaseWait: 'Подождите...',
        switch: 'Хотите зарегистрироваться?',
      },
      signup: {
        title: 'Регистрация',
        placeholders: {
          email: 'Email',
          password: 'Пароль',
          confirm: 'Подтвердите пароль',
        },
        errors: {
          passwordRequired: 'Введите пароль',
          emailRequired: 'Введите email',
          fillFields: 'Пожалуйста, заполните поля',
          passwordMismatch: 'Пароли не совпадают',
          invalidPassword: 'Неверный пароль',
          invalidEmail: 'Неверный email',
        },
        loading: 'Создаём аккаунт...',
        button: 'Зарегистрироваться',
        pleaseWait: 'Подождите...',
        switch: 'Уже есть аккаунт?',
      },
      cartCard: {
        noDescription: 'Описание недоступно',
        remove: 'Удалить',
        each: 'за штуку',
        productName: 'Название товара',
        product: 'Товар',
      },
      spinner: {
        loading: 'Загрузка...',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
    keySeparator: '.',
  });

export default i18n;


